import { describe, expect, it } from 'vitest'
import {
  codeGateSteps,
  runAggregate,
  runCodeGate,
  runIntegrationGate,
} from '../tooling/verification-gates.mjs'

interface GateResult {
  readonly exitCode: number
  readonly output: string
}

const combinations = [
  { name: 'both pass', integration: 0, code: 0, expectedExitCode: 0 },
  { name: 'integration fails and code passes', integration: 1, code: 0, expectedExitCode: 1 },
  { name: 'integration passes and code fails', integration: 0, code: 1, expectedExitCode: 1 },
  { name: 'both fail', integration: 1, code: 1, expectedExitCode: 1 },
] as const

describe('partita verification gates', () => {
  for (const combination of combinations) {
    it(`runs both gates for ${combination.name}`, () => {
      const observed: string[] = []
      const result = runAggregate({
        runGate: (gate: 'integration' | 'code'): GateResult => {
          observed.push(gate)
          return {
            exitCode: gate === 'integration' ? combination.integration : combination.code,
            output: `${gate} fixture output`,
          }
        },
      })

      expect(observed).toEqual(['integration', 'code'])
      expect(result.exitCode).toBe(combination.expectedExitCode)
      expect(result.output).toContain('Integration gate:')
      expect(result.output).toContain('Code gate:')
      expect(result.output).toContain('Aggregate:')
    })
  }

  it('classifies a fresh checkout as integration drift while code passes', () => {
    const result = runAggregate({
      root: '/tmp/partita-fresh-checkout-fixture',
      runGate: (gate: 'integration' | 'code'): GateResult => gate === 'integration'
        ? { exitCode: 1, output: 'prelude: Target is not a Converged Integration' }
        : { exitCode: 0, output: 'source checkout code checks passed' },
    })

    expect(result.exitCode).toBe(1)
    expect(result.output).toContain('Integration drift')
    expect(result.output).toContain('Code gate: PASS')
    expect(result.output).not.toContain('ordinary code-gate failure')
  })

  it('distinguishes Effect/toolchain failures from ordinary code failures', () => {
    const effectFailure = runCodeGate({
      runCommand: (step: { readonly name: string }): GateResult => step.name === 'effect:verify'
        ? { exitCode: 1, output: 'Effect toolchain mismatch' }
        : { exitCode: 0, output: '' },
    })
    const ordinaryFailure = runCodeGate({
      runCommand: (step: { readonly name: string }): GateResult => step.name === 'test'
        ? { exitCode: 1, output: 'test assertion failed' }
        : { exitCode: 0, output: '' },
    })

    expect(effectFailure.output).toContain('Effect/toolchain')
    expect(ordinaryFailure.output).toContain('ordinary code-gate failure')
  })

  it('keeps Integration-only authoritative on prelude check', () => {
    const observed: Array<{ readonly command: string, readonly args: readonly string[] }> = []
    const result = runIntegrationGate({
      runCommand: (command: string, args: readonly string[]): GateResult => {
        observed.push({ command, args })
        return { exitCode: 0, output: 'prelude check passed' }
      },
    })

    expect(result.exitCode).toBe(0)
    expect(observed).toEqual([{ command: 'pnpm', args: ['exec', 'prelude', 'check'] }])
  })

  it('keeps gate command lists read-only', () => {
    const commandText = JSON.stringify([
      ['pnpm', 'exec', 'prelude', 'check'],
      ...codeGateSteps,
    ])

    expect(commandText).not.toMatch(/\b(apply|install|patch|fix|suppression|migration)\b/i)
  })
})
