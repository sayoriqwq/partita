import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import * as path from 'node:path'
import process from 'node:process'
import { NodeServices } from '@effect/platform-node'
import { Effect, Schema, Stream } from 'effect'
import * as Console from 'effect/Console'
import { ChildProcess, ChildProcessSpawner } from 'effect/unstable/process'

export interface SkillRuntimeCommand {
  readonly command: string
  readonly args: ReadonlyArray<string>
  readonly cwd: string
}

interface SkillRuntimeCommandResult {
  readonly exitCode: number
  readonly output: string
}

type SkillRuntimeCommandRunner = (
  command: SkillRuntimeCommand,
) => Effect.Effect<SkillRuntimeCommandResult, PartitaSkillRuntimeError>

export interface SkillRuntimeOptions {
  readonly root?: string
  readonly runCommand?: SkillRuntimeCommandRunner
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

interface SourceSkillEntry {
  readonly name: string
  readonly relativePath: string
}

const sourceSkillNamespaces = new Set(['expression', 'link', 'maintenance', 'orientation', 'primitive'])

function formatUnknown(cause: unknown): string {
  if (cause instanceof Error) {
    return cause.message
  }
  return String(cause)
}

const skillRuntimeError = (message: string): PartitaSkillRuntimeError => new PartitaSkillRuntimeError({ message })

const runSkillRuntimeCommandEffect = Effect.fn('runSkillRuntimeCommand')(
  function* (command: SkillRuntimeCommand) {
    const spawner = yield* ChildProcessSpawner.ChildProcessSpawner
    const handle = yield* spawner.spawn(
      ChildProcess.make(command.command, command.args, {
        cwd: command.cwd,
        extendEnv: true,
      }),
    ).pipe(
      Effect.mapError(cause =>
        skillRuntimeError(`spawn ${command.command}: ${formatUnknown(cause)}`),
      ),
    )
    const output = yield* handle.all.pipe(
      Stream.decodeText(),
      Stream.mkString,
      Effect.mapError(cause =>
        skillRuntimeError(`collect ${command.command} output: ${formatUnknown(cause)}`),
      ),
    )
    const exitCode = Number(yield* handle.exitCode.pipe(
      Effect.mapError(cause =>
        skillRuntimeError(`wait for ${command.command}: ${formatUnknown(cause)}`),
      ),
    ))

    return {
      exitCode,
      output,
    }
  },
)

const runSkillRuntimeCommand: SkillRuntimeCommandRunner = command =>
  runSkillRuntimeCommandEffect(command).pipe(
    Effect.scoped,
    Effect.provide(NodeServices.layer),
  )

export const syncSkillRuntime = Effect.fn('syncSkillRuntime')(
  function* (options: SkillRuntimeOptions = {}): Effect.fn.Return<SkillRuntimeSyncResult, PartitaSkillRuntimeError> {
    const root = path.resolve(options.root ?? process.cwd())
    const runCommand = options.runCommand ?? runSkillRuntimeCommand
    const addCommand: SkillRuntimeCommand = {
      command: 'npx',
      args: ['skills', 'add', './skills', '-a', 'codex', '-g', '--skill', '*', '-y', '--full-depth'],
      cwd: root,
    }

    const addResult = yield* runCommand(addCommand)
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
  function* (options: SkillRuntimeOptions = {}) {
    const root = path.resolve(options.root ?? process.cwd())
    const runCommand = options.runCommand ?? runSkillRuntimeCommand
    const listCommand: SkillRuntimeCommand = {
      command: 'npx',
      args: ['skills', 'list', '-g', '-a', 'codex', '--json'],
      cwd: root,
    }

    const listResult = yield* runCommand(listCommand)
    if (listResult.exitCode !== 0) {
      return yield* skillRuntimeError(`npx skills list failed with exit code ${listResult.exitCode}: ${listResult.output.trim()}`)
    }

    return {
      commands: [listCommand],
      entries: parseSkillRuntimeEntries(listResult.output),
    }
  },
)

const inspectSkillRuntime = Effect.fn('inspectSkillRuntime')(
  function* (options: SkillRuntimeOptions = {}): Effect.fn.Return<SkillRuntimeStatus, PartitaSkillRuntimeError> {
    const root = path.resolve(options.root ?? process.cwd())
    const sourceSkills = sourceSkillEntries(root)
    const runtime = yield* listSkillRuntime(runtimeOptions(root, options.runCommand))
    const expectedSkills = sourceSkills.map(skill => skill.name).sort()
    const installedSkills = [...runtime.entries].sort((left, right) => left.name.localeCompare(right.name))
    const installedNames = new Set(installedSkills.map(skill => skill.name))
    const expectedNames = new Set(expectedSkills)
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

    for (const installed of installedSkills) {
      if (!expectedNames.has(installed.name)) {
        issues.push({
          code: 'runtime_skill.unmanaged',
          message: `installed Codex skill is not Partita source-owned: ${installed.name}`,
          path: installed.path,
        })
      }
    }

    for (const sourceSkill of sourceSkills) {
      const runtimeSkill = runtimeByName.get(sourceSkill.name)
      if (runtimeSkill === undefined) {
        continue
      }
      issues.push(...compareSkillDirectories(
        path.join(root, path.dirname(sourceSkill.relativePath)),
        runtimeSkill.path,
        sourceSkill.name,
      ))
    }

    return {
      commands: runtime.commands,
      expectedSkills,
      installedSkills,
      issues,
    }
  },
)

function sourceSkillEntries(root: string): ReadonlyArray<SourceSkillEntry> {
  const skillsRoot = path.join(root, 'skills')
  if (!existsSync(skillsRoot)) {
    return []
  }

  const entries: Array<SourceSkillEntry> = []
  for (const entry of readdirSync(skillsRoot, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name))) {
    if (!entry.isDirectory()) {
      continue
    }

    const directSkillPath = path.join(skillsRoot, entry.name, 'SKILL.md')
    if (existsSync(directSkillPath)) {
      entries.push({
        name: entry.name,
        relativePath: path.join('skills', entry.name, 'SKILL.md'),
      })
      continue
    }

    if (!sourceSkillNamespaces.has(entry.name)) {
      continue
    }

    const namespaceRoot = path.join(skillsRoot, entry.name)
    for (const skillEntry of readdirSync(namespaceRoot, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name))) {
      if (!skillEntry.isDirectory()) {
        continue
      }
      const namespacedSkillPath = path.join(namespaceRoot, skillEntry.name, 'SKILL.md')
      if (!existsSync(namespacedSkillPath)) {
        continue
      }
      entries.push({
        name: skillEntry.name,
        relativePath: path.join('skills', entry.name, skillEntry.name, 'SKILL.md'),
      })
    }
  }

  return entries.sort((left, right) => left.name.localeCompare(right.name))
}

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
    yield* Console.log(`Codex global runtime: ${status.installedSkills.map(skill => skill.name).join(', ') || '(none)'}`)
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

function parseSkillRuntimeEntries(output: string): ReadonlyArray<SkillRuntimeEntry> {
  const parsed = parseJson(output)
  if (!Array.isArray(parsed)) {
    throw skillRuntimeError('npx skills list returned non-array JSON')
  }
  return parsed.map((entry, index) => parseSkillRuntimeEntry(entry, index))
}

function parseJson(output: string): unknown {
  try {
    return JSON.parse(output) as unknown
  }
  catch (cause) {
    throw skillRuntimeError(`npx skills list returned invalid JSON: ${formatUnknown(cause)}`)
  }
}

function parseSkillRuntimeEntry(entry: unknown, index: number): SkillRuntimeEntry {
  if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
    throw skillRuntimeError(`npx skills list entry ${index} is not an object`)
  }
  const record = entry as Record<string, unknown>
  const name = record.name
  const entryPath = record.path
  const scope = record.scope
  const agents = record.agents
  if (typeof name !== 'string' || !name.trim()) {
    throw skillRuntimeError(`npx skills list entry ${index} is missing name`)
  }
  if (typeof entryPath !== 'string' || !entryPath.trim()) {
    throw skillRuntimeError(`npx skills list entry ${index} is missing path`)
  }
  if (typeof scope !== 'string' || !scope.trim()) {
    throw skillRuntimeError(`npx skills list entry ${index} is missing scope`)
  }
  if (!Array.isArray(agents) || agents.some(agent => typeof agent !== 'string')) {
    throw skillRuntimeError(`npx skills list entry ${index} has invalid agents`)
  }

  return {
    agents: agents as ReadonlyArray<string>,
    name,
    path: entryPath,
    scope,
  }
}

function compareSkillDirectories(sourceDir: string, runtimeDir: string, skillName: string): ReadonlyArray<SkillRuntimeIssue> {
  return Effect.runSync(Effect.sync(() => {
    const issues: Array<SkillRuntimeIssue> = []
    if (!existsSync(runtimeDir)) {
      return [{
        code: 'runtime_skill.path_missing',
        message: `installed Codex skill path is missing: ${skillName}`,
        path: runtimeDir,
      }]
    }

    const sourceFiles = listRelativeFiles(sourceDir)
    const runtimeFiles = listRelativeFiles(runtimeDir)
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
      const sourceText = readFileSync(path.join(sourceDir, sourceFile), 'utf8')
      const runtimeText = readFileSync(path.join(runtimeDir, sourceFile), 'utf8')
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
  }))
}

function listRelativeFiles(root: string): ReadonlyArray<string> {
  const files: Array<string> = []
  visitFiles(root, root, files)
  return files.sort()
}

function visitFiles(root: string, current: string, files: Array<string>) {
  for (const entry of readdirSync(current).sort()) {
    const fullPath = path.join(current, entry)
    const stats = statSync(fullPath)
    if (stats.isDirectory()) {
      visitFiles(root, fullPath, files)
      continue
    }
    if (stats.isFile()) {
      files.push(path.relative(root, fullPath))
    }
  }
}

function formatRuntimeIssue(issue: SkillRuntimeIssue): string {
  return issue.path ? `${issue.code}: ${issue.message} (${issue.path})` : `${issue.code}: ${issue.message}`
}

function runtimeOptions(root: string, runCommand: SkillRuntimeCommandRunner | undefined): SkillRuntimeOptions {
  return runCommand === undefined ? { root } : { root, runCommand }
}
