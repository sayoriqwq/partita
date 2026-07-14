import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as Schema from 'effect/Schema'
import * as Stream from 'effect/Stream'
import { ChildProcess, ChildProcessSpawner } from 'effect/unstable/process'

export interface PartitaCommand {
  readonly command: string
  readonly args: ReadonlyArray<string>
  readonly cwd: string
}

export interface PartitaCommandResult {
  readonly exitCode: number
  readonly output: string
}

export class PartitaCommandError extends Schema.TaggedErrorClass<PartitaCommandError>()('PartitaCommandError', {
  message: Schema.String,
}) {}

export class CommandExecutor extends Context.Service<CommandExecutor, {
  readonly run: (command: PartitaCommand) => Effect.Effect<PartitaCommandResult, PartitaCommandError>
}>()('partita/CommandExecutor') {}

function formatUnknown(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause)
}

const commandError = (message: string): PartitaCommandError => new PartitaCommandError({ message })

export const CommandExecutorLive = Layer.effect(
  CommandExecutor,
  Effect.gen(function* () {
    const spawner = yield* ChildProcessSpawner.ChildProcessSpawner
    const run = Effect.fn('CommandExecutor.run')(function* (command: PartitaCommand) {
      return yield* Effect.scoped(Effect.gen(function* () {
        const handle = yield* spawner.spawn(
          ChildProcess.make(command.command, command.args, {
            cwd: command.cwd,
            extendEnv: true,
          }),
        ).pipe(
          Effect.mapError(cause => commandError(`spawn ${command.command}: ${formatUnknown(cause)}`)),
        )
        const output = yield* handle.all.pipe(
          Stream.decodeText(),
          Stream.mkString,
          Effect.mapError(cause => commandError(`collect ${command.command} output: ${formatUnknown(cause)}`)),
        )
        const exitCode = Number(yield* handle.exitCode.pipe(
          Effect.mapError(cause => commandError(`wait for ${command.command}: ${formatUnknown(cause)}`)),
        ))
        return { exitCode, output }
      }))
    })
    return CommandExecutor.of({ run })
  }),
)
