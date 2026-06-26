import type { InstallCommand } from '../src/partita/install.ts'
import * as fs from 'node:fs/promises'
import * as os from 'node:os'
import * as path from 'node:path'
import { assert, describe, it } from '@effect/vitest'
import { Effect, Schema } from 'effect'
import { installCodexPlugin, installCodexSkill, partitaMarketplaceEntry } from '../src/partita/install.ts'

class TestError extends Schema.TaggedErrorClass<TestError>()('TestError', {
  cause: Schema.Defect(),
}) {}

function effectPromise<A>(action: () => Promise<A>): Effect.Effect<A, TestError, never> {
  return Effect.tryPromise({
    try: action,
    catch: cause => new TestError({ cause }),
  })
}

function tempDirectoryScoped(prefix: string) {
  return Effect.acquireRelease(
    effectPromise(() => fs.mkdtemp(path.join(os.tmpdir(), prefix))),
    directory =>
      effectPromise(() => fs.rm(directory, { recursive: true, force: true })).pipe(Effect.orElseSucceed(() => undefined)),
  )
}

function writeText(filePath: string, content: string): Effect.Effect<void, TestError, never> {
  return effectPromise(async () => {
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, content)
  })
}

function readText(filePath: string): Effect.Effect<string, TestError, never> {
  return effectPromise(() => fs.readFile(filePath, 'utf8'))
}

describe('Partita install', () => {
  it.effect('maintains the personal Codex plugin symlink and marketplace entry', () =>
    Effect.scoped(Effect.gen(function* () {
      const root = yield* tempDirectoryScoped('partita-install-root-')
      const marketplaceRoot = yield* tempDirectoryScoped('partita-marketplace-')
      const pluginsRoot = path.join(marketplaceRoot, 'plugins')

      yield* effectPromise(() => fs.mkdir(pluginsRoot, { recursive: true }))
      yield* writeText(path.join(marketplaceRoot, '.agents', 'plugins', 'marketplace.json'), JSON.stringify({
        name: 'personal',
        interface: { displayName: 'Personal' },
        plugins: [
          { name: 'other', source: { source: 'local', path: './plugins/other' } },
          { name: 'partita', source: { source: 'local', path: './old' } },
        ],
      }))

      const result = yield* installCodexPlugin({ root, marketplaceRoot })
      const rootRealPath = yield* effectPromise(() => fs.realpath(root))
      const partitaTarget = yield* effectPromise(() => fs.readlink(path.join(pluginsRoot, 'partita')))
      const marketplace = JSON.parse(yield* readText(result.marketplaceJson)) as { readonly plugins: ReadonlyArray<unknown> }

      assert.strictEqual(path.resolve(path.dirname(result.pluginLink), partitaTarget), rootRealPath)
      assert.deepStrictEqual(marketplace.plugins, [
        { name: 'other', source: { source: 'local', path: './plugins/other' } },
        partitaMarketplaceEntry,
      ])
    })))

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
