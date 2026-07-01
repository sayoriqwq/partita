import type { ValidationIssue, ValidationReport } from './validation.ts'

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import {
  blockProjectionEndPrefix,
  blockProjectionStartPrefix,
  fileProjectionPrefix,
  parseProjectionAttributes,
  projectionCommentLines,
  renderFileCopyProjection,
  routingTableEnd,
  routingTableStart,
  validProjectionSource,
} from '@partita/generic-projection'
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
const dispatcherRelativePath = 'harness/skills/dispatcher.md'
const legacyDispatcherRelativePath = 'skills/DISPATCHER.md'
const legacyRoutingTableStart = '<!-- routing-table:start -->'
const legacyRoutingTableEnd = '<!-- routing-table:end -->'
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
    ...checkProjectionMarkers(root),
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
    if (!text.includes(routingTableStart) || !text.includes(routingTableEnd)) {
      issues.push(issue('routing.missing_projection_marker', 'dispatcher must use partita routing-table projection markers', path))
    }
  }

  return issues
}

function checkProjectionMarkers(root: string): ReadonlyArray<ValidationIssue> {
  const issues: Array<ValidationIssue> = []
  for (const path of markdownFiles(root)) {
    const relativePath = relativePathFrom(root, path)
    const text = readText(path)
    if (text.includes(legacyRoutingTableStart) || text.includes(legacyRoutingTableEnd)) {
      issues.push(issue('projection.legacy_marker', 'legacy routing-table marker is not allowed; use partita:projection markers', relativePath))
    }

    issues.push(...checkBlockProjectionMarkers(text, relativePath))
    issues.push(...checkFileProjectionMarker(root, text, relativePath))
  }
  return issues
}

function checkBlockProjectionMarkers(text: string, relativePath: string): ReadonlyArray<ValidationIssue> {
  const issues: Array<ValidationIssue> = []
  const starts = projectionCommentLines(text, blockProjectionStartPrefix)
  const ends = projectionCommentLines(text, blockProjectionEndPrefix)
  const endCounts = new Map<string, number>()

  for (const end of ends) {
    const attrs = parseProjectionAttributes(end)
    const id = attrs.id
    if (!id) {
      issues.push(issue('projection.block_end_missing_id', 'projection block end marker must include id', relativePath))
      continue
    }
    endCounts.set(id, (endCounts.get(id) ?? 0) + 1)
  }

  for (const start of starts) {
    const attrs = parseProjectionAttributes(start)
    const id = attrs.id
    if (!id || !attrs.source || !attrs.mode) {
      issues.push(issue('projection.block_start_missing_attributes', 'projection block start marker must include id, source, and mode', relativePath))
      continue
    }
    if (attrs.mode !== 'block-table') {
      issues.push(issue('projection.unsupported_block_mode', `unsupported projection block mode: ${attrs.mode}`, relativePath))
    }

    const remaining = endCounts.get(id) ?? 0
    if (remaining === 0) {
      issues.push(issue('projection.block_end_missing', `missing projection block end marker for id=${id}`, relativePath))
      continue
    }
    endCounts.set(id, remaining - 1)
  }

  for (const [id, count] of endCounts) {
    if (count > 0) {
      issues.push(issue('projection.block_start_missing', `missing projection block start marker for id=${id}`, relativePath))
    }
  }

  return issues
}

function checkFileProjectionMarker(root: string, text: string, relativePath: string): ReadonlyArray<ValidationIssue> {
  if (!text.startsWith(fileProjectionPrefix)) {
    return []
  }

  const firstLine = text.split(/\r?\n/u, 1)[0] ?? ''
  const attrs = parseProjectionAttributes(firstLine)
  const source = attrs.source
  if (!source || !attrs.mode) {
    return [issue('projection.file_missing_attributes', 'file projection marker must include source and mode', relativePath)]
  }
  if (attrs.mode !== 'copy') {
    return [issue('projection.unsupported_file_mode', `unsupported file projection mode: ${attrs.mode}`, relativePath)]
  }
  if (!validProjectionSource(source)) {
    return [issue('projection.invalid_source', `invalid projection source: ${source}`, relativePath)]
  }

  const sourcePath = join(root, source)
  if (!existsSync(sourcePath)) {
    return [issue('projection.missing_source', `missing projection source: ${source}`, relativePath)]
  }

  const expected = renderFileCopyProjection(source, readText(sourcePath))
  return text === expected
    ? []
    : [issue('projection.file_drift', `file projection is out of sync with ${source}`, relativePath)]
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
    ['CLAUDE.md', 'tool-specific instruction projection was migrated to /Users/sayori/Desktop/partita-ref'],
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

function readText(path: string): string {
  return readFileSync(path, 'utf8')
}

function relativePathFrom(root: string, path: string): string {
  const relativePath = relative(root, path)
  return relativePath === '' ? '.' : relativePath.split(sep).join('/')
}
