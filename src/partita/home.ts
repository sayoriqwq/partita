import type { PartitaCommand } from './process.ts'
import * as path from 'node:path'
import process from 'node:process'
import { Effect, Schema } from 'effect'
import * as Console from 'effect/Console'
import { CommandExecutor } from './process.ts'

export type HomeCommand = PartitaCommand

export interface ChezmoiHomeOptions {
  readonly root?: string
}

export interface ChezmoiHomeApplyOptions extends ChezmoiHomeOptions {
  readonly write?: boolean
}

export class PartitaHomeError extends Schema.TaggedErrorClass<PartitaHomeError>()('PartitaHomeError', {
  message: Schema.String,
}) {}

const homeError = (message: string): PartitaHomeError => new PartitaHomeError({ message })

export const checkChezmoiHomeStatus = Effect.fn('checkChezmoiHomeStatus')(
  function* (options: ChezmoiHomeOptions = {}) {
    const root = path.resolve(options.root ?? process.cwd())
    const executor = yield* CommandExecutor
    const statusCommand: HomeCommand = {
      command: 'chezmoi',
      args: ['status'],
      cwd: root,
    }

    const statusResult = yield* executor.run(statusCommand)
    if (statusResult.exitCode !== 0) {
      return yield* homeError(`chezmoi status failed with exit code ${statusResult.exitCode}: ${statusResult.output.trim()}`)
    }

    return {
      commands: [statusCommand],
      exitCode: statusResult.exitCode,
      output: statusResult.output,
    }
  },
)

export const applyChezmoiHome = Effect.fn('applyChezmoiHome')(
  function* (options: ChezmoiHomeApplyOptions = {}) {
    if (options.write !== true) {
      return yield* homeError('partita home apply requires --write; use partita home diff for a non-mutating check')
    }

    const root = path.resolve(options.root ?? process.cwd())
    const executor = yield* CommandExecutor
    const applyCommand: HomeCommand = {
      command: 'chezmoi',
      args: ['apply'],
      cwd: root,
    }

    const applyResult = yield* executor.run(applyCommand)
    if (applyResult.exitCode !== 0) {
      return yield* homeError(`chezmoi apply failed with exit code ${applyResult.exitCode}: ${applyResult.output.trim()}`)
    }

    return {
      commands: [applyCommand],
      exitCode: applyResult.exitCode,
      output: applyResult.output,
    }
  },
)

export const diffChezmoiHome = Effect.fn('diffChezmoiHome')(
  function* (options: ChezmoiHomeOptions = {}) {
    const root = path.resolve(options.root ?? process.cwd())
    const executor = yield* CommandExecutor
    const diffCommand: HomeCommand = {
      command: 'chezmoi',
      args: ['diff'],
      cwd: root,
    }

    const diffResult = yield* executor.run(diffCommand)
    if (diffResult.exitCode !== 0) {
      return yield* homeError(`chezmoi diff failed with exit code ${diffResult.exitCode}: ${diffResult.output.trim()}`)
    }

    return {
      commands: [diffCommand],
      exitCode: diffResult.exitCode,
      output: diffResult.output,
    }
  },
)

export const printChezmoiHomeStatus = Effect.fn('printChezmoiHomeStatus')(
  function* (options: ChezmoiHomeOptions = {}) {
    const result = yield* checkChezmoiHomeStatus(options)
    yield* printOutputOrDefault(result.output, 'chezmoi status: clean')
  },
)

export const printChezmoiHomeDiff = Effect.fn('printChezmoiHomeDiff')(
  function* (options: ChezmoiHomeOptions = {}) {
    const result = yield* diffChezmoiHome(options)
    yield* printOutputOrDefault(result.output, 'chezmoi diff: clean')
  },
)

export const printChezmoiHomeApply = Effect.fn('printChezmoiHomeApply')(
  function* (options: ChezmoiHomeApplyOptions = {}) {
    const result = yield* applyChezmoiHome(options)
    yield* printOutputOrDefault(
      result.output,
      'chezmoi apply: complete',
    )
  },
)

function printOutputOrDefault(output: string, defaultMessage: string) {
  const trimmed = output.trim()
  return Console.log(trimmed || defaultMessage)
}
