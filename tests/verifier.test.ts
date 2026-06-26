import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { assert, describe, it } from '@effect/vitest'
import * as Effect from 'effect/Effect'
import { verifyPackageStage } from '../src/partita/package-verify.ts'
import { verifyRouting, verifySourceProject } from '../src/partita/verifier.ts'

const marker = '🧭'

const requiredWikiFiles = [
  'wiki/index.md',
  'wiki/harness/index.md',
  'wiki/skill/index.md',
  'wiki/skill/assertion.md',
  'wiki/skill/primitive.md',
  'wiki/skill/orchestrator.md',
  'wiki/skill/case/index.md',
  'wiki/skill/case/pattern.md',
  'wiki/skill/case/pressure.md',
  'wiki/skill/governance/index.md',
  'wiki/skill/governance/identity.md',
  'wiki/skill/lifecycle/index.md',
  'wiki/workflow/index.md',
  'wiki/workflow/gate/index.md',
  'wiki/workflow/gate/contract.md',
  'wiki/workflow/gate/span.md',
  'wiki/projection/index.md',
  'wiki/projection/codex/index.md',
  'wiki/projection/codex/dispatcher.md',
  'wiki/projection/verifier/index.md',
  'wiki/practice/index.md',
  'wiki/practice/create.md',
  'wiki/practice/patch.md',
  'wiki/practice/audit.md',
  'wiki/collaboration/index.md',
  'wiki/documentation/index.md',
  'wiki/vocabulary/index.md',
] as const

describe('Partita verifier', () => {
  it.effect('accepts a valid source fixture', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      const report = yield* verifySourceProject({ root })

      assert.isTrue(report.ok)
      assert.deepStrictEqual(report.issues, [])
    }))

  it.effect('reports skill contract drift', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, 'skills/demo/SKILL.md', [
        '---',
        'name: demo',
        'description: too short',
        '---',
        '',
        '# Demo',
      ].join('\n'))

      const report = yield* verifySourceProject({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('skill.description_too_short'))
      assert.isTrue(codes.includes('skill.missing_marker'))
      assert.isTrue(codes.includes('skill.missing_contract_sections'))
      assert.isTrue(codes.includes('skill.missing_primitive_audit'))
      assert.isTrue(codes.includes('skill.hard_boundary_wording'))
    }))

  it.effect('reports dispatcher routing drift', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, 'skills/DISPATCHER.md', [
        '# Partita Dispatcher',
        '',
        `Prefix with ${marker}.`,
        '',
        '| Skill | Description | File |',
        '| --- | --- | --- |',
        '| missing | Missing skill fixture | `skills/missing/SKILL.md` |',
      ].join('\n'))

      const report = yield* verifyRouting({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('routing.missing_skill_refs'))
      assert.isTrue(codes.includes('routing.stale_skill_refs'))
    }))

  it.effect('reports OpenAI invocation policy drift', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, 'skills/demo/SKILL.md', validSkill().replace('`invocation: implicit`', '`invocation: explicit`'))
      write(root, 'skills/demo/agents/openai.yaml', [
        'interface:',
        '  display_name: "Demo"',
        '  short_description: "Demo skill fixture"',
        'policy:',
        '  allow_implicit_invocation: true',
      ].join('\n'))

      const report = yield* verifySourceProject({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('openai_metadata.explicit_allows_implicit'))
    }))

  it.effect('validates package stage boundaries', () =>
    Effect.gen(function* () {
      const stage = makeValidPackageStage()
      write(stage, 'SKILL.md', '# Root skill is forbidden\n')
      write(stage, 'skills/RESOLVER.md', '# Removed resolver\n')
      mkdirSync(join(stage, 'rules'), { recursive: true })
      mkdirSync(join(stage, 'theory'), { recursive: true })
      mkdirSync(join(stage, '.claude-plugin'), { recursive: true })

      const report = yield* verifyPackageStage({ stage })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('package.root_skill_forbidden'))
      assert.isTrue(codes.includes('package.resolver_forbidden'))
      assert.isTrue(codes.includes('package.rules_forbidden'))
      assert.isTrue(codes.includes('package.theory_forbidden'))
      assert.isTrue(codes.includes('package.claude_plugin_forbidden'))
    }))
})

function makeValidSourceFixture(): string {
  const root = mkdtempSync(join(tmpdir(), 'partita-verifier-'))
  write(root, 'VERSION', '0.1.0\n')
  write(root, '.codex-plugin/plugin.json', JSON.stringify({
    name: 'partita',
    version: '0.1.0',
    skills: './skills/',
    interface: {
      displayName: 'Partita',
      shortDescription: 'A Codex skill harness for user-defined workflows',
      longDescription: 'Partita verifies user-defined Codex workflow skills.',
      developerName: 'sayori',
      category: 'Developer Tools',
      capabilities: ['Interactive'],
      defaultPrompt: ['Add a custom Partita skill'],
    },
  }, null, 2))

  for (const path of requiredWikiFiles) {
    write(root, path, `# ${path}\n`)
  }

  write(root, 'skills/demo/SKILL.md', validSkill())
  write(root, 'skills/DISPATCHER.md', dispatcher())
  return root
}

function makeValidPackageStage(): string {
  const stage = mkdtempSync(join(tmpdir(), 'partita-package-'))
  write(stage, '.codex-plugin/plugin.json', JSON.stringify({
    name: 'partita',
    skills: './skills/',
  }, null, 2))
  mkdirSync(join(stage, 'skills'), { recursive: true })
  mkdirSync(join(stage, 'wiki'), { recursive: true })
  return stage
}

function validSkill(): string {
  return [
    '---',
    'name: demo',
    'description: "Use when verifying Partita skill shape in tests. Not for production routing or broad behavior."',
    '---',
    '',
    '# Demo',
    '',
    `Prefix your first user-facing line with ${marker} inline when this Partita skill is active.`,
    '',
    '## Capability',
    '',
    'Verify the fixture behavior.',
    '',
    'Pressure scenario: tests need a realistic skill contract.',
    '',
    '## Trigger',
    '',
    'Use when the verifier tests need a valid skill.',
    '',
    '## Soft Boundary',
    '',
    'Primitive audit: `demo` is `stateless`, `activation: narrow`, `invocation: implicit`, and `duration: turn`.',
    '',
    '## Hard Boundary',
    '',
    'This shape has no primitive `constraint.hard` until machine-checkable enforcement exists.',
    '',
    '## Workflow',
    '',
    '1. Run the verifier.',
    '',
    '## Validation',
    '',
    'The verifier passes.',
  ].join('\n')
}

function dispatcher(): string {
  return [
    '# Partita Dispatcher',
    '',
    `Prefix with ${marker} when a Partita skill is active.`,
    '',
    '| Skill | Description | File |',
    '| --- | --- | --- |',
    '| demo | Demo skill fixture | `skills/demo/SKILL.md` |',
  ].join('\n')
}

function write(root: string, path: string, contents: string) {
  const absolutePath = join(root, path)
  mkdirSync(dirname(absolutePath), { recursive: true })
  writeFileSync(absolutePath, contents)
}
