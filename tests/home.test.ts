import type { HomeCommand } from '../src/partita/home.ts'
import * as NodeServices from '@effect/platform-node/NodeServices'
import { assert, describe, it } from '@effect/vitest'
import { Effect, Layer } from 'effect'
import {
  applyChezmoiHome,
  checkChezmoiHomeStatus,
  diffChezmoiHome,
} from '../src/partita/home.ts'
import { CommandExecutor } from '../src/partita/process.ts'

function commandExecutorLayer(run: CommandExecutor['Service']['run']) {
  return Layer.merge(
    NodeServices.layer,
    Layer.succeed(CommandExecutor, CommandExecutor.of({ run })),
  )
}

describe('Partita home', () => {
  const statusCalls: Array<HomeCommand> = []
  it.layer(commandExecutorLayer((command: HomeCommand) => {
    statusCalls.push(command)
    return Effect.succeed({ exitCode: 0, output: '' })
  }))(it => it.effect('runs chezmoi status', () =>
    Effect.gen(function* () {
      statusCalls.length = 0
      const root = '/tmp/partita-test-root'
      const result = yield* checkChezmoiHomeStatus({ root })

      assert.strictEqual(result.exitCode, 0)
      assert.deepStrictEqual(statusCalls, [
        {
          command: 'chezmoi',
          args: ['status'],
          cwd: root,
        },
      ])
    })))

  const diffCalls: Array<HomeCommand> = []
  it.layer(commandExecutorLayer((command: HomeCommand) => {
    diffCalls.push(command)
    return Effect.succeed({ exitCode: 0, output: '' })
  }))(it => it.effect('runs chezmoi diff for a non-mutating check', () =>
    Effect.gen(function* () {
      diffCalls.length = 0
      const root = '/tmp/partita-test-root'
      const result = yield* diffChezmoiHome({ root })

      assert.strictEqual(result.exitCode, 0)
      assert.deepStrictEqual(diffCalls, [
        {
          command: 'chezmoi',
          args: ['diff'],
          cwd: root,
        },
      ])
    })))

  it.layer(commandExecutorLayer(() => Effect.succeed({ exitCode: 17, output: 'status failed\n' })))(it =>
    it.effect('preserves non-zero process output in the typed home failure', () =>
      checkChezmoiHomeStatus({ root: '/tmp/partita-test-root' }).pipe(
        Effect.match({
          onFailure: (error) => {
            assert.include(error.message, 'exit code 17')
            assert.include(error.message, 'status failed')
          },
          onSuccess: () => assert.fail('expected non-zero status to fail'),
        }),
      )))

  it.layer(commandExecutorLayer(() => Effect.succeed({ exitCode: 0, output: '' })))(it =>
    it.effect('blocks chezmoi apply unless write is explicit', () =>
      Effect.gen(function* () {
        const exit = yield* applyChezmoiHome({
          root: '/tmp/partita-test-root',
        }).pipe(
          Effect.match({
            onFailure: error => error.message,
            onSuccess: () => '',
          }),
        )

        assert.include(exit, 'requires --write')
      })))

  const applyCalls: Array<HomeCommand> = []
  it.layer(commandExecutorLayer((command: HomeCommand) => {
    applyCalls.push(command)
    return Effect.succeed({ exitCode: 0, output: '' })
  }))(it => it.effect('runs chezmoi apply when write is explicit', () =>
    Effect.gen(function* () {
      applyCalls.length = 0
      const root = '/tmp/partita-test-root'
      const result = yield* applyChezmoiHome({ root, write: true })

      assert.strictEqual(result.exitCode, 0)
      assert.deepStrictEqual(applyCalls, [
        {
          command: 'chezmoi',
          args: ['apply'],
          cwd: root,
        },
      ])
    })))
})
