import type { SkillRuntimeCommand } from '../src/partita/skill.ts'
import { assert, describe, it } from '@effect/vitest'
import { Effect } from 'effect'
import {
  listSkillRuntime,
  syncSkillRuntime,
} from '../src/partita/skill.ts'

describe('Partita skill runtime', () => {
  it.effect('runs the npx skills add command', () =>
    Effect.gen(function* () {
      const calls: Array<SkillRuntimeCommand> = []
      const root = '/tmp/partita-test-root'
      const result = yield* syncSkillRuntime({
        root,
        runCommand: (command: SkillRuntimeCommand) => {
          calls.push(command)
          return Effect.succeed({
            exitCode: 0,
            output: '',
          })
        },
      })

      assert.strictEqual(result.syncExitCode, 0)
      assert.deepStrictEqual(calls, [
        {
          command: 'npx',
          args: ['skills', 'add', './skills', '-a', 'codex', '-g', '--skill', '*', '-y', '--full-depth'],
          cwd: root,
        },
      ])
    }))

  it.effect('runs the npx skills list command for Codex runtime status', () =>
    Effect.gen(function* () {
      const calls: Array<SkillRuntimeCommand> = []
      const root = '/tmp/partita-test-root'
      const result = yield* listSkillRuntime({
        root,
        runCommand: (command: SkillRuntimeCommand) => {
          calls.push(command)
          return Effect.succeed({
            exitCode: 0,
            output: JSON.stringify([
              {
                agents: ['Codex'],
                name: 'demo',
                path: '/Users/sayori/.agents/skills/demo',
                scope: 'global',
              },
            ]),
          })
        },
      })

      assert.deepStrictEqual(result.entries.map(entry => entry.name), ['demo'])
      assert.deepStrictEqual(calls, [
        {
          command: 'npx',
          args: ['skills', 'list', '-g', '-a', 'codex', '--json'],
          cwd: root,
        },
      ])
    }))
})
