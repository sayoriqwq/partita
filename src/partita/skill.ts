/* eslint-disable ts/no-use-before-define */
import type { PartitaError } from './errors.ts'
import type { PartitaCommand, PartitaCommandError } from './process.ts'
import process from 'node:process'
import { Effect, Path, Schema } from 'effect'
import * as Console from 'effect/Console'
import * as FileSystem from 'effect/FileSystem'
import { CommandExecutor } from './process.ts'
import { loadPartitaSourceSkillCatalog } from './source-skill-catalog.ts'

export type SkillRuntimeCommand = PartitaCommand

export interface SkillRuntimeOptions {
  readonly root?: string
}

export interface SkillRuntimeSyncResult {
  readonly commands: ReadonlyArray<SkillRuntimeCommand>
  readonly syncExitCode: number
}

export interface SkillRuntimeEntry {
  readonly name: string
  readonly path: string
  readonly scope: string
  readonly agents: ReadonlyArray<string>
}

export interface SkillRuntimeIssue {
  readonly code: string
  readonly message: string
  readonly path?: string
}

export interface SkillRuntimeStatus {
  readonly commands: ReadonlyArray<SkillRuntimeCommand>
  readonly expectedSkills: ReadonlyArray<string>
  readonly installedSkills: ReadonlyArray<SkillRuntimeEntry>
  readonly issues: ReadonlyArray<SkillRuntimeIssue>
}

export class PartitaSkillRuntimeError extends Schema.TaggedErrorClass<PartitaSkillRuntimeError>()('PartitaSkillRuntimeError', {
  message: Schema.String,
}) {}

function formatUnknown(cause: unknown): string {
  if (cause instanceof Error) {
    return cause.message
  }
  return String(cause)
}

const skillRuntimeError = (message: string): PartitaSkillRuntimeError => PartitaSkillRuntimeError.make({ message })

export const syncSkillRuntime = Effect.fn('syncSkillRuntime')(
  function* (
    options: SkillRuntimeOptions = {},
  ): Effect.fn.Return<SkillRuntimeSyncResult, PartitaCommandError | PartitaSkillRuntimeError, CommandExecutor | Path.Path> {
    const path = yield* Path.Path
    const root = path.resolve(options.root ?? process.cwd())
    const executor = yield* CommandExecutor
    const addCommand: SkillRuntimeCommand = {
      command: 'npx',
      args: ['skills', 'add', './skills', '-a', 'codex', '-g', '--skill', '*', '-y', '--full-depth'],
      cwd: root,
    }

    const addResult = yield* executor.run(addCommand)
    if (addResult.exitCode !== 0) {
      return yield* skillRuntimeError(`npx skills add failed with exit code ${addResult.exitCode}: ${addResult.output.trim()}`)
    }

    return {
      commands: [addCommand],
      syncExitCode: addResult.exitCode,
    }
  },
)

export const listSkillRuntime = Effect.fn('listSkillRuntime')(
  function* (
    options: SkillRuntimeOptions = {},
  ): Effect.fn.Return<{
    readonly commands: ReadonlyArray<SkillRuntimeCommand>
    readonly entries: ReadonlyArray<SkillRuntimeEntry>
  }, PartitaCommandError | PartitaSkillRuntimeError, CommandExecutor | Path.Path> {
    const path = yield* Path.Path
    const root = path.resolve(options.root ?? process.cwd())
    const executor = yield* CommandExecutor
    const listCommand: SkillRuntimeCommand = {
      command: 'npx',
      args: ['skills', 'list', '-g', '-a', 'codex', '--json'],
      cwd: root,
    }

    const listResult = yield* executor.run(listCommand)
    if (listResult.exitCode !== 0) {
      return yield* skillRuntimeError(`npx skills list failed with exit code ${listResult.exitCode}: ${listResult.output.trim()}`)
    }

    return {
      commands: [listCommand],
      entries: yield* parseSkillRuntimeEntries(listResult.output),
    }
  },
)

const inspectSkillRuntime = Effect.fn('inspectSkillRuntime')(
  function* (
    options: SkillRuntimeOptions = {},
  ): Effect.fn.Return<
    SkillRuntimeStatus,
    PartitaCommandError | PartitaError | PartitaSkillRuntimeError,
    CommandExecutor | FileSystem.FileSystem | Path.Path
  > {
    const path = yield* Path.Path
    const root = path.resolve(options.root ?? process.cwd())
    const sourceSkills = (yield* loadPartitaSourceSkillCatalog(root)).skills
    const runtime = yield* listSkillRuntime({ root })
    const expectedSkills = sourceSkills.map(skill => skill.name).sort()
    const expectedNames = new Set(expectedSkills)
    const installedSkills = runtime.entries
      .filter(skill => expectedNames.has(skill.name))
      .sort((left, right) => left.name.localeCompare(right.name))
    const installedNames = new Set(installedSkills.map(skill => skill.name))
    const runtimeByName = new Map(installedSkills.map(skill => [skill.name, skill]))
    const issues: Array<SkillRuntimeIssue> = []

    for (const expected of expectedSkills) {
      if (!installedNames.has(expected)) {
        issues.push({
          code: 'runtime_skill.missing',
          message: `missing installed Codex skill: ${expected}`,
        })
      }
    }

    for (const sourceSkill of sourceSkills) {
      const runtimeSkill = runtimeByName.get(sourceSkill.name)
      if (runtimeSkill === undefined) {
        continue
      }
      issues.push(...(yield* compareSkillDirectories(
        path.join(root, path.dirname(sourceSkill.relativePath)),
        runtimeSkill.path,
        sourceSkill.name,
      )))
    }

    return {
      commands: runtime.commands,
      expectedSkills,
      installedSkills,
      issues,
    }
  },
)

const verifySkillRuntime = Effect.fn('verifySkillRuntime')(
  function* (options: SkillRuntimeOptions = {}) {
    const status = yield* inspectSkillRuntime(options)
    if (status.issues.length > 0) {
      yield* Console.error('Partita Codex skill runtime verification failed:')
      for (const issue of status.issues) {
        yield* Console.error(`- ${formatRuntimeIssue(issue)}`)
      }
      return yield* skillRuntimeError('Partita Codex skill runtime verification failed.')
    }
    return status
  },
)

export const printSkillRuntimeStatus = Effect.fn('printSkillRuntimeStatus')(
  function* (options: SkillRuntimeOptions = {}) {
    const status = yield* inspectSkillRuntime(options)
    yield* Console.log(`Partita Codex skill source: ${status.expectedSkills.join(', ') || '(none)'}`)
    yield* Console.log(`Partita-owned Codex global runtime: ${status.installedSkills.map(skill => skill.name).join(', ') || '(none)'}`)
    if (status.issues.length === 0) {
      yield* Console.log('Partita Codex skill runtime matches source.')
      return status
    }
    yield* Console.log('Partita Codex skill runtime issues:')
    for (const issue of status.issues) {
      yield* Console.log(`- ${formatRuntimeIssue(issue)}`)
    }
    return status
  },
)

export const printSkillRuntimeVerify = Effect.fn('printSkillRuntimeVerify')(
  function* (options: SkillRuntimeOptions = {}) {
    const status = yield* verifySkillRuntime(options)
    yield* Console.log(`Partita Codex skill runtime verified: ${status.installedSkills.length} skills`)
  },
)

const parseSkillRuntimeEntries = Effect.fn('parseSkillRuntimeEntries')(function* (output: string) {
  const parsed = yield* parseJson(skillRuntimeJsonPayload(output))
  if (!Array.isArray(parsed)) {
    return yield* skillRuntimeError('npx skills list returned non-array JSON')
  }
  const entries: Array<SkillRuntimeEntry> = []
  for (const [index, entry] of parsed.entries()) {
    entries.push(yield* parseSkillRuntimeEntry(entry, index))
  }
  return entries
})

function skillRuntimeJsonPayload(output: string): string {
  const start = output.indexOf('[')
  const end = output.lastIndexOf(']')
  return start === -1 || end < start ? output : output.slice(start, end + 1)
}

const parseJson = Effect.fn('parseSkillRuntimeJson')((output: string) =>
  Schema.decodeUnknownEffect(Schema.UnknownFromJsonString)(output).pipe(
    Effect.mapError(cause => skillRuntimeError(`npx skills list returned invalid JSON: ${formatUnknown(cause)}`)),
  ))

const parseSkillRuntimeEntry = Effect.fn('parseSkillRuntimeEntry')(function* (entry: unknown, index: number) {
  if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
    return yield* skillRuntimeError(`npx skills list entry ${index} is not an object`)
  }
  const record = entry as Record<string, unknown>
  const name = record.name
  const entryPath = record.path
  const scope = record.scope
  const agents = record.agents
  if (typeof name !== 'string' || name.trim() === '') {
    return yield* skillRuntimeError(`npx skills list entry ${index} is missing name`)
  }
  if (typeof entryPath !== 'string' || entryPath.trim() === '') {
    return yield* skillRuntimeError(`npx skills list entry ${index} is missing path`)
  }
  if (typeof scope !== 'string' || scope.trim() === '') {
    return yield* skillRuntimeError(`npx skills list entry ${index} is missing scope`)
  }
  if (!Array.isArray(agents) || agents.some(agent => typeof agent !== 'string')) {
    return yield* skillRuntimeError(`npx skills list entry ${index} has invalid agents`)
  }

  return {
    agents: agents as ReadonlyArray<string>,
    name,
    path: entryPath,
    scope,
  }
})

const compareSkillDirectories = Effect.fn('compareSkillDirectories')(function* (
  sourceDir: string,
  runtimeDir: string,
  skillName: string,
) {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const issues: Array<SkillRuntimeIssue> = []
  if (!(yield* pathExists(fs, runtimeDir))) {
    return [{
      code: 'runtime_skill.path_missing',
      message: `installed Codex skill path is missing: ${skillName}`,
      path: runtimeDir,
    }]
  }

  const sourceFiles = yield* listRelativeFiles(fs, sourceDir)
  const runtimeFiles = yield* listRelativeFiles(fs, runtimeDir)
  const sourceSet = new Set(sourceFiles)
  const runtimeSet = new Set(runtimeFiles)

  for (const sourceFile of sourceFiles) {
    if (!runtimeSet.has(sourceFile)) {
      issues.push({
        code: 'runtime_skill.file_missing',
        message: `installed Codex skill is missing file: ${skillName}/${sourceFile}`,
        path: path.join(runtimeDir, sourceFile),
      })
      continue
    }
    const sourceText = yield* readFileString(fs, path.join(sourceDir, sourceFile))
    const runtimeText = yield* readFileString(fs, path.join(runtimeDir, sourceFile))
    if (sourceText !== runtimeText) {
      issues.push({
        code: 'runtime_skill.file_drift',
        message: `installed Codex skill file drift: ${skillName}/${sourceFile}`,
        path: path.join(runtimeDir, sourceFile),
      })
    }
  }

  for (const runtimeFile of runtimeFiles) {
    if (!sourceSet.has(runtimeFile)) {
      issues.push({
        code: 'runtime_skill.file_unmanaged',
        message: `installed Codex skill has unmanaged file: ${skillName}/${runtimeFile}`,
        path: path.join(runtimeDir, runtimeFile),
      })
    }
  }

  return issues
})

const listRelativeFiles = Effect.fn('listRelativeFiles')(function* (fs: FileSystem.FileSystem, root: string) {
  const files: Array<string> = []
  yield* visitFiles(fs, root, root, files)
  return files.sort()
})

const visitFiles = Effect.fn('visitFiles')(function* (
  fs: FileSystem.FileSystem,
  root: string,
  current: string,
  files: Array<string>,
): Effect.fn.Return<void, PartitaSkillRuntimeError, Path.Path> {
  const path = yield* Path.Path
  for (const entry of yield* readDirectory(fs, current)) {
    const fullPath = path.join(current, entry)
    const stats = yield* fs.stat(fullPath).pipe(Effect.mapError(cause => fileSystemError(`stat ${fullPath}`, cause)))
    if (stats.type === 'Directory') {
      yield* visitFiles(fs, root, fullPath, files)
      continue
    }
    if (stats.type === 'File') {
      files.push(path.relative(root, fullPath))
    }
  }
})

function formatRuntimeIssue(issue: SkillRuntimeIssue): string {
  return issue.path !== undefined && issue.path !== ''
    ? `${issue.code}: ${issue.message} (${issue.path})`
    : `${issue.code}: ${issue.message}`
}

function fileSystemError(operation: string, cause: unknown): PartitaSkillRuntimeError {
  return skillRuntimeError(`${operation}: ${formatUnknown(cause)}`)
}

const pathExists = Effect.fn('skillRuntimePathExists')((fs: FileSystem.FileSystem, target: string) =>
  fs.exists(target).pipe(Effect.mapError(cause => fileSystemError(`check ${target}`, cause))))

const readDirectory = Effect.fn('skillRuntimeReadDirectory')((fs: FileSystem.FileSystem, target: string) =>
  fs.readDirectory(target).pipe(
    Effect.map(entries => [...entries].sort()),
    Effect.mapError(cause => fileSystemError(`read directory ${target}`, cause)),
  ))

const readFileString = Effect.fn('skillRuntimeReadFile')((fs: FileSystem.FileSystem, target: string) =>
  fs.readFileString(target).pipe(Effect.mapError(cause => fileSystemError(`read ${target}`, cause))))
