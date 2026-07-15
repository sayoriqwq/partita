import * as Schema from 'effect/Schema'
import { describe, expect, it } from 'vitest'

const { spawnSync } = process.getBuiltinModule('node:child_process')

const PlanDocument = Schema.fromJsonString(Schema.Struct({
  schemaVersion: Schema.Finite,
  blocked: Schema.Boolean,
  integrations: Schema.Array(Schema.Struct({ integrationId: Schema.String })),
  outputs: Schema.Array(Schema.Struct({
    declaration: Schema.Struct({ kind: Schema.String }),
    owner: Schema.Struct({ integrationId: Schema.String }),
  })),
  requirements: Schema.Array(Schema.Unknown),
  issues: Schema.Array(Schema.Unknown),
  checks: Schema.Array(Schema.Struct({ owner: Schema.Struct({ integrationId: Schema.String }) })),
}))

describe('prelude V2 Harness convergence', () => {
  it('loads the selected Effect Module and declares the complete V2 output set', () => {
    const result = spawnSync('pnpm', ['exec', 'prelude', 'plan', '--json'], {
      cwd: import.meta.dirname.replace(/\/tests$/, ''),
      encoding: 'utf8',
    })

    expect(result.status, result.stderr).toBe(0)
    const plan = Schema.decodeUnknownSync(PlanDocument)(result.stdout)
    expect(plan.schemaVersion).toBe(2)
    expect(plan.blocked).toBe(false)
    expect(plan.integrations.map(integration => integration.integrationId)).toEqual(['effect'])

    const outputs = (integrationId: string) => plan.outputs
      .filter(output => output.owner.integrationId === integrationId)
    expect(outputs('effect').map(output => output.declaration.kind).sort()).toEqual([
      'ManagedBlock',
      'ManagedTree',
      'PinnedReferenceTree',
      'PinnedReferenceTree',
    ])
    expect(plan.requirements).toEqual([])
    expect(plan.issues).toEqual([])
    expect(plan.checks).toEqual([])
  })
})
