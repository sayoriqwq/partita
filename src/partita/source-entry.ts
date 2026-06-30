import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import * as Console from 'effect/Console'
import * as Effect from 'effect/Effect'
import { PartitaError } from './errors.ts'

export const defaultSourceContractPath = '.partita/source-entries.json'

type SourceMechanism = 'git-subtree'
export type SourceOwnershipMode = 'direct' | 'provider' | 'prelude-maintain'
type SourcePolicyDecision = 'enabled' | 'recommended' | 'disabled'
type ParsedSourceMechanism = SourceMechanism | ''
type ParsedSourceOwnershipMode = SourceOwnershipMode | ''
type ParsedSourcePolicyDecision = SourcePolicyDecision | ''
type ParsedSourceFilesExcludeDecision = 'enabled' | 'disabled' | ''

export interface SourceEntryContract {
  readonly schemaVersion: 1
  readonly sources: ReadonlyArray<SourceEntry>
}

export interface SourceEntry {
  readonly name: string
  readonly upstream: {
    readonly repository: string
    readonly branch: string
    readonly ref: string
  }
  readonly local: {
    readonly prefix: string
  }
  readonly mechanism: ParsedSourceMechanism
  readonly anchor: {
    readonly llmDocument: string
  }
  readonly commands: {
    readonly update: string
    readonly verify: string
  }
  readonly agent: {
    readonly route: string
  }
  readonly editorPolicy: {
    readonly autoImportExclude: 'block' | ''
    readonly watcherExclude: ParsedSourcePolicyDecision
    readonly searchExclude: ParsedSourcePolicyDecision
    readonly filesExclude: ParsedSourceFilesExcludeDecision
  }
  readonly ownership: {
    readonly mode: ParsedSourceOwnershipMode
  }
  readonly boundaries: {
    readonly readOnly: boolean
    readonly importBlock: boolean
  }
  readonly pin: {
    readonly ref: string
    readonly trailer: string
  }
}

export interface SourcePlanOptions {
  readonly root: string
  readonly contractPath?: string
  readonly name?: string
  readonly repository?: string
  readonly branch?: string
  readonly ref?: string
  readonly prefix?: string
  readonly anchor?: string
  readonly updateCommand?: string
  readonly verifyCommand?: string
  readonly agentRoute?: string
  readonly mechanism?: SourceMechanism
  readonly ownershipMode?: SourceOwnershipMode
  readonly watcherExclude?: SourcePolicyDecision
  readonly searchExclude?: SourcePolicyDecision
  readonly filesExclude?: Exclude<SourcePolicyDecision, 'recommended'>
}

export interface SourceCommandOptions {
  readonly root: string
  readonly contractPath?: string
  readonly name?: string
}

export interface SourceEntryIssue {
  readonly code: string
  readonly message: string
  readonly path?: string
}

export interface SourceEntryStatus {
  readonly name: string
  readonly prefix: string
  readonly mechanism: string
  readonly ownershipMode: string
  readonly pinnedRef: string
  readonly sourceExists: boolean
  readonly anchorExists: boolean
  readonly routeExists: boolean
}

export interface SourceEntryReport {
  readonly ok: boolean
  readonly contractPath: string
  readonly entries: ReadonlyArray<SourceEntryStatus>
  readonly issues: ReadonlyArray<SourceEntryIssue>
}

export interface SourceEntryPlan {
  readonly contractPath: string
  readonly contract: SourceEntryContract
  readonly contractJson: string
  readonly editorSettings: {
    readonly vscode: string
    readonly zed: string
  }
}

type JsonRecord = Record<string, unknown>

const sourceCodeExtensions = new Set([
  '.cjs',
  '.cts',
  '.js',
  '.jsx',
  '.mjs',
  '.mts',
  '.ts',
  '.tsx',
])

const ignoredDirectoryNames = new Set([
  '.git',
  '.turbo',
  'coverage',
  'dist',
  'node_modules',
])

const fromSpecifierPattern = /\bfrom\s*['"]([^'"]+)['"]/gu
const sideEffectImportPattern = /^\s*import\s*['"]([^'"]+)['"]/gmu
const dynamicImportPattern = /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/gu
const requirePattern = /\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/gu

export const buildSourceEntryPlan = Effect.fn('buildSourceEntryPlan')(function* (options: SourcePlanOptions) {
  return yield* Effect.sync(() => {
    const root = resolve(options.root)
    const name = nonEmpty(options.name) ?? 'source'
    const prefix = normalizeRelativePath(nonEmpty(options.prefix) ?? `repos/${name}`)
    const ref = nonEmpty(options.ref) ?? '<TODO:pinned-ref-or-subtree-split>'
    const entry: SourceEntry = {
      name,
      upstream: {
        repository: nonEmpty(options.repository) ?? '<TODO:upstream-repository>',
        branch: nonEmpty(options.branch) ?? 'main',
        ref,
      },
      local: {
        prefix,
      },
      mechanism: options.mechanism ?? 'git-subtree',
      anchor: {
        llmDocument: normalizeRelativePath(nonEmpty(options.anchor) ?? `${prefix}/LLMS.md`),
      },
      commands: {
        update: nonEmpty(options.updateCommand) ?? `partita source update --name ${name} --dry-run`,
        verify: nonEmpty(options.verifyCommand) ?? `partita source verify --name ${name}`,
      },
      agent: {
        route: normalizeRelativePath(nonEmpty(options.agentRoute) ?? defaultAgentRoute(root)),
      },
      editorPolicy: {
        autoImportExclude: 'block',
        watcherExclude: options.watcherExclude ?? 'recommended',
        searchExclude: options.searchExclude ?? 'recommended',
        filesExclude: options.filesExclude ?? 'disabled',
      },
      ownership: {
        mode: options.ownershipMode ?? defaultOwnershipMode(root),
      },
      boundaries: {
        importBlock: true,
        readOnly: true,
      },
      pin: {
        ref,
        trailer: ref.startsWith('<TODO:') ? '<TODO:git-subtree-split-trailer>' : `git-subtree-split: ${ref}`,
      },
    }
    const contract: SourceEntryContract = {
      schemaVersion: 1,
      sources: [entry],
    }
    return {
      contract,
      contractJson: `${JSON.stringify(contract, null, 2)}\n`,
      contractPath: normalizeRelativePath(options.contractPath ?? defaultSourceContractPath),
      editorSettings: renderEditorSettings(entry),
    } satisfies SourceEntryPlan
  })
})

export const inspectSourceEntries = Effect.fn('inspectSourceEntries')(function* (options: SourceCommandOptions) {
  return yield* Effect.sync(() => {
    const root = resolve(options.root)
    const contractPath = normalizeRelativePath(options.contractPath ?? defaultSourceContractPath)
    const contract = parseSourceContractFile(root, contractPath)
    return buildSourceEntryReport(root, contractPath, filterSources(contract.sources, options.name))
  })
})

export const printSourcePlan = Effect.fn('printSourcePlan')(function* (options: SourcePlanOptions) {
  const plan = yield* buildSourceEntryPlan(options)
  yield* Console.log(`Source entry plan: ${plan.contractPath}`)
  yield* Console.log('')
  yield* Console.log(plan.contractJson.trimEnd())
  yield* Console.log('')
  yield* Console.log('VSCode settings shape:')
  yield* Console.log(plan.editorSettings.vscode.trimEnd())
  yield* Console.log('')
  yield* Console.log('Zed settings shape:')
  yield* Console.log(plan.editorSettings.zed.trimEnd())
  return plan
})

export const printSourceStatus = Effect.fn('printSourceStatus')(function* (options: SourceCommandOptions) {
  const report = yield* inspectSourceEntries(options)
  yield* Console.log(`Source contract: ${report.contractPath}`)
  if (report.entries.length === 0) {
    yield* Console.log('No source entries matched.')
  }
  for (const entry of report.entries) {
    yield* Console.log(formatSourceEntryStatus(entry))
  }
  if (report.issues.length > 0) {
    yield* Console.log('Issues:')
    for (const issue of report.issues) {
      yield* Console.log(`- ${formatSourceIssue(issue)}`)
    }
  }
  return report
})

export const verifySourceEntries = Effect.fn('verifySourceEntries')(function* (options: SourceCommandOptions) {
  const report = yield* inspectSourceEntries(options)
  if (!report.ok) {
    yield* Console.error('Source-entry verification failed:')
    for (const issue of report.issues) {
      yield* Console.error(`- ${formatSourceIssue(issue)}`)
    }
    return yield* Effect.fail(new PartitaError('Source-entry verification failed.'))
  }

  yield* Console.log(`Source entries verified: ${report.contractPath}`)
  return report
})

function parseSourceContractFile(root: string, contractPath: string): SourceEntryContract {
  const relativePath = normalizeRelativePath(contractPath)
  const absolutePath = resolve(root, relativePath)
  if (!existsSync(absolutePath)) {
    throw new PartitaError(`Source contract missing: ${relativePath}`)
  }
  const raw = parseJson(readFileSync(absolutePath, 'utf8'), relativePath)
  return normalizeSourceContract(raw, relativePath)
}

function normalizeSourceContract(raw: unknown, path: string): SourceEntryContract {
  if (!isRecord(raw)) {
    throw new PartitaError(`Source contract must be a JSON object: ${path}`)
  }

  if (Array.isArray(raw.sources)) {
    return {
      schemaVersion: 1,
      sources: raw.sources.map((entry, index) => normalizeSourceEntry(entry, `${path}#sources[${index}]`)),
    }
  }

  return {
    schemaVersion: 1,
    sources: [normalizeSourceEntry(raw, path)],
  }
}

function normalizeSourceEntry(raw: unknown, path: string): SourceEntry {
  if (!isRecord(raw)) {
    throw new PartitaError(`Source entry must be a JSON object: ${path}`)
  }

  const upstream = recordAt(raw.upstream)
  const local = recordAt(raw.local)
  const anchor = recordAt(raw.anchor)
  const commands = recordAt(raw.commands)
  const agent = recordAt(raw.agent)
  const editorPolicy = recordAt(raw.editorPolicy)
  const ownership = recordAt(raw.ownership)
  const boundaries = recordAt(raw.boundaries)
  const pin = recordAt(raw.pin)
  const split = stringAt(raw.split)
  const ref = stringAt(pin.ref) ?? stringAt(upstream.ref) ?? split ?? ''

  return {
    name: stringAt(raw.name) ?? 'source',
    upstream: {
      repository: stringAt(upstream.repository) ?? stringAt(raw.repository) ?? '',
      branch: stringAt(upstream.branch) ?? stringAt(raw.branch) ?? '',
      ref,
    },
    local: {
      prefix: normalizeRelativePath(stringAt(local.prefix) ?? stringAt(raw.prefix) ?? ''),
    },
    mechanism: normalizeMechanism(stringAt(raw.mechanism) ?? 'git-subtree'),
    anchor: {
      llmDocument: normalizeRelativePath(stringAt(anchor.llmDocument) ?? stringAt(raw.llmDocument) ?? ''),
    },
    commands: {
      update: stringAt(commands.update) ?? stringAt(raw.updateCommand) ?? '',
      verify: stringAt(commands.verify) ?? stringAt(raw.verifyCommand) ?? '',
    },
    agent: {
      route: normalizeRelativePath(stringAt(agent.route) ?? stringAt(raw.agentRoute) ?? ''),
    },
    editorPolicy: {
      autoImportExclude: stringAt(editorPolicy.autoImportExclude) === 'block' ? 'block' : '',
      watcherExclude: normalizePolicyDecision(stringAt(editorPolicy.watcherExclude)),
      searchExclude: normalizePolicyDecision(stringAt(editorPolicy.searchExclude)),
      filesExclude: normalizeFilesExclude(stringAt(editorPolicy.filesExclude)),
    },
    ownership: {
      mode: normalizeOwnershipMode(stringAt(ownership.mode) ?? stringAt(raw.ownershipMode)),
    },
    boundaries: {
      importBlock: booleanAt(boundaries.importBlock) ?? booleanAt(raw.importBlock) ?? false,
      readOnly: booleanAt(boundaries.readOnly) ?? booleanAt(raw.readOnly) ?? false,
    },
    pin: {
      ref,
      trailer: stringAt(pin.trailer) ?? stringAt(raw.trailer) ?? (split ? `git-subtree-split: ${split}` : ''),
    },
  }
}

function buildSourceEntryReport(
  root: string,
  contractPath: string,
  sources: ReadonlyArray<SourceEntry>,
): SourceEntryReport {
  const issues = sources.flatMap(entry => checkSourceEntry(root, entry))
  return {
    contractPath,
    entries: sources.map(entry => sourceEntryStatus(root, entry)),
    issues,
    ok: issues.length === 0,
  }
}

function checkSourceEntry(root: string, entry: SourceEntry): ReadonlyArray<SourceEntryIssue> {
  const issues: Array<SourceEntryIssue> = []
  const prefix = entry.local.prefix
  const prefixPath = prefix ? resolve(root, prefix) : root

  issues.push(...checkRequiredEntryFields(entry))
  issues.push(...checkRelativeEntryPaths(entry))

  if (!isMissingValue(prefix) && !existsSync(prefixPath)) {
    issues.push(issue('source.missing', `source prefix is missing: ${prefix}`, prefix))
  }
  if (!isMissingValue(prefix) && sourcePrefixIsGitlink(root, prefix)) {
    issues.push(issue('source.gitlink', `source prefix must be a git subtree checkout, not a submodule or gitlink: ${prefix}`, prefix))
  }
  if (!isMissingValue(prefix) && existsSync(join(prefixPath, '.git'))) {
    issues.push(issue('source.gitlink', `source prefix contains nested git metadata: ${prefix}/.git`, `${prefix}/.git`))
  }

  if (isMissingValue(entry.upstream.ref) && isMissingValue(entry.pin.ref) && isMissingValue(entry.pin.trailer)) {
    issues.push(issue('source.pin_missing', 'missing verifiable pin ref or git-subtree trailer', prefix))
  }

  if (!isMissingValue(entry.anchor.llmDocument) && !existsSync(resolve(root, entry.anchor.llmDocument))) {
    issues.push(issue('source.anchor_missing', `anchor LLM document is missing: ${entry.anchor.llmDocument}`, entry.anchor.llmDocument))
  }
  if (!isMissingValue(entry.agent.route) && !existsSync(resolve(root, entry.agent.route))) {
    issues.push(issue('source.agent_route_missing', `agent route is missing: ${entry.agent.route}`, entry.agent.route))
  }

  if (!entry.boundaries.readOnly) {
    issues.push(issue('source.read_only_missing', 'source entry must be marked read-only', prefix))
  }
  if (!entry.boundaries.importBlock) {
    issues.push(issue('source.import_block_missing', 'source entry must enable import blocking', prefix))
  }
  if (preludeManaged(root) && entry.ownership.mode === 'direct') {
    issues.push(issue('source.prelude_direct_write', 'prelude-managed targets must not use direct source-entry writes', '.prelude/manifest.json'))
  }

  if (entry.boundaries.importBlock && !isMissingValue(prefix)) {
    issues.push(...checkForbiddenImports(root, entry))
  }
  issues.push(...checkEditorPolicy(root, entry))

  return issues
}

function checkRequiredEntryFields(entry: SourceEntry): ReadonlyArray<SourceEntryIssue> {
  const fields = [
    ['source.name', entry.name],
    ['source.upstream.repository', entry.upstream.repository],
    ['source.upstream.branch', entry.upstream.branch],
    ['source.upstream.ref', entry.upstream.ref || entry.pin.ref || entry.pin.trailer],
    ['source.local.prefix', entry.local.prefix],
    ['source.mechanism', entry.mechanism],
    ['source.anchor.llmDocument', entry.anchor.llmDocument],
    ['source.commands.update', entry.commands.update],
    ['source.commands.verify', entry.commands.verify],
    ['source.agent.route', entry.agent.route],
    ['source.editorPolicy.autoImportExclude', entry.editorPolicy.autoImportExclude],
    ['source.editorPolicy.watcherExclude', entry.editorPolicy.watcherExclude],
    ['source.editorPolicy.searchExclude', entry.editorPolicy.searchExclude],
    ['source.editorPolicy.filesExclude', entry.editorPolicy.filesExclude],
    ['source.ownership.mode', entry.ownership.mode],
  ] as const
  return fields
    .filter(([, value]) => isMissingValue(value))
    .map(([field]) => issue('source.contract_missing', `missing source-entry contract field: ${field}`))
}

function checkRelativeEntryPaths(entry: SourceEntry): ReadonlyArray<SourceEntryIssue> {
  const paths = [
    ['source.local.prefix', entry.local.prefix],
    ['source.anchor.llmDocument', entry.anchor.llmDocument],
    ['source.agent.route', entry.agent.route],
  ] as const
  return paths.flatMap(([field, value]) => {
    if (isMissingValue(value) || validRelativePath(value)) {
      return []
    }
    return [issue('source.path_invalid', `${field} must be a relative path inside the target repo: ${value}`, value)]
  })
}

function checkForbiddenImports(root: string, entry: SourceEntry): ReadonlyArray<SourceEntryIssue> {
  const files = collectSourceCodeFiles(root, [entry.local.prefix])
  const issues: Array<SourceEntryIssue> = []
  for (const file of files) {
    const text = readFileSync(file, 'utf8')
    for (const specifier of importedSpecifiers(text)) {
      if (specifierTargetsPrefix(root, file, specifier, entry.local.prefix)) {
        const relativeFile = relativePathFrom(root, file)
        issues.push(issue(
          'source.import_blocked',
          `application/test code must not import from source prefix ${entry.local.prefix}: ${specifier}`,
          relativeFile,
        ))
      }
    }
  }
  return issues
}

function checkEditorPolicy(root: string, entry: SourceEntry): ReadonlyArray<SourceEntryIssue> {
  const issues: Array<SourceEntryIssue> = []
  if (entry.editorPolicy.autoImportExclude !== 'block') {
    issues.push(issue('source.editor_auto_import_missing', 'editor policy must block auto-import from the source prefix'))
  }

  const vscodeSettings = join(root, '.vscode', 'settings.json')
  if (existsSync(vscodeSettings)) {
    const value = parseSettingsFile(vscodeSettings, '.vscode/settings.json')
    if (value instanceof PartitaError) {
      issues.push(issue('source.editor_settings_invalid', value.message, '.vscode/settings.json'))
    }
    else if (!vscodeAutoImportExcluded(value, entry.local.prefix)) {
      issues.push(issue('source.editor_vscode_auto_import_missing', 'VSCode settings must exclude the source prefix from TypeScript and JavaScript auto-imports', '.vscode/settings.json'))
    }
  }

  const zedSettings = join(root, '.zed', 'settings.json')
  if (existsSync(zedSettings)) {
    const value = parseSettingsFile(zedSettings, '.zed/settings.json')
    if (value instanceof PartitaError) {
      issues.push(issue('source.editor_settings_invalid', value.message, '.zed/settings.json'))
    }
    else if (!zedAutoImportExcluded(value, entry.local.prefix)) {
      issues.push(issue('source.editor_zed_auto_import_missing', 'Zed settings must exclude the source prefix through nested TypeScript LSP auto-import preferences', '.zed/settings.json'))
    }
  }

  return issues
}

function sourceEntryStatus(root: string, entry: SourceEntry): SourceEntryStatus {
  return {
    anchorExists: !isMissingValue(entry.anchor.llmDocument) && existsSync(resolve(root, entry.anchor.llmDocument)),
    mechanism: entry.mechanism,
    name: entry.name,
    ownershipMode: entry.ownership.mode,
    pinnedRef: entry.pin.ref || entry.upstream.ref || entry.pin.trailer,
    prefix: entry.local.prefix,
    routeExists: !isMissingValue(entry.agent.route) && existsSync(resolve(root, entry.agent.route)),
    sourceExists: !isMissingValue(entry.local.prefix) && existsSync(resolve(root, entry.local.prefix)),
  }
}

function formatSourceEntryStatus(entry: SourceEntryStatus): string {
  return [
    `- ${entry.name}`,
    `prefix=${entry.prefix}`,
    `mechanism=${entry.mechanism}`,
    `ownership=${entry.ownershipMode}`,
    `pin=${entry.pinnedRef || '<missing>'}`,
    `source=${entry.sourceExists ? 'present' : 'missing'}`,
    `anchor=${entry.anchorExists ? 'present' : 'missing'}`,
    `route=${entry.routeExists ? 'present' : 'missing'}`,
  ].join(' ')
}

function formatSourceIssue(issue: SourceEntryIssue): string {
  return issue.path ? `${issue.path}: ${issue.code}: ${issue.message}` : `${issue.code}: ${issue.message}`
}

function renderEditorSettings(entry: SourceEntry): SourceEntryPlan['editorSettings'] {
  const glob = `${entry.local.prefix}/**`
  const vscode: JsonRecord = {
    'javascript.preferences.autoImportFileExcludePatterns': [glob],
    'typescript.preferences.autoImportFileExcludePatterns': [glob],
  }
  if (entry.editorPolicy.watcherExclude !== 'disabled') {
    vscode['files.watcherExclude'] = { [glob]: true }
  }
  if (entry.editorPolicy.searchExclude !== 'disabled') {
    vscode['search.exclude'] = { [glob]: true }
  }
  if (entry.editorPolicy.filesExclude === 'enabled') {
    vscode['files.exclude'] = { [glob]: true }
  }

  const zed: JsonRecord = {
    lsp: {
      'vtsls': {
        settings: {
          javascript: {
            preferences: {
              autoImportFileExcludePatterns: [glob],
            },
          },
          typescript: {
            preferences: {
              autoImportFileExcludePatterns: [glob],
            },
          },
        },
      },
      'typescript-language-server': {
        initialization_options: {
          preferences: {
            autoImportFileExcludePatterns: [glob],
          },
        },
      },
    },
  }
  if (entry.editorPolicy.filesExclude === 'enabled') {
    zed.file_scan_exclusions = [glob]
  }

  return {
    vscode: `${JSON.stringify(vscode, null, 2)}\n`,
    zed: `${JSON.stringify(zed, null, 2)}\n`,
  }
}

function vscodeAutoImportExcluded(settings: JsonRecord, prefix: string): boolean {
  const glob = `${prefix}/**`
  return stringArrayIncludes(settings['typescript.preferences.autoImportFileExcludePatterns'], glob)
    && stringArrayIncludes(settings['javascript.preferences.autoImportFileExcludePatterns'], glob)
}

function zedAutoImportExcluded(settings: JsonRecord, prefix: string): boolean {
  const glob = `${prefix}/**`
  const lsp = recordAt(settings.lsp)
  const vtslsSettings = recordAt(recordAt(recordAt(lsp.vtsls).settings))
  const tsPreferences = recordAt(recordAt(vtslsSettings.typescript).preferences)
  const jsPreferences = recordAt(recordAt(vtslsSettings.javascript).preferences)
  const typescriptLanguageServer = recordAt(lsp['typescript-language-server'])
  const initializationOptions = recordAt(typescriptLanguageServer.initialization_options)
  const tlsPreferences = recordAt(initializationOptions.preferences)

  const vtslsConfigured = stringArrayIncludes(tsPreferences.autoImportFileExcludePatterns, glob)
    && stringArrayIncludes(jsPreferences.autoImportFileExcludePatterns, glob)
  const tlsConfigured = stringArrayIncludes(tlsPreferences.autoImportFileExcludePatterns, glob)
  return vtslsConfigured || tlsConfigured
}

function sourcePrefixIsGitlink(root: string, prefix: string): boolean {
  const result = spawnSync('git', ['ls-files', '--stage', '--', prefix], {
    cwd: root,
    encoding: 'utf8',
  })
  if (result.status !== 0) {
    return false
  }
  return result.stdout.split(/\r?\n/u).some(line => line.startsWith('160000 '))
}

function collectSourceCodeFiles(root: string, sourcePrefixes: ReadonlyArray<string>): ReadonlyArray<string> {
  const files: Array<string> = []

  function visit(directory: string) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const absolutePath = join(directory, entry.name)
      const relativePath = relativePathFrom(root, absolutePath)
      if (entry.isDirectory()) {
        if (ignoredDirectoryNames.has(entry.name) || sourcePrefixes.some(prefix => pathIsSameOrInside(relativePath, prefix))) {
          continue
        }
        visit(absolutePath)
        continue
      }
      if (!entry.isFile() || sourcePrefixes.some(prefix => pathIsSameOrInside(relativePath, prefix))) {
        continue
      }
      if (sourceCodeExtensions.has(extensionOf(entry.name))) {
        files.push(absolutePath)
      }
    }
  }

  visit(root)
  return files
}

function importedSpecifiers(text: string): ReadonlyArray<string> {
  const specifiers: Array<string> = []
  for (const pattern of [fromSpecifierPattern, sideEffectImportPattern, dynamicImportPattern, requirePattern]) {
    for (const match of text.matchAll(pattern)) {
      const value = match[1]
      if (value !== undefined) {
        specifiers.push(value)
      }
    }
  }
  return specifiers
}

function specifierTargetsPrefix(root: string, importer: string, specifier: string, prefix: string): boolean {
  if (specifier === prefix || specifier.startsWith(`${prefix}/`)) {
    return true
  }
  if (!specifier.startsWith('.')) {
    return false
  }
  const resolved = resolve(dirname(importer), specifier)
  return pathIsSameOrInside(relativePathFrom(root, resolved), prefix)
}

function filterSources(sources: ReadonlyArray<SourceEntry>, name: string | undefined): ReadonlyArray<SourceEntry> {
  const target = nonEmpty(name)
  return target === undefined ? sources : sources.filter(source => source.name === target)
}

function parseJson(text: string, path: string): unknown {
  try {
    return JSON.parse(text)
  }
  catch (cause) {
    throw new PartitaError(`Invalid JSON in ${path}: ${cause instanceof Error ? cause.message : String(cause)}`)
  }
}

function parseSettingsFile(path: string, relativePath: string): JsonRecord | PartitaError {
  try {
    const parsed = JSON.parse(stripJsonComments(readFileSync(path, 'utf8'))) as unknown
    if (!isRecord(parsed)) {
      return new PartitaError(`${relativePath} must contain a JSON object`)
    }
    return parsed
  }
  catch (cause) {
    return new PartitaError(`Invalid JSON in ${relativePath}: ${cause instanceof Error ? cause.message : String(cause)}`)
  }
}

function stripJsonComments(text: string): string {
  let output = ''
  let inString = false
  let escaped = false
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    const next = text[index + 1]
    if (char === undefined) {
      continue
    }
    if (inString) {
      const wasEscaped = escaped
      output += char
      escaped = char === '\\' && !escaped
      if (char === '"' && !wasEscaped) {
        inString = false
      }
      else if (char !== '\\') {
        escaped = false
      }
      continue
    }
    if (char === '"') {
      inString = true
      output += char
      continue
    }
    if (char === '/' && next === '/') {
      while (index < text.length && text[index] !== '\n') {
        index += 1
      }
      output += '\n'
      continue
    }
    if (char === '/' && next === '*') {
      index += 2
      while (index < text.length && !(text[index] === '*' && text[index + 1] === '/')) {
        index += 1
      }
      index += 1
      continue
    }
    output += char
  }
  return output
}

function normalizeMechanism(value: string | undefined): ParsedSourceMechanism {
  return value === 'git-subtree' ? 'git-subtree' : ''
}

function normalizeOwnershipMode(value: string | undefined): ParsedSourceOwnershipMode {
  if (value === 'provider' || value === 'prelude-maintain') {
    return value
  }
  return value === 'direct' ? 'direct' : ''
}

function normalizePolicyDecision(value: string | undefined): ParsedSourcePolicyDecision {
  if (value === 'enabled' || value === 'recommended' || value === 'disabled') {
    return value
  }
  return ''
}

function normalizeFilesExclude(value: string | undefined): ParsedSourceFilesExcludeDecision {
  if (value === 'enabled' || value === 'disabled') {
    return value
  }
  return ''
}

function defaultAgentRoute(root: string): string {
  return existsSync(join(root, 'AGENTS.md')) ? 'AGENTS.md' : '<TODO:agent-route>'
}

function defaultOwnershipMode(root: string): SourceOwnershipMode {
  return preludeManaged(root) ? 'prelude-maintain' : 'direct'
}

function preludeManaged(root: string): boolean {
  return existsSync(join(root, '.prelude', 'manifest.json'))
}

function nonEmpty(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed === undefined || trimmed.length === 0 ? undefined : trimmed
}

function isMissingValue(value: string): boolean {
  return value.trim().length === 0 || value.includes('<TODO:')
}

function normalizeRelativePath(value: string): string {
  return value.replaceAll('\\', '/').replace(/^\.\/+/u, '').replace(/\/+$/u, '')
}

function validRelativePath(value: string): boolean {
  if (isAbsolute(value)) {
    return false
  }
  const segments = normalizeRelativePath(value).split('/')
  return !segments.includes('..')
}

function pathIsSameOrInside(path: string, parent: string): boolean {
  const normalizedPath = normalizeRelativePath(path)
  const normalizedParent = normalizeRelativePath(parent)
  return normalizedPath === normalizedParent || normalizedPath.startsWith(`${normalizedParent}/`)
}

function relativePathFrom(root: string, path: string): string {
  const value = relative(root, path)
  return value.split(sep).join('/')
}

function extensionOf(path: string): string {
  const index = path.lastIndexOf('.')
  return index === -1 ? '' : path.slice(index)
}

function recordAt(value: unknown): JsonRecord {
  return isRecord(value) ? value : {}
}

function stringAt(value: unknown): string | undefined {
  return typeof value === 'string' ? value.trim() : undefined
}

function booleanAt(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined
}

function stringArrayIncludes(value: unknown, expected: string): boolean {
  return Array.isArray(value) && value.includes(expected)
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function issue(code: string, message: string, path?: string): SourceEntryIssue {
  return path === undefined ? { code, message } : { code, message, path }
}
