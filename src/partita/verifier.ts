/* eslint-disable ts/no-use-before-define */
import type { ValidationIssue } from './validation.ts'

import * as Console from 'effect/Console'
import * as Effect from 'effect/Effect'
import * as FileSystem from 'effect/FileSystem'
import * as Path from 'effect/Path'
import { PartitaError } from './errors.ts'
import {
  checkOpenAiRuntimeSkillFiles,
  checkPartitaSourceSkillFiles,
} from './partita-skill-validation.ts'
import {
  primitiveReferenceBody,
  primitiveReferenceCopySpecs,
} from './primitive.ts'
import { issue, reportFromIssues } from './validation.ts'

export interface VerifyProjectOptions {
  readonly root: string
  readonly level?: VerifyLevel
}

export type VerifyLevel = 'project' | 'runtime' | 'source'

const linkPattern = /\[[^\]]*\]\(([^)]+)\)/gu
const urlPrefixes = ['http://', 'https://', 'mailto:', 'ftp://', 'tel:', 'data:']

export const verifyRuntimeSkills = Effect.fn('verifyRuntimeSkills')(function* (options: VerifyProjectOptions) {
  const path = yield* Path.Path
  const result = yield* checkOpenAiRuntimeSkillFiles(path.resolve(options.root))
  return reportFromIssues(result.issues)
})

export const verifyPartitaSourceSkills = Effect.fn('verifyPartitaSourceSkills')(function* (options: VerifyProjectOptions) {
  const path = yield* Path.Path
  const result = yield* checkPartitaSourceSkillFiles(path.resolve(options.root))
  return reportFromIssues(result.issues)
})

export const verifySourceProject = Effect.fn('verifySourceProject')(function* (options: VerifyProjectOptions) {
  const path = yield* Path.Path
  return yield* buildSourceReport(path.resolve(options.root), options.level ?? 'project')
})

export const verifyProject = Effect.fn('verifyProject')(function* (options: VerifyProjectOptions) {
  const level = options.level ?? 'project'
  const report = yield* verifySourceProject({ ...options, level })
  if (!report.ok) {
    yield* Console.error(`Partita ${level} verification failed:`)
    for (const issue of report.issues) {
      yield* Console.error(`- ${formatIssue(issue)}`)
    }
    return yield* new PartitaError(`Partita ${level} verification failed.`)
  }

  yield* Console.log(`Partita ${level} verified: ${options.root}`)
})

function formatIssue(issue: ValidationIssue): string {
  return issue.path !== undefined && issue.path !== '' ? `${issue.path}: ${issue.message}` : issue.message
}

const buildSourceReport = Effect.fn('buildSourceReport')(function* (root: string, level: VerifyLevel) {
  if (level === 'runtime') {
    const result = yield* checkOpenAiRuntimeSkillFiles(root)
    return reportFromIssues(result.issues)
  }
  if (level === 'source') {
    const result = yield* checkPartitaSourceSkillFiles(root)
    return reportFromIssues(result.issues)
  }

  const fs = yield* FileSystem.FileSystem
  const skillResult = yield* checkPartitaSourceSkillFiles(root)
  const issues = [
    ...skillResult.issues,
    ...(yield* checkMarkdownLinks(fs, root)),
    ...(yield* checkPrimitiveReferenceCopies(fs, root)),
    ...(yield* checkRemovedSurfaces(fs, root)),
    ...(yield* checkNoRootSkill(fs, root)),
  ]
  return reportFromIssues(issues)
})

const checkMarkdownLinks = Effect.fn('checkMarkdownLinks')(function* (fs: FileSystem.FileSystem, root: string) {
  const pathService = yield* Path.Path
  const issues: Array<ValidationIssue> = []
  for (const path of yield* markdownFiles(fs, root)) {
    const relativePath = relativePathFrom(pathService, root, path)
    const text = yield* readText(fs, path)
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
      if (clean === '') {
        continue
      }
      if (!(yield* pathExists(fs, pathService.join(pathService.dirname(path), clean)))) {
        issues.push(issue('markdown.broken_link', `broken markdown link: ${target}`, relativePath))
      }
    }
  }
  return issues
})

const checkRemovedSurfaces = Effect.fn('checkRemovedSurfaces')(function* (fs: FileSystem.FileSystem, root: string) {
  const pathService = yield* Path.Path
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

  const issues: Array<ValidationIssue> = []
  for (const [path, message] of removed) {
    if (yield* pathExists(fs, pathService.join(root, path))) {
      issues.push(issue('surface.removed_exists', message, path))
    }
  }
  return issues
})

const checkPrimitiveReferenceCopies = Effect.fn('checkPrimitiveReferenceCopies')(function* (
  fs: FileSystem.FileSystem,
  root: string,
) {
  const path = yield* Path.Path
  const issues: Array<ValidationIssue> = []

  for (const copy of primitiveReferenceCopySpecs) {
    const sourcePath = path.join(root, copy.sourcePath)
    const targets = copy.targetPaths.map(targetPath => path.join(root, targetPath))
    const sourceExists = yield* pathExists(fs, sourcePath)
    const targetExists: Array<boolean> = []
    for (const targetPath of targets) {
      targetExists.push(yield* pathExists(fs, targetPath))
    }
    if (!sourceExists && targetExists.every(exists => !exists)) {
      continue
    }

    if (!sourceExists) {
      issues.push(issue('primitive_reference.missing_source', 'missing primitive reference source', copy.sourcePath))
      continue
    }

    const sourceText = primitiveReferenceBody(yield* readText(fs, sourcePath))
    for (const [index, referencePath] of targets.entries()) {
      const relativeReferencePath = relativePathFrom(path, root, referencePath)
      if (targetExists[index] !== true) {
        issues.push(issue(
          'primitive_reference.missing_target',
          `missing skill-local copy for ${copy.sourcePath}`,
          relativeReferencePath,
        ))
        continue
      }
      if ((yield* readText(fs, referencePath)) !== sourceText) {
        issues.push(issue(
          'primitive_reference.copy_drift',
          `skill-local reference must match ${copy.sourcePath} exactly`,
          relativeReferencePath,
        ))
      }
    }
  }

  return issues
})

const checkNoRootSkill = Effect.fn('checkNoRootSkill')(function* (fs: FileSystem.FileSystem, root: string) {
  const path = yield* Path.Path
  return (yield* pathExists(fs, path.join(root, 'SKILL.md')))
    ? [issue('root_skill.forbidden', 'source root SKILL.md is not allowed', 'SKILL.md')]
    : []
})

const markdownFiles = Effect.fn('markdownFiles')(function* (fs: FileSystem.FileSystem, root: string) {
  const files: Array<string> = []
  yield* walk(fs, root, files)
  return files.sort()
})

const walk = Effect.fn('walkMarkdownFiles')(function* (
  fs: FileSystem.FileSystem,
  path: string,
  files: Array<string>,
): Effect.fn.Return<void, PartitaError, Path.Path> {
  const pathService = yield* Path.Path
  if (shouldSkipPath(pathService, path)) {
    return
  }

  const stat = yield* fs.stat(path).pipe(Effect.mapError(cause => fileSystemError(`Stat ${path}`, cause)))
  if (stat.type === 'Directory') {
    const entries = yield* fs.readDirectory(path).pipe(Effect.mapError(cause => fileSystemError(`Read directory ${path}`, cause)))
    for (const entry of entries) {
      yield* walk(fs, pathService.join(path, entry), files)
    }
    return
  }

  if (path.endsWith('.md')) {
    files.push(path)
  }
})

function shouldSkipPath(pathService: Path.Path, path: string): boolean {
  const parts = path.split(pathService.sep)
  if (parts.some(part => part === '.git' || part === 'assets' || part === 'node_modules')) {
    return true
  }

  const preludeIndex = parts.lastIndexOf('.prelude')
  return preludeIndex !== -1 && parts[preludeIndex + 2] === 'repos'
}

function isExternalLink(target: string): boolean {
  return urlPrefixes.some(prefix => target.startsWith(prefix))
}

const pathExists = Effect.fn('verifierPathExists')((fs: FileSystem.FileSystem, path: string) =>
  fs.exists(path).pipe(Effect.mapError(cause => fileSystemError(`Check ${path}`, cause))))

const readText = Effect.fn('verifierReadText')((fs: FileSystem.FileSystem, path: string) =>
  fs.readFileString(path).pipe(Effect.mapError(cause => fileSystemError(`Read ${path}`, cause))))

function fileSystemError(operation: string, cause: unknown): PartitaError {
  return new PartitaError(`${operation}: ${cause instanceof Error ? cause.message : String(cause)}`)
}

function relativePathFrom(pathService: Path.Path, root: string, path: string): string {
  const relativePath = pathService.relative(root, path)
  return relativePath === '' ? '.' : relativePath.split(pathService.sep).join('/')
}
