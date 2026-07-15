/* eslint-disable ts/no-use-before-define */
import * as Effect from 'effect/Effect'
import * as FileSystem from 'effect/FileSystem'
import * as Path from 'effect/Path'
import { PartitaError } from './errors.ts'

export const partitaSkillFamilies = {
  expression: 'ex',
  link: 'lk',
  maintenance: 'mt',
  orientation: 'og',
  primitive: 'pm',
} as const

export type PartitaSkillFamily = keyof typeof partitaSkillFamilies

export interface PartitaSourceDirectoryEntry {
  readonly entries?: ReadonlyArray<PartitaSourceDirectoryEntry>
  readonly name: string
  readonly type: FileSystem.File.Type
}

export interface PartitaSourceSkill {
  readonly directoryEntries: ReadonlyArray<PartitaSourceDirectoryEntry>
  readonly directoryPath: string
  readonly family: PartitaSkillFamily | undefined
  readonly handle: string
  readonly name: string
  readonly path: string
  readonly relativePath: string
  readonly text: string
}

export interface PartitaSourceSkillCatalog {
  readonly root: string
  readonly skills: ReadonlyArray<PartitaSourceSkill>
  readonly skillsRootEntries: ReadonlyArray<PartitaSourceDirectoryEntry>
}

export function isPartitaSkillFamily(value: string): value is PartitaSkillFamily {
  return Object.hasOwn(partitaSkillFamilies, value)
}

export const loadPartitaSourceSkillCatalog = Effect.fn('loadPartitaSourceSkillCatalog')(function* (
  root: string,
): Effect.fn.Return<PartitaSourceSkillCatalog, PartitaError, FileSystem.FileSystem | Path.Path> {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const rootStat = yield* fs.stat(root).pipe(
    Effect.mapError(cause => fileSystemError(`Stat workspace root ${root}`, cause)),
  )
  if (rootStat.type !== 'Directory') {
    return yield* new PartitaError(`Workspace root must be a directory: ${root}`)
  }
  const skillsRoot = path.join(root, 'skills')
  if (!(yield* pathExists(fs, skillsRoot))) {
    return { root, skills: [], skillsRootEntries: [] }
  }

  const skills: Array<PartitaSourceSkill> = []
  const skillsRootEntries: Array<PartitaSourceDirectoryEntry> = []
  for (const rootEntry of yield* directoryEntries(fs, skillsRoot)) {
    if (rootEntry.type !== 'Directory') {
      skillsRootEntries.push(rootEntry)
      continue
    }

    const rootEntryPath = path.join(skillsRoot, rootEntry.name)
    const rootEntryChildren = yield* directoryEntries(fs, rootEntryPath)
    skillsRootEntries.push({ ...rootEntry, entries: rootEntryChildren })
    if (rootEntryChildren.some(entry => entry.name === 'SKILL.md')) {
      skills.push(yield* acquireSkill(fs, path, root, undefined, rootEntry.name, rootEntryPath, rootEntryChildren))
      continue
    }
    if (!isPartitaSkillFamily(rootEntry.name)) {
      continue
    }

    for (const skillEntry of rootEntryChildren) {
      if (skillEntry.type !== 'Directory') {
        continue
      }
      const skillDirectoryPath = path.join(rootEntryPath, skillEntry.name)
      const skillDirectoryEntries = yield* directoryEntries(fs, skillDirectoryPath)
      if (!skillDirectoryEntries.some(entry => entry.name === 'SKILL.md')) {
        continue
      }
      skills.push(yield* acquireSkill(
        fs,
        path,
        root,
        rootEntry.name,
        skillEntry.name,
        skillDirectoryPath,
        skillDirectoryEntries,
      ))
    }
  }

  return {
    root,
    skills: skills.sort((left, right) => left.handle.localeCompare(right.handle)),
    skillsRootEntries,
  }
})

const acquireSkill = Effect.fn('acquirePartitaSourceSkill')(function* (
  fs: FileSystem.FileSystem,
  pathService: Path.Path,
  root: string,
  family: PartitaSkillFamily | undefined,
  name: string,
  directoryPath: string,
  entries: ReadonlyArray<PartitaSourceDirectoryEntry>,
) {
  const path = pathService.join(directoryPath, 'SKILL.md')
  const directoryEntriesWithShape: Array<PartitaSourceDirectoryEntry> = []
  for (const entry of entries) {
    if (entry.type === 'Directory' && (entry.name === 'agents' || entry.name === 'references')) {
      directoryEntriesWithShape.push({
        ...entry,
        entries: yield* directoryEntries(fs, pathService.join(directoryPath, entry.name)),
      })
      continue
    }
    directoryEntriesWithShape.push(entry)
  }

  return {
    directoryEntries: directoryEntriesWithShape,
    directoryPath,
    family,
    handle: family === undefined ? name : `${partitaSkillFamilies[family]}:${name}`,
    name,
    path,
    relativePath: relativePathFrom(pathService, root, path),
    text: yield* fs.readFileString(path).pipe(
      Effect.mapError(cause => fileSystemError(`Read ${path}`, cause)),
    ),
  } satisfies PartitaSourceSkill
})

const directoryEntries = Effect.fn('partitaSourceSkillDirectoryEntries')(function* (
  fs: FileSystem.FileSystem,
  directoryPath: string,
) {
  const path = yield* Path.Path
  const names = yield* fs.readDirectory(directoryPath).pipe(
    Effect.mapError(cause => fileSystemError(`Read directory ${directoryPath}`, cause)),
  )
  const entries: Array<PartitaSourceDirectoryEntry> = []
  for (const name of [...names].sort()) {
    const entryPath = path.join(directoryPath, name)
    const stat = yield* fs.stat(entryPath).pipe(
      Effect.mapError(cause => fileSystemError(`Stat ${entryPath}`, cause)),
    )
    entries.push({ name, type: stat.type })
  }
  return entries
})

const pathExists = Effect.fn('partitaSourceSkillPathExists')((fs: FileSystem.FileSystem, path: string) =>
  fs.exists(path).pipe(
    Effect.mapError(cause => fileSystemError(`Check ${path}`, cause)),
  ))

function fileSystemError(operation: string, cause: unknown): PartitaError {
  return new PartitaError(`${operation}: ${cause instanceof Error ? cause.message : String(cause)}`)
}

function relativePathFrom(pathService: Path.Path, root: string, path: string): string {
  return pathService.relative(root, path).split(pathService.sep).join('/')
}
