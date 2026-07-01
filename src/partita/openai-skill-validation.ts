import type { SkillMetadata } from './model.ts'
import type { ValidationIssue, ValidationReport } from './validation.ts'

import { join } from 'node:path'
import { Effect, FileSystem } from 'effect'
import { issue } from './validation.ts'

export interface OpenAiSkillValidationReport extends ValidationReport {
  readonly fields?: SkillMetadata
}

const maxSkillNameLength = 64
const maxOfficialDescriptionLength = 1024
const officialFrontmatterKeys = new Set(['name', 'description', 'license', 'allowed-tools', 'metadata'])
const skillNamePattern = /^[a-z0-9-]+$/u
const numericCharactersPattern = /^[+\-.0-9e]+$/iu

type ScalarValue
  = | { readonly kind: 'string', readonly value: string }
    | { readonly kind: 'non_string', readonly typeName: string }
    | { readonly kind: 'invalid', readonly message: string }

interface ParsedFrontmatter {
  readonly keys: ReadonlyArray<string>
  readonly values: ReadonlyMap<string, ScalarValue>
  readonly issues: ReadonlyArray<ValidationIssue>
}

function pathExists(fs: FileSystem.FileSystem, path: string) {
  return fs.exists(path).pipe(
    Effect.catchTag('PlatformError', () => Effect.succeed(false)),
  )
}

export const validateOpenAiSkillFolder = Effect.fn('validateOpenAiSkillFolder')(function* (
  skillPath: string,
) {
  const skillMdPath = join(skillPath, 'SKILL.md')
  const fs = yield* FileSystem.FileSystem
  const exists = yield* pathExists(fs, skillMdPath)
  if (!exists) {
    return report([issue('openai_skill.skill_md_missing', 'SKILL.md not found', skillMdPath)])
  }

  return validateOpenAiSkillText(yield* fs.readFileString(skillMdPath), skillMdPath)
})

export function validateOpenAiSkillText(text: string, path = 'SKILL.md'): OpenAiSkillValidationReport {
  const lines = text.split(/\r?\n/u)
  if (lines[0] !== '---') {
    return report([issue('openai_skill.no_frontmatter', 'No YAML frontmatter found', path)])
  }

  const end = lines.indexOf('---', 1)
  if (end === -1) {
    return report([issue('openai_skill.invalid_frontmatter', 'Invalid frontmatter format', path)])
  }

  const parsed = parseFrontmatterLines(lines.slice(1, end), path)
  const issues = [...parsed.issues]
  if (parsed.keys.length === 0) {
    issues.push(issue('openai_skill.frontmatter_not_mapping', 'Frontmatter must be a YAML dictionary', path))
  }

  const unexpectedKeys = [...new Set(parsed.keys.filter(key => !officialFrontmatterKeys.has(key)))].sort()
  if (unexpectedKeys.length > 0) {
    const allowed = [...officialFrontmatterKeys].sort().join(', ')
    issues.push(issue(
      'openai_skill.unexpected_frontmatter_key',
      `Unexpected key(s) in SKILL.md frontmatter: ${unexpectedKeys.join(', ')}. Allowed properties are: ${allowed}`,
      path,
    ))
  }

  const hasName = parsed.keys.includes('name')
  const hasDescription = parsed.keys.includes('description')
  if (!hasName) {
    issues.push(issue('openai_skill.missing_name', 'Missing \'name\' in frontmatter', path))
  }
  if (!hasDescription) {
    issues.push(issue('openai_skill.missing_description', 'Missing \'description\' in frontmatter', path))
  }

  const name = checkName(parsed.values.get('name'), path, issues)
  const description = checkDescription(parsed.values.get('description'), path, issues)
  const fields = name !== undefined && description !== undefined
    ? { description, name } satisfies SkillMetadata
    : undefined

  return report(issues, fields)
}

function parseFrontmatterLines(lines: ReadonlyArray<string>, path: string): ParsedFrontmatter {
  const keys: Array<string> = []
  const values = new Map<string, ScalarValue>()
  const issues: Array<ValidationIssue> = []
  let currentKey: string | undefined

  for (const rawLine of lines) {
    if (!rawLine.trim()) {
      continue
    }

    if (/^\s/u.test(rawLine)) {
      if (currentKey === undefined) {
        issues.push(issue('openai_skill.invalid_frontmatter', `Invalid YAML in frontmatter: ${JSON.stringify(rawLine)}`, path))
      }
      continue
    }

    const separator = rawLine.indexOf(':')
    if (separator === -1) {
      issues.push(issue('openai_skill.invalid_frontmatter', `Invalid YAML in frontmatter: ${JSON.stringify(rawLine)}`, path))
      currentKey = undefined
      continue
    }

    const key = rawLine.slice(0, separator).trim()
    currentKey = key
    if (!key) {
      issues.push(issue('openai_skill.invalid_frontmatter', `Invalid YAML in frontmatter: ${JSON.stringify(rawLine)}`, path))
      continue
    }

    keys.push(key)
    if (key === 'name' || key === 'description') {
      values.set(key, parseScalar(rawLine.slice(separator + 1)))
    }
  }

  return { issues, keys, values }
}

function checkName(
  value: ScalarValue | undefined,
  path: string,
  issues: Array<ValidationIssue>,
): string | undefined {
  if (value === undefined) {
    return undefined
  }
  if (value.kind === 'invalid') {
    issues.push(issue('openai_skill.invalid_frontmatter', `Invalid YAML in frontmatter: ${value.message}`, path))
    return undefined
  }
  if (value.kind === 'non_string') {
    issues.push(issue('openai_skill.name_not_string', `Name must be a string, got ${value.typeName}`, path))
    return undefined
  }

  const name = value.value.trim()
  if (!name) {
    return name
  }
  if (!skillNamePattern.test(name)) {
    issues.push(issue(
      'openai_skill.name_format',
      `Name '${name}' should be hyphen-case (lowercase letters, digits, and hyphens only)`,
      path,
    ))
  }
  if (name.startsWith('-') || name.endsWith('-') || name.includes('--')) {
    issues.push(issue(
      'openai_skill.name_hyphen',
      `Name '${name}' cannot start/end with hyphen or contain consecutive hyphens`,
      path,
    ))
  }
  if (name.length > maxSkillNameLength) {
    issues.push(issue(
      'openai_skill.name_too_long',
      `Name is too long (${name.length} characters). Maximum is ${maxSkillNameLength} characters.`,
      path,
    ))
  }
  return name
}

function checkDescription(
  value: ScalarValue | undefined,
  path: string,
  issues: Array<ValidationIssue>,
): string | undefined {
  if (value === undefined) {
    return undefined
  }
  if (value.kind === 'invalid') {
    issues.push(issue('openai_skill.invalid_frontmatter', `Invalid YAML in frontmatter: ${value.message}`, path))
    return undefined
  }
  if (value.kind === 'non_string') {
    issues.push(issue('openai_skill.description_not_string', `Description must be a string, got ${value.typeName}`, path))
    return undefined
  }

  const description = value.value.trim()
  if (!description) {
    return description
  }
  if (description.includes('<') || description.includes('>')) {
    issues.push(issue('openai_skill.description_angle_bracket', 'Description cannot contain angle brackets (< or >)', path))
  }
  if (description.length > maxOfficialDescriptionLength) {
    issues.push(issue(
      'openai_skill.description_too_long',
      `Description is too long (${description.length} characters). Maximum is ${maxOfficialDescriptionLength} characters.`,
      path,
    ))
  }
  return description
}

function parseScalar(raw: string): ScalarValue {
  const value = raw.trim()
  if (!value) {
    return { kind: 'non_string', typeName: 'dict' }
  }

  if (value.startsWith('"') || value.startsWith('\'')) {
    const parsed = parseQuotedString(value)
    return parsed.ok
      ? { kind: 'string', value: parsed.value }
      : { kind: 'invalid', message: parsed.message }
  }

  const lowered = value.toLowerCase()
  if (lowered === 'true' || lowered === 'false') {
    return { kind: 'non_string', typeName: 'bool' }
  }
  if (lowered === 'null' || lowered === '~') {
    return { kind: 'non_string', typeName: 'NoneType' }
  }
  if (isNumericScalar(value)) {
    return { kind: 'non_string', typeName: value.includes('.') ? 'float' : 'int' }
  }
  if (value.startsWith('[')) {
    return { kind: 'non_string', typeName: 'list' }
  }
  if (value.startsWith('{')) {
    return { kind: 'non_string', typeName: 'dict' }
  }
  if (value.includes(': ')) {
    return { kind: 'invalid', message: 'mapping values are not allowed in this context' }
  }
  return { kind: 'string', value }
}

function isNumericScalar(value: string): boolean {
  return /\d/u.test(value) && numericCharactersPattern.test(value) && !Number.isNaN(Number(value))
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

function report(issues: ReadonlyArray<ValidationIssue>, fields?: SkillMetadata): OpenAiSkillValidationReport {
  return fields === undefined
    ? {
        issues,
        ok: issues.length === 0,
      }
    : {
        fields,
        issues,
        ok: issues.length === 0,
      }
}
