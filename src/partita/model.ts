import { Schema } from 'effect'

export interface SkillMetadata {
  readonly name: string
  readonly description: string
}

export type JsonObject = Record<string, unknown>

export interface GeneratedFile {
  readonly relativePath: string
  readonly path: string
  readonly content: string
}

export interface GeneratedFileWriteResult {
  readonly relativePath: string
  readonly path: string
  readonly status: 'written' | 'unchanged'
}

export interface GeneratedFileCheckResult {
  readonly relativePath: string
  readonly path: string
  readonly status: 'ok' | 'drift'
}

export class PartitaFrontmatterError extends Schema.TaggedErrorClass<PartitaFrontmatterError>()(
  'PartitaFrontmatterError',
  {
    path: Schema.String,
    message: Schema.String,
  },
) {}

export class PartitaGeneratorError extends Schema.TaggedErrorClass<PartitaGeneratorError>()(
  'PartitaGeneratorError',
  {
    path: Schema.String,
    message: Schema.String,
  },
) {}
