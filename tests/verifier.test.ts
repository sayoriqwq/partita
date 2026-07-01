import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { assert, describe, it } from '@effect/vitest'
import * as Effect from 'effect/Effect'
import {
  verifyPartitaSourceSkills,
  verifyRuntimeSkills,
  verifySourceProject,
} from '../src/partita/verifier.ts'

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
      assert.isTrue(codes.includes('partita_skill.description_too_short'))
      assert.isTrue(codes.includes('partita_skill.missing_marker'))
      assert.isTrue(codes.includes('partita_skill.missing_contract_sections'))
    }))

  it.effect('reports description selector contract drift', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, 'skills/demo/SKILL.md', validSkill().replace(
        'Use when verifying Partita skill shape in tests. Not for production behavior or broad review.',
        'Demo verifies Partita skill shape in tests. This is useful for source fixtures.',
      ))

      const report = yield* verifySourceProject({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('partita_skill.description_selector_prefix'))
      assert.isTrue(codes.includes('partita_skill.description_activation_surface'))
    }))

  it.effect('reports long or polluted skill descriptions', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      const repeatedSelector = 'a precise selector phrase '.repeat(20)
      const longDescription = `Use when ${repeatedSelector}requires verifier coverage. Not for unrelated work. Always use the best recommended path.`
      write(root, 'skills/demo/SKILL.md', validSkill().replace(
        'Use when verifying Partita skill shape in tests. Not for production behavior or broad review.',
        longDescription,
      ))

      const report = yield* verifySourceProject({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('partita_skill.description_too_long'))
      assert.isTrue(codes.includes('partita_skill.description_scheduling_pollution'))
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
      assert.isTrue(codes.includes('partita_skill.missing_contract_sections'))
      assert.isTrue(codes.includes('partita_skill.legacy_section'))
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
      assert.isTrue(codes.includes('openai_skill_shape.unsupported_entry'))
      assert.isTrue(codes.includes('openai_skill_shape.unsupported_reference'))
      assert.isTrue(codes.includes('openai_skill_shape.invalid_scripts_dir'))
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
      write(root, 'CLAUDE.md', '# Removed Claude instruction\n')
      write(root, 'CONTEXT.md', '# Removed context map\n')
      write(root, 'HARNESS.md', '# Removed harness map\n')
      write(root, 'packages/wiki/index.md', '# Migrated wiki\n')
      write(root, 'runtime/references/skill/case.md', '# Migrated runtime reference\n')
      write(root, 'harness/skills/checks.md', '# Migrated harness reference\n')
      write(root, 'docs/skills/theory.md', '# Removed docs baseline\n')
      write(root, 'harness/skills/dispatcher.md', '# Removed dispatcher\n')
      write(root, 'partita.materialize.json', '{}\n')
      write(root, 'MIGRATION.md', '# Removed migration baseline\n')
      mkdirSync(join(root, 'rules'), { recursive: true })
      mkdirSync(join(root, 'theory'), { recursive: true })
      mkdirSync(join(root, 'wiki'), { recursive: true })

      const report = yield* verifySourceProject({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('surface.removed_exists'))
    }))

  it.effect('keeps runtime, source, and project verification as separate layers', () =>
    Effect.gen(function* () {
      const root = mkdtempSync(join(tmpdir(), 'partita-verifier-levels-'))
      write(root, 'package.json', JSON.stringify({ version: '0.1.0' }))
      write(root, 'skills/demo/SKILL.md', [
        '---',
        'name: demo',
        'description: "Use when demo validation is needed. Not for unrelated work."',
        '---',
        '',
        '# Demo',
      ].join('\n'))

      const runtimeReport = yield* verifyRuntimeSkills({ root })
      const sourceReport = yield* verifyPartitaSourceSkills({ root })
      const projectReport = yield* verifySourceProject({ level: 'project', root })
      const sourceCodes = sourceReport.issues.map(issue => issue.code)
      const projectCodes = projectReport.issues.map(issue => issue.code)

      assert.isTrue(runtimeReport.ok)
      assert.isFalse(sourceReport.ok)
      assert.isTrue(sourceCodes.includes('partita_skill.missing_marker'))
      assert.isTrue(sourceCodes.includes('partita_skill.missing_contract_sections'))
      assert.isTrue(sourceCodes.includes('openai_metadata.missing'))
      assert.isFalse(projectReport.ok)
      assert.isTrue(projectCodes.includes('partita_skill.missing_marker'))
      assert.isTrue(projectCodes.includes('openai_metadata.missing'))
    }))
})

function makeValidSourceFixture(): string {
  const root = mkdtempSync(join(tmpdir(), 'partita-verifier-'))
  write(root, 'package.json', JSON.stringify({ version: '0.1.0' }))

  write(root, 'skills/demo/SKILL.md', validSkill())
  write(root, 'skills/demo/agents/openai.yaml', validOpenAiMetadata())
  return root
}

function validSkill(): string {
  return [
    '---',
    'name: demo',
    'description: "Use when verifying Partita skill shape in tests. Not for production behavior or broad review."',
    '---',
    '',
    '# Demo',
    '',
    `Prefix your first user-facing line with ${marker} inline when this Partita skill is active.`,
    '',
    '## Rule',
    '',
    'Facing Partita verifier fixture work, first run the local shape check, to avoid accepting invalid skill source shape.',
    '',
    '## Pattern',
    '',
    'Use when:',
    '',
    '- the verifier tests need a valid skill.',
    '',
    'Do not use when:',
    '',
    '- production behavior or broad review is being tested.',
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
    '- invalid skill source shape was avoided;',
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

function write(root: string, path: string, contents: string) {
  const absolutePath = join(root, path)
  mkdirSync(dirname(absolutePath), { recursive: true })
  writeFileSync(absolutePath, contents)
}
