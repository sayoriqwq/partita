import { strict as assert } from 'node:assert'
import { spawnSync } from 'node:child_process'
import { mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const root = new URL('../', import.meta.url).pathname
const nativeCompiler = join(root, 'node_modules/@typescript/native/bin/tsc')
const compatibilityCompiler = join(root, 'node_modules/typescript/bin/tsc6')

function runCompiler(compiler, args) {
  return spawnSync(process.execPath, [compiler, ...args], {
    cwd: root,
    encoding: 'utf8',
  })
}

const nativeVersion = runCompiler(nativeCompiler, ['--version'])
assert.equal(nativeVersion.status, 0, nativeVersion.stderr)
assert.equal(nativeVersion.stdout.trim(), 'Version 7.0.2+effect-tsgo.0.19.0')

const compatibilityVersion = runCompiler(compatibilityCompiler, ['--version'])
assert.equal(compatibilityVersion.status, 0, compatibilityVersion.stderr)
assert.match(compatibilityVersion.stdout.trim(), /^Version 6\./u)
const compatibilityPackage = JSON.parse(await readFile(join(root, 'node_modules/typescript/package.json'), 'utf8'))
assert.equal(compatibilityPackage.name, '@typescript/typescript6')
assert.equal(compatibilityPackage.version, '6.0.2')

const canonicalPolicy = JSON.parse(await readFile(join(root, '.prelude/effect/managed/data/tsgo-policy.json'), 'utf8'))
const targetConfig = JSON.parse(await readFile(join(root, 'tsconfig.effect.json'), 'utf8'))
assert.deepEqual(targetConfig.compilerOptions.plugins, [canonicalPolicy])

const fixture = await mkdtemp(join(tmpdir(), 'partita-effect-diagnostic-'))
try {
  await symlink(join(root, 'node_modules'), join(fixture, 'node_modules'), 'dir')
  await writeFile(join(fixture, 'tsconfig.json'), `${JSON.stringify({
    extends: join(root, 'tsconfig.effect.json'),
    compilerOptions: {
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      noEmit: true,
      strict: true,
      target: 'ES2024',
    },
    files: ['floating-effect.ts'],
  }, null, 2)}\n`, 'utf8')
  await writeFile(join(fixture, 'floating-effect.ts'), [
    "import { Effect } from 'effect'",
    '',
    "Effect.succeed('unsuppressed diagnostic probe')",
    '',
  ].join('\n'), 'utf8')

  const diagnostic = runCompiler(nativeCompiler, ['--project', join(fixture, 'tsconfig.json')])
  const output = `${diagnostic.stdout}\n${diagnostic.stderr}`
  assert.notEqual(diagnostic.status, 0, 'unsuppressed floatingEffect must fail the real native typecheck')
  assert.match(output, /effect\(floatingEffect\)/u)
}
finally {
  await rm(fixture, { recursive: true, force: true })
}

process.stdout.write(`Effect toolchain verified: TypeScript 7.0.2+effect-tsgo.0.19.0; @typescript/typescript6@6.0.2 compatibility (${compatibilityVersion.stdout.trim()}); floatingEffect exit enforced\n`)
