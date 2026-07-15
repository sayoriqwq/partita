import type { GitHubSubtreePinContract } from '../src/partita/pin.ts'
import * as NodeServices from '@effect/platform-node/NodeServices'
import { assert, layer } from '@effect/vitest'
import * as Effect from 'effect/Effect'
import * as FileSystem from 'effect/FileSystem'
import * as Layer from 'effect/Layer'
import * as Schema from 'effect/Schema'
import {
  buildPinPlan,
  defaultPinContractPath,
  inspectPins,
} from '../src/partita/pin.ts'
import { CommandExecutor } from '../src/partita/process.ts'

const { mkdirSync, mkdtempSync, writeFileSync } = process.getBuiltinModule('node:fs')
const { tmpdir } = process.getBuiltinModule('node:os')
const { dirname, join } = process.getBuiltinModule('node:path')

const gitSuccess = () => Effect.succeed({ exitCode: 0, output: '' })

function pinTestLayer(run: CommandExecutor['Service']['run'] = gitSuccess) {
  return Layer.merge(
    NodeServices.layer,
    Layer.succeed(CommandExecutor, CommandExecutor.of({ run })),
  )
}

const PinTestLayer = pinTestLayer()

layer(PinTestLayer)('Partita pins', (it) => {
  it.effect('plans a GitHub subtree pin with sibling contract path and separate editor settings shapes', () =>
    Effect.gen(function* () {
      const root = makeFixture()
      write(root, 'AGENTS.md', '# Agents\n')

      const plan = yield* buildPinPlan({
        name: 'upstream',
        ref: '3475ee6c2bda6b05c6d7a12ce30c8bb840b5b1a6',
        repository: 'https://github.com/example/upstream.git',
        root,
      })

      assert.strictEqual(plan.contractPath, 'repos/upstream.subtree.json')
      assert.strictEqual(defaultPinContractPath({ name: 'upstream', prefix: 'repos/upstream' }), 'repos/upstream.subtree.json')
      assert.strictEqual(plan.contract.github.repository, 'https://github.com/example/upstream.git')
      assert.strictEqual(plan.contract.local.prefix, 'repos/upstream')
      assert.strictEqual(plan.contract.mechanism, 'git-subtree')
      assert.strictEqual(plan.contract.ownership.mode, 'direct')
      assert.strictEqual(plan.contract.anchor.llmDocument, 'repos/upstream/LLMS.md')
      assert.strictEqual(plan.contract.agent.route, 'AGENTS.md')
      assert.include(plan.contract.commands.update, '--contract repos/upstream.subtree.json')
      assert.include(plan.contract.commands.verify, '--contract repos/upstream.subtree.json')
      assert.include(plan.editorSettings.vscode, '"typescript.preferences.autoImportFileExcludePatterns"')
      assert.include(plan.editorSettings.vscode, '"files.watcherExclude"')
      assert.include(plan.editorSettings.vscode, '"search.exclude"')
      assert.notInclude(plan.editorSettings.vscode, '"files.exclude"')
      assert.include(plan.editorSettings.zed, '"vtsls"')
      assert.include(plan.editorSettings.zed, '"typescript-language-server"')
      assert.notInclude(plan.editorSettings.zed, '"file_scan_exclusions"')
    }))

  it.effect('normalizes explicit contract paths back to target-root relative paths', () =>
    Effect.gen(function* () {
      const root = makeFixture()
      write(root, 'AGENTS.md', '# Agents\n')

      const plan = yield* buildPinPlan({
        contractPath: join(root, 'repos/upstream.subtree.json'),
        name: 'upstream',
        prefix: 'repos/upstream',
        ref: '3475ee6c2bda6b05c6d7a12ce30c8bb840b5b1a6',
        repository: 'https://github.com/example/upstream.git',
        root,
      })

      assert.strictEqual(plan.contractPath, 'repos/upstream.subtree.json')
      assert.include(plan.contract.commands.update, '--contract repos/upstream.subtree.json')
      assert.include(plan.contract.commands.verify, '--contract repos/upstream.subtree.json')
    }))

  it.effect('accepts a valid GitHub subtree pin contract from the default path', () =>
    Effect.gen(function* () {
      const root = makeFixture()
      write(root, 'AGENTS.md', '# Agents\n')
      write(root, 'repos/upstream/LLMS.md', '# Upstream LLM guide\n')
      write(root, '.vscode/settings.json', encodeJson({
        'javascript.preferences.autoImportFileExcludePatterns': ['repos/upstream/**'],
        'typescript.preferences.autoImportFileExcludePatterns': ['repos/upstream/**'],
      }))
      write(root, '.zed/settings.json', encodeJson({
        lsp: {
          vtsls: {
            settings: {
              javascript: {
                preferences: {
                  autoImportFileExcludePatterns: ['repos/upstream/**'],
                },
              },
              typescript: {
                preferences: {
                  autoImportFileExcludePatterns: ['repos/upstream/**'],
                },
              },
            },
          },
        },
      }))
      writeContract(root, validContract())

      const report = yield* inspectPins({ name: 'upstream', root })

      assert.isTrue(report.ok)
      assert.deepStrictEqual(report.issues, [])
      assert.strictEqual(report.contractPath, 'repos/upstream.subtree.json')
      assert.strictEqual(report.entry.name, 'upstream')
    }))

  it.effect('accepts Effect-tsgo as the sole Zed TypeScript server when auto-import exclusions remain configured', () =>
    Effect.gen(function* () {
      const root = makeFixture()
      write(root, 'AGENTS.md', '# Agents\n')
      write(root, 'repos/upstream/LLMS.md', '# Upstream LLM guide\n')
      write(root, '.vscode/settings.json', encodeJson({
        'javascript.preferences.autoImportFileExcludePatterns': ['repos/upstream/**'],
        'typescript.preferences.autoImportFileExcludePatterns': ['repos/upstream/**'],
      }))
      write(root, '.zed/settings.json', encodeJson({
        lsp: {
          tsgo: {
            initialization_options: {
              preferences: {
                autoImportFileExcludePatterns: ['repos/upstream/**'],
              },
            },
          },
        },
      }))
      writeContract(root, validContract())

      const report = yield* inspectPins({ name: 'upstream', root })

      assert.isTrue(report.ok)
      assert.deepStrictEqual(report.issues, [])
    }))

  it.effect('hard-blocks missing pin prefixes', () =>
    Effect.gen(function* () {
      const root = makeFixture()
      write(root, 'AGENTS.md', '# Agents\n')
      writeContract(root, validContract())

      const report = yield* inspectPins({ name: 'upstream', root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('pin.missing'))
    }))

  it.effect('hard-blocks non-direct source ownership', () =>
    Effect.gen(function* () {
      const root = makeFixture()
      write(root, 'AGENTS.md', '# Agents\n')
      write(root, 'repos/upstream/LLMS.md', '# Upstream LLM guide\n')
      writeContract(root, {
        ...validContract(),
        ownership: { mode: 'artifact' },
      })

      const report = yield* inspectPins({ name: 'upstream', root })

      assert.isFalse(report.ok)
      assert.isTrue(report.issues.some(issue =>
        issue.code === 'pin.contract_missing'
        && issue.message.includes('pin.ownership.mode')))
    }))

  it.effect('hard-blocks unsafe GitHub subtree pin contracts', () =>
    Effect.gen(function* () {
      const root = makeFixture()
      write(root, 'repos/upstream/.git', 'gitdir: ../.git/modules/upstream\n')
      write(root, 'src/app.ts', 'import { value } from "../repos/upstream/packages/pkg/src/index.ts"\n')
      write(root, '.vscode/settings.json', '{}\n')
      writeContract(root, {
        ...validContract(),
        agent: { route: 'missing/AGENTS.md' },
        anchor: { llmDocument: 'repos/upstream/LLMS.md' },
        boundaries: { importBlock: true, readOnly: false },
        github: {
          branch: 'main',
          ref: '',
          repository: 'https://example.com/not-github.git',
        },
        mechanism: '',
        ownership: { mode: 'direct' },
        subtree: { split: '', trailer: '' },
      })

      const report = yield* inspectPins({ name: 'upstream', root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('pin.github_only'))
      assert.isTrue(codes.includes('pin.mechanism_invalid'))
      assert.isTrue(codes.includes('pin.gitlink'))
      assert.isTrue(codes.includes('pin.pin_missing'))
      assert.isTrue(codes.includes('pin.anchor_missing'))
      assert.isTrue(codes.includes('pin.agent_route_missing'))
      assert.isTrue(codes.includes('pin.read_only_missing'))
      assert.isTrue(codes.includes('pin.import_blocked'))
      assert.isTrue(codes.includes('pin.editor_vscode_auto_import_missing'))
    }))

  it.layer(pinTestLayer(() => Effect.succeed({
    exitCode: 0,
    output: '160000 3475ee6c2bda6b05c6d7a12ce30c8bb840b5b1a6 0\trepos/upstream\n',
  })))(it => it.effect('recognizes a gitlink from deterministic Git index output', () =>
    Effect.gen(function* () {
      const root = makeFixture()
      write(root, 'AGENTS.md', '# Agents\n')
      write(root, 'repos/upstream/LLMS.md', '# Upstream LLM guide\n')
      writeContract(root, validContract())

      const report = yield* inspectPins({ name: 'upstream', root })

      assert.isFalse(report.ok)
      assert.isTrue(report.issues.some(issue => issue.code === 'pin.gitlink'))
    })))

  it.layer(pinTestLayer(() => Effect.succeed({
    exitCode: 0,
    output: '160000 52168999f3dcfc9205432d47f6f600051f02f1a2 0\trepos/upstream/typescript-go\n',
  })))(it => it.effect('allows internal upstream gitlinks as opaque reference boundaries', () =>
    Effect.gen(function* () {
      const root = makeFixture()
      write(root, 'AGENTS.md', '# Agents\n')
      write(root, 'repos/upstream/LLMS.md', '# Upstream LLM guide\n')
      writeContract(root, validContract())

      const report = yield* inspectPins({ name: 'upstream', root })

      assert.isTrue(report.ok)
      assert.deepStrictEqual(report.issues, [])
    })))

  it.layer(pinTestLayer(() => Effect.succeed({ exitCode: 128, output: 'fatal: index unavailable' })))(it =>
    it.effect('fails closed when Git cannot inspect the index', () => Effect.gen(function* () {
      const root = makeFixture()
      write(root, 'AGENTS.md', '# Agents\n')
      write(root, 'repos/upstream/LLMS.md', '# Upstream LLM guide\n')
      writeContract(root, validContract())
      yield* inspectPins({ name: 'upstream', root }).pipe(
        Effect.match({
          onFailure: error => assert.include(error.message, 'git exited with code 128'),
          onSuccess: () => assert.fail('expected Git inspection to fail closed'),
        }),
      )
    })))

  const statRoot = makeFixture()
  const sourcePath = join(statRoot, 'src/app.ts')
  it.layer(Layer.merge(
    failingStatLayer(sourcePath),
    Layer.succeed(CommandExecutor, CommandExecutor.of({ run: gitSuccess })),
  ))(it => it.effect('fails closed when source file stat cannot be completed', () => {
    write(statRoot, 'AGENTS.md', '# Agents\n')
    write(statRoot, 'repos/upstream/LLMS.md', '# Upstream LLM guide\n')
    write(statRoot, 'src/app.ts', 'export const value = 1\n')
    writeContract(statRoot, validContract())
    return inspectPins({ name: 'upstream', root: statRoot }).pipe(
      Effect.match({
        onFailure: error => assert.include(error.message, 'Stat src/app.ts'),
        onSuccess: () => assert.fail('expected source stat to fail closed'),
      }),
    )
  }))

  const existsRoot = makeFixture()
  const contractPath = join(existsRoot, 'repos/upstream.subtree.json')
  it.layer(Layer.merge(
    failingExistsLayer(contractPath),
    Layer.succeed(CommandExecutor, CommandExecutor.of({ run: gitSuccess })),
  ))(it => it.effect('fails closed when path existence cannot be checked', () => {
    writeContract(existsRoot, validContract())
    return inspectPins({ name: 'upstream', root: existsRoot }).pipe(
      Effect.match({
        onFailure: error => assert.include(error.message, `Check ${contractPath}`),
        onSuccess: () => assert.fail('expected path check to fail closed'),
      }),
    )
  }))
})

function failingStatLayer(target: string) {
  return Layer.effect(
    FileSystem.FileSystem,
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem
      return FileSystem.FileSystem.of({
        ...fs,
        stat: path => path === target ? fs.stat(`${target}.missing`) : fs.stat(path),
      })
    }),
  ).pipe(Layer.provide(NodeServices.layer))
}

function failingExistsLayer(target: string) {
  return Layer.effect(
    FileSystem.FileSystem,
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem
      return FileSystem.FileSystem.of({
        ...fs,
        exists: path => path === target ? fs.stat(`${target}.missing`).pipe(Effect.as(true)) : fs.exists(path),
      })
    }),
  ).pipe(Layer.provide(NodeServices.layer))
}

function makeFixture(): string {
  return mkdtempSync(join(tmpdir(), 'partita-pin-'))
}

function validContract(): GitHubSubtreePinContract {
  return {
    schemaVersion: 1,
    agent: {
      route: 'AGENTS.md',
    },
    anchor: {
      llmDocument: 'repos/upstream/LLMS.md',
    },
    boundaries: {
      importBlock: true,
      readOnly: true,
    },
    commands: {
      update: 'pnpm source:update',
      verify: 'pnpm source:verify',
    },
    editorPolicy: {
      autoImportExclude: 'block',
      filesExclude: 'disabled',
      searchExclude: 'recommended',
      watcherExclude: 'recommended',
    },
    local: {
      prefix: 'repos/upstream',
    },
    mechanism: 'git-subtree',
    name: 'upstream',
    ownership: {
      mode: 'direct',
    },
    subtree: {
      split: '3475ee6c2bda6b05c6d7a12ce30c8bb840b5b1a6',
      trailer: 'git-subtree-split: 3475ee6c2bda6b05c6d7a12ce30c8bb840b5b1a6',
    },
    github: {
      branch: 'main',
      ref: '3475ee6c2bda6b05c6d7a12ce30c8bb840b5b1a6',
      repository: 'https://github.com/example/upstream.git',
    },
  }
}

function writeContract(root: string, contract: unknown) {
  write(root, 'repos/upstream.subtree.json', `${encodeJson(contract)}\n`)
}

function encodeJson(value: unknown): string {
  return Schema.encodeSync(Schema.UnknownFromJsonString)(value)
}

function write(root: string, path: string, contents: string) {
  const absolutePath = join(root, path)
  mkdirSync(dirname(absolutePath), { recursive: true })
  writeFileSync(absolutePath, contents)
}
