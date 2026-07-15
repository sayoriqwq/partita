#!/usr/bin/env node

import process from 'node:process'
import * as NodeRuntime from '@effect/platform-node/NodeRuntime'
import * as Console from 'effect/Console'
import * as Effect from 'effect/Effect'
import * as FileSystem from 'effect/FileSystem'
import * as Layer from 'effect/Layer'
import * as Path from 'effect/Path'
import * as Schema from 'effect/Schema'
import * as CliError from 'effect/unstable/cli/CliError'
import { PartitaLive, runCli } from '../src/cli/Main.ts'
import { errorMessage } from '../src/partita/errors.ts'

const program = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const entrypoint = yield* path.fromFileUrl(new URL(import.meta.url))
  const packageRoot = resolvePackageRoot(path, entrypoint)
  const version = yield* readPackageVersion(fs, path.join(packageRoot, 'package.json'))
  yield* runCli({ root: process.cwd(), version })
}).pipe(
  Effect.catch((error: unknown) =>
    CliError.isCliError(error)
      ? Effect.sync(() => {
          process.exitCode = 1
        })
      : Effect.andThen(Console.error(errorMessage(error)), Effect.sync(() => {
          process.exitCode = 1
        })),
  ),
)

Effect.scoped(Effect.gen(function* () {
  const context = yield* Layer.build(PartitaLive)
  yield* Effect.provide(program, context)
})).pipe(NodeRuntime.runMain)

function resolvePackageRoot(path: Path.Path, entrypoint: string): string {
  const candidate = path.dirname(path.dirname(entrypoint))
  if (candidate.endsWith('/dist')) {
    return path.dirname(candidate)
  }
  return candidate
}

function readPackageVersion(
  fs: FileSystem.FileSystem,
  packageJsonPath: string,
) {
  return Effect.gen(function* () {
    const text = yield* fs.readFileString(packageJsonPath)
    const packageJson = yield* Schema.decodeUnknownEffect(Schema.UnknownFromJsonString)(text)
    if (typeof packageJson === 'object' && packageJson !== null && 'version' in packageJson) {
      return typeof packageJson.version === 'string' ? packageJson.version : '0.0.0'
    }
    return '0.0.0'
  }).pipe(
    Effect.orElseSucceed(() => '0.0.0'),
  )
}
