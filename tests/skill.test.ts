import type { SkillRuntimeCommand } from '../src/partita/skill.ts'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import * as NodeServices from '@effect/platform-node/NodeServices'
import { assert, describe, it } from '@effect/vitest'
import { Effect, Layer } from 'effect'
import { CommandExecutor } from '../src/partita/process.ts'
import {
  listSkillRuntime,
  printSkillRuntimeStatus,
  syncSkillRuntime,
} from '../src/partita/skill.ts'

function commandExecutorLayer(run: CommandExecutor['Service']['run']) {
  return Layer.succeed(CommandExecutor, CommandExecutor.of({ run }))
}

describe('Partita skill runtime', () => {
  it.effect('runs the npx skills add command', () =>
    Effect.gen(function* () {
      const calls: Array<SkillRuntimeCommand> = []
      const root = '/tmp/partita-test-root'
      const result = yield* syncSkillRuntime({ root }).pipe(
        Effect.provide(commandExecutorLayer((command: SkillRuntimeCommand) => {
          calls.push(command)
          return Effect.succeed({
            exitCode: 0,
            output: '',
          })
        })),
      )

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
      const result = yield* listSkillRuntime({ root }).pipe(
        Effect.provide(commandExecutorLayer((command: SkillRuntimeCommand) => {
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
        })),
      )

      assert.deepStrictEqual(result.entries.map(entry => entry.name), ['demo'])
      assert.deepStrictEqual(calls, [
        {
          command: 'npx',
          args: ['skills', 'list', '-g', '-a', 'codex', '--json'],
          cwd: root,
        },
      ])
    }))

  it.effect('reports malformed skills list JSON as a typed failure', () =>
    listSkillRuntime({ root: '/tmp/partita-test-root' }).pipe(
      Effect.provide(commandExecutorLayer(() => Effect.succeed({ exitCode: 0, output: '{' }))),
      Effect.match({
        onFailure: error => assert.include(error.message, 'invalid JSON'),
        onSuccess: () => assert.fail('expected malformed JSON to fail'),
      }),
    ))

  it.effect('uses catalog family discovery for runtime comparison', () => {
    const root = mkdtempSync(join(tmpdir(), 'partita-skill-runtime-catalog-'))
    const skillDirectory = join(root, 'skills/expression/density')
    write(root, 'skills/expression/density/SKILL.md', [
      '---',
      'name: density',
      'description: "Use when density comparison is needed. Not for unrelated work."',
      '---',
      '',
      '# Density',
    ].join('\n'))
    const runtimeLayer = Layer.merge(
      NodeServices.layer,
      commandExecutorLayer(() => Effect.succeed({
        exitCode: 0,
        output: JSON.stringify([{
          agents: ['Codex'],
          name: 'density',
          path: skillDirectory,
          scope: 'global',
        }]),
      })),
    )

    return printSkillRuntimeStatus({ root }).pipe(
      Effect.provide(runtimeLayer),
      Effect.flatMap(status => Effect.sync(() => {
        assert.deepStrictEqual(status.expectedSkills, ['density'])
        assert.deepStrictEqual(status.issues, [])
      })),
    )
  })
})

function write(root: string, path: string, contents: string) {
  const absolutePath = join(root, path)
  mkdirSync(dirname(absolutePath), { recursive: true })
  writeFileSync(absolutePath, contents)
}
