import type { ValidationIssue, ValidationReport } from './validation.ts'

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import * as Console from 'effect/Console'
import * as Effect from 'effect/Effect'
import { PartitaError } from './errors.ts'
import {
  checkOpenAiRuntimeSkillFiles,
  checkPartitaSourceSkillFiles,
  skillFiles,
} from './partita-skill-validation.ts'
import { issue, reportFromIssues } from './validation.ts'

export interface VerifyProjectOptions {
  readonly root: string
  readonly level?: VerifyLevel
}

export type VerifyLevel = 'project' | 'runtime' | 'source'

const skillRefPattern = /skills\/(?:(expression|link|maintenance|orientation|primitive)\/)?([a-z][a-z0-9_-]*)\/SKILL\.md/gu
const linkPattern = /\[[^\]]*\]\(([^)]+)\)/gu
const wikiLinkPattern = /\[\[([^\]\n]+)\]\]/gu
const urlPrefixes = ['http://', 'https://', 'mailto:', 'ftp://', 'tel:', 'data:']
const materializeConfigRelativePath = 'partita.materialize.json'
const dispatcherRelativePath = 'harness/skills/dispatcher.md'
const legacyDispatcherRelativePath = 'skills/DISPATCHER.md'
const legacyRoutingTableStart = '<!-- routing-table:start -->'
const legacyRoutingTableEnd = '<!-- routing-table:end -->'
const legacyProjectionMarker = '<!-- partita:projection:'
const namespaceShorthands = {
  expression: 'ex',
  link: 'lk',
  maintenance: 'mt',
  orientation: 'og',
  primitive: 'pm',
} as const

type SkillNamespace = keyof typeof namespaceShorthands

export const verifyRuntimeSkills = Effect.fn('verifyRuntimeSkills')(function* (options: VerifyProjectOptions) {
  return yield* Effect.sync(() => {
    const root = resolve(options.root)
    return reportFromIssues(checkOpenAiRuntimeSkillFiles(root).issues)
  })
})

export const verifyPartitaSourceSkills = Effect.fn('verifyPartitaSourceSkills')(function* (options: VerifyProjectOptions) {
  return yield* Effect.sync(() => {
    const root = resolve(options.root)
    return reportFromIssues(checkPartitaSourceSkillFiles(root).issues)
  })
})

export const verifySourceProject = Effect.fn('verifySourceProject')(function* (options: VerifyProjectOptions) {
  return yield* Effect.sync(() => buildSourceReport(resolve(options.root), options.level ?? 'project'))
})

export const verifyRouting = Effect.fn('verifyRouting')(function* (options: VerifyProjectOptions) {
  return yield* Effect.sync(() => {
    const root = resolve(options.root)
    const skills = skillFiles(root).map(skill => skill.handle)
    return reportFromIssues(checkRouting(root, new Set(skills)))
  })
})

export const verifyProject = Effect.fn('verifyProject')(function* (options: VerifyProjectOptions) {
  const level = options.level ?? 'project'
  const report = yield* verifySourceProject({ ...options, level })
  if (!report.ok) {
    yield* Console.error(`Partita ${level} verification failed:`)
    for (const issue of report.issues) {
      yield* Console.error(`- ${formatIssue(issue)}`)
    }
    return yield* Effect.fail(new PartitaError(`Partita ${level} verification failed.`))
  }

  yield* Console.log(`Partita ${level} verified: ${options.root}`)
})

function formatIssue(issue: ValidationIssue): string {
  return issue.path ? `${issue.path}: ${issue.message}` : issue.message
}

function buildSourceReport(root: string, level: VerifyLevel): ValidationReport {
  if (level === 'runtime') {
    return reportFromIssues(checkOpenAiRuntimeSkillFiles(root).issues)
  }
  if (level === 'source') {
    return reportFromIssues(checkPartitaSourceSkillFiles(root).issues)
  }

  const skillResult = checkPartitaSourceSkillFiles(root)
  const skills = new Set(Object.keys(skillResult.descriptions))
  const issues = [
    ...skillResult.issues,
    ...checkRouting(root, skills),
    ...checkMaterializedCopies(root),
    ...checkLegacyMaterializationMarkers(root),
    ...checkMarkdownLinks(root),
    ...checkWikiLinks(root),
    ...checkRemovedSurfaces(root),
    ...checkNoRootSkill(root),
  ]
  return reportFromIssues(issues)
}

function checkRouting(root: string, skills: ReadonlySet<string>): ReadonlyArray<ValidationIssue> {
  const issues: Array<ValidationIssue> = []
  const routingPaths = [dispatcherRelativePath]

  if (existsSync(join(root, legacyDispatcherRelativePath))) {
    issues.push(issue('routing.legacy_dispatcher_path', `dispatcher must live at ${dispatcherRelativePath}`, legacyDispatcherRelativePath))
  }

  if (!existsSync(join(root, dispatcherRelativePath))) {
    issues.push(issue('routing.dispatcher_missing', `missing dispatcher routing file: ${dispatcherRelativePath}`))
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
  }

  return issues
}

function checkMaterializedCopies(root: string): ReadonlyArray<ValidationIssue> {
  const issues: Array<ValidationIssue> = []
  const configPath = join(root, materializeConfigRelativePath)
  if (!existsSync(configPath)) {
    return [issue('materialize.config_missing', `missing materialization config: ${materializeConfigRelativePath}`, materializeConfigRelativePath)]
  }

  const config = readMaterializeConfig(root)
  if (!config.ok) {
    return [issue('materialize.config_invalid', config.message, materializeConfigRelativePath)]
  }

  if (!config.config.reports.some(report => report.name === 'skill-inventory' && report.target === dispatcherRelativePath)) {
    issues.push(issue(
      'materialize.report_missing',
      `materialization config must declare skill-inventory report at ${dispatcherRelativePath}`,
      materializeConfigRelativePath,
    ))
  }

  for (const copy of config.config.copies) {
    const sourcePath = join(root, copy.source)
    if (!existsSync(sourcePath)) {
      issues.push(issue('materialize.source_missing', `missing materialization source: ${copy.source}`, copy.source))
      continue
    }

    const expected = readText(sourcePath)
    for (const target of copy.targets) {
      const targetPath = join(root, target)
      if (!existsSync(targetPath)) {
        issues.push(issue('materialize.target_missing', `missing materialized target: ${target}`, target))
        continue
      }
      if (readText(targetPath) !== expected) {
        issues.push(issue('materialize.copy_drift', `materialized target is out of sync with ${copy.source}`, target))
      }
    }
  }

  return issues
}

interface MaterializedCopy {
  readonly source: string
  readonly targets: ReadonlyArray<string>
}

interface MaterializedReport {
  readonly name: string
  readonly target: string
}

interface MaterializeConfig {
  readonly copies: ReadonlyArray<MaterializedCopy>
  readonly reports: ReadonlyArray<MaterializedReport>
}

function readMaterializeConfig(root: string): { readonly ok: true, readonly config: MaterializeConfig } | { readonly ok: false, readonly message: string } {
  try {
    const parsed = JSON.parse(readText(join(root, materializeConfigRelativePath))) as unknown
    if (!isRecord(parsed)) {
      return { ok: false, message: 'materialization config must be an object' }
    }
    if (!Array.isArray(parsed.copies)) {
      return { ok: false, message: 'materialization config must contain copies array' }
    }
    if (!Array.isArray(parsed.reports)) {
      return { ok: false, message: 'materialization config must contain reports array' }
    }

    const copies: Array<MaterializedCopy> = []
    for (const [index, entry] of parsed.copies.entries()) {
      if (
        !isRecord(entry)
        || typeof entry.source !== 'string'
        || !isSafeRelativePath(entry.source)
        || !isStringArray(entry.targets)
        || entry.targets.length === 0
      ) {
        return { ok: false, message: `invalid copies[${index}] entry` }
      }
      copies.push({ source: entry.source, targets: entry.targets })
    }

    const reports: Array<MaterializedReport> = []
    for (const [index, entry] of parsed.reports.entries()) {
      if (
        !isRecord(entry)
        || entry.name !== 'skill-inventory'
        || typeof entry.target !== 'string'
        || !isSafeRelativePath(entry.target)
      ) {
        return { ok: false, message: `invalid reports[${index}] entry` }
      }
      reports.push({ name: entry.name, target: entry.target })
    }
    return { config: { copies, reports }, ok: true }
  }
  catch (cause) {
    return { ok: false, message: cause instanceof Error ? cause.message : String(cause) }
  }
}

function checkLegacyMaterializationMarkers(root: string): ReadonlyArray<ValidationIssue> {
  const issues: Array<ValidationIssue> = []
  for (const path of markdownFiles(root)) {
    const relativePath = relativePathFrom(root, path)
    const text = readText(path)
    if (text.includes(legacyProjectionMarker)) {
      issues.push(issue('materialize.legacy_marker', 'legacy partita:projection marker is not allowed in materialized output', relativePath))
    }
    if (text.includes(legacyRoutingTableStart) || text.includes(legacyRoutingTableEnd)) {
      issues.push(issue('materialize.legacy_marker', 'legacy routing-table marker is not allowed in materialized output', relativePath))
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
  const wikiRoot = join(root, 'packages', 'wiki')
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
    ['.codex', 'repo-local Codex runtime state must not exist'],
    ['.codex-plugin', 'Codex plugin metadata was migrated to /Users/sayori/Desktop/partita-ref'],
    ['CLAUDE.md', 'tool-specific instruction file was migrated to /Users/sayori/Desktop/partita-ref'],
    ['CONTEXT.md', 'wiki root map was migrated to /Users/sayori/Desktop/partita-ref'],
    ['HARNESS.md', 'wiki harness map was migrated to /Users/sayori/Desktop/partita-ref'],
    ['rules', 'removed rules directory must not exist'],
    ['theory', 'removed theory directory must not exist'],
    ['wiki', 'root wiki directory must not exist'],
    ['packages/wiki', 'wiki layer was migrated to /Users/sayori/Desktop/partita-ref'],
    ['runtime/references', 'runtime references were migrated to /Users/sayori/Desktop/partita-ref'],
    ['harness/skills/checks.md', 'harness checks reference was migrated to /Users/sayori/Desktop/partita-ref'],
    ['harness/skills/family.md', 'harness family reference was migrated to /Users/sayori/Desktop/partita-ref'],
    ['harness/skills/policy.md', 'harness policy reference was migrated to /Users/sayori/Desktop/partita-ref'],
    ['harness/skills/routing.md', 'harness routing reference was migrated to /Users/sayori/Desktop/partita-ref'],
    ['harness/skills/shape.md', 'harness shape reference was migrated to /Users/sayori/Desktop/partita-ref'],
    ['skills/RESOLVER.md', 'removed resolver registry must not exist'],
    ['skills/skill-write', 'removed skill-write path must not exist; use skills/primitive/notate'],
    ['skills/skill-patch', 'removed skill-patch path must not exist; use skills/primitive/retune'],
    ['src/partita/packager.ts', 'removed zip packager must not exist'],
    ['src/partita/package-verify.ts', 'removed package verifier must not exist'],
    ['tests/packager.test.ts', 'removed packager tests must not exist'],
    ['packages/wiki/skill/design-v1.md', 'absorbed design-v1 source must not exist'],
    ['packages/wiki/practice/migrate.md', 'removed migration practice node must not exist'],
    ['packages/wiki/projection/verifier/package.md', 'removed package verifier node must not exist'],
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
  return path.split(sep).some(part => part === '.git' || part === 'assets' || part === 'node_modules')
}

function skillRefs(text: string): ReadonlySet<string> {
  const refs: Array<string> = []
  for (const match of text.matchAll(skillRefPattern)) {
    const namespace = match[1]
    const skill = match[2]
    if (skill !== undefined) {
      refs.push(skillHandle(namespace === undefined || !isSkillNamespace(namespace) ? undefined : namespace, skill))
    }
  }
  return new Set(refs)
}

function skillHandle(namespace: SkillNamespace | undefined, name: string): string {
  return namespace === undefined ? name : `${namespaceShorthands[namespace]}:${name}`
}

function isSkillNamespace(value: string): value is SkillNamespace {
  return Object.hasOwn(namespaceShorthands, value)
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isStringArray(value: unknown): value is ReadonlyArray<string> {
  return Array.isArray(value) && value.every(item => typeof item === 'string')
}

function isSafeRelativePath(path: string): boolean {
  return path.trim().length > 0 && !path.startsWith('/') && !path.split('/').includes('..')
}

function readText(path: string): string {
  return readFileSync(path, 'utf8')
}

function relativePathFrom(root: string, path: string): string {
  const relativePath = relative(root, path)
  return relativePath === '' ? '.' : relativePath.split(sep).join('/')
}
