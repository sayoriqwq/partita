import * as path from 'node:path'
import process from 'node:process'
import { NodeServices } from '@effect/platform-node'
import { Effect, Schema, Stream } from 'effect'
import { ChildProcess, ChildProcessSpawner } from 'effect/unstable/process'

export interface InstallCommand {
  readonly command: string
  readonly args: ReadonlyArray<string>
  readonly cwd: string
}

interface InstallCommandResult {
  readonly exitCode: number
  readonly output: string
}

type InstallCommandRunner = (
  command: InstallCommand,
) => Effect.Effect<InstallCommandResult, PartitaInstallError>

export interface InstallCodexSkillOptions {
  readonly root?: string
  readonly runCommand?: InstallCommandRunner
}

export interface InstallCodexSkillResult {
  readonly commands: ReadonlyArray<InstallCommand>
  readonly addExitCode: number
}

export class PartitaInstallError extends Schema.TaggedErrorClass<PartitaInstallError>()('PartitaInstallError', {
  message: Schema.String,
}) {}

function formatUnknown(cause: unknown): string {
  if (cause instanceof Error) {
    return cause.message
  }
  return String(cause)
}

const installError = (message: string): PartitaInstallError => new PartitaInstallError({ message })

const runInstallCommandEffect = Effect.fn('runInstallCommand')(
  function* (command: InstallCommand) {
    const spawner = yield* ChildProcessSpawner.ChildProcessSpawner
    const handle = yield* spawner.spawn(
      ChildProcess.make(command.command, command.args, {
        cwd: command.cwd,
        extendEnv: true,
      }),
    ).pipe(
      Effect.mapError(cause =>
        installError(`spawn ${command.command}: ${formatUnknown(cause)}`),
      ),
    )
    const output = yield* handle.all.pipe(
      Stream.decodeText(),
      Stream.mkString,
      Effect.mapError(cause =>
        installError(`collect ${command.command} output: ${formatUnknown(cause)}`),
      ),
    )
    const exitCode = Number(yield* handle.exitCode.pipe(
      Effect.mapError(cause =>
        installError(`wait for ${command.command}: ${formatUnknown(cause)}`),
      ),
    ))

    return {
      exitCode,
      output,
    }
  },
)

const runInstallCommand: InstallCommandRunner = command =>
  runInstallCommandEffect(command).pipe(
    Effect.scoped,
    Effect.provide(NodeServices.layer),
  )

export const installCodexSkill = Effect.fn('installCodexSkill')(
  function* (options: InstallCodexSkillOptions = {}): Effect.fn.Return<InstallCodexSkillResult, PartitaInstallError> {
    const root = path.resolve(options.root ?? process.cwd())
    const runCommand = options.runCommand ?? runInstallCommand
    const addCommand: InstallCommand = {
      command: 'npx',
      args: ['skills', 'add', './skills', '-a', 'codex', '-g', '--skill', '*', '-y', '--full-depth'],
      cwd: root,
    }

    const addResult = yield* runCommand(addCommand)
    if (addResult.exitCode !== 0) {
      return yield* installError(`npx skills add failed with exit code ${addResult.exitCode}: ${addResult.output.trim()}`)
    }

    return {
      commands: [addCommand],
      addExitCode: addResult.exitCode,
    }
  },
)
