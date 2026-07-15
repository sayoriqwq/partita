export interface GateResult {
  readonly exitCode: number
  readonly output: string
  readonly category?: string
  readonly failedStep?: string
}

export interface CodeGateStep {
  readonly name: string
  readonly command: string
  readonly args: readonly string[]
  readonly category: string
}

export declare const codeGateSteps: readonly CodeGateStep[]

export declare function runIntegrationGate(options?: {
  readonly root?: string
  readonly runCommand?: (command: string, args: readonly string[], root: string) => GateResult
}): GateResult

export declare function runCodeGate(options?: {
  readonly root?: string
  readonly runCommand?: (step: CodeGateStep, root: string) => GateResult
}): GateResult

export declare function runAggregate(options?: {
  readonly root?: string
  readonly runCommand?: (command: string, args: readonly string[], root: string) => GateResult
  readonly runGate?: (gate: 'integration' | 'code') => GateResult
}): GateResult
