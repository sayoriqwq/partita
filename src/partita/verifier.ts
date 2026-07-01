import type { ValidationIssue, ValidationReport } from './validation.ts'

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import * as Console from 'effect/Console'
import * as Effect from 'effect/Effect'
import { PartitaError } from './errors.ts'
import {
  checkOpenAiRuntimeSkillFiles,
  checkPartitaSourceSkillFiles,
} from './partita-skill-validation.ts'
import { issue, reportFromIssues } from './validation.ts'

export interface VerifyProjectOptions {
  readonly root: string
  readonly level?: VerifyLevel
}

export type VerifyLevel = 'project' | 'runtime' | 'source'

const linkPattern = /\[[^\]]*\]\(([^)]+)\)/gu
const wikiLinkPattern = /\[\[([^\]\n]+)\]\]/gu
const urlPrefixes = ['http://', 'https://', 'mailto:', 'ftp://', 'tel:', 'data:']

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
  const issues = [
    ...skillResult.issues,
    ...checkMarkdownLinks(root),
    ...checkWikiLinks(root),
    ...checkRemovedSurfaces(root),
    ...checkNoRootSkill(root),
  ]
  return reportFromIssues(issues)
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
    ['.codex-plugin', 'Codex plugin metadata was migrated out of this repo'],
    ['CLAUDE.md', 'tool-specific instruction file was migrated out of this repo'],
    ['CONTEXT.md', 'wiki root map was migrated out of this repo'],
    ['HARNESS.md', 'wiki harness map was migrated out of this repo'],
    ['rules', 'removed rules directory must not exist'],
    ['theory', 'removed theory directory must not exist'],
    ['wiki', 'root wiki directory must not exist'],
    ['packages/wiki', 'wiki layer was migrated out of this repo'],
    ['runtime/references', 'runtime references were migrated out of this repo'],
    ['docs/skills', 'removed current docs baseline must not exist'],
    ['harness/skills/dispatcher.md', 'removed dispatcher baseline must not exist'],
    ['harness/skills/checks.md', 'harness checks reference was migrated out of this repo'],
    ['harness/skills/family.md', 'harness family reference was migrated out of this repo'],
    ['harness/skills/policy.md', 'harness policy reference was migrated out of this repo'],
    ['harness/skills/routing.md', 'harness routing reference was migrated out of this repo'],
    ['harness/skills/shape.md', 'harness shape reference was migrated out of this repo'],
    ['skills/RESOLVER.md', 'removed resolver registry must not exist'],
    ['skills/skill-write', 'removed skill-write path must not exist; use skills/primitive/notate'],
    ['skills/skill-patch', 'removed skill-patch path must not exist; use skills/primitive/retune'],
    ['partita.materialize.json', 'removed materialization config must not exist'],
    ['MIGRATION.md', 'removed migration baseline must not exist'],
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
