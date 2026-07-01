import type { GitHubSubtreePinContract } from '../src/partita/pin.ts'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import * as NodeServices from '@effect/platform-node/NodeServices'
import { assert, describe, it } from '@effect/vitest'
import * as Effect from 'effect/Effect'
import {
  buildPinPlan,
  defaultPinContractPath,
  inspectPins,
} from '../src/partita/pin.ts'

describe('Partita pins', () => {
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
    }).pipe(Effect.provide(NodeServices.layer)))

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
    }).pipe(Effect.provide(NodeServices.layer)))

  it.effect('accepts a valid GitHub subtree pin contract from the default path', () =>
    Effect.gen(function* () {
      const root = makeFixture()
      write(root, 'AGENTS.md', '# Agents\n')
      write(root, 'repos/upstream/LLMS.md', '# Upstream LLM guide\n')
      write(root, '.vscode/settings.json', JSON.stringify({
        'javascript.preferences.autoImportFileExcludePatterns': ['repos/upstream/**'],
        'typescript.preferences.autoImportFileExcludePatterns': ['repos/upstream/**'],
      }, null, 2))
      write(root, '.zed/settings.json', JSON.stringify({
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
      }, null, 2))
      writeContract(root, validContract())

      const report = yield* inspectPins({ name: 'upstream', root })

      assert.isTrue(report.ok)
      assert.deepStrictEqual(report.issues, [])
      assert.strictEqual(report.contractPath, 'repos/upstream.subtree.json')
      assert.strictEqual(report.entry.name, 'upstream')
    }).pipe(Effect.provide(NodeServices.layer)))

  it.effect('hard-blocks missing pin prefixes', () =>
    Effect.gen(function* () {
      const root = makeFixture()
      write(root, 'AGENTS.md', '# Agents\n')
      writeContract(root, validContract())

      const report = yield* inspectPins({ name: 'upstream', root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('pin.missing'))
    }).pipe(Effect.provide(NodeServices.layer)))

  it.effect('hard-blocks unsafe GitHub subtree pin contracts', () =>
    Effect.gen(function* () {
      const root = makeFixture()
      write(root, '.prelude/manifest.json', '{}\n')
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
      assert.isTrue(codes.includes('pin.prelude_direct_write'))
      assert.isTrue(codes.includes('pin.import_blocked'))
      assert.isTrue(codes.includes('pin.editor_vscode_auto_import_missing'))
    }).pipe(Effect.provide(NodeServices.layer)))
})

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
      mode: 'provider',
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

function writeContract(root: string, contract: GitHubSubtreePinContract) {
  write(root, 'repos/upstream.subtree.json', `${JSON.stringify(contract, null, 2)}\n`)
}

function write(root: string, path: string, contents: string) {
  const absolutePath = join(root, path)
  mkdirSync(dirname(absolutePath), { recursive: true })
  writeFileSync(absolutePath, contents)
}
