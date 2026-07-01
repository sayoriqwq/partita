import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { assert, describe, it } from '@effect/vitest'
import * as Effect from 'effect/Effect'
import { verifyRouting, verifySourceProject } from '../src/partita/verifier.ts'

const marker = '🧭'

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
    }))

  it.effect('reports description selector contract drift', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, 'skills/demo/SKILL.md', validSkill().replace(
        'Use when verifying Partita skill shape in tests. Not for production routing or broad behavior.',
        'Demo verifies Partita skill shape in tests. This is useful for routing fixtures.',
      ))

      const report = yield* verifySourceProject({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('skill.description_selector_prefix'))
      assert.isTrue(codes.includes('skill.description_activation_surface'))
    }))

  it.effect('reports long or polluted skill descriptions', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      const repeatedSelector = 'a precise selector phrase '.repeat(20)
      const longDescription = `Use when ${repeatedSelector}requires verifier coverage. Not for unrelated routing. Always use the best recommended path.`
      write(root, 'skills/demo/SKILL.md', validSkill().replace(
        'Use when verifying Partita skill shape in tests. Not for production routing or broad behavior.',
        longDescription,
      ))

      const report = yield* verifySourceProject({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('skill.description_too_long'))
      assert.isTrue(codes.includes('skill.description_scheduling_pollution'))
    }))

  it.effect('reports dispatcher routing drift', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, 'harness/skills/dispatcher.md', [
        '# Dispatcher',
        '',
        '<!-- partita:projection:start id="routing-table" source="skills" mode="block-table" -->',
        '| Handle | Name | Invocation | Description | File |',
        '| --- | --- | --- | --- | --- |',
        '| missing | missing | true | Missing skill fixture | `skills/missing/SKILL.md` |',
        '<!-- partita:projection:end id="routing-table" -->',
      ].join('\n'))

      const report = yield* verifyRouting({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('routing.missing_skill_refs'))
      assert.isTrue(codes.includes('routing.stale_skill_refs'))
    }))

  it.effect('rejects dispatcher under skills', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, 'skills/DISPATCHER.md', dispatcher())

      const report = yield* verifySourceProject({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('routing.legacy_dispatcher_path'))
    }))

  it.effect('accepts supported namespace skill handles', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, 'skills/expression/density/SKILL.md', validSkill().replace('name: demo', 'name: density').replace('🧭', '💬'))
      write(root, 'skills/expression/density/agents/openai.yaml', validOpenAiMetadata())
      write(root, 'skills/link/pin/SKILL.md', validSkill().replace('name: demo', 'name: pin').replace('🧭', '🔗'))
      write(root, 'skills/link/pin/agents/openai.yaml', validOpenAiMetadata())
      write(root, 'skills/orientation/argue/SKILL.md', validSkill().replace('name: demo', 'name: argue'))
      write(root, 'skills/orientation/argue/agents/openai.yaml', validOpenAiMetadata())
      write(root, 'skills/maintenance/reconcile/SKILL.md', validSkill().replace('name: demo', 'name: reconcile'))
      write(root, 'skills/maintenance/reconcile/agents/openai.yaml', validOpenAiMetadata())
      write(root, 'skills/primitive/notate/SKILL.md', validSkill().replace('name: demo', 'name: notate'))
      write(root, 'skills/primitive/notate/agents/openai.yaml', validOpenAiMetadata())
      write(root, 'harness/skills/dispatcher.md', [
        '# Dispatcher',
        '',
        '<!-- partita:projection:start id="routing-table" source="skills" mode="block-table" -->',
        '| Handle | Name | Invocation | Description | File |',
        '| --- | --- | --- | --- | --- |',
        '| demo | demo | true | Demo skill fixture | `skills/demo/SKILL.md` |',
        '| ex:density | density | true | Demo skill fixture | `skills/expression/density/SKILL.md` |',
        '| lk:pin | pin | true | Demo skill fixture | `skills/link/pin/SKILL.md` |',
        '| mt:reconcile | reconcile | true | Demo skill fixture | `skills/maintenance/reconcile/SKILL.md` |',
        '| og:argue | argue | true | Argue skill fixture | `skills/orientation/argue/SKILL.md` |',
        '| pm:notate | notate | true | Notate skill fixture | `skills/primitive/notate/SKILL.md` |',
        '<!-- partita:projection:end id="routing-table" -->',
      ].join('\n'))

      const report = yield* verifySourceProject({ root })

      assert.isTrue(report.ok)
      assert.deepStrictEqual(report.issues, [])
    }))

  it.effect('reports legacy skill section drift', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, 'skills/demo/SKILL.md', validSkill().replace('## Rule', '## Capability'))

      const report = yield* verifySourceProject({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('skill.missing_contract_sections'))
      assert.isTrue(codes.includes('skill.legacy_section'))
    }))

  it.effect('reports missing OpenAI metadata for implicit skills', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      rmSync(join(root, 'skills/demo/agents/openai.yaml'))

      const report = yield* verifySourceProject({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('openai_metadata.missing'))
    }))

  it.effect('reports invocation policy outside the policy block', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, 'skills/demo/agents/openai.yaml', [
        'interface:',
        '  display_name: "Demo"',
        '  short_description: "Demo skill fixture"',
        '  default_prompt: "Use $demo for verifier tests."',
        'allow_implicit_invocation: true',
      ].join('\n'))

      const report = yield* verifySourceProject({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('openai_metadata.policy_location'))
      assert.isTrue(codes.includes('openai_metadata.policy_missing'))
      assert.isTrue(codes.includes('openai_metadata.missing_invocation_policy'))
    }))

  it.effect('reports unsupported skill directory shape', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, 'skills/demo/README.md', '# Unsupported docs\n')
      write(root, 'skills/demo/references/nested/case.md', '# Nested case\n')
      write(root, 'skills/demo/scripts', '# Not a directory\n')

      const report = yield* verifySourceProject({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('skill_shape.unsupported_entry'))
      assert.isTrue(codes.includes('skill_shape.unsupported_reference'))
      assert.isTrue(codes.includes('skill_shape.invalid_scripts_dir'))
    }))

  it.effect('accepts official bundled resource directories', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, 'skills/demo/agents/custom.yaml', 'custom: true\n')
      write(root, 'skills/demo/scripts/run.py', 'print("ok")\n')
      write(root, 'skills/demo/references/schema.txt', 'reference\n')
      write(root, 'skills/demo/assets/template/README.md', '[asset link](missing.md)\n')

      const report = yield* verifySourceProject({ root })

      assert.isTrue(report.ok)
      assert.deepStrictEqual(report.issues, [])
    }))

  it.effect('reports removed source surfaces', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, 'VERSION', '0.1.0\n')
      write(root, 'AGENTS.profile.md', '# Removed profile\n')
      write(root, 'packaging.allowlist', 'README.md\n')
      write(root, 'skills/RESOLVER.md', '# Removed resolver\n')
      write(root, 'skills/skill-write/SKILL.md', validSkill().replace('name: demo', 'name: skill-write'))
      write(root, 'skills/skill-patch/SKILL.md', validSkill().replace('name: demo', 'name: skill-patch'))
      write(root, 'src/partita/packager.ts', 'export {}\n')
      write(root, 'src/partita/package-verify.ts', 'export {}\n')
      write(root, 'tests/packager.test.ts', 'export {}\n')
      write(root, '.codex-plugin/plugin.json', '{}\n')
      write(root, 'CLAUDE.md', '# Removed Claude projection\n')
      write(root, 'CONTEXT.md', '# Removed context map\n')
      write(root, 'HARNESS.md', '# Removed harness map\n')
      write(root, 'packages/wiki/index.md', '# Migrated wiki\n')
      write(root, 'runtime/references/skill/case.md', '# Migrated runtime reference\n')
      write(root, 'harness/skills/checks.md', '# Migrated harness reference\n')
      mkdirSync(join(root, 'rules'), { recursive: true })
      mkdirSync(join(root, 'theory'), { recursive: true })
      mkdirSync(join(root, 'wiki'), { recursive: true })

      const report = yield* verifySourceProject({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('surface.removed_exists'))
    }))

  it.effect('reports legacy projection markers', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, 'harness/skills/dispatcher.md', [
        '# Dispatcher',
        '',
        '<!-- routing-table:start -->',
        '| Skill | Description | File |',
        '| --- | --- | --- |',
        '| demo | Demo skill fixture | `skills/demo/SKILL.md` |',
        '<!-- routing-table:end -->',
      ].join('\n'))

      const report = yield* verifySourceProject({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('projection.legacy_marker'))
      assert.isTrue(codes.includes('routing.missing_projection_marker'))
    }))

  it.effect('reports file projection drift', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, 'skills/demo/references/insufficient-material.md', [
        '<!-- partita:projection:file source="reference-source/insufficient-material.md" mode="copy" -->',
        '',
        '# stale',
      ].join('\n'))

      const report = yield* verifySourceProject({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('projection.file_drift'))
    }))
})

function makeValidSourceFixture(): string {
  const root = mkdtempSync(join(tmpdir(), 'partita-verifier-'))
  write(root, 'package.json', JSON.stringify({ version: '0.1.0' }))
  write(root, 'reference-source/insufficient-material.md', '# 材料不足\n\nMUST 打回。\n')

  write(root, 'skills/demo/SKILL.md', validSkill())
  write(root, 'skills/demo/agents/openai.yaml', validOpenAiMetadata())
  write(root, 'harness/skills/dispatcher.md', dispatcher())
  return root
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
    '## Rule',
    '',
    'Facing Partita verifier fixture work, first run the local shape check, to avoid accepting invalid skill projections.',
    '',
    '## Pattern',
    '',
    'Use when:',
    '',
    '- the verifier tests need a valid skill.',
    '',
    'Do not use when:',
    '',
    '- production routing or broad behavior is being tested.',
    '',
    '## Boundary',
    '',
    'Soft:',
    '',
    '- Keep the fixture focused on verifier behavior.',
    '',
    'Hard:',
    '',
    '- Run `partita verify` against the fixture.',
    '',
    '## Effects',
    '',
    '- Conversation: may report verifier results.',
    '- Filesystem: none.',
    '- External: none.',
    '',
    '## Workflow',
    '',
    '1. Run the verifier.',
    '',
    '## References',
    '',
    '- No references.',
    '',
    '## Validation',
    '',
    'Before done:',
    '',
    '- the fixture pattern was matched;',
    '- the verifier rule was applied;',
    '- invalid skill projections were avoided;',
    '- effects stayed at none for filesystem and external services;',
    '- hard checks passed.',
  ].join('\n')
}

function validOpenAiMetadata(): string {
  return [
    'interface:',
    '  display_name: "Demo"',
    '  short_description: "Demo skill fixture"',
    '  default_prompt: "Use $demo for verifier tests."',
    'policy:',
    '  allow_implicit_invocation: true',
  ].join('\n')
}

function dispatcher(): string {
  return [
    '# Dispatcher',
    '',
    '<!-- partita:projection:start id="routing-table" source="skills" mode="block-table" -->',
    '| Handle | Name | Invocation | Description | File |',
    '| --- | --- | --- | --- | --- |',
    '| demo | demo | true | Demo skill fixture | `skills/demo/SKILL.md` |',
    '<!-- partita:projection:end id="routing-table" -->',
  ].join('\n')
}

function write(root: string, path: string, contents: string) {
  const absolutePath = join(root, path)
  mkdirSync(dirname(absolutePath), { recursive: true })
  writeFileSync(absolutePath, contents)
}
