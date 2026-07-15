import { realpathSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const verificationPrefix = '[Partita verification]'

export const codeGateSteps = [
  { name: 'build', command: 'pnpm', args: ['run', 'build'], category: 'ordinary code-gate failure' },
  { name: 'project verifier', command: 'node', args: ['dist/bin/partita.js', 'verify'], category: 'ordinary code-gate failure' },
  { name: 'effect:verify', command: 'pnpm', args: ['run', 'effect:verify'], category: 'Effect/toolchain' },
  { name: 'typecheck', command: 'pnpm', args: ['run', 'typecheck'], category: 'Effect/toolchain' },
  { name: 'test', command: 'pnpm', args: ['run', 'test'], category: 'ordinary code-gate failure' },
  { name: 'lint', command: 'pnpm', args: ['run', 'lint'], category: 'ordinary code-gate failure' },
  { name: 'knip', command: 'pnpm', args: ['run', 'knip'], category: 'ordinary code-gate failure' },
]

function runExternalCommand(command, args, root) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
  })
  const output = [result.stdout, result.stderr]
    .filter(value => typeof value === 'string' && value.length > 0)
    .join('')

  return {
    exitCode: typeof result.status === 'number' ? result.status : 1,
    output: result.error === undefined ? output : `${output}${result.error.message}\n`,
  }
}

function commandText(command, args) {
  return [command, ...args].join(' ')
}

function appendCommandOutput(lines, output) {
  if (output.trim().length > 0) {
    lines.push(output.trimEnd())
  }
}

function classifyCodeFailure(result) {
  return result.category ?? (
    result.output.includes('Effect/toolchain')
      ? 'Effect/toolchain'
      : 'ordinary code-gate failure'
  )
}

function decorateAggregateGate(name, result) {
  if (result.output.includes(`${name} gate:`)) {
    return result
  }

  const category = name === 'Integration'
    ? 'Integration drift'
    : classifyCodeFailure(result)
  return {
    ...result,
    category: result.exitCode === 0 ? undefined : category,
    output: [result.output, gateSummary(name, result, category)].filter(Boolean).join('\n'),
  }
}

function gateSummary(name, result, failureCategory) {
  if (result.exitCode === 0) {
    return `${verificationPrefix} ${name} gate: PASS`
  }
  return `${verificationPrefix} ${name} gate: FAIL — ${failureCategory} (exit ${result.exitCode})`
}

export function runIntegrationGate({
  root = process.cwd(),
  runCommand = runExternalCommand,
} = {}) {
  const command = 'pnpm'
  const args = ['exec', 'prelude', 'check']
  const result = runCommand(command, args, root)
  const lines = [`${verificationPrefix} Running Integration gate: ${commandText(command, args)}`]
  appendCommandOutput(lines, result.output)
  lines.push(gateSummary('Integration', result, 'Integration drift'))

  return {
    ...result,
    category: result.exitCode === 0 ? undefined : 'Integration drift',
    output: lines.join('\n'),
  }
}

export function runCodeGate({
  root = process.cwd(),
  runCommand = (step, commandRoot) => runExternalCommand(step.command, step.args, commandRoot),
} = {}) {
  const lines = [`${verificationPrefix} Running Code gate`]

  for (const step of codeGateSteps) {
    lines.push(`${verificationPrefix} Running ${step.name}: ${commandText(step.command, step.args)}`)
    const result = runCommand(step, root)
    appendCommandOutput(lines, result.output)
    if (result.exitCode !== 0) {
      const category = step.category
      lines.push(gateSummary('Code', result, category))
      return {
        ...result,
        category,
        failedStep: step.name,
        output: lines.join('\n'),
      }
    }
  }

  const result = { exitCode: 0, output: '' }
  lines.push(gateSummary('Code', result, 'ordinary code-gate failure'))
  return { ...result, output: lines.join('\n') }
}

export function runAggregate({
  root = process.cwd(),
  runCommand = runExternalCommand,
  runGate,
} = {}) {
  const integration = decorateAggregateGate('Integration', runGate === undefined
    ? runIntegrationGate({ root, runCommand })
    : runGate('integration'))
  const code = decorateAggregateGate('Code', runGate === undefined
    ? runCodeGate({
        root,
        runCommand: (step, commandRoot) => runCommand(step.command, step.args, commandRoot),
      })
    : runGate('code'))
  const lines = [integration.output, code.output]
  const failures = []

  if (integration.exitCode !== 0) {
    failures.push('Integration drift')
  }
  if (code.exitCode !== 0) {
    failures.push(classifyCodeFailure(code))
  }

  if (failures.length === 0) {
    lines.push(`${verificationPrefix} Aggregate: PASS`)
    return { exitCode: 0, output: lines.join('\n') }
  }

  lines.push(`${verificationPrefix} Aggregate: FAIL — ${failures.join('; ')}`)
  return { exitCode: 1, output: lines.join('\n') }
}

function runCli(mode) {
  if (mode === 'integration') {
    return runIntegrationGate()
  }
  if (mode === 'code') {
    return runCodeGate()
  }
  if (mode === 'aggregate') {
    return runAggregate()
  }
  return {
    exitCode: 2,
    output: `${verificationPrefix} Unknown gate ${JSON.stringify(mode)}; expected integration, code, or aggregate`,
  }
}

if (
  process.argv[1] !== undefined
  && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
) {
  const result = runCli(process.argv[2] ?? 'aggregate')
  process.stdout.write(`${result.output}\n`)
  process.exitCode = result.exitCode
}
