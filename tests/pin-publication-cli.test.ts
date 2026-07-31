import { afterEach, assert, describe, it } from '@effect/vitest'
import * as Effect from 'effect/Effect'
import * as Schema from 'effect/Schema'

const { execFileSync, spawnSync } = process.getBuiltinModule('node:child_process')
const {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} = process.getBuiltinModule('node:fs')
const { tmpdir } = process.getBuiltinModule('node:os')
const { dirname, join, resolve } = process.getBuiltinModule('node:path')
const { fileURLToPath } = process.getBuiltinModule('node:url')

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const cliEntrypoint = join(repositoryRoot, 'bin/partita.ts')
const publicationFixtureRoots = new Set<string>()

afterEach(() => {
  for (const root of publicationFixtureRoots) {
    rmSync(root, { force: true, recursive: true })
  }
  publicationFixtureRoots.clear()
})

describe('partita pin publish CLI', () => {
  it.effect('publishes byte-identical canonical archives and provenance for identical verified input', () => Effect.sync(() => {
    const root = makeFixture()
    const first = publish(root, 'first')
    const second = publish(root, 'second')

    assert.equal(first.status, 0, first.stderr || first.stdout)
    assert.equal(second.status, 0, second.stderr || second.stdout)
    assert.deepEqual(
      readFileSync(join(root, 'out/first.pta')),
      readFileSync(join(root, 'out/second.pta')),
    )
    assert.equal(
      readFileSync(join(root, 'out/first.json'), 'utf8'),
      readFileSync(join(root, 'out/second.json'), 'utf8'),
    )
    assert.deepEqual(decodeJson(readFileSync(join(root, 'out/first.json'), 'utf8')), {
      archive: {
        format: 'prelude-canonical-tree-archive-v1',
      },
      name: 'upstream',
      provenance: {
        revision: 'a'.repeat(40),
        sourceUrl: 'https://github.com/example/upstream',
        treeDigest: 'c43c1959a0685c185aafa326973dadcf621cca636084a360564523fbb4ceea40',
      },
      schemaVersion: 1,
    })
  }))

  it.effect('omits internal Gitlinks as opaque reference boundaries', () => Effect.sync(() => {
    const root = makeFixture()
    git(root, 'update-index', '--add', '--cacheinfo', `160000,${'b'.repeat(40)},repos/upstream/vendor`)

    const result = publish(root, 'opaque')

    assert.equal(result.status, 0, result.stderr || result.stdout)
    assert.match(readFileSync(join(root, 'out/opaque.json'), 'utf8'), /"treeDigest": "[a-f0-9]{64}"/u)
  }))

  it.effect('rejects an untracked entry inside the Source Pin', () => Effect.sync(() => {
    const root = makeFixture()
    write(root, 'repos/upstream/untracked.txt', 'not in the index\n')

    const result = publish(root, 'untracked')

    assert.notEqual(result.status, 0)
    assert.include(result.stderr, 'Untracked Source Pin entry: untracked.txt')
    assertOutputsAbsent(root, 'untracked')
  }))

  it.effect('rejects a tracked entry missing from the working tree', () => Effect.sync(() => {
    const root = makeFixture()
    execFileSync('rm', [join(root, 'repos/upstream/README.md')])

    const result = publish(root, 'missing')

    assert.notEqual(result.status, 0)
    assert.include(result.stderr, 'Tracked Source Pin entry is missing: README.md')
    assertOutputsAbsent(root, 'missing')
  }))

  it.effect('rejects tracked Source Pin content modified after the pinned commit', () => Effect.sync(() => {
    const root = makeFixture()
    write(root, 'repos/upstream/README.md', 'locally modified\n')

    const result = publish(root, 'modified')

    assert.notEqual(result.status, 0)
    assert.include(result.stderr, 'Source Pin working tree differs from its Git index')
    assertOutputsAbsent(root, 'modified')
  }))

  it.effect('rejects committed Source Pin content that no longer matches the declared subtree revision', () => Effect.sync(() => {
    const root = makeFixture()
    write(root, 'repos/upstream/README.md', 'committed local drift\n')
    git(root, 'add', 'repos/upstream/README.md')
    git(root, 'commit', '--quiet', '-m', 'drift after pinned subtree')

    const result = publish(root, 'committed-drift')

    assert.notEqual(result.status, 0)
    assert.include(result.stderr, 'does not match declared subtree revision')
    assertOutputsAbsent(root, 'committed-drift')
  }))

  it.effect('rejects a Source Pin prefix materialized as a Gitlink', () => Effect.sync(() => {
    const root = makeFixture()
    git(root, 'rm', '-r', '--cached', 'repos/upstream')
    git(root, 'update-index', '--add', '--cacheinfo', `160000,${'b'.repeat(40)},repos/upstream`)

    const result = publish(root, 'gitlink')

    assert.notEqual(result.status, 0)
    assert.include(result.stderr, 'pin prefix must be a git subtree checkout')
    assertOutputsAbsent(root, 'gitlink')
  }))

  it.effect('rejects an unsupported Source Pin contract schema version', () => Effect.sync(() => {
    const root = makeFixture()
    write(root, 'repos/upstream.subtree.json', `${encodeJson({ ...contract(), schemaVersion: 1 })}\n`)

    const result = publish(root, 'schema-version')

    assert.notEqual(result.status, 0)
    assert.include(result.stderr, 'must use Source Pin contract schemaVersion 2')
    assertOutputsAbsent(root, 'schema-version')
  }))

  it.effect('publishes independently of Harness delivery routes, anchors, and editor policy', () => Effect.sync(() => {
    const root = makeFixture()
    write(root, 'repos/upstream.subtree.json', `${encodeJson({
      ...contract(),
      agent: {
        ...contract().agent,
        anchor: 'delivery/missing-anchor.md',
        route: 'delivery/missing-route.md',
      },
      workspace: {
        autoImport: '',
        files: 'visible',
        search: 'included',
        watch: 'included',
      },
    })}\n`)

    const result = publish(root, 'policy-independent')

    assert.equal(result.status, 0, result.stderr || result.stdout)
  }))

  it.effect('rejects publication outputs inside the read-only Source Pin prefix', () => Effect.sync(() => {
    const root = makeFixture()
    const archive = 'repos/upstream/out/archive.pta'
    const provenance = 'repos/upstream/out/provenance.json'

    const result = publish(root, 'inside-pin', { archive, provenance })

    assert.notEqual(result.status, 0)
    assert.include(result.stderr, 'must be outside Source Pin prefix repos/upstream')
    assert.isFalse(existsSync(join(root, archive)))
    assert.isFalse(existsSync(join(root, provenance)))
  }))

  it.effect('rejects publication output that would overwrite the Source Pin contract', () => Effect.sync(() => {
    const root = makeFixture()

    const result = publish(root, 'contract-output', {
      archive: 'repos/upstream.subtree.json',
      provenance: 'out/contract-output.json',
    })

    assert.notEqual(result.status, 0)
    assert.include(result.stderr, 'must not overwrite Source Pin contract')
    assert.match(readFileSync(join(root, 'repos/upstream.subtree.json'), 'utf8'), /"schemaVersion":\s*2/u)
  }))

  it.effect('requires the Source Pin import block before publication', () => Effect.sync(() => {
    const root = makeFixture()
    write(root, 'repos/upstream.subtree.json', `${encodeJson({
      ...contract(),
      agent: { ...contract().agent, importBlock: false },
    })}\n`)

    const result = publish(root, 'missing-import-block')

    assert.notEqual(result.status, 0)
    assert.include(result.stderr, 'pin.import_block_missing')
    assertOutputsAbsent(root, 'missing-import-block')
  }))

  it.effect('rejects application imports from the Source Pin before publication', () => Effect.sync(() => {
    const root = makeFixture()
    write(root, 'src/app.ts', 'import "../repos/upstream/README.md"\n')

    const result = publish(root, 'blocked-import')

    assert.notEqual(result.status, 0)
    assert.include(result.stderr, 'pin.import_blocked')
    assertOutputsAbsent(root, 'blocked-import')
  }))

  it.effect('rejects publication through an output parent symlink that escapes the repository', () => Effect.sync(() => {
    const root = makeFixture()
    const outside = mkdtempSync(join(tmpdir(), 'partita-pin-publication-outside-'))
    publicationFixtureRoots.add(outside)
    symlinkSync(outside, join(root, 'out'))

    const result = publish(root, 'escaping-output')

    assert.notEqual(result.status, 0)
    assert.include(result.stderr, 'output parent escapes the repository')
    assert.isFalse(existsSync(join(outside, 'escaping-output.pta')))
    assert.isFalse(existsSync(join(outside, 'escaping-output.json')))
  }))

  it.effect('rejects internal output symlink aliases to the contract and Source Pin prefix', () => Effect.sync(() => {
    const contractRoot = makeFixture()
    symlinkSync('.', join(contractRoot, 'out'))
    const contractAlias = publish(contractRoot, 'contract-alias', {
      archive: 'out/repos/upstream.subtree.json',
      provenance: 'publication/contract-alias.json',
    })

    assert.notEqual(contractAlias.status, 0)
    assert.include(contractAlias.stderr, 'must not overwrite Source Pin contract')
    assert.match(readFileSync(join(contractRoot, 'repos/upstream.subtree.json'), 'utf8'), /"schemaVersion":\s*2/u)

    const prefixRoot = makeFixture()
    symlinkSync('repos/upstream', join(prefixRoot, 'out'))
    const prefixAlias = publish(prefixRoot, 'prefix-alias', {
      archive: 'out/generated.pta',
      provenance: 'publication/prefix-alias.json',
    })

    assert.notEqual(prefixAlias.status, 0)
    assert.include(prefixAlias.stderr, 'must be outside Source Pin prefix')
    assert.isFalse(existsSync(join(prefixRoot, 'repos/upstream/generated.pta')))

    const sameOutputRoot = makeFixture()
    symlinkSync('.', join(sameOutputRoot, 'out'))
    const sameOutputAlias = publish(sameOutputRoot, 'same-output-alias', {
      archive: 'out/publication.bin',
      provenance: 'publication.bin',
    })

    assert.notEqual(sameOutputAlias.status, 0)
    assert.include(sameOutputAlias.stderr, 'resolve to different files')
    assert.isFalse(existsSync(join(sameOutputRoot, 'publication.bin')))
  }), 30_000)

  it.effect('rejects an escaping symbolic link', () => Effect.sync(() => {
    const root = makeFixture()
    symlinkSync('../../outside', join(root, 'repos/upstream/escape'))
    git(root, 'add', 'repos/upstream/escape')

    const result = publish(root, 'unsafe-link')

    assert.notEqual(result.status, 0)
    assert.include(result.stderr, 'Unsafe Source Pin symbolic link: escape -> ../../outside')
    assertOutputsAbsent(root, 'unsafe-link')
  }))

  it.effect('rejects unsupported working-tree entries and Git inspection failures', () => Effect.sync(() => {
    const unsupportedRoot = makeFixture()
    const source = join(unsupportedRoot, 'repos/upstream/README.md')
    execFileSync('rm', [source])
    execFileSync('mkfifo', [source])
    const unsupported = publish(unsupportedRoot, 'unsupported')

    assert.notEqual(unsupported.status, 0)
    assert.include(unsupported.stderr, 'Unsupported Source Pin entry: README.md')
    assertOutputsAbsent(unsupportedRoot, 'unsupported')

    const noGitRoot = makeFixture({ initializeGit: false })
    const noGit = publish(noGitRoot, 'git-failure')

    assert.notEqual(noGit.status, 0)
    assert.include(noGit.stderr, 'Inspect git index for repos/upstream')
    assertOutputsAbsent(noGitRoot, 'git-failure')
  }))
})

function publish(
  root: string,
  outputName: string,
  paths: { readonly archive: string, readonly provenance: string } = {
    archive: `out/${outputName}.pta`,
    provenance: `out/${outputName}.json`,
  },
) {
  return spawnSync(process.execPath, [
    '--experimental-strip-types',
    cliEntrypoint,
    'pin',
    'publish',
    '--root',
    root,
    '--name',
    'upstream',
    '--archive',
    paths.archive,
    '--provenance',
    paths.provenance,
  ], {
    cwd: repositoryRoot,
    encoding: 'utf8',
    env: { ...process.env, NODE_NO_WARNINGS: '1' },
  })
}

function makeFixture(options: { readonly initializeGit?: boolean } = {}): string {
  const root = mkdtempSync(join(tmpdir(), 'partita-pin-publication-'))
  publicationFixtureRoots.add(root)
  write(root, 'AGENTS.md', '# Agents\n')
  write(root, 'repos/upstream/LLMS.md', '# Upstream\n')
  write(root, 'repos/upstream/README.md', 'hello\n')
  write(root, 'repos/upstream/bin/run.sh', '#!/bin/sh\necho hello\n')
  chmodSync(join(root, 'repos/upstream/bin/run.sh'), 0o755)
  write(root, 'repos/upstream.subtree.json', `${encodeJson(contract())}\n`)
  if (options.initializeGit !== false) {
    git(root, 'init', '--quiet')
    git(root, 'config', 'user.email', 'partita@example.invalid')
    git(root, 'config', 'user.name', 'Partita Test')
    git(root, 'add', 'AGENTS.md', 'repos/upstream.subtree.json')
    git(root, 'commit', '--quiet', '-m', 'fixture base')
    const base = gitOutput(root, 'rev-parse', 'HEAD')
    git(root, 'add', 'repos/upstream')
    const materializationTree = gitOutput(root, 'write-tree')
    const prefixTree = gitOutput(root, 'rev-parse', `${materializationTree}:repos/upstream`)
    const squash = gitOutput(
      root,
      'commit-tree',
      prefixTree,
      '-p',
      base,
      '-m',
      `Squashed 'repos/upstream/' changes\n\ngit-subtree-dir: repos/upstream\ngit-subtree-split: ${'a'.repeat(40)}`,
    )
    const materialization = gitOutput(
      root,
      'commit-tree',
      materializationTree,
      '-p',
      base,
      '-p',
      squash,
      '-m',
      'materialize subtree',
    )
    git(root, 'reset', '--quiet', '--hard', materialization)
  }
  return root
}

function contract() {
  const revision = 'a'.repeat(40)
  return {
    schemaVersion: 2,
    name: 'upstream',
    source: {
      repository: 'https://github.com/example/upstream',
      revision,
      trackingBranch: 'main',
    },
    materialization: {
      mechanism: 'git-subtree',
      prefix: 'repos/upstream',
      split: revision,
      trailer: `git-subtree-split: ${revision}`,
    },
    ownership: { mode: 'direct' },
    agent: {
      anchor: 'repos/upstream/LLMS.md',
      importBlock: true,
      readOnly: true,
      route: 'AGENTS.md',
    },
    workspace: {
      autoImport: 'excluded',
      files: 'visible',
      search: 'excluded',
      watch: 'excluded',
    },
  }
}

function assertOutputsAbsent(root: string, outputName: string): void {
  const result = execFileSync('sh', [
    '-c',
    'test ! -e "$1" && test ! -e "$2"',
    'sh',
    join(root, `out/${outputName}.pta`),
    join(root, `out/${outputName}.json`),
  ])
  assert.equal(result.length, 0)
}

function git(root: string, ...args: ReadonlyArray<string>): void {
  execFileSync('git', args, { cwd: root, stdio: 'pipe' })
}

function gitOutput(root: string, ...args: ReadonlyArray<string>): string {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
}

function write(root: string, path: string, value: string): void {
  const target = join(root, path)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, value)
}

function decodeJson(value: string): unknown {
  return Schema.decodeUnknownSync(Schema.UnknownFromJsonString)(value)
}

function encodeJson(value: unknown): string {
  return Schema.encodeSync(Schema.UnknownFromJsonString)(value)
}
