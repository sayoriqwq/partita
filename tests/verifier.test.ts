import * as NodeServices from '@effect/platform-node/NodeServices'
import { assert, layer } from '@effect/vitest'
import * as Effect from 'effect/Effect'
import * as FileSystem from 'effect/FileSystem'
import * as Layer from 'effect/Layer'
import * as Schema from 'effect/Schema'
import {
  primitiveReferenceCopySpecs,
  syncPrimitiveReferences,
} from '../src/partita/primitive.ts'
import {
  verifyPartitaSourceSkills,
  verifyRuntimeSkills,
  verifySourceProject,
} from '../src/partita/verifier.ts'

const { execFileSync } = process.getBuiltinModule('node:child_process')
const { createHash } = process.getBuiltinModule('node:crypto')
const { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } = process.getBuiltinModule('node:fs')
const { tmpdir } = process.getBuiltinModule('node:os')
const { dirname, join } = process.getBuiltinModule('node:path')

const marker = '🧭'

layer(NodeServices.layer)('Partita verifier', (it) => {
  it.effect('keeps score explicit invocation only', () => Effect.sync(() => {
    const metadata = readFileSync('skills/primitive/score/agents/openai.yaml', 'utf8')

    assert.include(metadata, 'policy:\n  allow_implicit_invocation: false')
  }))

  it.effect('locks composition-only creation routing and native Density interruption', () => Effect.sync(() => {
    const agents = readFileSync('AGENTS.md', 'utf8')
    const conduct = readFileSync('skills/primitive/conduct/SKILL.md', 'utf8')
    const workflowCreation = readFileSync('skills/primitive/conduct/references/workflow-creation.md', 'utf8')
    const notate = readFileSync('skills/primitive/notate/SKILL.md', 'utf8')
    const density = readFileSync('skills/expression/density/SKILL.md', 'utf8')

    assert.include(agents, 'Primitive 的 implementation 不调用 Skill；Workflow 的 implementation 调用一个或多个 predeclared Skills')
    assert.include(agents, '这属于 Workflow composition，不是 component 的 top-level implicit invocation')
    assert.include(conduct, '调用零个 Skill 是 Primitive；调用一个或多个 Skill 是 Workflow')
    assert.include(workflowCreation, '`components` MUST 是 nonempty、closed、finite set')
    assert.include(notate, '零 calls 是 Primitive，继续创建；一个或多个 predeclared calls 是 Workflow')
    assert.notInclude(workflowCreation, '`state primitive`')
    assert.notInclude(workflowCreation, '`protocol primitive`')
    assert.notInclude(workflowCreation, '`router`')
    assert.notInclude(density, 'Cancelled')
    assert.include(density, 'native interruption semantics')
  }))

  it.effect('keeps recall read-only while retune owns existing-skill patches', () => Effect.sync(() => {
    const recall = readFileSync('skills/primitive/recall/SKILL.md', 'utf8')
    const recallMetadata = readFileSync('skills/primitive/recall/agents/openai.yaml', 'utf8')
    const retune = readFileSync('skills/primitive/retune/SKILL.md', 'utf8')
    const outputTemplate = fencedBlockAfter(recall, '使用以下 envelope 交付并停止')
    const topLevelFields = [...outputTemplate.matchAll(/^([a-z_]+):/gmu)].map(match => match[1])

    assert.deepStrictEqual(topLevelFields, ['case', 'judgment'])
    assert.notInclude(outputTemplate, '\npatch:')
    assert.notInclude(outputTemplate, '\ndiff:')
    assert.include(markdownSection(recall, '## Effects', '## Workflow'), 'Filesystem: MAY 在明确 scope 内只读 Skill source 和 observable artifacts；no writes。')
    assert.include(recall, '`retune` 是 existing identity-valid Skill patch 的唯一 owner。')
    assert.include(retune, 'Filesystem: MAY 只更新 target source skill')
    assert.include(recallMetadata, 'policy:\n  allow_implicit_invocation: false')
    assert.include(
      primitiveReferenceCopySpec('primitive/case.md').targetPaths,
      'skills/primitive/recall/references/case.md',
    )
  }))

  it.effect('locks the reviewed Matt-centered diagnosis method against partial semantic weakening', () => Effect.sync(() => {
    const skill = readFileSync('skills/orientation/diagnosing-bugs/SKILL.md', 'utf8')
    const behavioralBody = markdownSection(skill, '## Rule', '## References')

    assert.strictEqual(
      sha256(behavioralBody),
      '91f8e671f40cddf1b4cfe8532529349ff7e0d9872edccecc60ed66363ae0b605',
    )
  }))

  it.effect('pins the audited Matt source identities while bounding the Partita lifecycle shell', () => Effect.sync(() => {
    const skill = readFileSync('skills/orientation/diagnosing-bugs/SKILL.md', 'utf8')
    const metadata = readFileSync('skills/orientation/diagnosing-bugs/agents/openai.yaml', 'utf8')
    const provenance = readFileSync('skills/orientation/diagnosing-bugs/references/source-provenance.md', 'utf8')
    const sourceRevision = '84fdeffd12f2ee307994d1eb6feb48173b6e0502'
    const sourceRevisions = [...provenance.matchAll(/github\.com\/mattpocock\/skills\/(?:blob|tree)\/([0-9a-f]{40})/gu)]
      .map(match => match[1])

    assert.deepStrictEqual(provenanceBlobMap(provenance), {
      'docs/engineering/diagnosing-bugs.md': '4527956c59fbd73967b1e90d84f4e1a8b28621c2',
      'skills/engineering/diagnosing-bugs/SKILL.md': '7f8acf7e3c5929a557d7bf26c88a7844551e3976',
      'skills/engineering/diagnosing-bugs/agents/openai.yaml': 'a13a755a77634ce61a649a3a0d905a66d3865b35',
      'skills/engineering/diagnosing-bugs/scripts/hitl-loop.template.sh': '43daedd1bdbb47b49638c82557990fc5100d7c9c',
    })
    assert.isAbove(sourceRevisions.length, 0)
    assert.isTrue(sourceRevisions.every(revision => revision === sourceRevision))
    assert.strictEqual(countOccurrences(skill, 'provisional / case-pending'), 1)
    assert.strictEqual(countOccurrences(skill, 'Recall handoff'), 1)
    assert.include(metadata, 'policy:\n  allow_implicit_invocation: false')
  }))

  it.effect('locks the Matt-centered two-axis review against center-of-gravity drift', () => Effect.sync(() => {
    const skill = readFileSync('skills/primitive/code-review/SKILL.md', 'utf8')
    const baseline = readFileSync('skills/primitive/code-review/references/smell-baseline.md', 'utf8')
    const behavioralBody = markdownSection(skill, '## Rule', '## References')
    const reportShape = /```markdown\n([\s\S]*?)\n```/u.exec(
      skill.slice(skill.indexOf('under exactly these peer headings')),
    )?.[1] ?? ''

    assert.strictEqual(
      sha256(behavioralBody),
      '86a2d6812d7d4a6d000830c23c5623f0fd07893e6619cb4078916056fe1d6d45',
    )
    assert.strictEqual(
      sha256(baseline),
      '9f037f3f96a1fe8a83d6a1306de5bffaf7fd7b279927dabe614c68465fb837ab',
    )
    assert.deepStrictEqual(
      [...reportShape.matchAll(/^## (Standards|Spec)$/gmu)].map(match => match[1]),
      ['Standards', 'Spec'],
    )
    assert.include(behavioralBody, 'without merging, cross-axis reranking, or letting one axis mask the other')
    assert.include(behavioralBody, 'no spec available')
  }))

  it.effect('pins Matt code-review provenance and the provisional Partita lifecycle shell', () => Effect.sync(() => {
    const skill = readFileSync('skills/primitive/code-review/SKILL.md', 'utf8')
    const metadata = readFileSync('skills/primitive/code-review/agents/openai.yaml', 'utf8')
    const provenance = readFileSync('skills/primitive/code-review/references/source-provenance.md', 'utf8')
    const sourceRevision = '84fdeffd12f2ee307994d1eb6feb48173b6e0502'
    const sourceRevisions = [...provenance.matchAll(/github\.com\/mattpocock\/skills\/(?:blob|tree)\/([0-9a-f]{40})/gu)]
      .map(match => match[1])

    assert.deepStrictEqual(provenanceBlobMap(provenance), {
      'docs/engineering/code-review.md': '5cabe864334b4958764e78bf51a688367f35212f',
      'skills/engineering/code-review/SKILL.md': '2d276fe88bddd363395b4887a555769222a34975',
      'skills/engineering/code-review/agents/openai.yaml': '9076774ba327f49068db9273feceda03bfe940fa',
    })
    assert.isAbove(sourceRevisions.length, 0)
    assert.isTrue(sourceRevisions.every(revision => revision === sourceRevision))
    assert.strictEqual(countOccurrences(skill, 'provisional / case-pending'), 1)
    assert.strictEqual([...skill.matchAll(/^Recall handoff:$/gmu)].length, 1)
    assert.include(skill, 'every patch requires a later explicit retune')
    assert.include(provenance, 'Every patch to this identity-valid Skill MUST be performed through a later explicit `retune`.')
    assert.include(metadata, 'policy:\n  allow_implicit_invocation: false')
  }))

  it.effect('protects the bounded domain-modeling intervention and completion semantics', () => Effect.sync(() => {
    const skill = readFileSync('skills/primitive/domain-modeling/SKILL.md', 'utf8')
    const rule = markdownSection(skill, '## Rule', '## Pattern')
    const boundary = markdownSection(skill, '## Boundary', '## Effects')
    const workflow = markdownSection(skill, '## Workflow', '## References')
    const resultContract = fencedBlockAfter(skill, '用以下 contract 形成 bounded result')
    const resultClass = /^ {2}class: (.+)$/mu.exec(resultContract)?.[1]
    const completionMode = /^ {4}mode: (.+)$/mu.exec(resultContract)?.[1]

    assert.include(rule, '提出精确 canonical distinction 供 human meaning authority 裁决')
    assertInOrder(workflow, [
      'exactly one bounded model pressure',
      '立即点名冲突，提出一个 precise canonical distinction',
      '构造 concrete edge case',
      '只有 observable implementation claim 才 cross-check bounded relevant code',
      '交给 human meaning authority',
      '选择 exactly one result class',
      'supplied authorized target',
      '以 `handoff` completion 返回 resolved delta 与 required owner action',
      '立即归还控制',
    ])
    assert.deepStrictEqual(resultClass?.split(' | '), [
      'canonical_term_or_difference',
      'resolved_relationship',
      'code_model_conflict_plus_question',
      'adr_offered_or_rejected_by_gates',
      'no_change',
      'typed_handoff_or_blocker',
    ])
    assert.deepStrictEqual(completionMode?.split(' | '), ['persisted', 'handoff'])
    assert.include(resultContract, 'bounded_pressure: <the single entry pressure>')
    assert.include(boundary, 'human 始终是 meaning authority')
    assert.include(boundary, 'MUST NOT 把 agent proposal 写成 accepted language')
    assert.include(boundary, 'MUST NOT invent storage path')
  }))

  it.effect('pins Matt domain-modeling provenance and the reviewed Partita behavioral projection', () => Effect.sync(() => {
    const skill = readFileSync('skills/primitive/domain-modeling/SKILL.md', 'utf8')
    const metadata = readFileSync('skills/primitive/domain-modeling/agents/openai.yaml', 'utf8')
    const provenance = readFileSync('skills/primitive/domain-modeling/references/source-provenance.md', 'utf8')
    const sourceRevision = '84fdeffd12f2ee307994d1eb6feb48173b6e0502'
    const sourceRevisions = [...provenance.matchAll(/github\.com\/mattpocock\/skills\/(?:blob|tree)\/([0-9a-f]{40})/gu)]
      .map(match => match[1])

    assert.strictEqual(
      sha256(markdownSection(skill, '## Rule', '## References')),
      '8d33568421501807ea8fa827a08f420cb720903c9b034f13507c0aab8b2451c6',
    )
    assert.deepStrictEqual(provenanceBlobMap(provenance), {
      'docs/engineering/domain-modeling.md': '01d172876f08f68f492c9c38c18d30048c1bbc07',
      'skills/engineering/domain-modeling/ADR-FORMAT.md': 'da7e78ec1c220cd0aedf7ad36424c9398034f375',
      'skills/engineering/domain-modeling/CONTEXT-FORMAT.md': 'eaf2a18573f0a2d8c69ed53e29e4d9e21baf81d8',
      'skills/engineering/domain-modeling/SKILL.md': 'd0f7e1a5ccb06a7184056ff9af02b67bc77f9dda',
      'skills/engineering/domain-modeling/agents/openai.yaml': '7f1522d2f11506ee205275ab7c282aa52366ecf6',
    })
    assert.isAbove(sourceRevisions.length, 0)
    assert.isTrue(sourceRevisions.every(revision => revision === sourceRevision))
    assert.include(metadata, 'policy:\n  allow_implicit_invocation: false')
  }))

  it.effect('keeps the pinned HITL fallback byte-identical and agent-drivable', () => Effect.sync(() => {
    const helperPath = 'skills/orientation/diagnosing-bugs/scripts/hitl-loop.template.sh'
    const helper = readFileSync(helperPath)
    const output = execFileSync('bash', [helperPath], {
      encoding: 'utf8',
      input: '\ny\nsynthetic failure\n',
    })

    assert.strictEqual(gitBlobId(helper), '43daedd1bdbb47b49638c82557990fc5100d7c9c')
    assert.include(output, 'ERRORED=y')
    assert.include(output, 'ERROR_MSG=synthetic failure')
  }))

  it.effect('accepts a valid source fixture', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      const report = yield* verifySourceProject({ root })

      assert.isTrue(report.ok)
      assert.deepStrictEqual(report.issues, [])
    }))

  it.effect('reports filesystem access failures through the typed error channel', () => {
    const fixture = makeValidSourceFixture()
    const missingRoot = join(fixture, 'missing')
    return verifySourceProject({ root: missingRoot }).pipe(
      Effect.match({
        onFailure: error => assert.include(error.message, missingRoot),
        onSuccess: () => assert.fail('expected missing root to fail'),
      }),
    )
  })

  it.effect('fails source and runtime verification when the workspace root is missing', () =>
    Effect.gen(function* () {
      const fixture = makeValidSourceFixture()
      const missingRoot = join(fixture, 'missing')
      const sourceFailure = yield* Effect.flip(verifyPartitaSourceSkills({ root: missingRoot }))
      const runtimeFailure = yield* Effect.flip(verifyRuntimeSkills({ root: missingRoot }))

      assert.include(sourceFailure.message, `Stat workspace root ${missingRoot}`)
      assert.include(runtimeFailure.message, `Stat workspace root ${missingRoot}`)
    }))

  it.effect('fails source and runtime verification when the workspace root is not a directory', () =>
    Effect.gen(function* () {
      const fixture = makeValidSourceFixture()
      const fileRoot = join(fixture, 'workspace-root-file')
      writeFileSync(fileRoot, 'not a directory\n')
      const sourceFailure = yield* Effect.flip(verifyPartitaSourceSkills({ root: fileRoot }))
      const runtimeFailure = yield* Effect.flip(verifyRuntimeSkills({ root: fileRoot }))

      assert.include(sourceFailure.message, `Workspace root must be a directory: ${fileRoot}`)
      assert.include(runtimeFailure.message, `Workspace root must be a directory: ${fileRoot}`)
    }))

  it.effect('keeps zero skills as a valid source state', () =>
    Effect.gen(function* () {
      const root = mkdtempSync(join(tmpdir(), 'partita-verifier-zero-skills-'))
      const report = yield* verifyPartitaSourceSkills({ root })

      assert.isTrue(report.ok)
      assert.deepStrictEqual(report.issues, [])
    }))

  const trackedRoot = makeValidSourceFixture()
  const trackedSkillPath = join(trackedRoot, 'skills/demo/SKILL.md')
  let reads = 0
  const trackingFileSystem = Layer.effect(
    FileSystem.FileSystem,
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem
      return FileSystem.FileSystem.of({
        ...fs,
        readFileString: (path, encoding) => {
          if (path === trackedSkillPath) {
            reads += 1
          }
          return fs.readFileString(path, encoding)
        },
      })
    }),
  )

  it.layer(trackingFileSystem)((it) => {
    it.effect('acquires each source SKILL.md once during source validation', () =>
      Effect.gen(function* () {
        reads = 0
        const report = yield* verifyPartitaSourceSkills({ root: trackedRoot })
        assert.isTrue(report.ok)
        assert.strictEqual(reads, 1)
      }))
  })

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
      write(root, 'skills/expression/density/SKILL.md', validSkill().replace('name: demo', 'name: density').replace('🧭', '💬 Demo'))
      write(root, 'skills/expression/density/agents/openai.yaml', validOpenAiMetadataFor('ex:density'))
      write(root, 'skills/link/pin/SKILL.md', validSkill().replace('name: demo', 'name: pin').replace('🧭', '🔗 Demo'))
      write(root, 'skills/link/pin/agents/openai.yaml', validOpenAiMetadataFor('lk:pin'))
      write(root, 'skills/orientation/argue/SKILL.md', validSkill().replace('name: demo', 'name: argue').replace('🧭', '🧭 Demo'))
      write(root, 'skills/orientation/argue/agents/openai.yaml', validOpenAiMetadataFor('og:argue'))
      write(root, 'skills/maintenance/reconcile/SKILL.md', validSkill().replace('name: demo', 'name: reconcile').replace('🧭', '🧹 Demo'))
      write(root, 'skills/maintenance/reconcile/agents/openai.yaml', validOpenAiMetadataFor('mt:reconcile'))
      write(root, 'skills/primitive/notate/SKILL.md', validSkill().replace('name: demo', 'name: notate').replace('🧭', '🎼 Demo'))
      write(root, 'skills/primitive/notate/agents/openai.yaml', validOpenAiMetadataFor('pm:notate'))

      const report = yield* verifySourceProject({ root })

      assert.isTrue(report.ok)
      assert.deepStrictEqual(report.issues, [])
    }))

  it.effect('accepts canonical named markers and nonempty contributor display names', () =>
    Effect.gen(function* () {
      for (const validMarker of ['🧭 Argue', '🧭 Argue + Aim + Tempo', '🧭 Argue + C++']) {
        const root = makeValidSourceFixture()
        write(root, 'skills/orientation/argue/SKILL.md', namespacedSkill('argue', 'Argue', validMarker))
        write(root, 'skills/orientation/argue/agents/openai.yaml', validOpenAiMetadataFor('og:argue', 'Argue'))

        const report = yield* verifySourceProject({ root })

        assert.isTrue(report.ok, validMarker)
        assert.deepStrictEqual(report.issues, [], validMarker)
      }
    }))

  it.effect('rejects bare, wrong-primary, wrong-title, wrong-case, and empty-contributor namespace markers', () =>
    Effect.gen(function* () {
      for (const invalidMarker of ['🧭', '🔗 Argue', '🧭 Probe', '🧭 argue', '🧭 Argue + ', '🧭 Argue +  + Tempo']) {
        const root = makeValidSourceFixture()
        write(root, 'skills/orientation/argue/SKILL.md', namespacedSkill('argue', 'Argue', invalidMarker))
        write(root, 'skills/orientation/argue/agents/openai.yaml', validOpenAiMetadataFor('og:argue', 'Argue'))

        const report = yield* verifySourceProject({ root })

        assert.isFalse(report.ok, invalidMarker)
        assert.isTrue(report.issues.some(issue => issue.code === 'partita_projection.marker'), invalidMarker)
      }
    }))

  it.effect('does not let a canonical preamble decoy hide the first wrong marker declaration', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, 'skills/orientation/argue/SKILL.md', namespacedSkill('argue', 'Argue', '🧭')
        .replace('## Rule', 'The canonical marker is `🧭 Argue`.\n\n## Rule'))
      write(root, 'skills/orientation/argue/agents/openai.yaml', validOpenAiMetadataFor('og:argue', 'Argue'))

      const report = yield* verifySourceProject({ root })

      assert.isTrue(report.issues.some(issue => issue.code === 'partita_projection.marker'))
    }))

  it.effect('reports marker projection when a namespaced skill has no Markdown title', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, 'skills/orientation/argue/SKILL.md', namespacedSkill('argue', 'Argue', '🧭 Argue')
        .replace('# Argue\n', 'Argue\n'))
      write(root, 'skills/orientation/argue/agents/openai.yaml', validOpenAiMetadataFor('og:argue', 'Argue'))

      const report = yield* verifySourceProject({ root })

      assert.isTrue(report.issues.some(issue => issue.code === 'partita_projection.marker'))
    }))

  it.effect('validates the activation preamble marker even when Pattern parsing fails', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, 'skills/orientation/argue/SKILL.md', namespacedSkill('argue', 'Argue', '🧭')
        .replace('- verifying Partita skill shape in tests.', '- .'))
      write(root, 'skills/orientation/argue/agents/openai.yaml', validOpenAiMetadataFor('og:argue', 'Argue'))

      const report = yield* verifySourceProject({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.isTrue(codes.includes('partita_projection.pattern_missing_use_when'))
      assert.isTrue(codes.includes('partita_projection.marker'))
    }))

  it.effect('does not accept a canonical marker mentioned only after Rule', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, 'skills/orientation/argue/SKILL.md', namespacedSkill('argue', 'Argue', '🧭')
        .replace(
          'Facing Partita verifier fixture work,',
          'The canonical marker is `🧭 Argue`. Facing Partita verifier fixture work,',
        ))
      write(root, 'skills/orientation/argue/agents/openai.yaml', validOpenAiMetadataFor('og:argue', 'Argue'))

      const report = yield* verifySourceProject({ root })

      assert.isTrue(report.issues.some(issue => issue.code === 'partita_projection.marker'))
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

  it.effect('reports missing OpenAI metadata for source skills', () =>
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

  it.effect('reports implicit invocation in the current public skill catalog', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, 'skills/demo/agents/openai.yaml', validOpenAiMetadata().replace(
        'allow_implicit_invocation: false',
        'allow_implicit_invocation: true',
      ))

      const report = yield* verifySourceProject({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('openai_metadata.invocation_policy_projection'))
    }))

  it.effect('reports OpenAI display name projection drift', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, 'skills/demo/agents/openai.yaml', [
        'interface:',
        '  display_name: "Wrong"',
        '  short_description: "Demo skill fixture"',
        '  default_prompt: "Use $demo for verifier tests."',
        'policy:',
        '  allow_implicit_invocation: false',
      ].join('\n'))

      const report = yield* verifySourceProject({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('openai_metadata.display_name_projection'))
    }))

  it.effect('reports Partita projection drift from Pattern to frontmatter and marker', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, 'skills/orientation/argue/SKILL.md', validSkill()
        .replace('name: demo', 'name: argue')
        .replace(
          'Use when verifying Partita skill shape in tests. Not for production behavior or broad review.',
          'Use when unrelated selector text is present. Not for production behavior or broad review.',
        )
        .replace('verifying Partita skill shape in tests', '验证 Partita skill shape'))
      write(root, 'skills/orientation/argue/agents/openai.yaml', validOpenAiMetadataFor('og:argue'))

      const report = yield* verifySourceProject({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('partita_projection.description'))
      assert.isTrue(codes.includes('partita_projection.selector_language'))
    }))

  it.effect('reports OpenAI metadata projection drift from Pattern', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, 'skills/primitive/notate/SKILL.md', validSkill().replace('name: demo', 'name: notate').replace('🧭', '🎼 Demo'))
      write(root, 'skills/primitive/notate/agents/openai.yaml', [
        'interface:',
        '  display_name: "Demo"',
        '  short_description: "Wrong"',
        '  default_prompt: "Wrong"',
        'policy:',
        '  allow_implicit_invocation: false',
      ].join('\n'))

      const report = yield* verifySourceProject({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('openai_metadata.short_description_projection'))
      assert.isTrue(codes.includes('openai_metadata.default_prompt_projection'))
    }))

  it.effect('reports primitive marker projection drift', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, 'skills/primitive/notate/SKILL.md', validSkill().replace('name: demo', 'name: notate'))
      write(root, 'skills/primitive/notate/agents/openai.yaml', validOpenAiMetadataFor('pm:notate'))

      const report = yield* verifySourceProject({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('partita_projection.marker'))
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

  it.effect('accepts primitive reference copies', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      const spec = primitiveReferenceCopySpec('primitive/case.md')
      const ruleSpec = primitiveReferenceCopySpec('primitive/rule.md')
      write(root, 'primitive/case.md', '# Case\n\nShared case definition.\n')
      write(root, 'primitive/rule.md', '# Rule\n\nShared rule definition.\n')
      for (const targetPath of spec.targetPaths) {
        write(root, targetPath, '# Case\n\nShared case definition.\n')
      }
      for (const targetPath of ruleSpec.targetPaths) {
        write(root, targetPath, '# Rule\n\nShared rule definition.\n')
      }

      const report = yield* verifySourceProject({ root })

      assert.isTrue(report.ok)
      assert.deepStrictEqual(report.issues, [])
    }))

  it.effect('reports primitive reference copy drift', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      const spec = primitiveReferenceCopySpec('primitive/case.md')
      write(root, 'primitive/case.md', '# Case\n\nShared case definition.\n')
      for (const targetPath of spec.targetPaths) {
        write(root, targetPath, '# Case\n\nShared case definition.\n')
      }
      write(root, firstTargetPath(spec.targetPaths), '# Case\n\nLocal drift.\n')

      const report = yield* verifySourceProject({ root })
      const codes = report.issues.map(issue => issue.code)

      assert.strictEqual(report.ok, false)
      assert.isTrue(codes.includes('primitive_reference.copy_drift'))
    }))

  it.effect('syncs primitive reference copies without source frontmatter', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      const caseSpec = primitiveReferenceCopySpec('primitive/case.md')
      const ruleSpec = primitiveReferenceCopySpec('primitive/rule.md')
      write(root, 'primitive/case.md', [
        '---',
        'updated: 2026-07-07',
        '---',
        '',
        '# Case',
        '',
        'Shared case definition.',
        '',
      ].join('\n'))
      write(root, 'primitive/rule.md', [
        '---',
        'updated: 2026-07-07',
        '---',
        '',
        '# Rule',
        '',
        'Shared rule definition.',
        '',
      ].join('\n'))

      const syncReport = yield* syncPrimitiveReferences({ root })

      assert.deepStrictEqual(syncReport.copied, [
        ...caseSpec.targetPaths,
        ...ruleSpec.targetPaths,
      ])
      for (const targetPath of caseSpec.targetPaths) {
        assert.strictEqual(readFileSync(join(root, targetPath), 'utf8'), '# Case\n\nShared case definition.\n')
      }
      for (const targetPath of ruleSpec.targetPaths) {
        assert.strictEqual(readFileSync(join(root, targetPath), 'utf8'), '# Rule\n\nShared rule definition.\n')
      }
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

  it.effect('does not interpret external managed-doc wikilinks while rejecting the removed wiki package', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, 'external/managed/docs/lead.md', 'Use [[prelude|Prelude]].\n')

      const externalDocsReport = yield* verifySourceProject({ root })
      assert.isTrue(externalDocsReport.ok)
      assert.deepStrictEqual(externalDocsReport.issues, [])

      write(root, 'packages/wiki/index.md', '# Removed wiki package\n')
      const removedSurfaceReport = yield* verifySourceProject({ root })

      assert.isFalse(removedSurfaceReport.ok)
      assert.isTrue(removedSurfaceReport.issues.some(issue => issue.path === 'packages/wiki'))
    }))

  it.effect('treats Prelude pinned reference trees as read-only diagnostics outside project verification', () =>
    Effect.gen(function* () {
      const root = makeValidSourceFixture()
      write(root, '.prelude/effect/repos/upstream/README.md', '[missing](./not-materialized.md)\n')

      const report = yield* verifySourceProject({ root })

      assert.isTrue(report.ok)
      assert.deepStrictEqual(report.issues, [])
    }))

  it.effect('keeps runtime, source, and project verification as separate layers', () =>
    Effect.gen(function* () {
      const root = mkdtempSync(join(tmpdir(), 'partita-verifier-levels-'))
      write(root, 'package.json', encodeJson({ version: '0.1.0' }))
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
  write(root, 'package.json', encodeJson({ version: '0.1.0' }))

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
    `Prefix your first user-facing line with \`${marker}\` inline when this Partita skill is active.`,
    '',
    '## Rule',
    '',
    'Facing Partita verifier fixture work, first run the local shape check, to avoid accepting invalid skill source shape.',
    '',
    '## Pattern',
    '',
    'Use when:',
    '',
    '- verifying Partita skill shape in tests.',
    '',
    'Do not use when:',
    '',
    '- production behavior or broad review.',
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
    '  allow_implicit_invocation: false',
  ].join('\n')
}

function validOpenAiMetadataFor(handle: string, displayName = 'Demo'): string {
  return [
    'interface:',
    `  display_name: "${displayName}"`,
    '  short_description: "Verifying Partita skill shape in tests"',
    `  default_prompt: "Use ${handle} when verifying Partita skill shape in tests."`,
    'policy:',
    '  allow_implicit_invocation: false',
  ].join('\n')
}

function namespacedSkill(name: string, title: string, projectedMarker: string): string {
  return validSkill()
    .replace('name: demo', `name: ${name}`)
    .replace('# Demo', `# ${title}`)
    .replace('🧭', projectedMarker)
}

function primitiveReferenceCopySpec(sourcePath: string) {
  const spec = primitiveReferenceCopySpecs.find(spec => spec.sourcePath === sourcePath)
  if (spec === undefined) {
    throw new Error(`missing primitive copy spec: ${sourcePath}`)
  }
  return spec
}

function firstTargetPath(paths: ReadonlyArray<string>) {
  const path = paths[0]
  if (path === undefined) {
    throw new Error('missing primitive copy target')
  }
  return path
}

function markdownSection(text: string, start: string, end: string): string {
  const startIndex = text.indexOf(start)
  const endIndex = text.indexOf(end, startIndex + start.length)
  if (startIndex === -1 || endIndex === -1) {
    throw new Error(`missing Markdown section: ${start}..${end}`)
  }
  return text.slice(startIndex + start.length, endIndex)
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

function gitBlobId(value: Uint8Array): string {
  return createHash('sha1')
    .update(`blob ${value.byteLength}\0`)
    .update(value)
    .digest('hex')
}

function provenanceBlobMap(markdown: string): Record<string, string> {
  return Object.fromEntries(
    [...markdown.matchAll(/^\| `([^`]+)` \| `([0-9a-f]{40})` \|/gmu)]
      .map(match => [match[1], match[2]]),
  )
}

function countOccurrences(value: string, needle: string): number {
  return value.split(needle).length - 1
}

function assertInOrder(value: string, needles: ReadonlyArray<string>): void {
  let previousIndex = -1
  for (const needle of needles) {
    const index = value.indexOf(needle)
    assert.isAbove(index, previousIndex, `expected ${JSON.stringify(needle)} after index ${previousIndex}`)
    previousIndex = index
  }
}

function fencedBlockAfter(text: string, anchor: string): string {
  const anchorIndex = text.indexOf(anchor)
  const fenceStart = text.indexOf('```yaml\n', anchorIndex)
  const fenceEnd = text.indexOf('\n```', fenceStart + '```yaml\n'.length)
  if (anchorIndex === -1 || fenceStart === -1 || fenceEnd === -1) {
    throw new Error(`missing YAML block after: ${anchor}`)
  }
  return text.slice(fenceStart + '```yaml\n'.length, fenceEnd)
}

function write(root: string, path: string, contents: string) {
  const absolutePath = join(root, path)
  mkdirSync(dirname(absolutePath), { recursive: true })
  writeFileSync(absolutePath, contents)
}

function encodeJson(value: unknown): string {
  return Schema.encodeSync(Schema.UnknownFromJsonString)(value)
}
