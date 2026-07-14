import type { HomeCommand } from '../src/partita/home.ts'
import { assert, describe, it } from '@effect/vitest'
import { Effect, Layer } from 'effect'
import {
  applyChezmoiHome,
  checkChezmoiHomeStatus,
  diffChezmoiHome,
} from '../src/partita/home.ts'
import { CommandExecutor } from '../src/partita/process.ts'

function commandExecutorLayer(run: CommandExecutor['Service']['run']) {
  return Layer.succeed(CommandExecutor, CommandExecutor.of({ run }))
}

describe('Partita home', () => {
  it.effect('runs chezmoi status', () =>
    Effect.gen(function* () {
      const calls: Array<HomeCommand> = []
      const root = '/tmp/partita-test-root'
      const result = yield* checkChezmoiHomeStatus({ root }).pipe(
        Effect.provide(commandExecutorLayer((command: HomeCommand) => {
          calls.push(command)
          return Effect.succeed({
            exitCode: 0,
            output: '',
          })
        })),
      )

      assert.strictEqual(result.exitCode, 0)
      assert.deepStrictEqual(calls, [
        {
          command: 'chezmoi',
          args: ['status'],
          cwd: root,
        },
      ])
    }))

  it.effect('runs chezmoi diff for a non-mutating check', () =>
    Effect.gen(function* () {
      const calls: Array<HomeCommand> = []
      const root = '/tmp/partita-test-root'
      const result = yield* diffChezmoiHome({ root }).pipe(
        Effect.provide(commandExecutorLayer((command: HomeCommand) => {
          calls.push(command)
          return Effect.succeed({
            exitCode: 0,
            output: '',
          })
        })),
      )

      assert.strictEqual(result.exitCode, 0)
      assert.deepStrictEqual(calls, [
        {
          command: 'chezmoi',
          args: ['diff'],
          cwd: root,
        },
      ])
    }))

  it.effect('preserves non-zero process output in the typed home failure', () =>
    checkChezmoiHomeStatus({ root: '/tmp/partita-test-root' }).pipe(
      Effect.provide(commandExecutorLayer(() => Effect.succeed({ exitCode: 17, output: 'status failed\n' }))),
      Effect.match({
        onFailure: (error) => {
          assert.include(error.message, 'exit code 17')
          assert.include(error.message, 'status failed')
        },
        onSuccess: () => assert.fail('expected non-zero status to fail'),
      }),
    ))

  it.effect('blocks chezmoi apply unless write is explicit', () =>
    Effect.gen(function* () {
      const exit = yield* applyChezmoiHome({
        root: '/tmp/partita-test-root',
      }).pipe(
        Effect.provide(commandExecutorLayer(() => Effect.succeed({ exitCode: 0, output: '' }))),
        Effect.match({
          onFailure: error => error.message,
          onSuccess: () => '',
        }),
      )

      assert.include(exit, 'requires --write')
    }))

  it.effect('runs chezmoi apply when write is explicit', () =>
    Effect.gen(function* () {
      const calls: Array<HomeCommand> = []
      const root = '/tmp/partita-test-root'
      const result = yield* applyChezmoiHome({ root, write: true }).pipe(
        Effect.provide(commandExecutorLayer((command: HomeCommand) => {
          calls.push(command)
          return Effect.succeed({
            exitCode: 0,
            output: '',
          })
        })),
      )

      assert.strictEqual(result.exitCode, 0)
      assert.deepStrictEqual(calls, [
        {
          command: 'chezmoi',
          args: ['apply'],
          cwd: root,
        },
      ])
    }))
})
