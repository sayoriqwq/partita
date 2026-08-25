/* eslint-disable ts/no-use-before-define */
import type { ValidationIssue } from './validation.ts'

import { createHash } from 'node:crypto'
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

const arrangeSourceRoot = 'repos/score'
const arrangeTargetRoot = 'skills/primitive/arrange'
const arrangeSourceDigests = {
  'SKILL.md': 'c7c91423aa32fbcec5cd2373737c8300f010ad99489ace44eaa661a31780c11e',
  'agents/openai.yaml': 'd348b64634e9d9732c58fa2803c7479de6c1edfd9f5c2e0fa6ba4bf72fb7eb15',
  'references/assertion.md': '55ddc98aef5644ee2776d85d8306acff98dcffcc871f1ca9ad2bd915d764a998',
  'references/audience.md': '1954502997dd55332f8c96dd78badd674ecedee04ff7ac83dec6da35f4050b9d',
  'references/boundary.md': 'e72cd50f33e625ba835acebeacbf31aebb7fce9bb015fb568cbb231fcf4375e4',
  'references/index-routing-case.md': '89b99ea6aea59d94f464dd764f241489ffc4743b6678729158963f9ed05a9461',
  'references/keywords.md': 'c0975b20e20d2dd0d3e76c5370b7a191f9df426e5a207b27fa5097695a11660c',
  'references/language.md': '7369e1e6b9798f197a9dc3be24a6b5c9f47349f0e993ba08e9561eca3e97654f',
  'references/links.md': '13119871db48bbfae6f49c595327e72e463945f30b056777ea96d06cc073ff6c',
  'references/metadata.md': '41ce5a5ed605599b24b2605f15367e02159ad51d20ece0d5a2d69f7522c2560a',
  'references/module.md': 'db2ee8d94923daddd8cc98797f4c187155390f2073058e6c1c177b97c01dd6e3',
  'references/path.md': 'c65fc36eca9f2562c3c686fff1faa3872a11223e8ffed8fbb195f026ddfb2870',
  'references/pattern.md': 'cb310317184325fcc450a9db846e79583fc75c058db0a2f7a770b75de98a1cc1',
  'references/section.md': 'b6f1628673a25fb4c931f63ca53a0066db42e8338487425d26ef27e7e145fe1b',
} as const
const arrangeTargetOverlayDigests = {
  'references/source-provenance.md': '766a22fa72d5457ea60c90212a6f60b4bc5498c0a6dfdce616e92d20e82a65eb',
} as const

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
    ...(yield* checkArrangeSourceProjection(fs, root)),
    ...(yield* checkRemovedSurfaces(fs, root)),
    ...(yield* checkDocwardenV1(fs, root)),
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

const checkDocwardenV1 = Effect.fn('checkDocwardenV1')(function* (
  fs: FileSystem.FileSystem,
  root: string,
) {
  const path = yield* Path.Path
  const packagePath = path.join(root, 'package.json')
  if (!(yield* pathExists(fs, packagePath))) {
    return []
  }

  const packageText = yield* readText(fs, packagePath)
  if (!/"name"\s*:\s*"@sayoriqwq\/partita"/u.test(packageText)) {
    return []
  }

  const issues: Array<ValidationIssue> = []
  const requiredFiles = [
    'AGENTS.md',
    '.gitignore',
    '.docwarden/CONTEXT.md',
    '.docwarden/GLOSSARY.md',
    '.docwarden/STATE.md',
    '.docwarden/issue-tracker/CONTRACT.md',
  ] as const
  const requiredDirectories = [
    '.docwarden/issue-tracker/specs',
    '.docwarden/issue-tracker/tickets',
  ] as const

  for (const relativePath of requiredFiles) {
    const absolutePath = path.join(root, relativePath)
    if (!(yield* pathExists(fs, absolutePath))) {
      issues.push(issue('docwarden.required_missing', 'required Docwarden V1 file is missing', relativePath))
      continue
    }
    const stat = yield* fs.stat(absolutePath).pipe(
      Effect.mapError(cause => fileSystemError(`Stat ${absolutePath}`, cause)),
    )
    if (stat.type !== 'File') {
      issues.push(issue('docwarden.required_shape', 'required Docwarden V1 path must be a file', relativePath))
    }
  }

  for (const relativePath of requiredDirectories) {
    const absolutePath = path.join(root, relativePath)
    if (!(yield* pathExists(fs, absolutePath))) {
      issues.push(issue('docwarden.required_missing', 'required Docwarden V1 directory is missing', relativePath))
      continue
    }
    const stat = yield* fs.stat(absolutePath).pipe(
      Effect.mapError(cause => fileSystemError(`Stat ${absolutePath}`, cause)),
    )
    if (stat.type !== 'Directory') {
      issues.push(issue('docwarden.required_shape', 'required Docwarden V1 path must be a directory', relativePath))
    }
  }

  if (yield* pathExists(fs, path.join(root, '.gitignore'))) {
    const gitignore = yield* readText(fs, path.join(root, '.gitignore'))
    if (!/^\/\.docwarden\/NOTES\.md$/mu.test(gitignore)) {
      issues.push(issue(
        'docwarden.notes_not_ignored',
        'Docwarden NOTES must have the exact repository-root ignore boundary',
        '.gitignore',
      ))
    }
  }

  const requiredFragments: ReadonlyArray<readonly [string, string]> = [
    ['AGENTS.md', '[`.docwarden/CONTEXT.md`](.docwarden/CONTEXT.md)'],
    ['AGENTS.md', 'Lead records a reconcilable intent in STATE before the effect'],
    ['AGENTS.md', 'Never retry `Unknown` before reconciliation'],
    ['AGENTS.md', 'Lead alone writes STATE and completes Specs or Tickets'],
    ['AGENTS.md', 'Agents never write `NOTES.md`'],
    ['.docwarden/CONTEXT.md', 'This file owns stable domain meaning'],
    ['.docwarden/GLOSSARY.md', 'This file owns behavior-changing collaboration leading words'],
    ['.docwarden/GLOSSARY.md', '## Unknown'],
    ['.docwarden/STATE.md', '## Current reality'],
    ['.docwarden/STATE.md', '## Active work and decisions'],
    ['.docwarden/STATE.md', '## Mutable effects'],
    ['.docwarden/issue-tracker/CONTRACT.md', 'Supported kinds: `spec | ticket`'],
    ['.docwarden/issue-tracker/CONTRACT.md', 'Supported lifecycle: `draft | ready | in-progress | blocked | completed | not-planned`'],
    ['.docwarden/issue-tracker/CONTRACT.md', 'Lead alone writes `completed`'],
  ]
  for (const [relativePath, fragment] of requiredFragments) {
    const absolutePath = path.join(root, relativePath)
    if (!(yield* pathExists(fs, absolutePath))) {
      continue
    }
    if (!(yield* readText(fs, absolutePath)).includes(fragment)) {
      issues.push(issue('docwarden.contract_drift', `missing Docwarden V1 contract: ${fragment}`, relativePath))
    }
  }

  const docwardenRoot = path.join(root, '.docwarden')
  if (yield* pathExists(fs, docwardenRoot)) {
    const allowed = new Set(['CONTEXT.md', 'GLOSSARY.md', 'NOTES.md', 'STATE.md', 'adr', 'issue-tracker'])
    for (const entry of yield* fs.readDirectory(docwardenRoot).pipe(
      Effect.mapError(cause => fileSystemError(`Read directory ${docwardenRoot}`, cause)),
    )) {
      if (!allowed.has(entry)) {
        issues.push(issue('docwarden.unsupported_surface', 'unsupported Docwarden V1 root surface', `.docwarden/${entry}`))
      }
    }
  }

  const issueRoot = path.join(root, '.docwarden/issue-tracker')
  if (yield* pathExists(fs, issueRoot)) {
    const allowed = new Set(['CONTRACT.md', 'specs', 'tickets'])
    for (const entry of yield* fs.readDirectory(issueRoot).pipe(
      Effect.mapError(cause => fileSystemError(`Read directory ${issueRoot}`, cause)),
    )) {
      if (!allowed.has(entry)) {
        issues.push(issue(
          'docwarden.unsupported_surface',
          'Docwarden V1 FILE backend allows only its contract and distinct specs/tickets paths',
          `.docwarden/issue-tracker/${entry}`,
        ))
      }
    }
  }

  const adrRoot = path.join(root, '.docwarden/adr')
  if (yield* pathExists(fs, adrRoot)) {
    for (const relativePath of yield* relativeFilePaths(fs, adrRoot)) {
      const issuePath = `.docwarden/adr/${relativePath}`
      if (!/^[a-z0-9-]+\/\d{4}-\d{2}-\d{2}-[a-z0-9-]+\.md$/u.test(relativePath)) {
        issues.push(issue('docwarden.adr_shape', 'accepted ADR path must match <scope>/<date>-<slug>.md', issuePath))
        continue
      }
      const text = yield* readText(fs, path.join(adrRoot, relativePath))
      for (const heading of ['## Why necessary', '## Decision', '## Context-at-the-time', '## Revisit-when']) {
        if (!text.includes(heading)) {
          issues.push(issue('docwarden.adr_shape', `accepted ADR is missing ${heading}`, issuePath))
        }
      }
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

const checkArrangeSourceProjection = Effect.fn('checkArrangeSourceProjection')(function* (
  fs: FileSystem.FileSystem,
  root: string,
) {
  const path = yield* Path.Path
  const sourceRoot = path.join(root, arrangeSourceRoot)
  const targetRoot = path.join(root, arrangeTargetRoot)
  const sourceExists = yield* pathExists(fs, sourceRoot)
  const targetExists = yield* pathExists(fs, targetRoot)
  if (!sourceExists && !targetExists) {
    return []
  }

  const issues: Array<ValidationIssue> = []
  if (!sourceExists) {
    issues.push(issue('arrange_source.missing_root', 'Arrange upstream Source Pin is missing', arrangeSourceRoot))
  }
  if (!targetExists) {
    issues.push(issue('arrange_source.missing_root', 'Arrange runtime projection is missing', arrangeTargetRoot))
  }
  if (!sourceExists || !targetExists) {
    return issues
  }

  const expectedSourcePaths = Object.keys(arrangeSourceDigests)
  const expectedTargetPaths = [...expectedSourcePaths, ...Object.keys(arrangeTargetOverlayDigests)].sort()
  const sourcePaths = yield* relativeFilePaths(fs, sourceRoot)
  const targetPaths = yield* relativeFilePaths(fs, targetRoot)
  issues.push(...checkArrangePathSet(sourcePaths, expectedSourcePaths, arrangeSourceRoot, 'upstream'))
  issues.push(...checkArrangePathSet(targetPaths, expectedTargetPaths, arrangeTargetRoot, 'target'))

  for (const relativePath of expectedSourcePaths) {
    if (!sourcePaths.includes(relativePath)) {
      continue
    }
    const sourceText = yield* readText(fs, path.join(sourceRoot, relativePath))
    if (sha256(sourceText) !== arrangeSourceDigests[relativePath as keyof typeof arrangeSourceDigests]) {
      issues.push(issue(
        'arrange_source.upstream_drift',
        'Score Source Pin behavior file differs from the reviewed baseline',
        `${arrangeSourceRoot}/${relativePath}`,
      ))
    }
    if (!targetPaths.includes(relativePath)) {
      continue
    }
    const targetText = yield* readText(fs, path.join(targetRoot, relativePath))
    if (targetText !== arrangeProjectionText(relativePath, sourceText)) {
      issues.push(issue(
        'arrange_source.projection_drift',
        'Arrange behavior file differs from the approved Score projection',
        `${arrangeTargetRoot}/${relativePath}`,
      ))
    }
  }

  for (const [relativePath, digest] of Object.entries(arrangeTargetOverlayDigests)) {
    if (!targetPaths.includes(relativePath)) {
      continue
    }
    const targetText = yield* readText(fs, path.join(targetRoot, relativePath))
    if (sha256(targetText) !== digest) {
      issues.push(issue(
        'arrange_source.overlay_drift',
        'Arrange Partita-owned overlay differs from its approved bytes',
        `${arrangeTargetRoot}/${relativePath}`,
      ))
    }
  }

  return issues
})

function arrangeProjectionText(relativePath: string, sourceText: string): string {
  let projected = sourceText
    .replaceAll('Score', 'Arrange')
    .replaceAll('score', 'arrange')
    .replaceAll(
      'apply sayoriqwq-style Markdown writing preferences to Markdown docs',
      'reshape a concrete Markdown artifact under Score while preserving its meaning',
    )
  if (relativePath !== 'SKILL.md') {
    return projected
  }

  projected = projected.replace(
    '面对用户显式调用 `arrange` 处理 Markdown 时，MUST 按 sayoriqwq-style Markdown preferences 组织 module、section 和 assertion，并维护 metadata、audience、language、pattern、index、path、links 与 normative keywords，避免 agent 写出无边界、不可审查、不可复用或不符合用户文档偏好的 Markdown。',
    '面对用户显式调用 `arrange` 处理 concrete Markdown artifact 时，MUST 在保持语义不变的前提下按 Score writing preferences 组织 module、section 和 assertion，并维护 metadata、audience、language、pattern、index、path、links 与 normative keywords，避免 agent 写出无边界、不可审查、不可复用或不符合用户文档偏好的 Markdown。',
  )
  projected = projected.replace(
    '- 需要 OFM-first linking 时，读取 [links](references/links.md)。',
    '- 需要 OFM-first linking 时，读取 [links](references/links.md)。\n- 需要核对 Score source、projection boundary 或 Partita overlay 时，读取 [source provenance](references/source-provenance.md)。',
  )
  return projected.replace(
    '- target surface 是 Markdown；',
    '- target surface 是 concrete Markdown artifact，且 reshape 保持其 meaning；',
  )
}

function checkArrangePathSet(
  actualPaths: ReadonlyArray<string>,
  expectedPaths: ReadonlyArray<string>,
  root: string,
  side: 'target' | 'upstream',
): ReadonlyArray<ValidationIssue> {
  return [
    ...expectedPaths
      .filter(path => !actualPaths.includes(path))
      .map(path => issue(
        `arrange_source.${side}_missing`,
        `Arrange ${side} behavior file is missing`,
        `${root}/${path}`,
      )),
    ...actualPaths
      .filter(path => !expectedPaths.includes(path))
      .map(path => issue(
        `arrange_source.${side}_extra`,
        `Arrange ${side} contains an unapproved behavior file`,
        `${root}/${path}`,
      )),
  ]
}

const relativeFilePaths = Effect.fn('arrangeRelativeFilePaths')(function* (
  fs: FileSystem.FileSystem,
  root: string,
) {
  const files: Array<string> = []
  yield* walkAllFiles(fs, root, root, files)
  return files.sort()
})

const walkAllFiles = Effect.fn('walkAllArrangeFiles')(function* (
  fs: FileSystem.FileSystem,
  root: string,
  current: string,
  files: Array<string>,
): Effect.fn.Return<void, PartitaError, Path.Path> {
  const path = yield* Path.Path
  const stat = yield* fs.stat(current).pipe(Effect.mapError(cause => fileSystemError(`Stat ${current}`, cause)))
  if (stat.type === 'Directory') {
    const entries = yield* fs.readDirectory(current).pipe(
      Effect.mapError(cause => fileSystemError(`Read directory ${current}`, cause)),
    )
    for (const entry of entries) {
      yield* walkAllFiles(fs, root, path.join(current, entry), files)
    }
    return
  }
  files.push(relativePathFrom(path, root, current))
})

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

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
