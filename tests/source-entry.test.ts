import type { SourceEntryContract } from '../src/partita/source-entry.ts'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { assert, describe, it } from '@effect/vitest'
import * as Effect from 'effect/Effect'
import {
  buildSourceEntryPlan,
  inspectSourceEntries,
} from '../src/partita/source-entry.ts'

describe('Partita source entries', () => {
  it.effect('plans a generic source entry with separate editor settings shapes', () =>
    Effect.gen(function* () {
      const root = makeFixture()
      write(root, 'AGENTS.md', '# Agents\n')

      const plan = yield* buildSourceEntryPlan({
        name: 'effect',
        ref: '3475ee6c2bda6b05c6d7a12ce30c8bb840b5b1a6',
        repository: 'https://github.com/Effect-TS/effect-smol.git',
        root,
      })

      const entry = plan.contract.sources[0]
      assert.strictEqual(entry?.local.prefix, 'repos/effect')
      assert.strictEqual(entry?.anchor.llmDocument, 'repos/effect/LLMS.md')
      assert.strictEqual(entry?.agent.route, 'AGENTS.md')
      assert.include(plan.editorSettings.vscode, '"typescript.preferences.autoImportFileExcludePatterns"')
      assert.include(plan.editorSettings.vscode, '"files.watcherExclude"')
      assert.include(plan.editorSettings.vscode, '"search.exclude"')
      assert.notInclude(plan.editorSettings.vscode, '"files.exclude"')
      assert.include(plan.editorSettings.zed, '"vtsls"')
      assert.include(plan.editorSettings.zed, '"typescript-language-server"')
      assert.notInclude(plan.editorSettings.zed, '"file_scan_exclusions"')
    }))

  it.effect('accepts a valid source-entry contract', () =>
    Effect.gen(function* () {
      const root = makeFixture()
      write(root, 'AGENTS.md', '# Agents\n')
      write(root, 'repos/effect/LLMS.md', '# Effect LLM guide\n')
      write(root, '.vscode/settings.json', JSON.stringify({
        'javascript.preferences.autoImportFileExcludePatterns': ['repos/effect/**'],
        'typescript.preferences.autoImportFileExcludePatterns': ['repos/effect/**'],
      }, null, 2))
      write(root, '.zed/settings.json', JSON.stringify({
        lsp: {
          vtsls: {
            settings: {
              javascript: {
                preferences: {
                  autoImportFileExcludePatterns: ['repos/effect/**'],
                },
              },
              typescript: {
                preferences: {
                  autoImportFileExcludePatterns: ['repos/effect/**'],
                },
              },
            },
          },
        },
      }, null, 2))
      writeContract(root, validContract())

      const report = yield* inspectSourceEntries({ root })

      assert.isTrue(report.ok)
      assert.deepStrictEqual(report.issues, [])
      assert.deepStrictEqual(report.entries.map(entry => entry.name), ['effect'])
    }))

  it.effect('hard-blocks missing source prefixes', () =>
    Effect.gen(function* () {
      const root = makeFixture()
      write(root, 'AGENTS.md', '# Agents\n')
      writeContract(root, validContract())

      const report = yield* inspectSourceEntries({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('source.missing'))
    }))

  it.effect('hard-blocks unsafe source-entry contracts', () =>
    Effect.gen(function* () {
      const root = makeFixture()
      write(root, '.prelude/manifest.json', '{}\n')
      write(root, 'repos/effect/.git', 'gitdir: ../.git/modules/effect\n')
      write(root, 'src/app.ts', 'import { Effect } from "../repos/effect/packages/effect/src/Effect.ts"\n')
      write(root, '.vscode/settings.json', '{}\n')
      writeContract(root, {
        schemaVersion: 1,
        sources: [{
          ...validEntry(),
          agent: { route: 'missing/AGENTS.md' },
          anchor: { llmDocument: 'repos/effect/LLMS.md' },
          boundaries: { importBlock: true, readOnly: false },
          ownership: { mode: 'direct' },
          pin: { ref: '', trailer: '' },
          upstream: {
            branch: 'main',
            ref: '',
            repository: 'https://github.com/Effect-TS/effect-smol.git',
          },
        }],
      })

      const report = yield* inspectSourceEntries({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('source.gitlink'))
      assert.isTrue(codes.includes('source.pin_missing'))
      assert.isTrue(codes.includes('source.anchor_missing'))
      assert.isTrue(codes.includes('source.agent_route_missing'))
      assert.isTrue(codes.includes('source.read_only_missing'))
      assert.isTrue(codes.includes('source.prelude_direct_write'))
      assert.isTrue(codes.includes('source.import_blocked'))
      assert.isTrue(codes.includes('source.editor_vscode_auto_import_missing'))
    }))
})

function makeFixture(): string {
  return mkdtempSync(join(tmpdir(), 'partita-source-entry-'))
}

function validContract(): SourceEntryContract {
  return {
    schemaVersion: 1,
    sources: [validEntry()],
  }
}

function validEntry(): SourceEntryContract['sources'][number] {
  return {
    agent: {
      route: 'AGENTS.md',
    },
    anchor: {
      llmDocument: 'repos/effect/LLMS.md',
    },
    boundaries: {
      importBlock: true,
      readOnly: true,
    },
    commands: {
      update: 'pnpm effect:update',
      verify: 'pnpm effect:verify',
    },
    editorPolicy: {
      autoImportExclude: 'block',
      filesExclude: 'disabled',
      searchExclude: 'recommended',
      watcherExclude: 'recommended',
    },
    local: {
      prefix: 'repos/effect',
    },
    mechanism: 'git-subtree',
    name: 'effect',
    ownership: {
      mode: 'provider',
    },
    pin: {
      ref: '3475ee6c2bda6b05c6d7a12ce30c8bb840b5b1a6',
      trailer: 'git-subtree-split: 3475ee6c2bda6b05c6d7a12ce30c8bb840b5b1a6',
    },
    upstream: {
      branch: 'main',
      ref: '3475ee6c2bda6b05c6d7a12ce30c8bb840b5b1a6',
      repository: 'https://github.com/Effect-TS/effect-smol.git',
    },
  }
}

function writeContract(root: string, contract: SourceEntryContract) {
  write(root, '.partita/source-entries.json', `${JSON.stringify(contract, null, 2)}\n`)
}

function write(root: string, path: string, contents: string) {
  const absolutePath = join(root, path)
  mkdirSync(dirname(absolutePath), { recursive: true })
  writeFileSync(absolutePath, contents)
}
