import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { assert, describe, it } from '@effect/vitest'
import * as Effect from 'effect/Effect'

import { validateSkillFolder, validateSkillText } from '../src/partita/skill-validation.ts'

describe('official skill validation', () => {
  it.effect('accepts official optional frontmatter keys', () => Effect.sync(() => {
    const report = validateSkillText([
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
    const report = validateSkillText([
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
    assert.isTrue(codes.includes('skill_validation.unexpected_frontmatter_key'))
    assert.isTrue(codes.includes('skill_validation.name_format'))
    assert.isTrue(codes.includes('skill_validation.description_angle_bracket'))
  }))

  it.effect('validates a skill folder has SKILL.md', () => Effect.sync(() => {
    const root = mkdtempSync(join(tmpdir(), 'partita-skill-validation-'))
    const report = validateSkillFolder(root)

    assert.isFalse(report.ok)
    assert.strictEqual(report.issues[0]?.code, 'skill_validation.skill_md_missing')

    writeFileSync(join(root, 'SKILL.md'), [
      '---',
      'name: folder-skill',
      'description: "Use when folder skill validation is needed. Not for unrelated work."',
      '---',
      '',
      '# Folder Skill',
    ].join('\n'))
    const validReport = validateSkillFolder(root)

    assert.isTrue(validReport.ok)
  }))
})
