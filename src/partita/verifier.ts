import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, dirname, join, relative, resolve, sep } from 'node:path'
import * as Console from 'effect/Console'
import * as Effect from 'effect/Effect'
import { PartitaError } from './errors.ts'

export interface VerifyProjectOptions {
  readonly root: string
}

export interface ValidationIssue {
  readonly code: string
  readonly message: string
  readonly path?: string
}

export interface ValidationReport {
  readonly ok: boolean
  readonly issues: ReadonlyArray<ValidationIssue>
}

interface SkillFrontmatter {
  readonly name: string
  readonly description: string
}

interface FrontmatterParseResult {
  readonly fields?: SkillFrontmatter
  readonly issues: ReadonlyArray<ValidationIssue>
}

const skillRefPattern = /skills\/([a-z][a-z0-9_-]*)\/SKILL\.md/gu
const linkPattern = /\[[^\]]*\]\(([^)]+)\)/gu
const wikiLinkPattern = /\[\[([^\]\n]+)\]\]/gu
const urlPrefixes = ['http://', 'https://', 'mailto:', 'ftp://', 'tel:', 'data:']
const loadedSkillMarker = '🧭'
const skillContractSections = [
  '## Capability',
  '## Trigger',
  '## Soft Boundary',
  '## Hard Boundary',
  '## Workflow',
  '## Validation',
] as const
const stateTokens = ['`stateful`', '`stateless`'] as const
const activationTokens = ['`activation: broad`', '`activation: narrow`'] as const
const invocationTokens = ['`invocation: implicit`', '`invocation: explicit`'] as const
const durationTokens = ['`duration: turn`', '`duration: task`', '`duration: topic`', '`duration: mode`'] as const
const requiredOpenAiInterfaceFields = ['display_name', 'short_description', 'default_prompt'] as const

const requiredRootMapFiles = [
  'CONTEXT.md',
  'HARNESS.md',
] as const

const requiredWikiFiles = [
  'wiki/index.md',
  'wiki/harness/index.md',
  'wiki/skill/index.md',
  'wiki/skill/assertion.md',
  'wiki/skill/primitive.md',
  'wiki/skill/orchestrator.md',
  'wiki/skill/case/index.md',
  'wiki/skill/case/pattern.md',
  'wiki/skill/case/pressure.md',
  'wiki/skill/governance/index.md',
  'wiki/skill/governance/identity.md',
  'wiki/skill/lifecycle/index.md',
  'wiki/workflow/index.md',
  'wiki/workflow/gate/index.md',
  'wiki/workflow/gate/contract.md',
  'wiki/workflow/gate/span.md',
  'wiki/projection/index.md',
  'wiki/projection/codex/index.md',
  'wiki/projection/codex/frontmatter.md',
  'wiki/projection/codex/openai.md',
  'wiki/projection/codex/dispatcher.md',
  'wiki/projection/codex/references.md',
  'wiki/projection/codex/skill-md.md',
  'wiki/projection/verifier/index.md',
  'wiki/projection/verifier/links.md',
  'wiki/projection/verifier/metadata.md',
  'wiki/projection/verifier/nodes.md',
  'wiki/projection/verifier/shape.md',
  'wiki/practice/index.md',
  'wiki/practice/create.md',
  'wiki/practice/patch.md',
  'wiki/practice/audit.md',
  'wiki/collaboration/index.md',
  'wiki/documentation/index.md',
  'wiki/vocabulary/index.md',
] as const

export const verifySourceProject = Effect.fn('verifySourceProject')(function* (options: VerifyProjectOptions) {
  return yield* Effect.sync(() => buildSourceReport(resolve(options.root)))
})

export const verifyRouting = Effect.fn('verifyRouting')(function* (options: VerifyProjectOptions) {
  return yield* Effect.sync(() => {
    const root = resolve(options.root)
    const skills = skillFiles(root).map(path => basename(dirname(path)))
    return reportFromIssues(checkRouting(root, new Set(skills)))
  })
})

export const verifyProject = Effect.fn('verifyProject')(function* (options: VerifyProjectOptions) {
  const report = yield* verifySourceProject(options)
  if (!report.ok) {
    yield* Console.error('Partita verification failed:')
    for (const issue of report.issues) {
      yield* Console.error(`- ${formatIssue(issue)}`)
    }
    return yield* Effect.fail(new PartitaError('Partita verification failed.'))
  }

  yield* Console.log(`Partita source verified: ${options.root}`)
})

function formatIssue(issue: ValidationIssue): string {
  return issue.path ? `${issue.path}: ${issue.message}` : issue.message
}

function reportFromIssues(issues: ReadonlyArray<ValidationIssue>): ValidationReport {
  return {
    issues,
    ok: issues.length === 0,
  }
}

function buildSourceReport(root: string): ValidationReport {
  const skillResult = checkSkillFiles(root)
  const skills = new Set(Object.keys(skillResult.descriptions))
  const issues = [
    ...skillResult.issues,
    ...checkPluginManifest(root),
    ...checkRouting(root, skills),
    ...checkRootMapFiles(root),
    ...checkWikiFiles(root),
    ...checkMarkdownLinks(root),
    ...checkWikiLinks(root),
    ...checkRemovedSurfaces(root),
    ...checkNoRootSkill(root),
  ]
  return reportFromIssues(issues)
}

function checkSkillFiles(root: string): { readonly descriptions: Record<string, string>, readonly issues: ReadonlyArray<ValidationIssue> } {
  const descriptions: Record<string, string> = {}
  const issues: Array<ValidationIssue> = []

  for (const path of skillFiles(root)) {
    const relativePath = relativePathFrom(root, path)
    const text = readText(path)
    const parsed = parseFrontmatter(text, relativePath)
    issues.push(...parsed.issues)

    if (!parsed.fields) {
      continue
    }

    issues.push(...checkSkillDirectoryShape(root, path))

    const name = parsed.fields.name
    if (name !== basename(dirname(path))) {
      issues.push(issue('skill.name_mismatch', `name=${JSON.stringify(name)} dir=${JSON.stringify(basename(dirname(path)))}`, relativePath))
    }

    const description = parsed.fields.description.trim()
    if (description.length < 40) {
      issues.push(issue('skill.description_too_short', 'description must be at least 40 characters', relativePath))
    }
    const lowered = description.toLowerCase()
    if (!lowered.includes('use when') || !lowered.includes('not for')) {
      issues.push(issue('skill.description_activation_surface', 'description must include Use when and Not for', relativePath))
    }
    if (!text.includes(loadedSkillMarker)) {
      issues.push(issue('skill.missing_marker', `missing ${loadedSkillMarker} marker instruction`, relativePath))
    }

    const missingSections = skillContractSections.filter(section => !text.includes(section))
    if (missingSections.length > 0) {
      issues.push(issue('skill.missing_contract_sections', `missing sections: ${missingSections.join(', ')}`, relativePath))
    }

    const softBoundary = sectionBetween(text, '## Soft Boundary', '## Hard Boundary')
    if (!softBoundary.includes('Primitive audit:')) {
      issues.push(issue('skill.missing_primitive_audit', 'Soft Boundary must include Primitive audit:', relativePath))
    }
    if (!stateTokens.some(token => softBoundary.includes(token))) {
      issues.push(issue('skill.primitive_state_missing', 'Primitive audit must include `stateful` or `stateless`', relativePath))
    }
    if (!activationTokens.some(token => softBoundary.includes(token))) {
      issues.push(issue('skill.primitive_activation_missing', 'Primitive audit must include activation token', relativePath))
    }
    const invocation = primitiveInvocation(softBoundary)
    if (!invocation) {
      issues.push(issue('skill.primitive_invocation_missing', 'Primitive audit must include invocation token', relativePath))
    }
    if (!durationTokens.some(token => softBoundary.includes(token))) {
      issues.push(issue('skill.primitive_duration_missing', 'Primitive audit must include duration token', relativePath))
    }

    const hardBoundary = sectionBetween(text, '## Hard Boundary', '## Workflow')
    if (!hardBoundary.includes('primitive `constraint.hard`') || !hardBoundary.includes('machine-checkable')) {
      issues.push(issue('skill.hard_boundary_wording', 'Hard Boundary must distinguish primitive `constraint.hard` from machine-checkable enforcement', relativePath))
    }
    issues.push(...checkOpenAiMetadata(root, name, path, invocation))

    descriptions[name] = description
  }

  return { descriptions, issues }
}

function primitiveInvocation(softBoundary: string): 'implicit' | 'explicit' | undefined {
  if (softBoundary.includes(invocationTokens[0])) {
    return 'implicit'
  }
  if (softBoundary.includes(invocationTokens[1])) {
    return 'explicit'
  }
  return undefined
}

function checkOpenAiMetadata(
  root: string,
  skillName: string,
  skillPath: string,
  invocation: 'implicit' | 'explicit' | undefined,
): ReadonlyArray<ValidationIssue> {
  const metadataPath = join(dirname(skillPath), 'agents', 'openai.yaml')
  const relativeMetadataPath = relativePathFrom(root, metadataPath)
  const exists = existsSync(metadataPath)
  const issues: Array<ValidationIssue> = []
  if (!exists) {
    issues.push(issue(
      'openai_metadata.missing',
      `${skillName} must project invocation policy through agents/openai.yaml`,
      relativeMetadataPath,
    ))
    return issues
  }

  const metadata = parseOpenAiMetadata(readText(metadataPath), relativeMetadataPath)
  issues.push(...metadata.issues)

  if (!metadata.sections.has('interface')) {
    issues.push(issue('openai_metadata.interface_missing', 'agents/openai.yaml must declare interface metadata', relativeMetadataPath))
  }
  for (const field of requiredOpenAiInterfaceFields) {
    if (!nonEmptyString(metadata.interfaceFields[field])) {
      issues.push(issue('openai_metadata.interface_field_missing', `interface.${field} is required`, relativeMetadataPath))
    }
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

  if (invocation === 'explicit' && metadata.allowImplicitInvocation !== false) {
    issues.push(issue('openai_metadata.explicit_allows_implicit', 'invocation: explicit requires policy.allow_implicit_invocation: false', relativeMetadataPath))
  }
  if (invocation === 'implicit' && metadata.allowImplicitInvocation !== true) {
    issues.push(issue('openai_metadata.implicit_disallows_implicit', 'invocation: implicit must not set policy.allow_implicit_invocation: false', relativeMetadataPath))
  }

  return issues
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

function parseFrontmatter(text: string, path: string): FrontmatterParseResult {
  const issues: Array<ValidationIssue> = []
  const lines = text.split(/\r?\n/u)
  if (lines.length === 0 || lines[0] !== '---') {
    return {
      issues: [issue('frontmatter.invalid', 'frontmatter must start with ---', path)],
    }
  }

  const end = lines.indexOf('---', 1)
  if (end === -1) {
    return {
      issues: [issue('frontmatter.invalid', 'frontmatter missing closing ---', path)],
    }
  }

  const fields: Partial<SkillFrontmatter> = {}
  for (const rawLine of lines.slice(1, end)) {
    if (!rawLine.trim()) {
      continue
    }

    if (rawLine.startsWith('  ')) {
      issues.push(issue('frontmatter.invalid_indent', `invalid frontmatter indent: ${JSON.stringify(rawLine)}`, path))
      continue
    }

    const [key, rawValue] = splitFrontmatterLine(rawLine)
    if (!rawValue) {
      issues.push(issue('frontmatter.invalid_line', `invalid frontmatter line: ${JSON.stringify(rawLine)}`, path))
      continue
    }

    const field = frontmatterFieldName(key)
    if (field) {
      const parsed = parseScalar(key, rawValue, path)
      issues.push(...parsed.issues)
      if (parsed.value) {
        Object.assign(fields, { [field]: parsed.value })
      }
    }
    else {
      issues.push(issue('frontmatter.unsupported_field', `unsupported frontmatter field: ${key}; Codex skills use only name and description`, path))
    }
  }

  if (!fields.name?.trim()) {
    issues.push(issue('frontmatter.missing_name', 'missing name', path))
  }
  if (!fields.description?.trim()) {
    issues.push(issue('frontmatter.missing_description', 'missing description', path))
  }
  if (!fields.name || !fields.description) {
    return { issues }
  }

  return {
    fields: {
      description: fields.description.trim(),
      name: fields.name.trim(),
    },
    issues,
  }
}

function splitFrontmatterLine(line: string): readonly [string, string] {
  const separator = line.indexOf(':')
  if (separator === -1) {
    return [line, '']
  }
  return [line.slice(0, separator), line.slice(separator + 1)]
}

function frontmatterFieldName(key: string): keyof SkillFrontmatter | undefined {
  switch (key) {
    case 'name':
      return 'name'
    case 'description':
      return 'description'
    default:
      return undefined
  }
}

function parseScalar(field: string, raw: string, path: string): { readonly value?: string, readonly issues: ReadonlyArray<ValidationIssue> } {
  const value = raw.trim()
  if (!value) {
    return { issues: [issue('frontmatter.empty_value', `empty frontmatter value: ${field}`, path)] }
  }

  if (value.startsWith('"') || value.startsWith('\'')) {
    const parsed = parseQuotedString(value)
    return parsed.ok
      ? { issues: [], value: parsed.value }
      : { issues: [issue('frontmatter.invalid_quote', `invalid frontmatter quote in ${field}: ${parsed.message}`, path)] }
  }

  if (value.includes(': ')) {
    return { issues: [issue('frontmatter.unquoted_colon', `quote values containing ': ' in ${field}`, path)] }
  }

  return { issues: [], value }
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

function checkPluginManifest(root: string): ReadonlyArray<ValidationIssue> {
  const issues: Array<ValidationIssue> = []
  const packageJsonPath = join(root, 'package.json')
  const packageJsonRelPath = 'package.json'
  const manifestPath = join(root, '.codex-plugin', 'plugin.json')
  const manifestRelPath = '.codex-plugin/plugin.json'

  const version = packageJsonVersion(packageJsonPath, packageJsonRelPath, issues)

  if (existsSync(join(root, 'VERSION'))) {
    issues.push(issue('version_file.forbidden', 'VERSION file is not used; package.json owns the version', 'VERSION'))
  }

  if (!existsSync(manifestPath)) {
    issues.push(issue('plugin_manifest.missing', '.codex-plugin/plugin.json missing', manifestRelPath))
    return issues
  }

  const parsed = parseJson(readText(manifestPath), manifestRelPath)
  if (!parsed.ok) {
    issues.push(parsed.issue)
    return issues
  }

  const data = parsed.value
  if (!isRecord(data)) {
    issues.push(issue('plugin_manifest.invalid', 'plugin manifest must be a JSON object', manifestRelPath))
    return issues
  }

  if (data.name !== 'partita') {
    issues.push(issue('plugin_manifest.name', 'name must be partita', manifestRelPath))
  }
  if (version && data.version !== version) {
    issues.push(issue('plugin_manifest.version_drift', `plugin.json version ${stringifyField(data.version)} != package.json version ${version}`, manifestRelPath))
  }
  if (data.skills !== './skills/') {
    issues.push(issue('plugin_manifest.skills_path', 'skills must be ./skills/', manifestRelPath))
  }

  const interfaceValue = data.interface
  if (!isRecord(interfaceValue)) {
    issues.push(issue('plugin_manifest.interface', 'interface must be an object', manifestRelPath))
    return issues
  }

  for (const field of ['displayName', 'shortDescription', 'longDescription', 'developerName', 'category'] as const) {
    if (!nonEmptyString(interfaceValue[field])) {
      issues.push(issue('plugin_manifest.interface_field', `interface.${field} is required`, manifestRelPath))
    }
  }

  for (const field of ['capabilities', 'defaultPrompt'] as const) {
    const value = interfaceValue[field]
    if (!Array.isArray(value) || !value.every(nonEmptyString)) {
      issues.push(issue('plugin_manifest.interface_array', `interface.${field} must be non-empty strings`, manifestRelPath))
    }
  }

  return issues
}

function packageJsonVersion(path: string, relativePath: string, issues: Array<ValidationIssue>): string {
  if (!existsSync(path)) {
    issues.push(issue('package_json.missing', 'package.json missing', relativePath))
    return ''
  }

  const parsed = parseJson(readText(path), relativePath)
  if (!parsed.ok) {
    issues.push(parsed.issue)
    return ''
  }

  const data = parsed.value
  if (!isRecord(data)) {
    issues.push(issue('package_json.invalid', 'package.json must be a JSON object', relativePath))
    return ''
  }

  if (!nonEmptyString(data.version)) {
    issues.push(issue('package_json.version_missing', 'package.json version is required', relativePath))
    return ''
  }

  return data.version.trim()
}

function checkRouting(root: string, skills: ReadonlySet<string>): ReadonlyArray<ValidationIssue> {
  const issues: Array<ValidationIssue> = []
  const routingPaths = ['skills/DISPATCHER.md']

  if (!existsSync(join(root, 'skills/DISPATCHER.md'))) {
    issues.push(issue('routing.dispatcher_missing', 'missing dispatcher routing file: skills/DISPATCHER.md'))
  }

  for (const path of routingPaths) {
    const absolutePath = join(root, path)
    if (!existsSync(absolutePath)) {
      issues.push(issue('routing.missing_file', 'missing routing file', path))
      continue
    }

    const text = readText(absolutePath)
    const refs = skillRefs(text)
    const missing = [...skills].filter(skill => !refs.has(skill)).sort()
    const stale = [...refs].filter(skill => !skills.has(skill)).sort()
    if (missing.length > 0) {
      issues.push(issue('routing.missing_skill_refs', `missing skill refs: ${missing.join(', ')}`, path))
    }
    if (stale.length > 0) {
      issues.push(issue('routing.stale_skill_refs', `stale skill refs: ${stale.join(', ')}`, path))
    }
    if (!text.includes(loadedSkillMarker)) {
      issues.push(issue('routing.missing_marker', `missing ${loadedSkillMarker} marker`, path))
    }
  }

  return issues
}

function checkWikiFiles(root: string): ReadonlyArray<ValidationIssue> {
  return requiredWikiFiles
    .filter(path => !existsSync(join(root, path)))
    .map(path => issue('wiki.missing_file', 'missing wiki file', path))
}

function checkRootMapFiles(root: string): ReadonlyArray<ValidationIssue> {
  const issues: Array<ValidationIssue> = []
  for (const path of requiredRootMapFiles) {
    const absolutePath = join(root, path)
    if (!existsSync(absolutePath)) {
      issues.push(issue('root_map.missing_file', 'missing root map file', path))
      continue
    }

    const text = readText(absolutePath)
    if (!text.includes('wiki/')) {
      issues.push(issue('root_map.missing_wiki_route', 'root map must route readers into wiki/', path))
    }
    if (text.includes('rules/') || text.includes('theory/')) {
      issues.push(issue('root_map.old_layer_ref', 'root map must not route to removed rules/ or theory/ layers', path))
    }
  }
  return issues
}

function checkMarkdownLinks(root: string): ReadonlyArray<ValidationIssue> {
  const issues: Array<ValidationIssue> = []
  for (const path of markdownFiles(root)) {
    const relativePath = relativePathFrom(root, path)
    const text = readText(path)
    for (const match of text.matchAll(linkPattern)) {
      const target = match[1]
      if (target === undefined) {
        continue
      }
      if (isExternalLink(target) || target.startsWith('#')) {
        continue
      }

      const hashIndex = target.indexOf('#')
      const clean = (hashIndex === -1 ? target : target.slice(0, hashIndex)).trim()
      if (!clean) {
        continue
      }
      if (!existsSync(join(dirname(path), clean))) {
        issues.push(issue('markdown.broken_link', `broken markdown link: ${target}`, relativePath))
      }
    }
  }
  return issues
}

function checkWikiLinks(root: string): ReadonlyArray<ValidationIssue> {
  const issues: Array<ValidationIssue> = []
  const wikiRoot = join(root, 'wiki')
  for (const path of markdownFiles(root)) {
    const relativePath = relativePathFrom(root, path)
    const text = readText(path)
    for (const match of text.matchAll(wikiLinkPattern)) {
      const target = match[1]
      if (target === undefined) {
        continue
      }

      const clean = cleanWikiTarget(target)
      if (!clean) {
        continue
      }

      const targetPath = clean.endsWith('.md') ? clean : `${clean}.md`
      if (!existsSync(join(wikiRoot, targetPath))) {
        issues.push(issue('wiki.broken_link', `broken wiki link: ${target}`, relativePath))
      }
    }
  }
  return issues
}

function checkRemovedSurfaces(root: string): ReadonlyArray<ValidationIssue> {
  const removed = [
    ['VERSION', 'deprecated VERSION file must not exist'],
    ['AGENTS.profile.md', 'removed profile file must not exist'],
    ['packaging.allowlist', 'removed package allowlist must not exist'],
    ['rules', 'removed rules directory must not exist'],
    ['theory', 'removed theory directory must not exist'],
    ['skills/RESOLVER.md', 'removed resolver registry must not exist'],
    ['src/partita/packager.ts', 'removed zip packager must not exist'],
    ['src/partita/package-verify.ts', 'removed package verifier must not exist'],
    ['tests/packager.test.ts', 'removed packager tests must not exist'],
    ['wiki/skill/design-v1.md', 'absorbed design-v1 source must not exist'],
    ['wiki/practice/migrate.md', 'removed migration practice node must not exist'],
    ['wiki/projection/verifier/package.md', 'removed package verifier node must not exist'],
    ['partita.zip', 'removed zip artifact must not exist'],
    ['dist/partita.zip', 'removed zip artifact must not exist'],
  ] as const

  return removed
    .filter(([path]) => existsSync(join(root, path)))
    .map(([path, message]) => issue('surface.removed_exists', message, path))
}

function checkNoRootSkill(root: string): ReadonlyArray<ValidationIssue> {
  return existsSync(join(root, 'SKILL.md'))
    ? [issue('root_skill.forbidden', 'source root SKILL.md is not allowed', 'SKILL.md')]
    : []
}

function skillFiles(root: string): ReadonlyArray<string> {
  const skillsRoot = join(root, 'skills')
  if (!existsSync(skillsRoot)) {
    return []
  }

  return readdirSync(skillsRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => join(skillsRoot, entry.name, 'SKILL.md'))
    .filter(path => existsSync(path))
    .sort()
}

function checkSkillDirectoryShape(root: string, skillPath: string): ReadonlyArray<ValidationIssue> {
  const issues: Array<ValidationIssue> = []
  const skillDir = dirname(skillPath)
  for (const entry of readdirSync(skillDir, { withFileTypes: true })) {
    const entryPath = join(skillDir, entry.name)
    const relativeEntryPath = relativePathFrom(root, entryPath)
    switch (entry.name) {
      case 'SKILL.md':
        if (!entry.isFile()) {
          issues.push(issue('skill_shape.invalid_skill_file', 'SKILL.md must be a file', relativeEntryPath))
        }
        break
      case 'agents':
        issues.push(...checkAgentsDirectory(root, entryPath, entry.isDirectory()))
        break
      case 'references':
        issues.push(...checkReferencesDirectory(root, entryPath, entry.isDirectory()))
        break
      default:
        issues.push(issue('skill_shape.unsupported_entry', 'skill directories may only contain SKILL.md, agents/openai.yaml, and references/*.md', relativeEntryPath))
    }
  }
  return issues
}

function checkAgentsDirectory(root: string, path: string, isDirectory: boolean): ReadonlyArray<ValidationIssue> {
  if (!isDirectory) {
    return [issue('skill_shape.invalid_agents_dir', 'agents must be a directory', relativePathFrom(root, path))]
  }

  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(path, entry.name)
    const relativeEntryPath = relativePathFrom(root, entryPath)
    if (entry.name !== 'openai.yaml') {
      return [issue('skill_shape.unsupported_agent_file', 'agents may only contain openai.yaml', relativeEntryPath)]
    }
    return entry.isFile()
      ? []
      : [issue('skill_shape.invalid_openai_metadata', 'agents/openai.yaml must be a file', relativeEntryPath)]
  })
}

function checkReferencesDirectory(root: string, path: string, isDirectory: boolean): ReadonlyArray<ValidationIssue> {
  if (!isDirectory) {
    return [issue('skill_shape.invalid_references_dir', 'references must be a directory', relativePathFrom(root, path))]
  }

  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(path, entry.name)
    const relativeEntryPath = relativePathFrom(root, entryPath)
    if (!entry.isFile() || !entry.name.endsWith('.md')) {
      return [issue('skill_shape.unsupported_reference', 'references must be one-level Markdown files', relativeEntryPath)]
    }
    return []
  })
}

function markdownFiles(root: string): ReadonlyArray<string> {
  const files: Array<string> = []
  walk(root, files)
  return files.sort()
}

function walk(path: string, files: Array<string>) {
  if (shouldSkipPath(path)) {
    return
  }

  const stat = statSync(path)
  if (stat.isDirectory()) {
    for (const entry of readdirSync(path)) {
      walk(join(path, entry), files)
    }
    return
  }

  if (path.endsWith('.md')) {
    files.push(path)
  }
}

function shouldSkipPath(path: string): boolean {
  return path.split(sep).some(part => part === '.git' || part === 'node_modules')
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

function skillRefs(text: string): ReadonlySet<string> {
  const refs: Array<string> = []
  for (const match of text.matchAll(skillRefPattern)) {
    const skill = match[1]
    if (skill !== undefined) {
      refs.push(skill)
    }
  }
  return new Set(refs)
}

function isExternalLink(target: string): boolean {
  return urlPrefixes.some(prefix => target.startsWith(prefix))
}

function cleanWikiTarget(target: string): string {
  const aliasIndex = target.indexOf('|')
  const withoutAlias = aliasIndex === -1 ? target : target.slice(0, aliasIndex)
  const hashIndex = withoutAlias.indexOf('#')
  const withoutHash = hashIndex === -1 ? withoutAlias : withoutAlias.slice(0, hashIndex)
  return withoutHash.trim().replace(/^\/+|\/+$/g, '')
}

function readText(path: string): string {
  return readFileSync(path, 'utf8')
}

function parseJson(text: string, path: string): { readonly ok: true, readonly value: unknown } | { readonly ok: false, readonly issue: ValidationIssue } {
  try {
    return { ok: true, value: JSON.parse(text) }
  }
  catch (error) {
    return { issue: issue('json.invalid', `invalid JSON: ${errorMessage(error)}`, path), ok: false }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function stringifyField(value: unknown): string {
  return typeof value === 'string' ? value : JSON.stringify(value)
}

function relativePathFrom(root: string, path: string): string {
  const relativePath = relative(root, path)
  return relativePath === '' ? '.' : relativePath.split(sep).join('/')
}

function issue(code: string, message: string, path?: string): ValidationIssue {
  return path ? { code, message, path } : { code, message }
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}
