import { NodeFileSystem } from '@effect/platform-node'
import { assert, describe, it } from '@effect/vitest'
import { FileSystem } from 'effect'
import * as Effect from 'effect/Effect'

import { validateOpenAiSkillFolder, validateOpenAiSkillText } from '../src/partita/openai-skill-validation.ts'

describe('official skill validation', () => {
  it.effect('accepts official optional frontmatter keys', () => Effect.sync(() => {
    const report = validateOpenAiSkillText([
      '---',
      'name: demo-skill',
      'description: "Use when demo validation is needed. Not for unrelated work."',
      'license: MIT',
      'allowed-tools:',
      '  - web',
      'metadata:',
      '  short-description: "Demo skill"',
      '---',
      '',
      '# Demo Skill',
    ].join('\n'))

    assert.isTrue(report.ok)
    assert.deepStrictEqual(report.fields, {
      name: 'demo-skill',
      description: 'Use when demo validation is needed. Not for unrelated work.',
    })
  }))

  it.effect('reports official name and description violations', () => Effect.sync(() => {
    const report = validateOpenAiSkillText([
      '---',
      'name: Bad_Name',
      'description: "Use when <demo> validation is needed."',
      'extra: true',
      '---',
      '',
      '# Bad Skill',
    ].join('\n'))
    const codes = report.issues.map(issue => issue.code)

    assert.isFalse(report.ok)
    assert.isTrue(codes.includes('openai_skill.unexpected_frontmatter_key'))
    assert.isTrue(codes.includes('openai_skill.name_format'))
    assert.isTrue(codes.includes('openai_skill.description_angle_bracket'))
  }))

  it.effect('validates a skill folder has SKILL.md', () =>
    Effect.scoped(Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem
      const root = yield* fs.makeTempDirectoryScoped({ prefix: 'partita-openai-skill-validation-' })
      const report = yield* validateOpenAiSkillFolder(root)

      assert.isFalse(report.ok)
      assert.strictEqual(report.issues[0]?.code, 'openai_skill.skill_md_missing')

      yield* fs.writeFileString(`${root}/SKILL.md`, [
        '---',
        'name: folder-skill',
        'description: "Use when folder skill validation is needed. Not for unrelated work."',
        '---',
        '',
        '# Folder Skill',
      ].join('\n'))
      const validReport = yield* validateOpenAiSkillFolder(root)

      assert.isTrue(validReport.ok)
    }).pipe(Effect.provide(NodeFileSystem.layer))))
})
