import type { GitHubSubtreePinContract, PinPlan } from '../src/partita/pin.ts'
import * as NodeServices from '@effect/platform-node/NodeServices'
import { assert, layer } from '@effect/vitest'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as Schema from 'effect/Schema'
import {
  applyPinPlan,
  buildPinPlan,
  defaultPinContractPath,
  inspectPins,
} from '../src/partita/pin.ts'
import { CommandExecutorLive } from '../src/partita/process.ts'

const { execFileSync } = process.getBuiltinModule('node:child_process')
const { mkdirSync, mkdtempSync, readFileSync, writeFileSync } = process.getBuiltinModule('node:fs')
const { tmpdir } = process.getBuiltinModule('node:os')
const { dirname, join } = process.getBuiltinModule('node:path')

const GitHubRepository = 'https://github.com/example/upstream.git'
const PinTestTimeout = 20_000
const PinTestLayer = CommandExecutorLive.pipe(
  Layer.provideMerge(NodeServices.layer),
)

layer(PinTestLayer)('Partita Source Pins', (it) => {
  it.effect('plans and applies a real git-subtree add from an immutable branch resolution', () =>
    Effect.gen(function* () {
      const fixture = makeGitFixture()
      const plan = yield* buildPinPlan(addPlanOptions(fixture))

      assert.strictEqual(plan.planVersion, 1)
      assert.strictEqual(plan.operation, 'add')
      assert.strictEqual(plan.currentRevision, null)
      assert.strictEqual(plan.desiredRevision, fixture.revision)
      assert.match(plan.planHash, /^[0-9a-f]{64}$/u)
      assert.strictEqual(plan.contractPath, 'repos/upstream.subtree.json')
      assert.strictEqual(
        defaultPinContractPath({ name: 'upstream', prefix: 'repos/upstream' }),
        'repos/upstream.subtree.json',
      )
      assert.deepStrictEqual(plan.git, {
        action: 'add',
        args: [
          'subtree',
          'add',
          '--prefix=repos/upstream',
          GitHubRepository,
          fixture.revision,
          '--squash',
        ],
        command: 'git',
      })
      assert.strictEqual(plan.contract.schemaVersion, 2)
      assert.deepStrictEqual(plan.contract.source, {
        repository: GitHubRepository,
        revision: fixture.revision,
        trackingBranch: 'main',
      })
      assert.deepStrictEqual(plan.contract.materialization, {
        mechanism: 'git-subtree',
        prefix: 'repos/upstream',
        split: fixture.revision,
        trailer: `git-subtree-split: ${fixture.revision}`,
      })
      assert.notProperty(plan.contract, 'commands')

      const report = yield* apply(plan, fixture.target)
      assert.isTrue(report.ok)
      assert.strictEqual(read(fixture.target, 'repos/upstream/value.txt'), 'one\n')
      assert.deepStrictEqual(
        readJson(fixture.target, 'repos/upstream.subtree.json'),
        plan.contract as unknown as Record<string, unknown>,
      )
      assert.include(
        git(fixture.target, ['log', '--format=%B', '--all']),
        `git-subtree-split: ${fixture.revision}`,
      )
    }), PinTestTimeout)

  it.effect('plans and applies a real git-subtree update without reselecting the approved revision', () =>
    Effect.gen(function* () {
      const fixture = makeGitFixture()
      const addPlan = yield* buildPinPlan(addPlanOptions(fixture))
      yield* apply(addPlan, fixture.target)
      commitAll(fixture.target, 'record Source Pin contract')

      write(fixture.upstream, 'value.txt', 'two\n')
      commitAll(fixture.upstream, 'second')
      const nextRevision = git(fixture.upstream, ['rev-parse', 'HEAD']).trim()
      const updatePlan = yield* buildPinPlan({
        contractPath: 'repos/upstream.subtree.json',
        operation: 'update',
        root: fixture.target,
      })

      assert.strictEqual(updatePlan.currentRevision, fixture.revision)
      assert.strictEqual(updatePlan.desiredRevision, nextRevision)
      assert.deepStrictEqual(updatePlan.git, {
        action: 'update',
        args: [
          'subtree',
          'pull',
          '--prefix=repos/upstream',
          GitHubRepository,
          nextRevision,
          '--squash',
        ],
        command: 'git',
      })
      const report = yield* apply(updatePlan, fixture.target)
      assert.isTrue(report.ok)
      assert.strictEqual(read(fixture.target, 'repos/upstream/value.txt'), 'two\n')
      const contract = readJson(
        fixture.target,
        'repos/upstream.subtree.json',
      ) as unknown as GitHubSubtreePinContract
      assert.strictEqual(contract.source.revision, nextRevision)
      assert.strictEqual(contract.materialization.split, nextRevision)
    }), PinTestTimeout)

  it.effect('rejects an altered or unapproved plan hash before writing', () =>
    Effect.gen(function* () {
      const fixture = makeGitFixture()
      const plan = yield* buildPinPlan(addPlanOptions(fixture))
      const result = yield* Effect.result(applyPinPlan({
        operation: 'add',
        plan,
        planHash: '0'.repeat(64),
        revision: plan.desiredRevision,
        root: fixture.target,
      }))
      assert.strictEqual(result._tag, 'Failure')
      assert.include(String(result), 'plan hash')
      assert.notInclude(git(fixture.target, ['status', '--short']), 'repos/upstream')
    }), PinTestTimeout)

  it.effect('rejects a plan when its tracking branch moved after approval', () =>
    Effect.gen(function* () {
      const fixture = makeGitFixture()
      const plan = yield* buildPinPlan(addPlanOptions(fixture))
      write(fixture.upstream, 'value.txt', 'moved\n')
      commitAll(fixture.upstream, 'branch moved')
      const result = yield* Effect.result(applyPinPlan({
        operation: 'add',
        plan,
        planHash: plan.planHash,
        revision: plan.desiredRevision,
        root: fixture.target,
      }))
      assert.strictEqual(result._tag, 'Failure')
      assert.include(String(result), 'tracking branch moved')
      assert.notInclude(git(fixture.target, ['status', '--short']), 'repos/upstream')
    }), PinTestTimeout)

  it.effect('rejects a stale local baseline before writing', () =>
    Effect.gen(function* () {
      const fixture = makeGitFixture()
      const plan = yield* buildPinPlan(addPlanOptions(fixture))
      write(fixture.target, 'after-plan.txt', 'changed\n')
      commitAll(fixture.target, 'change after plan')
      const result = yield* Effect.result(applyPinPlan({
        operation: 'add',
        plan,
        planHash: plan.planHash,
        revision: plan.desiredRevision,
        root: fixture.target,
      }))
      assert.strictEqual(result._tag, 'Failure')
      assert.include(String(result), 'stale local baseline')
    }), PinTestTimeout)

  it.effect('fresh-plans recovery after the subtree commit succeeded but contract delivery failed', () =>
    Effect.gen(function* () {
      const fixture = makeGitFixture()
      const firstPlan = yield* buildPinPlan(addPlanOptions(fixture))
      git(fixture.target, firstPlan.git.args)
      const recoveryPlan = yield* buildPinPlan(addPlanOptions(fixture))
      assert.strictEqual(recoveryPlan.git.action, 'none')
      assert.strictEqual(recoveryPlan.recovery, true)
      const report = yield* apply(recoveryPlan, fixture.target)
      assert.isTrue(report.ok)
      assert.deepStrictEqual(
        readJson(fixture.target, recoveryPlan.contractPath),
        recoveryPlan.contract as unknown as Record<string, unknown>,
      )
    }), PinTestTimeout)

  it.effect('materializes internal gitlinks as opaque upstream entries without following them', () =>
    Effect.gen(function* () {
      const fixture = makeGitFixture()
      const gitlinkRevision = '52168999f3dcfc9205432d47f6f600051f02f1a2'
      git(fixture.upstream, [
        'update-index',
        '--add',
        '--info-only',
        '--cacheinfo',
        `160000,${gitlinkRevision},nested`,
      ])
      git(fixture.upstream, ['commit', '-m', 'opaque gitlink'])
      const plan = yield* buildPinPlan(addPlanOptions(fixture))
      const report = yield* apply(plan, fixture.target)
      assert.isTrue(report.ok)
      assert.include(
        git(fixture.target, ['ls-files', '--stage', '--', 'repos/upstream/nested']),
        `160000 ${gitlinkRevision}`,
      )
      assert.strictEqual(
        readJson(fixture.target, plan.contractPath).schemaVersion,
        2,
      )
    }), PinTestTimeout)

  it.effect('applies explicit editor decisions and preserves unrelated settings', () =>
    Effect.gen(function* () {
      const fixture = makeGitFixture()
      write(
        fixture.target,
        '.vscode/settings.json',
        `${encodeJson({ 'editor.formatOnSave': true })}\n`,
      )
      write(
        fixture.target,
        '.zed/settings.json',
        `${encodeJson({ telemetry: false })}\n`,
      )
      commitAll(fixture.target, 'editor settings')
      const plan = yield* buildPinPlan(addPlanOptions(fixture))
      yield* apply(plan, fixture.target)
      const vscode = readJson(fixture.target, '.vscode/settings.json')
      const zed = readJson(fixture.target, '.zed/settings.json')
      assert.strictEqual(vscode['editor.formatOnSave'], true)
      assert.deepStrictEqual(
        vscode['typescript.preferences.autoImportFileExcludePatterns'],
        ['repos/upstream/**'],
      )
      assert.deepStrictEqual(
        vscode['javascript.preferences.autoImportFileExcludePatterns'],
        ['repos/upstream/**'],
      )
      assert.deepStrictEqual(vscode['files.watcherExclude'], {
        'repos/upstream/**': true,
      })
      assert.deepStrictEqual(vscode['search.exclude'], {
        'repos/upstream/**': true,
      })
      assert.notProperty(vscode, 'files.exclude')
      assert.strictEqual(zed.telemetry, false)
      assert.include(encodeJson(zed), 'repos/upstream/**')
    }), PinTestTimeout)

  it.effect('accepts Effect-tsgo as the sole Zed TypeScript server', () =>
    Effect.gen(function* () {
      const fixture = makeGitFixture()
      const plan = yield* buildPinPlan(addPlanOptions(fixture))
      yield* apply(plan, fixture.target)
      write(fixture.target, '.zed/settings.json', `${encodeJson({
        lsp: {
          tsgo: {
            initialization_options: {
              preferences: {
                autoImportFileExcludePatterns: ['repos/upstream/**'],
              },
            },
          },
        },
      })}\n`)

      const report = yield* inspectPins({ name: 'upstream', root: fixture.target })

      assert.isTrue(report.ok)
      assert.deepStrictEqual(report.issues, [])
    }), PinTestTimeout)

  it.effect('hard-cuts schema version 1 instead of adapting it', () => {
    const fixture = makeGitFixture()
    write(
      fixture.target,
      'repos/upstream.subtree.json',
      `${encodeJson({ schemaVersion: 1 })}\n`,
    )
    return inspectPins({ name: 'upstream', root: fixture.target }).pipe(
      Effect.match({
        onFailure: error => assert.include(error.message, 'schemaVersion 2'),
        onSuccess: () => assert.fail('expected schema version 1 to be rejected'),
      }),
    )
  }, PinTestTimeout)

  it.effect('hard-blocks imports from the pinned prefix and exact-prefix gitlinks', () =>
    Effect.gen(function* () {
      const fixture = makeGitFixture()
      const plan = yield* buildPinPlan(addPlanOptions(fixture))
      yield* apply(plan, fixture.target)
      write(fixture.target, 'src/app.ts', 'import "../repos/upstream/value.txt"\n')
      const imported = yield* inspectPins({ name: 'upstream', root: fixture.target })
      assert.isTrue(imported.issues.some(issue => issue.code === 'pin.import_blocked'))

      git(fixture.target, ['rm', '--quiet', '-r', '--cached', 'repos/upstream'])
      git(fixture.target, [
        'update-index',
        '--add',
        '--info-only',
        '--cacheinfo',
        `160000,${plan.desiredRevision},repos/upstream`,
      ])
      const gitlinked = yield* inspectPins({ name: 'upstream', root: fixture.target })
      assert.isTrue(gitlinked.issues.some(issue => issue.code === 'pin.gitlink'))
    }), PinTestTimeout)
})

function addPlanOptions(fixture: GitFixture) {
  return {
    agentRoute: 'AGENTS.md',
    anchor: 'repos/upstream/LLMS.md',
    branch: 'main',
    name: 'upstream',
    operation: 'add' as const,
    prefix: 'repos/upstream',
    repository: GitHubRepository,
    root: fixture.target,
  }
}

function apply(plan: PinPlan, root: string) {
  return applyPinPlan({
    operation: plan.operation,
    plan,
    planHash: plan.planHash,
    revision: plan.desiredRevision,
    root,
  })
}

interface GitFixture {
  readonly revision: string
  readonly target: string
  readonly upstream: string
}

function makeGitFixture(): GitFixture {
  const base = mkdtempSync(join(tmpdir(), 'partita-pin-lifecycle-'))
  const upstream = join(base, 'upstream')
  const target = join(base, 'target')
  mkdirSync(upstream, { recursive: true })
  mkdirSync(target, { recursive: true })
  initRepository(upstream)
  write(upstream, 'LLMS.md', '# Upstream reference\n')
  write(upstream, 'value.txt', 'one\n')
  commitAll(upstream, 'first')
  const revision = git(upstream, ['rev-parse', 'HEAD']).trim()

  initRepository(target)
  write(target, 'AGENTS.md', '# Agent route\n')
  commitAll(target, 'initial target')
  git(target, ['config', `url.${upstream}.insteadOf`, GitHubRepository])
  return { revision, target, upstream }
}

function initRepository(root: string) {
  git(root, ['init', '--quiet', '--initial-branch=main'])
  git(root, ['config', 'user.email', 'partita@example.invalid'])
  git(root, ['config', 'user.name', 'Partita Test'])
}

function commitAll(root: string, message: string) {
  git(root, ['add', '--all'])
  git(root, ['commit', '--quiet', '-m', message])
}

function git(root: string, args: ReadonlyArray<string>): string {
  return execFileSync('git', [...args], { cwd: root, encoding: 'utf8' })
}

function read(root: string, path: string): string {
  return readFileSync(join(root, path), 'utf8')
}

function readJson(root: string, path: string): Record<string, unknown> {
  return Schema.decodeUnknownSync(Schema.UnknownFromJsonString)(
    read(root, path),
  ) as Record<string, unknown>
}

function encodeJson(value: unknown): string {
  return Schema.encodeSync(Schema.UnknownFromJsonString)(value)
}

function write(root: string, path: string, contents: string) {
  const absolutePath = join(root, path)
  mkdirSync(dirname(absolutePath), { recursive: true })
  writeFileSync(absolutePath, contents)
}
