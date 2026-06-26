import type { SkillMetadata } from './model.ts'

import { Effect, FileSystem } from 'effect'
import { PartitaFrontmatterError } from './model.ts'
import { validateSkillText } from './skill-validation.ts'

function failFrontmatter(path: string, message: string) {
  return Effect.fail(new PartitaFrontmatterError({ path, message }))
}

export const parseSkillFrontmatter = Effect.fn('parseSkillFrontmatter')(function* (
  path: string,
  text: string,
) {
  const validation = validateSkillText(text, path)
  if (!validation.ok || !validation.fields) {
    const firstIssue = validation.issues[0]
    const message = firstIssue === undefined
      ? `INVALID FRONTMATTER: ${path}`
      : `${firstIssue.code}: ${firstIssue.message}`
    return yield* failFrontmatter(path, message)
  }

  return validation.fields satisfies SkillMetadata
})

export const readSkillFrontmatter = Effect.fn('readSkillFrontmatter')(function* (path: string) {
  const fs = yield* FileSystem.FileSystem
  const text = yield* fs.readFileString(path)
  return yield* parseSkillFrontmatter(path, text)
})
