import { assert, describe, it } from '@effect/vitest'
import {
  projectSkillForm,
  validateInvocationSelectorEnglish,
} from '../src/partita/projection.ts'

describe('Partita projection', () => {
  it('projects identity from slug, family, and title', () => {
    const projection = projectSkillForm({
      identity: {
        family: 'primitive',
        slug: 'notate',
        title: 'Notate',
      },
      invocation: {
        policy: {
          allowImplicitInvocation: false,
        },
        selector: {
          doNotUseWhen: [
            'creating public workflow skills',
            'patching an existing identity-valid skill',
          ],
          useWhen: [
            'creating a case-rooted Partita skill from an evidence-anchored skill case',
          ],
        },
      },
    })

    assert.deepStrictEqual(projection.identity, {
      acceptedMarkers: ['🎼 notate'],
      displayName: 'Notate',
      family: 'primitive',
      handle: 'pm:notate',
      marker: '🎼 notate',
      slug: 'notate',
      sourcePath: 'skills/primitive/notate/',
      title: 'Notate',
    })
  })

  it('projects non-primitive markers using the family marker convention', () => {
    const projection = projectSkillForm({
      identity: {
        family: 'orientation',
        slug: 'argue',
        title: 'Argue',
      },
      invocation: {
        policy: {
          allowImplicitInvocation: false,
        },
        selector: {
          doNotUseWhen: [
            'ordinary implementation',
          ],
          useWhen: [
            'pressure-testing an unstable assertion',
          ],
        },
      },
    })

    assert.strictEqual(projection.identity.marker, '🧭')
    assert.deepStrictEqual(projection.identity.acceptedMarkers, ['🧭', '🧭 argue'])
  })

  it('projects invocation into frontmatter, pattern, and OpenAI metadata', () => {
    const projection = projectSkillForm({
      identity: {
        family: 'primitive',
        slug: 'notate',
        title: 'Notate',
      },
      invocation: {
        policy: {
          allowImplicitInvocation: false,
        },
        selector: {
          doNotUseWhen: [
            'creating public workflow skills',
            'patching an existing identity-valid skill',
          ],
          useWhen: [
            'creating a case-rooted Partita skill from an evidence-anchored skill case',
            'using a confirmed case to create a new source skill',
          ],
        },
      },
    })

    assert.strictEqual(
      projection.skillFrontmatter.description,
      'Use when creating a case-rooted Partita skill from an evidence-anchored skill case. Not for creating public workflow skills; patching an existing identity-valid skill.',
    )
    assert.deepStrictEqual(projection.skillBody.pattern, {
      doNotUseWhen: [
        'creating public workflow skills',
        'patching an existing identity-valid skill',
      ],
      useWhen: [
        'creating a case-rooted Partita skill from an evidence-anchored skill case',
        'using a confirmed case to create a new source skill',
      ],
    })
    assert.deepStrictEqual(projection.openAiMetadata, {
      interface: {
        defaultPrompt: 'Use pm:notate when creating a case-rooted Partita skill from an evidence-anchored skill case.',
        displayName: 'Notate',
        shortDescription: 'Creating a case-rooted Partita skill from an evidence-anchored skill case',
      },
      policy: {
        allowImplicitInvocation: false,
      },
    })
  })

  it('reports non-English invocation selector text', () => {
    const issues = validateInvocationSelectorEnglish({
      doNotUseWhen: [
        '创建 public workflow skill',
      ],
      useWhen: [
        'creating a case-rooted Partita skill',
      ],
    })

    assert.deepStrictEqual(issues, [
      'do_not_use_when[0] must be English selector text',
    ])
  })
})
