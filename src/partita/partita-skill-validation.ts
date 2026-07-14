/* eslint-disable ts/no-use-before-define */
import type { SkillMetadata } from './model.ts'
import type { OpenAiSkillValidationReport } from './openai-skill-validation.ts'
import type {
  InvocationSelectorForm,
  OpenAiMetadataProjection,
} from './projection.ts'
import type {
  PartitaSourceDirectoryEntry,
  PartitaSourceSkill,
  PartitaSourceSkillCatalog,
} from './source-skill-catalog.ts'
import type { ValidationIssue } from './validation.ts'

import { dirname, join, relative, sep } from 'node:path'
import * as Effect from 'effect/Effect'
import * as FileSystem from 'effect/FileSystem'
import { PartitaError } from './errors.ts'
import { validateOpenAiSkillText } from './openai-skill-validation.ts'
import {
  projectSkillForm,
  validateInvocationSelectorEnglish,
} from './projection.ts'
import {
  isPartitaSkillFamily,
  loadPartitaSourceSkillCatalog,
} from './source-skill-catalog.ts'
import { issue } from './validation.ts'

export interface SkillFileValidationResult {
  readonly descriptions: Record<string, string>
  readonly issues: ReadonlyArray<ValidationIssue>
}

const loadedSkillMarkers = ['💬', '🔗', '🧭', '🎼', '🧹'] as const
const skillContractSections = [
  '## Rule',
  '## Pattern',
  '## Boundary',
  '## Effects',
  '## Workflow',
  '## References',
  '## Validation',
] as const
const forbiddenLegacySkillSections = [
  '## Capability',
  '## Trigger',
  '## Template',
  '## Protocol',
  '## Surface',
  '## External State',
  '## Soft Boundary',
  '## Hard Boundary',
  'Primitive audit:',
] as const
const descriptionMaximumLength = 500
const descriptionSelectorPrefixPattern = /^Use (?:when|for)\b/u
const descriptionSchedulingPollution = [
  'always use',
  'use for all',
  'best',
  'safest',
  'recommended',
] as const
const requiredOpenAiInterfaceFields = ['display_name', 'short_description', 'default_prompt'] as const
type ExpectedOpenAiInterfaceProjection = OpenAiMetadataProjection['interface']

export const checkOpenAiRuntimeSkillFiles = Effect.fn('checkOpenAiRuntimeSkillFiles')(function* (
  root: string,
): Effect.fn.Return<SkillFileValidationResult, PartitaError, FileSystem.FileSystem> {
  const catalog = yield* loadPartitaSourceSkillCatalog(root)
  return checkOpenAiRuntimeSkillCatalog(catalog).result
})

interface RuntimeSkillValidation {
  readonly result: SkillFileValidationResult
  readonly skills: ReadonlyArray<{
    readonly skill: PartitaSourceSkill
    readonly validation: OpenAiSkillValidationReport
  }>
}

function checkOpenAiRuntimeSkillCatalog(catalog: PartitaSourceSkillCatalog): RuntimeSkillValidation {
  const descriptions: Record<string, string> = {}
  const issues: Array<ValidationIssue> = []
  const skills: Array<RuntimeSkillValidation['skills'][number]> = []

  for (const skill of catalog.skills) {
    const validation = validateOpenAiSkillText(skill.text, skill.relativePath)
    skills.push({ skill, validation })
    issues.push(...validation.issues)

    issues.push(...checkRuntimeSkillDirectoryShape(catalog.root, skill))

    if (!validation.fields) {
      continue
    }

    issues.push(...checkRuntimeSkillIdentity(validation.fields, skill, skill.relativePath))
    descriptions[skill.handle] = validation.fields.description.trim()
  }

  return {
    result: { descriptions, issues },
    skills,
  }
}

export const checkPartitaSourceSkillFiles = Effect.fn('checkPartitaSourceSkillFiles')(function* (
  root: string,
): Effect.fn.Return<SkillFileValidationResult, PartitaError, FileSystem.FileSystem> {
  const fs = yield* FileSystem.FileSystem
  const catalog = yield* loadPartitaSourceSkillCatalog(root)
  const runtime = checkOpenAiRuntimeSkillCatalog(catalog)
  const issues: Array<ValidationIssue> = [
    ...runtime.result.issues,
    ...checkSkillsRootShape(catalog),
  ]

  for (const { skill, validation } of runtime.skills) {
    if (!validation.fields) {
      continue
    }

    const title = firstMarkdownTitle(skill.text)
    const projection = checkPartitaSkillProjection(validation.fields, skill, skill.text, skill.relativePath, title)
    const description = validation.fields.description.trim()
    issues.push(...checkPartitaSkillDescription(description, skill.relativePath))
    if (!hasLoadedSkillMarker(skill.text)) {
      issues.push(issue('partita_skill.missing_marker', `missing supported marker instruction: ${loadedSkillMarkers.join(', ')}`, skill.relativePath))
    }

    issues.push(...checkPartitaSkillBodyShape(skill.text, skill.relativePath))
    issues.push(...projection.issues)
    issues.push(...(yield* checkOpenAiMetadata(fs, root, validation.fields.name, skill.path, title, projection.openAiInterface)))
  }

  return {
    descriptions: runtime.result.descriptions,
    issues,
  }
})

interface PartitaSkillProjectionCheck {
  readonly issues: ReadonlyArray<ValidationIssue>
  readonly openAiInterface: ExpectedOpenAiInterfaceProjection | undefined
}

function checkPartitaSkillProjection(
  fields: SkillMetadata,
  skill: PartitaSourceSkill,
  text: string,
  relativePath: string,
  title: string | undefined,
): PartitaSkillProjectionCheck {
  if (skill.family === undefined || title === undefined) {
    return { issues: [], openAiInterface: undefined }
  }

  const parsedSelector = parsePatternSelector(text, relativePath)
  const issues = [...parsedSelector.issues]
  if (parsedSelector.selector === undefined) {
    return { issues, openAiInterface: undefined }
  }

  for (const message of validateInvocationSelectorEnglish(parsedSelector.selector)) {
    issues.push(issue('partita_projection.selector_language', message, relativePath))
  }

  const projection = projectSkillForm({
    identity: {
      family: skill.family,
      slug: skill.name,
      title,
    },
    invocation: {
      policy: {
        allowImplicitInvocation: false,
      },
      selector: parsedSelector.selector,
    },
  })

  if (fields.description.trim() !== projection.skillFrontmatter.description) {
    issues.push(issue(
      'partita_projection.description',
      `frontmatter description must equal projected selector description: ${projection.skillFrontmatter.description}`,
      relativePath,
    ))
  }

  if (!projection.identity.acceptedMarkers.some(marker => text.includes(`\`${marker}\``))) {
    issues.push(issue(
      'partita_projection.marker',
      `skill marker must match family projection: ${projection.identity.acceptedMarkers.join(' or ')}`,
      relativePath,
    ))
  }

  return {
    issues,
    openAiInterface: projection.openAiMetadata.interface,
  }
}

interface ParsedPatternSelector {
  readonly issues: ReadonlyArray<ValidationIssue>
  readonly selector: InvocationSelectorForm | undefined
}

function parsePatternSelector(text: string, relativePath: string): ParsedPatternSelector {
  const pattern = sectionBetween(text, '## Pattern', '## Boundary')
  if (!pattern) {
    return { issues: [], selector: undefined }
  }

  const useWhen: Array<string> = []
  const doNotUseWhen: Array<string> = []
  let currentList: 'do_not_use_when' | 'use_when' | undefined

  for (const rawLine of pattern.split(/\r?\n/u)) {
    const line = rawLine.trim()
    if (line === 'Use when:') {
      currentList = 'use_when'
      continue
    }
    if (line === 'Do not use when:') {
      currentList = 'do_not_use_when'
      continue
    }
    if (!line.startsWith('- ') || currentList === undefined) {
      continue
    }

    const value = normalizePatternBullet(line.slice(2))
    if (value === '') {
      continue
    }
    if (currentList === 'use_when') {
      useWhen.push(value)
    }
    else {
      doNotUseWhen.push(value)
    }
  }

  const issues: Array<ValidationIssue> = []
  if (useWhen.length === 0) {
    issues.push(issue('partita_projection.pattern_missing_use_when', 'Pattern must include at least one Use when bullet', relativePath))
  }
  if (doNotUseWhen.length === 0) {
    issues.push(issue('partita_projection.pattern_missing_do_not_use_when', 'Pattern must include at least one Do not use when bullet', relativePath))
  }

  return {
    issues,
    selector: useWhen.length > 0 && doNotUseWhen.length > 0
      ? {
          doNotUseWhen,
          useWhen,
        }
      : undefined,
  }
}

function normalizePatternBullet(value: string): string {
  return value.trim().replace(/[.。]+$/u, '')
}

function checkRuntimeSkillIdentity(
  fields: SkillMetadata,
  skill: PartitaSourceSkill,
  relativePath: string,
): ReadonlyArray<ValidationIssue> {
  return fields.name === skill.name
    ? []
    : [issue('openai_skill.name_directory_mismatch', `name=${JSON.stringify(fields.name)} dir=${JSON.stringify(skill.name)}`, relativePath)]
}

function checkPartitaSkillDescription(description: string, relativePath: string): ReadonlyArray<ValidationIssue> {
  const issues: Array<ValidationIssue> = []

  if (description.length < 40) {
    issues.push(issue('partita_skill.description_too_short', 'description must be at least 40 characters', relativePath))
  }
  if (description.length > descriptionMaximumLength) {
    issues.push(issue('partita_skill.description_too_long', `description must be at most ${descriptionMaximumLength} characters`, relativePath))
  }
  if (!descriptionSelectorPrefixPattern.test(description)) {
    issues.push(issue('partita_skill.description_selector_prefix', 'description must start with Use when or Use for', relativePath))
  }
  if (!description.includes('Not for')) {
    issues.push(issue('partita_skill.description_activation_surface', 'description must include Not for', relativePath))
  }

  const lowered = description.toLowerCase()
  for (const term of descriptionSchedulingPollution) {
    if (lowered.includes(term)) {
      issues.push(issue('partita_skill.description_scheduling_pollution', `description must not include scheduling claim: ${term}`, relativePath))
    }
  }

  return issues
}

function checkPartitaSkillBodyShape(text: string, relativePath: string): ReadonlyArray<ValidationIssue> {
  const issues: Array<ValidationIssue> = []
  const missingSections = skillContractSections.filter(section => !text.includes(section))
  if (missingSections.length > 0) {
    issues.push(issue('partita_skill.missing_contract_sections', `missing sections: ${missingSections.join(', ')}`, relativePath))
  }

  let previousIndex = -1
  for (const section of skillContractSections) {
    const index = text.indexOf(section)
    if (index === -1) {
      continue
    }
    if (index < previousIndex) {
      issues.push(issue('partita_skill.section_order', `sections must appear in V1 order: ${skillContractSections.join(', ')}`, relativePath))
      break
    }
    previousIndex = index
  }

  for (const section of forbiddenLegacySkillSections) {
    if (text.includes(section)) {
      issues.push(issue('partita_skill.legacy_section', `legacy skill section or marker is not allowed: ${section}`, relativePath))
    }
  }

  const pattern = sectionBetween(text, '## Pattern', '## Boundary')
  if (pattern && (!pattern.includes('Use when:') || !pattern.includes('Do not use when:'))) {
    issues.push(issue('partita_skill.pattern_shape', 'Pattern must include Use when: and Do not use when:', relativePath))
  }

  const boundary = sectionBetween(text, '## Boundary', '## Effects')
  if (boundary && !boundary.includes('Soft:')) {
    issues.push(issue('partita_skill.boundary_missing_soft', 'Boundary must include Soft:', relativePath))
  }
  const hardIndex = boundary.indexOf('Hard:')
  if (hardIndex !== -1 && !boundary.slice(hardIndex + 'Hard:'.length).trim()) {
    issues.push(issue('partita_skill.boundary_empty_hard', 'Boundary Hard: must not be empty when present', relativePath))
  }

  const effects = sectionBetween(text, '## Effects', '## Workflow')
  for (const effect of ['Conversation', 'Filesystem', 'External'] as const) {
    if (effects && !effects.includes(`- ${effect}:`)) {
      issues.push(issue('partita_skill.effects_missing_surface', `Effects must include ${effect}`, relativePath))
    }
  }

  const validation = sectionBetween(text, '## Validation', '')
  if (validation && !validation.includes('Before done:')) {
    issues.push(issue('partita_skill.validation_shape', 'Validation must include Before done:', relativePath))
  }

  return issues
}

const checkOpenAiMetadata = Effect.fn('checkOpenAiMetadata')(function* (
  fs: FileSystem.FileSystem,
  root: string,
  skillName: string,
  skillPath: string,
  expectedDisplayName: string | undefined,
  expectedInterface: ExpectedOpenAiInterfaceProjection | undefined,
) {
  const metadataPath = join(dirname(skillPath), 'agents', 'openai.yaml')
  const relativeMetadataPath = relativePathFrom(root, metadataPath)
  const exists = yield* pathExists(fs, metadataPath)
  const issues: Array<ValidationIssue> = []
  if (!exists) {
    issues.push(issue(
      'openai_metadata.missing',
      `${skillName} must project invocation policy through agents/openai.yaml`,
      relativeMetadataPath,
    ))
    return issues
  }

  const metadata = parseOpenAiMetadata(yield* readText(fs, metadataPath), relativeMetadataPath)
  issues.push(...metadata.issues)

  if (!metadata.sections.has('interface')) {
    issues.push(issue('openai_metadata.interface_missing', 'agents/openai.yaml must declare interface metadata', relativeMetadataPath))
  }
  for (const field of requiredOpenAiInterfaceFields) {
    if (!nonEmptyString(metadata.interfaceFields[field])) {
      issues.push(issue('openai_metadata.interface_field_missing', `interface.${field} is required`, relativeMetadataPath))
    }
  }
  if (
    expectedDisplayName !== undefined
    && nonEmptyString(metadata.interfaceFields.display_name)
    && metadata.interfaceFields.display_name !== expectedDisplayName
  ) {
    issues.push(issue(
      'openai_metadata.display_name_projection',
      `interface.display_name must match SKILL.md title: ${expectedDisplayName}`,
      relativeMetadataPath,
    ))
  }
  if (
    expectedInterface !== undefined
    && nonEmptyString(metadata.interfaceFields.short_description)
    && metadata.interfaceFields.short_description !== expectedInterface.shortDescription
  ) {
    issues.push(issue(
      'openai_metadata.short_description_projection',
      `interface.short_description must match selector projection: ${expectedInterface.shortDescription}`,
      relativeMetadataPath,
    ))
  }
  if (
    expectedInterface !== undefined
    && nonEmptyString(metadata.interfaceFields.default_prompt)
    && metadata.interfaceFields.default_prompt !== expectedInterface.defaultPrompt
  ) {
    issues.push(issue(
      'openai_metadata.default_prompt_projection',
      `interface.default_prompt must match selector projection: ${expectedInterface.defaultPrompt}`,
      relativeMetadataPath,
    ))
  }

  if (metadata.topLevelScalars.allow_implicit_invocation !== undefined) {
    issues.push(issue('openai_metadata.policy_location', 'allow_implicit_invocation must be nested under policy', relativeMetadataPath))
  }
  if (!metadata.sections.has('policy')) {
    issues.push(issue('openai_metadata.policy_missing', 'agents/openai.yaml must declare policy metadata', relativeMetadataPath))
  }
  if (metadata.allowImplicitInvocation === undefined) {
    issues.push(issue('openai_metadata.missing_invocation_policy', 'agents/openai.yaml must declare policy.allow_implicit_invocation', relativeMetadataPath))
    return issues
  }

  return issues
})

function firstMarkdownTitle(text: string): string | undefined {
  for (const line of text.split(/\r?\n/u)) {
    if (line.startsWith('# ')) {
      const title = line.slice(2).trim()
      return title.length > 0 ? title : undefined
    }
  }
  return undefined
}

interface OpenAiMetadata {
  readonly allowImplicitInvocation: boolean | undefined
  readonly interfaceFields: Record<string, string>
  readonly policyFields: Record<string, string>
  readonly sections: ReadonlySet<string>
  readonly topLevelScalars: Record<string, string>
  readonly issues: ReadonlyArray<ValidationIssue>
}

function parseOpenAiMetadata(
  text: string,
  path: string,
): OpenAiMetadata {
  const issues: Array<ValidationIssue> = []
  const interfaceFields: Record<string, string> = {}
  const policyFields: Record<string, string> = {}
  const topLevelScalars: Record<string, string> = {}
  const sections = new Set<string>()
  let currentSection: string | undefined

  for (const [index, rawLine] of text.split(/\r?\n/u).entries()) {
    if (!rawLine.trim() || rawLine.trimStart().startsWith('#')) {
      continue
    }

    if (rawLine.includes('\t')) {
      issues.push(issue('openai_metadata.invalid_indent', `tabs are not allowed in YAML metadata on line ${index + 1}`, path))
      continue
    }

    const indent = leadingSpaceCount(rawLine)
    const line = rawLine.trim()
    const [key, rawValue] = splitYamlLine(line)
    if (rawValue === undefined) {
      issues.push(issue('openai_metadata.invalid_line', `invalid YAML metadata line ${index + 1}: ${JSON.stringify(rawLine)}`, path))
      continue
    }

    if (indent === 0) {
      currentSection = key
      if (rawValue.trim()) {
        topLevelScalars[key] = rawValue.trim()
        if (key === 'interface' || key === 'policy') {
          issues.push(issue('openai_metadata.invalid_section', `${key} must be a YAML mapping block`, path))
        }
      }
      else {
        sections.add(key)
      }
      continue
    }

    if (indent !== 2 || currentSection === undefined) {
      issues.push(issue('openai_metadata.invalid_indent', `unsupported YAML indentation on line ${index + 1}`, path))
      continue
    }

    const value = parseYamlScalar(rawValue, path, index + 1, issues)
    if (value === undefined) {
      continue
    }
    if (currentSection === 'interface') {
      interfaceFields[key] = value
    }
    else if (currentSection === 'policy') {
      policyFields[key] = value
    }
  }

  const policyValue = policyFields.allow_implicit_invocation
  const allowImplicitInvocation = policyValue === undefined
    ? undefined
    : parseBooleanPolicy(policyValue, path, issues)

  return {
    allowImplicitInvocation,
    interfaceFields,
    issues,
    policyFields,
    sections,
    topLevelScalars,
  }
}

function leadingSpaceCount(line: string): number {
  return line.length - line.trimStart().length
}

function splitYamlLine(line: string): readonly [string, string | undefined] {
  const separator = line.indexOf(':')
  if (separator === -1) {
    return [line, undefined]
  }
  return [line.slice(0, separator), line.slice(separator + 1)]
}

function parseYamlScalar(
  rawValue: string,
  path: string,
  line: number,
  issues: Array<ValidationIssue>,
): string | undefined {
  const value = rawValue.trim()
  if (!value) {
    issues.push(issue('openai_metadata.empty_value', `empty YAML scalar on line ${line}`, path))
    return undefined
  }

  if (value.startsWith('"') || value.startsWith('\'')) {
    const parsed = parseQuotedString(value)
    if (parsed.ok) {
      return parsed.value
    }
    issues.push(issue('openai_metadata.invalid_quote', `invalid YAML quote on line ${line}: ${parsed.message}`, path))
    return undefined
  }

  return value
}

function parseBooleanPolicy(value: string, path: string, issues: Array<ValidationIssue>): boolean | undefined {
  if (value === 'true') {
    return true
  }
  if (value === 'false') {
    return false
  }
  issues.push(issue('openai_metadata.invalid_invocation_policy', 'policy.allow_implicit_invocation must be true or false', path))
  return undefined
}

function parseQuotedString(value: string): { readonly ok: true, readonly value: string } | { readonly ok: false, readonly message: string } {
  const quote = value[0]
  if (value[value.length - 1] !== quote) {
    return { message: 'missing closing quote', ok: false }
  }

  let result = ''
  for (let index = 1; index < value.length - 1; index += 1) {
    const character = value[index]
    if (character !== '\\') {
      result += character
      continue
    }

    index += 1
    if (index >= value.length - 1) {
      return { message: 'dangling escape', ok: false }
    }
    const escaped = value[index]
    switch (escaped) {
      case 'n':
        result += '\n'
        break
      case 'r':
        result += '\r'
        break
      case 't':
        result += '\t'
        break
      case '\\':
      case '"':
      case '\'':
        result += escaped
        break
      default:
        result += escaped
    }
  }

  return { ok: true, value: result }
}

function checkSkillsRootShape(catalog: PartitaSourceSkillCatalog): ReadonlyArray<ValidationIssue> {
  const issues: Array<ValidationIssue> = []
  for (const entry of catalog.skillsRootEntries) {
    if (entry.type !== 'Directory') {
      continue
    }

    const hasDirectSkill = entry.entries?.some(child => child.name === 'SKILL.md') ?? false
    if (hasDirectSkill || isPartitaSkillFamily(entry.name)) {
      continue
    }

    issues.push(issue(
      'skills_root.unsupported_directory',
      'skills directories must be direct skills or supported namespaces',
      relativePathFrom(catalog.root, join(catalog.root, 'skills', entry.name)),
    ))
  }
  return issues
}

function checkRuntimeSkillDirectoryShape(
  root: string,
  skill: PartitaSourceSkill,
): ReadonlyArray<ValidationIssue> {
  const issues: Array<ValidationIssue> = []
  for (const entry of skill.directoryEntries) {
    const entryPath = join(skill.directoryPath, entry.name)
    const relativeEntryPath = relativePathFrom(root, entryPath)
    switch (entry.name) {
      case 'SKILL.md':
        if (entry.type !== 'File') {
          issues.push(issue('openai_skill_shape.invalid_skill_file', 'SKILL.md must be a file', relativeEntryPath))
        }
        break
      case 'agents':
        issues.push(...checkAgentsDirectory(root, entryPath, entry))
        break
      case 'assets':
        issues.push(...checkBundledResourceDirectory(root, entryPath, entry.type === 'Directory', 'assets'))
        break
      case 'references':
        issues.push(...checkReferencesDirectory(root, entryPath, entry))
        break
      case 'scripts':
        issues.push(...checkBundledResourceDirectory(root, entryPath, entry.type === 'Directory', 'scripts'))
        break
      default:
        issues.push(issue('openai_skill_shape.unsupported_entry', 'skill directories may only contain SKILL.md, agents/, scripts/, references/, and assets/', relativeEntryPath))
    }
  }
  return issues
}

function checkAgentsDirectory(
  root: string,
  path: string,
  directory: PartitaSourceDirectoryEntry,
): ReadonlyArray<ValidationIssue> {
  if (directory.type !== 'Directory') {
    return [issue('openai_skill_shape.invalid_agents_dir', 'agents must be a directory', relativePathFrom(root, path))]
  }

  return (directory.entries ?? []).flatMap((entry) => {
    const entryPath = join(path, entry.name)
    const relativeEntryPath = relativePathFrom(root, entryPath)
    if (entry.type !== 'File') {
      return [issue('openai_skill_shape.unsupported_agent_entry', 'agents must contain one-level config files', relativeEntryPath)]
    }
    return []
  })
}

function checkBundledResourceDirectory(
  root: string,
  path: string,
  isDirectory: boolean,
  name: 'assets' | 'scripts',
): ReadonlyArray<ValidationIssue> {
  return isDirectory
    ? []
    : [issue(`openai_skill_shape.invalid_${name}_dir`, `${name} must be a directory`, relativePathFrom(root, path))]
}

function checkReferencesDirectory(
  root: string,
  path: string,
  directory: PartitaSourceDirectoryEntry,
): ReadonlyArray<ValidationIssue> {
  if (directory.type !== 'Directory') {
    return [issue('openai_skill_shape.invalid_references_dir', 'references must be a directory', relativePathFrom(root, path))]
  }

  return (directory.entries ?? []).flatMap((entry) => {
    const entryPath = join(path, entry.name)
    const relativeEntryPath = relativePathFrom(root, entryPath)
    if (entry.type !== 'File') {
      return [issue('openai_skill_shape.unsupported_reference', 'references must be one-level files', relativeEntryPath)]
    }
    return []
  })
}

function hasLoadedSkillMarker(text: string): boolean {
  return loadedSkillMarkers.some(marker => text.includes(marker))
}

function sectionBetween(text: string, start: string, end: string): string {
  const startIndex = text.indexOf(start)
  if (startIndex === -1) {
    return ''
  }

  const contentStart = startIndex + start.length
  const endIndex = text.indexOf(end, contentStart)
  return endIndex === -1 ? text.slice(contentStart) : text.slice(contentStart, endIndex)
}

const pathExists = Effect.fn('partitaSkillPathExists')((fs: FileSystem.FileSystem, path: string) =>
  fs.exists(path).pipe(Effect.mapError(cause => fileSystemError(`Check ${path}`, cause))))

const readText = Effect.fn('partitaSkillReadText')((fs: FileSystem.FileSystem, path: string) =>
  fs.readFileString(path).pipe(Effect.mapError(cause => fileSystemError(`Read ${path}`, cause))))

function fileSystemError(operation: string, cause: unknown): PartitaError {
  return new PartitaError(`${operation}: ${cause instanceof Error ? cause.message : String(cause)}`)
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function relativePathFrom(root: string, path: string): string {
  const relativePath = relative(root, path)
  return relativePath === '' ? '.' : relativePath.split(sep).join('/')
}
