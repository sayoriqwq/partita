import type { InstallCommand } from '../src/partita/install.ts'
import { assert, describe, it } from '@effect/vitest'
import { Effect } from 'effect'
import { installCodexSkill } from '../src/partita/install.ts'

describe('Partita install', () => {
  it.effect('runs the npx skills add command', () =>
    Effect.gen(function* () {
      const calls: Array<InstallCommand> = []
      const root = '/tmp/partita-test-root'
      const result = yield* installCodexSkill({
        root,
        runCommand: (command: InstallCommand) => {
          calls.push(command)
          return Effect.succeed({
            exitCode: 0,
            output: '',
          })
        },
      })

      assert.strictEqual(result.addExitCode, 0)
      assert.deepStrictEqual(calls, [
        {
          command: 'npx',
          args: ['skills', 'add', './skills', '-a', 'codex', '-g', '--skill', '*', '-y', '--full-depth'],
          cwd: root,
        },
      ])
    }))
})
