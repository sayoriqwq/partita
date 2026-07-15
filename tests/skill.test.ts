import type { SkillRuntimeCommand } from '../src/partita/skill.ts'
import * as NodeServices from '@effect/platform-node/NodeServices'
import { assert, describe, it } from '@effect/vitest'
import { Effect, Layer } from 'effect'
import * as Schema from 'effect/Schema'
import { CommandExecutor } from '../src/partita/process.ts'
import {
  listSkillRuntime,
  printSkillRuntimeStatus,
  syncSkillRuntime,
} from '../src/partita/skill.ts'

const { mkdirSync, mkdtempSync, writeFileSync } = process.getBuiltinModule('node:fs')
const { tmpdir } = process.getBuiltinModule('node:os')
const { dirname, join } = process.getBuiltinModule('node:path')

function commandExecutorLayer(run: CommandExecutor['Service']['run']) {
  return Layer.merge(
    NodeServices.layer,
    Layer.succeed(CommandExecutor, CommandExecutor.of({ run })),
  )
}

describe('Partita skill runtime', () => {
  const syncCalls: Array<SkillRuntimeCommand> = []
  it.layer(commandExecutorLayer((command: SkillRuntimeCommand) => {
    syncCalls.push(command)
    return Effect.succeed({ exitCode: 0, output: '' })
  }))(it => it.effect('runs the npx skills add command', () =>
    Effect.gen(function* () {
      syncCalls.length = 0
      const root = '/tmp/partita-test-root'
      const result = yield* syncSkillRuntime({ root })

      assert.strictEqual(result.syncExitCode, 0)
      assert.deepStrictEqual(syncCalls, [
        {
          command: 'npx',
          args: ['skills', 'add', './skills', '-a', 'codex', '-g', '--skill', '*', '-y', '--full-depth'],
          cwd: root,
        },
      ])
    })))

  const listCalls: Array<SkillRuntimeCommand> = []
  it.layer(commandExecutorLayer((command: SkillRuntimeCommand) => {
    listCalls.push(command)
    return Effect.succeed({
      exitCode: 0,
      output: encodeJson([{
        agents: ['Codex'],
        name: 'demo',
        path: '/Users/sayori/.agents/skills/demo',
        scope: 'global',
      }]),
    })
  }))(it => it.effect('runs the npx skills list command for Codex runtime status', () =>
    Effect.gen(function* () {
      listCalls.length = 0
      const root = '/tmp/partita-test-root'
      const result = yield* listSkillRuntime({ root })

      assert.deepStrictEqual(result.entries.map(entry => entry.name), ['demo'])
      assert.deepStrictEqual(listCalls, [
        {
          command: 'npx',
          args: ['skills', 'list', '-g', '-a', 'codex', '--json'],
          cwd: root,
        },
      ])
    })))

  it.layer(commandExecutorLayer(() => Effect.succeed({ exitCode: 0, output: '{' })))(it =>
    it.effect('reports malformed skills list JSON as a typed failure', () =>
      listSkillRuntime({ root: '/tmp/partita-test-root' }).pipe(
        Effect.match({
          onFailure: error => assert.include(error.message, 'invalid JSON'),
          onSuccess: () => assert.fail('expected malformed JSON to fail'),
        }),
      )))

  const catalogRoot = mkdtempSync(join(tmpdir(), 'partita-skill-runtime-catalog-'))
  const skillDirectory = join(catalogRoot, 'skills/expression/density')
  write(catalogRoot, 'skills/expression/density/SKILL.md', [
    '---',
    'name: density',
    'description: "Use when density comparison is needed. Not for unrelated work."',
    '---',
    '',
    '# Density',
  ].join('\n'))
  const runtimeLayer = commandExecutorLayer(() => Effect.succeed({
    exitCode: 0,
    output: encodeJson([{
      agents: ['Codex'],
      name: 'density',
      path: skillDirectory,
      scope: 'global',
    }]),
  }))

  it.layer(runtimeLayer)((it) => {
    it.effect('uses catalog family discovery for runtime comparison', () =>
      printSkillRuntimeStatus({ root: catalogRoot }).pipe(
        Effect.flatMap(status => Effect.sync(() => {
          assert.deepStrictEqual(status.expectedSkills, ['density'])
          assert.deepStrictEqual(status.issues, [])
        })),
      ))
  })
})

function write(root: string, path: string, contents: string) {
  const absolutePath = join(root, path)
  mkdirSync(dirname(absolutePath), { recursive: true })
  writeFileSync(absolutePath, contents)
}

function encodeJson(value: unknown): string {
  return Schema.encodeSync(Schema.UnknownFromJsonString)(value)
}
