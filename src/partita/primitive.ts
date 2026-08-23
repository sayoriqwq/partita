import * as Console from 'effect/Console'
import * as Effect from 'effect/Effect'
import * as FileSystem from 'effect/FileSystem'
import * as Path from 'effect/Path'
import { PartitaError } from './errors.ts'

export interface PrimitiveReferenceCopySpec {
  readonly sourcePath: string
  readonly targetPaths: ReadonlyArray<string>
}

export interface PrimitiveReferenceSyncReport {
  readonly copied: ReadonlyArray<string>
}

export interface SyncPrimitiveReferencesOptions {
  readonly root: string
}

export const primitiveReferenceCopySpecs: ReadonlyArray<PrimitiveReferenceCopySpec> = [
  {
    sourcePath: 'primitive/case.md',
    targetPaths: [
      'skills/primitive/notate/references/case.md',
      'skills/primitive/conduct/references/case.md',
      'skills/primitive/recall/references/case.md',
      'skills/primitive/retune/references/case.md',
    ],
  },
  {
    sourcePath: 'primitive/rule.md',
    targetPaths: [
      'skills/primitive/notate/references/rule.md',
      'skills/primitive/conduct/references/rule.md',
      'skills/primitive/retune/references/rule.md',
    ],
  },
]

export const syncPrimitiveReferences = Effect.fn('syncPrimitiveReferences')(function* (
  options: SyncPrimitiveReferencesOptions,
): Effect.fn.Return<PrimitiveReferenceSyncReport, PartitaError, FileSystem.FileSystem | Path.Path> {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const root = path.resolve(options.root)
  const copied: Array<string> = []

  for (const copy of primitiveReferenceCopySpecs) {
    const sourcePath = path.join(root, copy.sourcePath)
    if (!(yield* mapFileSystemError(fs.exists(sourcePath), `Check ${copy.sourcePath}`))) {
      return yield* new PartitaError(`Missing primitive reference source: ${copy.sourcePath}`)
    }

    const text = yield* mapFileSystemError(fs.readFileString(sourcePath), `Read ${copy.sourcePath}`)
    const body = primitiveReferenceBody(text)
    for (const targetPath of copy.targetPaths) {
      const absoluteTargetPath = path.join(root, targetPath)
      yield* mapFileSystemError(
        fs.makeDirectory(path.dirname(absoluteTargetPath), { recursive: true }),
        `Create ${path.dirname(targetPath)}`,
      )
      yield* mapFileSystemError(fs.writeFileString(absoluteTargetPath, body), `Write ${targetPath}`)
      copied.push(targetPath)
    }
  }

  return { copied }
})

export const printPrimitiveReferenceSync = Effect.fn('printPrimitiveReferenceSync')(function* (options: SyncPrimitiveReferencesOptions) {
  const report = yield* syncPrimitiveReferences(options)
  for (const path of report.copied) {
    yield* Console.log(`Copied ${path}`)
  }
  yield* Console.log(`Primitive references synced: ${report.copied.length}`)
})

export function primitiveReferenceBody(text: string): string {
  if (!text.startsWith('---\n')) {
    return text
  }

  const delimiter = '\n---\n'
  const end = text.indexOf(delimiter, 4)
  if (end === -1) {
    return text
  }

  return text.slice(end + delimiter.length).replace(/^\n/u, '')
}

function mapFileSystemError<A, E, R>(effect: Effect.Effect<A, E, R>, operation: string) {
  return effect.pipe(Effect.mapError(cause => new PartitaError(`${operation}: ${formatUnknown(cause)}`)))
}

function formatUnknown(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause)
}
