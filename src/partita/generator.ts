import type { GeneratedFile, GeneratedFileCheckResult, GeneratedFileWriteResult, JsonObject, SkillMetadata } from './model.ts'

import { Effect, FileSystem } from 'effect'
import { readSkillFrontmatter } from './frontmatter.ts'
import { PartitaGeneratorError } from './model.ts'

const MATERIALIZE_CONFIG_RELATIVE_PATH = 'partita.materialize.json'
const namespaceShorthands = {
  expression: 'ex',
  link: 'lk',
  maintenance: 'mt',
  orientation: 'og',
  primitive: 'pm',
} as const

type SkillNamespace = keyof typeof namespaceShorthands

export interface SourceSkillMetadata extends SkillMetadata {
  readonly allowImplicitInvocation: boolean
  readonly handle: string
  readonly relativePath: string
}

interface MaterializeConfig {
  readonly copies: ReadonlyArray<MaterializedCopy>
  readonly reports: ReadonlyArray<MaterializedReport>
}

interface MaterializedCopy {
  readonly source: string
  readonly targets: ReadonlyArray<string>
}

interface MaterializedReport {
  readonly name: string
  readonly target: string
}

function failGenerator(path: string, message: string) {
  return Effect.fail(new PartitaGeneratorError({ path, message }))
}

export function joinPath(root: string, ...segments: ReadonlyArray<string>): string {
  const normalizedRoot = root.endsWith('/') && root !== '/' ? root.slice(0, -1) : root
  const normalizedSegments = segments.map(segment => segment.replace(/^\/+|\/+$/g, ''))
  if (normalizedRoot === '/') {
    return `/${normalizedSegments.filter(Boolean).join('/')}`
  }
  return [normalizedRoot, ...normalizedSegments].filter(Boolean).join('/')
}

function parentPath(path: string): string {
  const index = path.lastIndexOf('/')
  if (index <= 0) {
    return index === 0 ? '/' : '.'
  }
  return path.slice(0, index)
}

const renderJson = (value: unknown): string => `${JSON.stringify(value, null, 2)}\n`

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isStringArray(value: unknown): value is ReadonlyArray<string> {
  return Array.isArray(value) && value.every(item => typeof item === 'string')
}

function pathExists(fs: FileSystem.FileSystem, path: string) {
  return fs.exists(path).pipe(
    Effect.catchTag('PlatformError', () => Effect.succeed(false)),
  )
}

function skillHandle(namespace: SkillNamespace | undefined, name: string): string {
  return namespace === undefined ? name : `${namespaceShorthands[namespace]}:${name}`
}

function isSkillNamespace(value: string): value is SkillNamespace {
  return Object.hasOwn(namespaceShorthands, value)
}

const readAllowImplicitInvocation = Effect.fn('readAllowImplicitInvocation')(function* (metadataPath: string) {
  const fs = yield* FileSystem.FileSystem
  const exists = yield* pathExists(fs, metadataPath)
  if (!exists) {
    return yield* failGenerator(metadataPath, `ERROR: missing OpenAI metadata: ${metadataPath}`)
  }

  const value = parseAllowImplicitInvocation(yield* fs.readFileString(metadataPath))
  if (value === undefined) {
    return yield* failGenerator(metadataPath, `ERROR: ${metadataPath} must declare policy.allow_implicit_invocation as true or false`)
  }
  return value
})

function parseAllowImplicitInvocation(text: string): boolean | undefined {
  let currentSection: string | undefined
  for (const rawLine of text.split(/\r?\n/u)) {
    if (!rawLine.trim() || rawLine.trimStart().startsWith('#')) {
      continue
    }

    const indent = rawLine.length - rawLine.trimStart().length
    const line = rawLine.trim()
    const separator = line.indexOf(':')
    if (separator === -1) {
      continue
    }

    const key = line.slice(0, separator)
    const rawValue = line.slice(separator + 1).trim()
    if (indent === 0) {
      currentSection = rawValue ? undefined : key
      continue
    }

    if (indent === 2 && currentSection === 'policy' && key === 'allow_implicit_invocation') {
      const value = unquoteScalar(rawValue)
      if (value === 'true') {
        return true
      }
      if (value === 'false') {
        return false
      }
      return undefined
    }
  }
  return undefined
}

function unquoteScalar(value: string): string {
  const quote = value[0]
  if (value.length >= 2 && quote !== undefined && (quote === '"' || quote === '\'') && value.endsWith(quote)) {
    return value.slice(1, -1)
  }
  return value
}

export const collectSkillMetadata = Effect.fn('collectSkillMetadata')(function* (root: string) {
  const fs = yield* FileSystem.FileSystem
  const skillsDir = joinPath(root, 'skills')
  const skillsDirExists = yield* pathExists(fs, skillsDir)
  if (!skillsDirExists) {
    return [] satisfies Array<SourceSkillMetadata>
  }

  const entries = [...(yield* fs.readDirectory(skillsDir))].sort()
  const skills: Array<SourceSkillMetadata> = []
  for (const entry of entries) {
    const skillPath = joinPath(skillsDir, entry, 'SKILL.md')
    const skillExists = yield* pathExists(fs, skillPath)
    if (skillExists) {
      const fields = yield* readSkillFrontmatter(skillPath)
      if (fields.name !== entry) {
        return yield* failGenerator(
          skillPath,
          `ERROR: ${skillPath} frontmatter name=${JSON.stringify(fields.name)} != directory ${JSON.stringify(entry)}`,
        )
      }
      const allowImplicitInvocation = yield* readAllowImplicitInvocation(joinPath(parentPath(skillPath), 'agents', 'openai.yaml'))
      skills.push({
        ...fields,
        allowImplicitInvocation,
        handle: skillHandle(undefined, fields.name),
        relativePath: `skills/${entry}/SKILL.md`,
      })
      continue
    }

    if (!isSkillNamespace(entry)) {
      continue
    }

    const namespaceDir = joinPath(skillsDir, entry)
    const namespaceEntries = [...(yield* fs.readDirectory(namespaceDir))].sort()
    for (const skillName of namespaceEntries) {
      const namespacedSkillPath = joinPath(namespaceDir, skillName, 'SKILL.md')
      const namespacedSkillExists = yield* pathExists(fs, namespacedSkillPath)
      if (!namespacedSkillExists) {
        continue
      }
      const fields = yield* readSkillFrontmatter(namespacedSkillPath)
      if (fields.name !== skillName) {
        return yield* failGenerator(
          namespacedSkillPath,
          `ERROR: ${namespacedSkillPath} frontmatter name=${JSON.stringify(fields.name)} != directory ${JSON.stringify(skillName)}`,
        )
      }
      const allowImplicitInvocation = yield* readAllowImplicitInvocation(joinPath(parentPath(namespacedSkillPath), 'agents', 'openai.yaml'))
      skills.push({
        ...fields,
        allowImplicitInvocation,
        handle: skillHandle(entry, fields.name),
        relativePath: `skills/${entry}/${skillName}/SKILL.md`,
      })
    }
  }
  return skills
})

const parseJsonObject = Effect.fn('parseJsonObject')(function* (path: string, text: string) {
  const parsed = yield* Effect.try({
    try: () => JSON.parse(text) as unknown,
    catch: (cause): PartitaGeneratorError =>
      new PartitaGeneratorError({
        path,
        message: `INVALID JSON: ${path}: ${cause instanceof Error ? cause.message : String(cause)}`,
      }),
  })

  return isRecord(parsed)
    ? parsed
    : yield* failGenerator(path, 'INVALID JSON: manifest must be an object')
})

const readPackageVersion = Effect.fn('readPackageVersion')(function* (root: string) {
  const packageJsonPath = joinPath(root, 'package.json')
  const fs = yield* FileSystem.FileSystem
  const packageJson = yield* parseJsonObject(packageJsonPath, yield* fs.readFileString(packageJsonPath))
  const version = packageJson.version
  if (typeof version !== 'string' || version.trim().length === 0) {
    return yield* failGenerator(packageJsonPath, 'ERROR: package.json version is missing or empty')
  }
  return version.trim()
})

function partitaPackageFields(): JsonObject {
  return {
    dependencies: {
      'effect': '4.0.0-beta.90',
      '@effect/platform-node': '4.0.0-beta.90',
    },
    devDependencies: {
      '@antfu/eslint-config': '^9.0.0',
      '@types/node': '^25.6.0',
      '@effect/vitest': '4.0.0-beta.90',
      '@effect/tsgo': '0.14.6',
      '@effect/language-service': '0.86.2',
      '@typescript/native-preview': '7.0.0-dev.20260624.1',
      'eslint': '^10.3.0',
      'knip': '^6.12.0',
      'turbo': '^2.10.1',
      'typescript': '^6.0.3',
      'vitest': '^4.1.8',
    },
    scripts: {
      'build': 'rm -rf dist && tsc --project tsconfig.build.json && chmod +x dist/bin/partita.js',
      'generate': 'pnpm build && node dist/bin/partita.js generate',
      'generate:check': 'pnpm build && node dist/bin/partita.js generate --check',
      'home:diff': 'pnpm build && node dist/bin/partita.js home diff',
      'home:status': 'pnpm build && node dist/bin/partita.js home status',
      'skill-sync': 'pnpm build && node dist/bin/partita.js skill sync',
      'skill-status': 'pnpm build && node dist/bin/partita.js skill status',
      'skill-verify': 'pnpm build && node dist/bin/partita.js skill verify',
      'knip': 'knip',
      'link:global': 'pnpm build && pnpm link --global',
      'lint': 'eslint eslint.config.mjs "bin/**/*.ts" "src/**/*.ts" "tests/**/*.ts" "packages/*/src/**/*.ts" --no-error-on-unmatched-pattern',
      'lint:fix': 'eslint eslint.config.mjs "bin/**/*.ts" "src/**/*.ts" "tests/**/*.ts" "packages/*/src/**/*.ts" --fix --no-error-on-unmatched-pattern',
      'test': 'vitest run',
      'typecheck': 'tsgo --noEmit',
      'verify': 'pnpm generate:check && node dist/bin/partita.js verify && pnpm typecheck && pnpm test && pnpm lint && pnpm knip',
      'verify-runtime': 'pnpm build && node dist/bin/partita.js verify --level runtime',
      'verify-source': 'pnpm build && node dist/bin/partita.js verify --level source',
    },
  }
}

function buildPackageJson(version: string): JsonObject {
  const packageJson = {
    name: 'partita',
    type: 'module',
    version,
    description: 'CLI-backed Codex skill harness for user-defined workflow skills.',
    author: 'sayori',
    private: true,
    packageManager: 'pnpm@11.7.0',
    license: 'MIT',
    bin: {
      partita: 'dist/bin/partita.js',
    },
    files: [
      'dist',
      'LICENSE',
      'README.md',
      'AGENTS.md',
      'MIGRATION.md',
      MATERIALIZE_CONFIG_RELATIVE_PATH,
      'docs',
      'harness',
      'skills',
    ],
    ...partitaPackageFields(),
  }

  return packageJson satisfies JsonObject
}

const renderPackageJson = Effect.fn('renderPackageJson')(function* (version: string) {
  return renderJson(buildPackageJson(version))
})

function renderSkillInventoryReport(skills: ReadonlyArray<SourceSkillMetadata>): string {
  const rows = ['| Handle | Name | Invocation | Description | File |', '|--------|------|------------|-------------|------|']
  for (const skill of [...skills].sort((left, right) => left.handle.localeCompare(right.handle))) {
    rows.push(`| ${skill.handle} | ${skill.name} | ${String(skill.allowImplicitInvocation)} | ${markdownTableCell(skill.description)} | \`${skill.relativePath}\` |`)
  }

  return `# Dispatcher

Dispatcher 是 Partita 从当前 \`skills/\` source materialize 出来的 skill inventory audit。

它不是 runtime governance、installer state、mapping layer 或 durable knowledge layer。

它不决定 Codex runtime 加载哪些 skills；runtime 安装状态由 skills.sh CLI 管理。

## Inventory

${rows.join('\n')}
`
}

function markdownTableCell(value: string): string {
  return value.replace(/\s+/g, ' ').replaceAll('|', '\\|').trim()
}

const readMaterializeConfig = Effect.fn('readMaterializeConfig')(function* (root: string) {
  const configPath = joinPath(root, MATERIALIZE_CONFIG_RELATIVE_PATH)
  const fs = yield* FileSystem.FileSystem
  const exists = yield* pathExists(fs, configPath)
  if (!exists) {
    return yield* failGenerator(configPath, `ERROR: missing materialize config: ${MATERIALIZE_CONFIG_RELATIVE_PATH}`)
  }

  const config = yield* parseJsonObject(configPath, yield* fs.readFileString(configPath))
  const copies = parseCopies(config.copies, configPath)
  const reports = parseReports(config.reports, configPath)
  if (copies instanceof PartitaGeneratorError) {
    return yield* Effect.fail(copies)
  }
  if (reports instanceof PartitaGeneratorError) {
    return yield* Effect.fail(reports)
  }
  return { copies, reports } satisfies MaterializeConfig
})

function parseCopies(value: unknown, path: string): ReadonlyArray<MaterializedCopy> | PartitaGeneratorError {
  if (!Array.isArray(value)) {
    return new PartitaGeneratorError({ message: 'ERROR: materialize config copies must be an array', path })
  }

  const copies: Array<MaterializedCopy> = []
  for (const [index, entry] of value.entries()) {
    if (!isRecord(entry)) {
      return new PartitaGeneratorError({ message: `ERROR: materialize config copies[${index}] must be an object`, path })
    }
    if (typeof entry.source !== 'string' || !isSafeRelativePath(entry.source)) {
      return new PartitaGeneratorError({ message: `ERROR: materialize config copies[${index}].source must be a safe relative path`, path })
    }
    if (!isStringArray(entry.targets) || entry.targets.length === 0) {
      return new PartitaGeneratorError({ message: `ERROR: materialize config copies[${index}].targets must be a non-empty string array`, path })
    }
    for (const target of entry.targets) {
      if (!isSafeRelativePath(target)) {
        return new PartitaGeneratorError({ message: `ERROR: materialize config copies[${index}].targets contains unsafe path: ${target}`, path })
      }
      if (target === entry.source) {
        return new PartitaGeneratorError({ message: `ERROR: materialize config copy target must not equal source: ${target}`, path })
      }
    }
    copies.push({
      source: entry.source,
      targets: entry.targets,
    })
  }
  return copies
}

function parseReports(value: unknown, path: string): ReadonlyArray<MaterializedReport> | PartitaGeneratorError {
  if (!Array.isArray(value)) {
    return new PartitaGeneratorError({ message: 'ERROR: materialize config reports must be an array', path })
  }

  const reports: Array<MaterializedReport> = []
  for (const [index, entry] of value.entries()) {
    if (!isRecord(entry)) {
      return new PartitaGeneratorError({ message: `ERROR: materialize config reports[${index}] must be an object`, path })
    }
    if (entry.name !== 'skill-inventory') {
      return new PartitaGeneratorError({ message: `ERROR: unsupported materialized report: ${String(entry.name)}`, path })
    }
    if (typeof entry.target !== 'string' || !isSafeRelativePath(entry.target)) {
      return new PartitaGeneratorError({ message: `ERROR: materialize config reports[${index}].target must be a safe relative path`, path })
    }
    reports.push({
      name: entry.name,
      target: entry.target,
    })
  }
  return reports
}

function isSafeRelativePath(path: string): boolean {
  return path.trim().length > 0 && !path.startsWith('/') && !path.split('/').includes('..')
}

const renderMaterializedCopies = Effect.fn('renderMaterializedCopies')(function* (
  root: string,
  config: MaterializeConfig,
) {
  const fs = yield* FileSystem.FileSystem
  const files: Array<GeneratedFile> = []

  for (const copy of config.copies) {
    const sourcePath = joinPath(root, copy.source)
    const sourceExists = yield* pathExists(fs, sourcePath)
    if (!sourceExists) {
      return yield* failGenerator(sourcePath, `ERROR: missing materialize source: ${copy.source}`)
    }

    const sourceText = yield* fs.readFileString(sourcePath)
    for (const target of copy.targets) {
      files.push({
        relativePath: target,
        path: joinPath(root, target),
        content: sourceText,
      })
    }
  }

  return files.sort((left, right) => left.relativePath.localeCompare(right.relativePath))
})

function renderMaterializedReports(
  root: string,
  config: MaterializeConfig,
  skills: ReadonlyArray<SourceSkillMetadata>,
): ReadonlyArray<GeneratedFile> | PartitaGeneratorError {
  const files: Array<GeneratedFile> = []
  for (const report of config.reports) {
    if (report.name !== 'skill-inventory') {
      return new PartitaGeneratorError({ message: `ERROR: unsupported materialized report: ${report.name}`, path: MATERIALIZE_CONFIG_RELATIVE_PATH })
    }
    files.push({
      relativePath: report.target,
      path: joinPath(root, report.target),
      content: renderSkillInventoryReport(skills),
    })
  }
  return files
}

export const renderGeneratedFiles = Effect.fn('renderGeneratedFiles')(function* (root: string) {
  const version = yield* readPackageVersion(root)
  const config = yield* readMaterializeConfig(root)
  const skills = yield* collectSkillMetadata(root)
  const packageJson = yield* renderPackageJson(version)
  const materializedReports = renderMaterializedReports(root, config, skills)
  if (materializedReports instanceof PartitaGeneratorError) {
    return yield* Effect.fail(materializedReports)
  }
  const materializedCopies = yield* renderMaterializedCopies(root, config)

  return [
    {
      relativePath: 'package.json',
      path: joinPath(root, 'package.json'),
      content: packageJson,
    },
    ...materializedReports,
    ...materializedCopies,
  ] satisfies Array<GeneratedFile>
})

export const checkGeneratedFiles = Effect.fn('checkGeneratedFiles')(function* (root: string) {
  const fs = yield* FileSystem.FileSystem
  const files = yield* renderGeneratedFiles(root)
  const results: Array<GeneratedFileCheckResult> = []

  for (const file of files) {
    const exists = yield* pathExists(fs, file.path)
    const actual = exists ? yield* fs.readFileString(file.path) : ''
    results.push({
      relativePath: file.relativePath,
      path: file.path,
      status: actual === file.content ? 'ok' : 'drift',
    })
  }

  return results
})

export const writeGeneratedFiles = Effect.fn('writeGeneratedFiles')(function* (root: string) {
  const fs = yield* FileSystem.FileSystem
  const files = yield* renderGeneratedFiles(root)
  const results: Array<GeneratedFileWriteResult> = []

  for (const file of files) {
    const exists = yield* pathExists(fs, file.path)
    const actual = exists ? yield* fs.readFileString(file.path) : ''
    if (actual === file.content) {
      results.push({
        relativePath: file.relativePath,
        path: file.path,
        status: 'unchanged',
      })
      continue
    }

    yield* fs.makeDirectory(parentPath(file.path), { recursive: true })
    yield* fs.writeFileString(file.path, file.content)
    results.push({
      relativePath: file.relativePath,
      path: file.path,
      status: 'written',
    })
  }

  return results
})

export interface GenerateProjectOptions {
  readonly root: string
  readonly check?: boolean
}

export const generateProject = Effect.fn('generateProject')(function* ({ check = false, root }: GenerateProjectOptions) {
  if (!check) {
    return yield* writeGeneratedFiles(root)
  }

  const results = yield* checkGeneratedFiles(root)
  const drift = results.filter(result => result.status === 'drift')
  if (drift.length > 0) {
    return yield* failGenerator(
      root,
      `DRIFT: ${drift.map(result => result.relativePath).join(', ')} out of sync; run generate.`,
    )
  }
  return results
})
