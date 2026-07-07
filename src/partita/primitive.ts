import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import * as Console from 'effect/Console'
import * as Effect from 'effect/Effect'
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

export const syncPrimitiveReferences = Effect.fn('syncPrimitiveReferences')(function* (options: SyncPrimitiveReferencesOptions) {
  return yield* Effect.try({
    catch: cause => new PartitaError(cause instanceof Error ? cause.message : String(cause)),
    try: () => syncPrimitiveReferencesSync(resolve(options.root)),
  })
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

function syncPrimitiveReferencesSync(root: string): PrimitiveReferenceSyncReport {
  const copied: Array<string> = []

  for (const copy of primitiveReferenceCopySpecs) {
    const sourcePath = join(root, copy.sourcePath)
    if (!existsSync(sourcePath)) {
      throw new Error(`Missing primitive reference source: ${copy.sourcePath}`)
    }

    const body = primitiveReferenceBody(readFileSync(sourcePath, 'utf8'))
    for (const targetPath of copy.targetPaths) {
      const absoluteTargetPath = join(root, targetPath)
      mkdirSync(dirname(absoluteTargetPath), { recursive: true })
      writeFileSync(absoluteTargetPath, body)
      copied.push(targetPath)
    }
  }

  return { copied }
}
