import { spawnSync } from 'node:child_process'
import {
  chmodSync,
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative, sep } from 'node:path'
import process from 'node:process'
import assert from 'node:assert/strict'

const root = process.cwd()
const fixture = mkdtempSync(join(tmpdir(), 'partita-fresh-checkout-'))

try {
  makeFreshCheckoutFixture(root, fixture)
  assert.equal(existsSync(join(fixture, '.prelude/effect/repos/effect')), false)
  assert.equal(existsSync(join(fixture, '.prelude/effect/repos/tsgo')), false)

  const code = runGate(fixture, 'code', 180_000)
  assert.equal(code.status, 0, commandOutput(code))
  assert.match(commandOutput(code), /Code gate: PASS/)
  assert.match(commandOutput(code), /Test Files\s+9 passed \(9\)/)
  assert.match(commandOutput(code), /Tests\s+109 passed \(109\)/)
  console.log('[fresh-checkout] code-only: PASS')

  const integration = runGate(fixture, 'integration', 60_000)
  assert.equal(integration.status, 1, commandOutput(integration))
  assert.match(commandOutput(integration), /Integration drift/)
  console.log('[fresh-checkout] Integration-only: FAIL — Integration drift')

  const aggregate = runGate(fixture, 'aggregate', 300_000)
  assert.equal(aggregate.status, 1, commandOutput(aggregate))
  assert.match(commandOutput(aggregate), /Integration gate: FAIL — Integration drift/)
  assert.match(commandOutput(aggregate), /Code gate: PASS/)
  assert.match(commandOutput(aggregate), /Test Files\s+9 passed \(9\)/)
  assert.match(commandOutput(aggregate), /Tests\s+109 passed \(109\)/)
  assert.match(commandOutput(aggregate), /Aggregate: FAIL — Integration drift/)
  console.log('[fresh-checkout] aggregate: FAIL — Integration drift; Code gate: PASS')
}
finally {
  rmSync(fixture, { force: true, recursive: true })
}

function commandOutput(result) {
  return [
    result.stdout ?? '',
    result.stderr ?? '',
    result.error?.message ?? '',
    `status=${result.status ?? 'null'} signal=${result.signal ?? 'none'}`,
  ].join('')
}

function runGate(fixtureRoot, gate, timeout) {
  const fixtureBin = join(fixtureRoot, '.fixture-bin')
  return spawnSync(process.execPath, [join(fixtureRoot, 'tooling/verification-gates.mjs'), gate], {
    cwd: fixtureRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      PATH: `${fixtureBin}${process.platform === 'win32' ? ';' : ':'}${process.env.PATH ?? ''}`,
    },
    timeout,
  })
}

function makeFreshCheckoutFixture(projectRoot, fixtureRoot) {
  cpSync(projectRoot, fixtureRoot, {
    filter: (source) => {
      const relativePath = relative(projectRoot, source).split(sep).join('/')
      return ![
        '.git',
        'dist',
        'node_modules',
        '.turbo',
        '.prelude/effect/repos',
      ].some(path => relativePath === path || relativePath.startsWith(`${path}/`))
    },
    recursive: true,
  })
  cpSync(join(projectRoot, 'node_modules'), join(fixtureRoot, 'node_modules'), {
    dereference: false,
    recursive: true,
    verbatimSymlinks: true,
  })
  const sourceNodeModules = join(projectRoot, 'node_modules')
  const fixtureNodeModules = join(fixtureRoot, 'node_modules')
  const realFixtureRoot = realpathSync(fixtureRoot)
  const modulesManifest = join(fixtureNodeModules, '.modules.yaml')
  const manifest = readFileSync(modulesManifest, 'utf8')
  writeFileSync(modulesManifest, manifest.replaceAll(sourceNodeModules, fixtureNodeModules))
  for (const packageName of ['@sayoriqwq/prelude', '@sayoriqwq/effect-harness']) {
    const packagePath = join(fixtureNodeModules, packageName)
    const resolved = realpathSync(packagePath)
    assert.ok(
      resolved === realFixtureRoot || resolved.startsWith(`${realFixtureRoot}${sep}`),
      `${packageName} escaped fixture: ${resolved}`,
    )
  }
  writeFixtureVitestConfig(fixtureRoot)
  writeFixturePnpmShim(fixtureRoot)
  assertFixturePnpmShimIsReadOnly(fixtureRoot)
}

function writeFixtureVitestConfig(fixtureRoot) {
  // Fixture-only cold-checkout policy: measured external subprocess tests need up to 14s.
  // The production Vitest config and package script remain unchanged; this keeps all tests selected.
  writeFileSync(join(fixtureRoot, 'vitest.config.ts'), `import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    testTimeout: 30_000,
  },
})
`)
}

function assertFixturePnpmShimIsReadOnly(fixtureRoot) {
  const shimPath = join(fixtureRoot, '.fixture-bin/pnpm')
  for (const args of [['install'], ['unknown-command']]) {
    const result = spawnSync(shimPath, args, { cwd: fixtureRoot, encoding: 'utf8' })
    assert.equal(result.status, 2, `${args.join(' ')} was accepted by fixture pnpm shim`)
  }
}

function writeFixturePnpmShim(fixtureRoot) {
  const fixtureBin = join(fixtureRoot, '.fixture-bin')
  mkdirSync(fixtureBin, { recursive: true })
  const shim = `#!/bin/sh
set -eu
case "$*" in
  *apply*|*install*|*prepare*|*patch*|*fix*|*suppression*|*migration*)
    echo "fixture pnpm shim rejected mutation command: $*" >&2
    exit 2
    ;;
esac
case "$*" in
  'exec prelude check') exec node node_modules/@sayoriqwq/prelude/dist/index.js check ;;
  # Explicit read-only test support; no other prelude command is allowed.
  'exec prelude plan --json') exec node node_modules/@sayoriqwq/prelude/dist/index.js plan --json ;;
  'run build') rm -rf dist && node node_modules/.pnpm/@typescript+typescript6@6.0.2/node_modules/@typescript/typescript6/bin/tsc6 --project tsconfig.build.json && chmod +x dist/bin/partita.js ;;
  'run effect:verify') exec node tooling/verify-effect-toolchain.mjs ;;
  'run typecheck') exec node node_modules/@typescript/native/bin/tsc --noEmit --project tsconfig.json ;;
  'run test') exec node node_modules/vitest/vitest.mjs run ;;
  'run lint') exec node node_modules/eslint/bin/eslint.js eslint.config.mjs 'bin/**/*.ts' 'src/**/*.ts' 'tests/**/*.ts' 'packages/*/src/**/*.ts' --no-error-on-unmatched-pattern ;;
  'run knip') exec node node_modules/knip/dist/cli.js ;;
  *) echo "fixture pnpm shim rejected command: $*" >&2; exit 2 ;;
esac
`
  const shimPath = join(fixtureBin, 'pnpm')
  writeFileSync(shimPath, shim)
  chmodSync(shimPath, 0o755)
}
