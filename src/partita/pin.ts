/* eslint-disable ts/no-use-before-define */
import type {
  CanonicalTreeArchiveSourceEntry,
  PinnedReferenceProvenance,
} from '@sayoriqwq/prelude-contract'
import { createHash } from 'node:crypto'
import {
  CANONICAL_TREE_ARCHIVE_FORMAT,
  encodeCanonicalTreeArchive,
  isSafeRelativeSymlink,
  PinnedReferenceProvenanceSchema,
  SYMBOLIC_LINK_MODE,
} from '@sayoriqwq/prelude-contract'
import * as Console from 'effect/Console'
import * as Effect from 'effect/Effect'
import * as FileSystem from 'effect/FileSystem'
import * as Path from 'effect/Path'
import * as Schema from 'effect/Schema'
import * as SchemaGetter from 'effect/SchemaGetter'
import * as SchemaTransformation from 'effect/SchemaTransformation'
import { PartitaError } from './errors.ts'
import { CommandExecutor } from './process.ts'

type PinOperation = 'add' | 'update'
type PinGitAction = PinOperation | 'none'
type InclusionDecision = 'excluded' | 'included'
type VisibilityDecision = 'hidden' | 'visible'
type ParsedInclusionDecision = InclusionDecision | ''
type ParsedVisibilityDecision = VisibilityDecision | ''

export interface GitHubSubtreePinContract {
  readonly schemaVersion: 2
  readonly name: string
  readonly source: {
    readonly repository: string
    readonly trackingBranch: string
    readonly revision: string
  }
  readonly materialization: {
    readonly prefix: string
    readonly mechanism: 'git-subtree' | ''
    readonly split: string
    readonly trailer: string
  }
  readonly ownership: { readonly mode: 'direct' | '' }
  readonly agent: {
    readonly anchor: string
    readonly route: string
    readonly readOnly: boolean
    readonly importBlock: boolean
  }
  readonly workspace: {
    readonly autoImport: 'excluded' | ''
    readonly watch: ParsedInclusionDecision
    readonly search: ParsedInclusionDecision
    readonly files: ParsedVisibilityDecision
  }
}

export interface PinPlanOptions {
  readonly operation: PinOperation
  readonly root: string
  readonly contractPath?: string
  readonly name?: string
  readonly repository?: string
  readonly branch?: string
  readonly revision?: string
  readonly prefix?: string
  readonly anchor?: string
  readonly agentRoute?: string
  readonly watch?: InclusionDecision
  readonly search?: InclusionDecision
  readonly files?: VisibilityDecision
}

export interface PinCommandOptions {
  readonly root: string
  readonly contractPath?: string
  readonly name?: string
  readonly prefix?: string
}

export interface PinApplyOptions {
  readonly operation: PinOperation
  readonly root: string
  readonly plan: PinPlan
  readonly planHash: string
  readonly revision: string
}

export interface PinPlanFileOptions {
  readonly operation: PinOperation
  readonly root: string
  readonly planPath: string
  readonly planHash: string
  readonly revision: string
}

export interface PinPublicationOptions extends PinCommandOptions {
  readonly archivePath: string
  readonly provenancePath: string
}

interface SourcePinPublication {
  readonly schemaVersion: 1
  readonly name: string
  readonly archive: {
    readonly format: typeof CANONICAL_TREE_ARCHIVE_FORMAT
  }
  readonly provenance: PinnedReferenceProvenance
}

export interface PinIssue {
  readonly code: string
  readonly message: string
  readonly path?: string
}

export interface PinStatus {
  readonly name: string
  readonly repository: string
  readonly trackingBranch: string
  readonly currentRevision: string
  readonly materializedRevision: string
  readonly prefix: string
  readonly mechanism: string
  readonly ownershipMode: string
  readonly contractPath: string
  readonly prefixExists: boolean
  readonly anchorExists: boolean
  readonly routeExists: boolean
}

interface PinReport {
  readonly ok: boolean
  readonly contractPath: string
  readonly entry: PinStatus
  readonly issues: ReadonlyArray<PinIssue>
}

interface PinBaseline {
  readonly head: string
  readonly contractDigest: string | null
  readonly prefixExists: boolean
  readonly materializedRevision: string | null
}

interface PinEditorChange {
  readonly path: '.vscode/settings.json' | '.zed/settings.json'
  readonly action: 'write' | 'none'
  readonly beforeDigest: string | null
  readonly contents: string | null
}

export interface PinPlan {
  readonly planVersion: 1
  readonly operation: PinOperation
  readonly contractPath: string
  readonly currentRevision: string | null
  readonly desiredRevision: string
  readonly recovery: boolean
  readonly baseline: PinBaseline
  readonly contract: GitHubSubtreePinContract
  readonly contractJson: string
  readonly git: {
    readonly command: 'git'
    readonly action: PinGitAction
    readonly args: ReadonlyArray<string>
  }
  readonly editorChanges: ReadonlyArray<PinEditorChange>
  readonly planHash: string
}

type PinPlanBody = Omit<PinPlan, 'planHash'>

interface MaterializedPin {
  readonly revision: string
  readonly squashCommit: string
  readonly treeMatches: boolean
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
const immutableRevisionPattern = /^[0-9a-f]{40,64}$/u

const PrettyJsonString = Schema.String.pipe(
  Schema.decodeTo(
    Schema.Unknown,
    new SchemaTransformation.Transformation(
      SchemaGetter.parseJson({}),
      SchemaGetter.stringifyJson({ space: 2 }),
    ),
  ),
)

const encodePrettyJson = Schema.encodeSync(PrettyJsonString)

export function defaultPinContractPath(options: {
  readonly name?: string
  readonly prefix?: string
}): string {
  const name = nonEmpty(options.name) ?? lastPathSegment(nonEmpty(options.prefix) ?? '') ?? 'pin'
  const prefix = normalizeRelativePath(nonEmpty(options.prefix) ?? `repos/${name}`)
  return siblingSubtreeContractPath(prefix, name)
}

export const buildPinPlan = Effect.fn('buildPinPlan')(function* (options: PinPlanOptions) {
  const path = yield* Path.Path
  const root = path.resolve(options.root)
  const operation = options.operation
  let currentContract: GitHubSubtreePinContract | null = null
  let name: string
  let repository: string
  let trackingBranch: string
  let prefix: string
  let contractPath: string
  let anchor: string
  let route: string
  let watch: InclusionDecision
  let search: InclusionDecision
  let files: VisibilityDecision

  if (operation === 'update') {
    contractPath = resolveContractPath(path, root, options)
    currentContract = yield* readGitHubSubtreeContract(root, contractPath)
    name = currentContract.name
    repository = currentContract.source.repository
    trackingBranch = currentContract.source.trackingBranch
    prefix = currentContract.materialization.prefix
    anchor = currentContract.agent.anchor
    route = currentContract.agent.route
    watch = yield* requireInclusionDecision(currentContract.workspace.watch, 'pin.workspace.watch')
    search = yield* requireInclusionDecision(currentContract.workspace.search, 'pin.workspace.search')
    files = yield* requireVisibilityDecision(currentContract.workspace.files, 'pin.workspace.files')
  }
  else {
    name = yield* requiredOption(options.name, '--name')
    repository = yield* requiredOption(options.repository, '--repository')
    trackingBranch = nonEmpty(options.branch) ?? 'main'
    prefix = normalizeRelativePath(nonEmpty(options.prefix) ?? `repos/${name}`)
    contractPath = pinContractPathFromOption(
      path,
      root,
      options.contractPath,
      defaultPinContractPath({ name, prefix }),
    )
    anchor = normalizeRelativePath(nonEmpty(options.anchor) ?? `${prefix}/LLMS.md`)
    route = normalizeRelativePath(nonEmpty(options.agentRoute) ?? (yield* defaultAgentRoute(root)))
    watch = options.watch ?? 'excluded'
    search = options.search ?? 'excluded'
    files = options.files ?? 'visible'
  }

  yield* validatePlanIdentity(path, { contractPath, prefix, repository, root })
  const desiredRevision = yield* resolveTrackingRevision(root, repository, trackingBranch)
  const revisionAssertion = nonEmpty(options.revision)
  if (revisionAssertion !== undefined && revisionAssertion !== desiredRevision) {
    return yield* new PartitaError(
      `Resolved revision ${desiredRevision} does not match requested immutable revision ${revisionAssertion}.`,
    )
  }

  const contract: GitHubSubtreePinContract = {
    schemaVersion: 2,
    name,
    source: { repository, trackingBranch, revision: desiredRevision },
    materialization: {
      prefix,
      mechanism: 'git-subtree',
      split: desiredRevision,
      trailer: `git-subtree-split: ${desiredRevision}`,
    },
    ownership: { mode: 'direct' },
    agent: { anchor, route, readOnly: true, importBlock: true },
    workspace: { autoImport: 'excluded', watch, search, files },
  }
  const contractJson = `${encodePrettyJson(contract)}\n`
  const contractText = yield* readOptionalFile(path.resolve(root, contractPath))
  if (operation === 'add' && contractText !== null) {
    return yield* new PartitaError(`Source Pin contract already exists at ${contractPath}; use an update plan.`)
  }

  const prefixExists = yield* fileExists(path.resolve(root, prefix))
  const materialized = prefixExists ? yield* inspectMaterializedPin(root, prefix) : null
  const currentRevision = currentContract?.source.revision ?? null
  let action: PinGitAction
  let recovery = false
  if (operation === 'add') {
    if (!prefixExists) {
      action = 'add'
    }
    else if (materialized?.revision === desiredRevision && materialized.treeMatches) {
      action = 'none'
      recovery = true
    }
    else {
      return yield* new PartitaError(
        `Pin prefix ${prefix} already exists without the approved Source Pin materialization; resolve it before add.`,
      )
    }
  }
  else if (materialized?.revision === desiredRevision && materialized.treeMatches) {
    action = 'none'
    recovery = currentRevision !== desiredRevision
  }
  else if (materialized?.revision === currentRevision && materialized.treeMatches) {
    action = currentRevision === desiredRevision ? 'none' : 'update'
  }
  else {
    return yield* new PartitaError(
      `Existing prefix ${prefix} does not match contract revision ${currentRevision ?? '<missing>'} or desired revision ${desiredRevision}.`,
    )
  }

  const head = (yield* gitOutput(root, ['rev-parse', 'HEAD'], 'Read target HEAD')).trim()
  const body: PinPlanBody = {
    planVersion: 1,
    operation,
    contract,
    contractPath,
    currentRevision,
    desiredRevision,
    recovery,
    baseline: {
      head,
      contractDigest: contractText === null ? null : sha256(contractText),
      prefixExists,
      materializedRevision: materialized?.revision ?? null,
    },
    contractJson,
    git: { command: 'git', action, args: gitSubtreeArgs(action, contract) },
    editorChanges: yield* buildEditorChanges(root, contract),
  }
  const plan: PinPlan = { ...body, planHash: hashPinPlanBody(body) }
  yield* validatePlanInternals(plan)
  return plan
})

export const applyPinPlan = Effect.fn('applyPinPlan')(function* (options: PinApplyOptions) {
  const path = yield* Path.Path
  const root = path.resolve(options.root)
  const plan = options.plan
  yield* validatePlanInternals(plan)
  const computedHash = hashPinPlan(plan)
  if (options.planHash !== plan.planHash || computedHash !== plan.planHash) {
    return yield* new PartitaError(
      `Approved plan hash does not match plan contents (expected ${computedHash}, received ${options.planHash}).`,
    )
  }
  if (options.operation !== plan.operation) {
    return yield* new PartitaError(`Approved plan operation is ${plan.operation}, not ${options.operation}.`)
  }
  if (options.revision !== plan.desiredRevision || !immutableRevisionPattern.test(options.revision)) {
    return yield* new PartitaError(`Approved immutable revision must equal plan revision ${plan.desiredRevision}.`)
  }

  yield* validatePlanBaseline(root, plan)
  const status = yield* gitOutput(root, ['status', '--porcelain', '--untracked-files=all'], 'Inspect worktree status')
  if (status.trim().length > 0) {
    return yield* new PartitaError(`Approved apply requires a clean worktree; found:\n${status.trim()}`)
  }
  const resolvedRevision = yield* resolveTrackingRevision(
    root,
    plan.contract.source.repository,
    plan.contract.source.trackingBranch,
  )
  if (resolvedRevision !== plan.desiredRevision) {
    return yield* new PartitaError(
      `Source Pin tracking branch moved from approved revision ${plan.desiredRevision} to ${resolvedRevision}; create a fresh plan.`,
    )
  }
  if (plan.git.action !== 'none') {
    yield* gitOutput(root, plan.git.args, `Apply git subtree ${plan.git.action}`)
  }

  const materialized = yield* inspectMaterializedPin(root, plan.contract.materialization.prefix)
  if (materialized?.revision !== plan.desiredRevision || !materialized.treeMatches) {
    return yield* new PartitaError(
      `Git subtree operation finished without approved materialization ${plan.desiredRevision}; create a fresh plan from repository state.`,
    )
  }

  const fs = yield* FileSystem.FileSystem
  const contractAbsolutePath = path.resolve(root, plan.contractPath)
  yield* fs.makeDirectory(path.dirname(contractAbsolutePath), { recursive: true }).pipe(
    Effect.mapError(cause => new PartitaError(`Create ${path.dirname(plan.contractPath)}: ${formatUnknown(cause)}`)),
  )
  yield* fs.writeFileString(contractAbsolutePath, plan.contractJson).pipe(
    Effect.mapError(cause => new PartitaError(`Write ${plan.contractPath}: ${formatUnknown(cause)}`)),
  )
  for (const change of plan.editorChanges) {
    if (change.action === 'write' && change.contents !== null) {
      yield* fs.writeFileString(path.resolve(root, change.path), change.contents).pipe(
        Effect.mapError(cause => new PartitaError(`Write ${change.path}: ${formatUnknown(cause)}`)),
      )
    }
  }
  return yield* inspectPins({ contractPath: plan.contractPath, root })
})

const applyPinPlanFile = Effect.fn('applyPinPlanFile')(function* (options: PinPlanFileOptions) {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const text = yield* fs.readFileString(path.resolve(options.planPath)).pipe(
    Effect.mapError(cause => new PartitaError(`Read plan ${options.planPath}: ${formatUnknown(cause)}`)),
  )
  const plan = yield* parsePinPlan(yield* parseJson(text, options.planPath))
  return yield* applyPinPlan({
    operation: options.operation,
    plan,
    planHash: options.planHash,
    revision: options.revision,
    root: options.root,
  })
})

export const inspectPins = Effect.fn('inspectPins')(function* (options: PinCommandOptions) {
  const path = yield* Path.Path
  const root = path.resolve(options.root)
  const defaultPathOptions: { name?: string, prefix?: string } = {}
  const name = nonEmpty(options.name)
  const prefix = nonEmpty(options.prefix)
  if (name !== undefined) {
    defaultPathOptions.name = name
  }
  if (prefix !== undefined) {
    defaultPathOptions.prefix = prefix
  }
  const contractPath = pinContractPathFromOption(path, root, options.contractPath, defaultPinContractPath(defaultPathOptions))
  const contract = yield* readGitHubSubtreeContract(root, contractPath)
  return yield* buildPinReport(root, contractPath, contract)
})

const inspectPublicationSource = Effect.fn('inspectPublicationSource')(function* (options: PinCommandOptions) {
  const path = yield* Path.Path
  const root = path.resolve(options.root)
  const defaultPathOptions: { name?: string, prefix?: string } = {}
  const name = nonEmpty(options.name)
  const prefix = nonEmpty(options.prefix)
  if (name !== undefined) {
    defaultPathOptions.name = name
  }
  if (prefix !== undefined) {
    defaultPathOptions.prefix = prefix
  }
  const contractPath = pinContractPathFromOption(path, root, options.contractPath, defaultPinContractPath(defaultPathOptions))
  const contract = yield* readGitHubSubtreeContract(root, contractPath)
  const issues = yield* checkPublicationSourceContract(root, contractPath, contract)
  return { contract, contractPath, issues, ok: issues.length === 0 }
})

export const printPinPlan = Effect.fn('printPinPlan')(function* (options: PinPlanOptions) {
  const plan = yield* buildPinPlan(options)
  yield* Console.log(encodePrettyJson(plan))
  return plan
})

export const printPinApply = Effect.fn('printPinApply')(function* (options: PinPlanFileOptions) {
  const report = yield* applyPinPlanFile(options)
  if (!report.ok) {
    yield* Console.error('GitHub subtree pin apply completed with verification issues:')
    for (const issue of report.issues) {
      yield* Console.error(`- ${formatPinIssue(issue)}`)
    }
    return yield* new PartitaError('GitHub subtree pin apply verification failed.')
  }
  yield* Console.log(`GitHub subtree pin applied: ${report.contractPath}`)
  return report
})

export const printPinStatus = Effect.fn('printPinStatus')(function* (options: PinCommandOptions) {
  const report = yield* inspectPins(options)
  yield* Console.log(`GitHub subtree pin contract: ${report.contractPath}`)
  yield* Console.log(formatPinStatus(report.entry))
  if (report.issues.length > 0) {
    yield* Console.log('Issues:')
    for (const issue of report.issues) {
      yield* Console.log(`- ${formatPinIssue(issue)}`)
    }
  }
  return report
})

export const verifyPins = Effect.fn('verifyPins')(function* (options: PinCommandOptions) {
  const report = yield* inspectPins(options)
  if (!report.ok) {
    yield* Console.error('GitHub subtree pin verification failed:')
    for (const issue of report.issues) {
      yield* Console.error(`- ${formatPinIssue(issue)}`)
    }
    return yield* new PartitaError('GitHub subtree pin verification failed.')
  }

  yield* Console.log(`GitHub subtree pin verified: ${report.contractPath}`)
  return report
})

const publishPin = Effect.fn('publishPin')(function* (options: PinPublicationOptions) {
  const path = yield* Path.Path
  const root = path.resolve(options.root)
  const report = yield* inspectPublicationSource(options)
  if (!report.ok) {
    return yield* new PartitaError([
      'GitHub subtree pin verification failed:',
      ...report.issues.map(issue => `- ${formatPinIssue(issue)}`),
    ].join('\n'))
  }

  const contract = report.contract
  const snapshot = yield* sourcePinArchiveEntries(root, contract)
  yield* assertSourcePinUnmodified(root, contract.materialization.prefix, snapshot.opaqueGitlinks)
  yield* assertSourcePinRevisionMatches(root, contract)
  const encoded = yield* Effect.try({
    try: () => encodeCanonicalTreeArchive(snapshot.entries),
    catch: cause => new PartitaError(`Encode Source Pin archive: ${formatUnknown(cause)}`),
  })
  const validatedProvenance = yield* Schema.decodeUnknownEffect(PinnedReferenceProvenanceSchema)({
    revision: contract.source.revision,
    sourceUrl: contract.source.repository,
    treeDigest: encoded.treeDigest,
  }).pipe(
    Effect.mapError(cause => new PartitaError(`Validate Source Pin provenance: ${formatUnknown(cause)}`)),
  )
  const publication: SourcePinPublication = {
    archive: { format: CANONICAL_TREE_ARCHIVE_FORMAT },
    name: contract.name,
    provenance: validatedProvenance,
    schemaVersion: 1,
  }

  const archive = yield* parsePublicationOutputPath(root, options.archivePath, 'archive')
  const provenance = yield* parsePublicationOutputPath(root, options.provenancePath, 'provenance')
  for (const output of [archive, provenance]) {
    if (pathIsSameOrInside(output.relativePath, contract.materialization.prefix)) {
      return yield* new PartitaError(
        `Source Pin publication output must be outside Source Pin prefix ${contract.materialization.prefix}: ${output.relativePath}`,
      )
    }
    if (output.relativePath === report.contractPath) {
      return yield* new PartitaError(
        `Source Pin publication output must not overwrite Source Pin contract: ${report.contractPath}`,
      )
    }
  }
  if (archive.relativePath === provenance.relativePath) {
    return yield* new PartitaError('Source Pin archive and provenance paths must be different.')
  }

  const fs = yield* FileSystem.FileSystem
  const physicalArchive = yield* resolvePublicationOutputPhysicalPath(root, archive)
  const physicalProvenance = yield* resolvePublicationOutputPhysicalPath(root, provenance)
  if (physicalArchive.physicalPath === physicalProvenance.physicalPath) {
    return yield* new PartitaError(
      'Source Pin archive and provenance paths must resolve to different files.',
    )
  }
  const [physicalContract, physicalPrefix] = yield* Effect.all([
    fs.realPath(path.resolve(root, report.contractPath)).pipe(
      Effect.mapError(cause => new PartitaError(`Resolve Source Pin contract ${report.contractPath}: ${formatUnknown(cause)}`)),
    ),
    fs.realPath(path.resolve(root, contract.materialization.prefix)).pipe(
      Effect.mapError(cause => new PartitaError(`Resolve Source Pin prefix ${contract.materialization.prefix}: ${formatUnknown(cause)}`)),
    ),
  ])
  for (const output of [physicalArchive, physicalProvenance]) {
    if (output.physicalPath === physicalContract) {
      return yield* new PartitaError(
        `Source Pin publication output must not overwrite Source Pin contract: ${report.contractPath}`,
      )
    }
    if (physicalPathIsSameOrInside(path, output.physicalPath, physicalPrefix)) {
      return yield* new PartitaError(
        `Source Pin publication output must be outside Source Pin prefix ${contract.materialization.prefix}: ${output.relativePath}`,
      )
    }
  }
  yield* fs.makeDirectory(path.dirname(physicalArchive.physicalPath), { recursive: true }).pipe(
    Effect.mapError(cause => new PartitaError(`Create ${path.dirname(archive.relativePath)}: ${formatUnknown(cause)}`)),
  )
  yield* fs.makeDirectory(path.dirname(physicalProvenance.physicalPath), { recursive: true }).pipe(
    Effect.mapError(cause => new PartitaError(`Create ${path.dirname(provenance.relativePath)}: ${formatUnknown(cause)}`)),
  )
  yield* fs.remove(physicalArchive.physicalPath, { force: true }).pipe(
    Effect.mapError(cause => new PartitaError(`Replace ${archive.relativePath}: ${formatUnknown(cause)}`)),
  )
  yield* fs.remove(physicalProvenance.physicalPath, { force: true }).pipe(
    Effect.mapError(cause => new PartitaError(`Replace ${provenance.relativePath}: ${formatUnknown(cause)}`)),
  )
  yield* fs.writeFile(physicalArchive.physicalPath, encoded.bytes).pipe(
    Effect.mapError(cause => new PartitaError(`Write ${archive.relativePath}: ${formatUnknown(cause)}`)),
  )
  yield* fs.writeFileString(physicalProvenance.physicalPath, `${encodePrettyJson(publication)}\n`).pipe(
    Effect.mapError(cause => new PartitaError(`Write ${provenance.relativePath}: ${formatUnknown(cause)}`)),
  )

  return { archivePath: archive.relativePath, bytes: encoded.bytes, publication, provenancePath: provenance.relativePath }
})

export const printPinPublication = Effect.fn('printPinPublication')(function* (options: PinPublicationOptions) {
  const result = yield* publishPin(options)
  yield* Console.log(`Published Source Pin archive: ${result.archivePath}`)
  yield* Console.log(`Published Source Pin provenance: ${result.provenancePath}`)
  return result
})

const readGitHubSubtreeContract = Effect.fn('readGitHubSubtreeContract')(function* (
  root: string,
  contractPath: string,
) {
  const path = yield* Path.Path
  const relativePath = normalizeRelativePath(contractPath)
  const text = yield* readOptionalFile(path.resolve(root, relativePath))
  if (text === null) {
    return yield* new PartitaError(`GitHub subtree pin contract missing: ${relativePath}`)
  }
  const raw = yield* parseJson(text, relativePath)
  if (recordAt(raw).schemaVersion !== 2) {
    return yield* new PartitaError(
      `${relativePath} must use Source Pin contract schemaVersion 2; legacy contracts are not adapted.`,
    )
  }
  return normalizeGitHubSubtreeContract(raw)
})

const buildPinReport = Effect.fn('buildPinReport')(function* (
  root: string,
  contractPath: string,
  contract: GitHubSubtreePinContract,
) {
  const issues = yield* checkGitHubSubtreeContract(root, contractPath, contract)
  return {
    contractPath,
    entry: yield* pinStatus(root, contractPath, contract),
    issues,
    ok: issues.length === 0,
  } satisfies PinReport
})

const checkGitHubSubtreeContract = Effect.fn('checkGitHubSubtreeContract')(function* (
  root: string,
  contractPath: string,
  contract: GitHubSubtreePinContract,
) {
  const path = yield* Path.Path
  const issues: Array<PinIssue> = [
    ...checkRequiredContractFields(contract),
    ...checkRelativeContractPaths(path, contract),
    ...checkContractIdentity(contractPath, contract),
  ]
  const prefix = contract.materialization.prefix
  const prefixPath = path.resolve(root, prefix)
  const prefixExists = !isMissingValue(prefix) && (yield* fileExists(prefixPath))
  if (!prefixExists) {
    issues.push(issue('pin.missing', `pin prefix is missing: ${prefix}`, prefix))
  }
  else {
    if (yield* pinPrefixIsGitlink(root, prefix)) {
      issues.push(issue(
        'pin.gitlink',
        `pin prefix must be a git subtree checkout, not a mode 160000 gitlink: ${prefix}`,
        prefix,
      ))
    }
    if (yield* fileExists(path.join(prefixPath, '.git'))) {
      issues.push(issue('pin.gitlink', `pin prefix contains nested git metadata: ${prefix}/.git`, `${prefix}/.git`))
    }
    const materialized = yield* inspectMaterializedPin(root, prefix)
    if (materialized === null) {
      issues.push(issue('pin.subtree_trailer_missing', `no git-subtree trailer owns prefix ${prefix}`, prefix))
    }
    else {
      if (materialized.revision !== contract.source.revision) {
        issues.push(issue(
          'pin.subtree_revision_mismatch',
          `materialized revision ${materialized.revision} does not equal contract revision ${contract.source.revision}`,
          prefix,
        ))
      }
      if (!materialized.treeMatches) {
        issues.push(issue(
          'pin.subtree_drift',
          `physical prefix differs from latest git-subtree materialization: ${prefix}`,
          prefix,
        ))
      }
    }
  }
  if (!isMissingValue(contract.agent.anchor) && !(yield* fileExists(path.resolve(root, contract.agent.anchor)))) {
    issues.push(issue(
      'pin.anchor_missing',
      `anchor LLM document is missing: ${contract.agent.anchor}`,
      contract.agent.anchor,
    ))
  }
  if (!isMissingValue(contract.agent.route) && !(yield* fileExists(path.resolve(root, contract.agent.route)))) {
    issues.push(issue('pin.agent_route_missing', `agent route is missing: ${contract.agent.route}`, contract.agent.route))
  }
  if (!contract.agent.readOnly) {
    issues.push(issue('pin.read_only_missing', 'GitHub subtree pin must be marked read-only', prefix))
  }
  if (!contract.agent.importBlock) {
    issues.push(issue('pin.import_block_missing', 'GitHub subtree pin must enable import blocking', prefix))
  }
  if (contract.agent.importBlock && !isMissingValue(prefix)) {
    issues.push(...(yield* checkForbiddenImports(root, contract)))
  }
  issues.push(...(yield* checkEditorPolicy(root, contract)))

  return issues
})

const checkPublicationSourceContract = Effect.fn('checkPublicationSourceContract')(function* (
  root: string,
  contractPath: string,
  contract: GitHubSubtreePinContract,
) {
  const path = yield* Path.Path
  const issues: Array<PinIssue> = [
    ...checkRequiredPublicationFields(contract),
    ...(validRelativePath(path, contract.materialization.prefix)
      ? []
      : [issue(
          'pin.path_invalid',
          `pin.materialization.prefix must be a relative path inside the source repo: ${contract.materialization.prefix}`,
          contract.materialization.prefix,
        )]),
    ...checkPublicationIdentity(contractPath, contract),
  ]
  const prefix = contract.materialization.prefix
  const prefixPath = path.resolve(root, prefix)
  if (!isMissingValue(prefix) && !(yield* fileExists(prefixPath))) {
    issues.push(issue('pin.missing', `pin prefix is missing: ${prefix}`, prefix))
  }
  if (!isMissingValue(prefix) && (yield* pinPrefixIsGitlink(root, prefix))) {
    issues.push(issue('pin.gitlink', `pin prefix must be a git subtree checkout, not a submodule or gitlink: ${prefix}`, prefix))
  }
  if (!isMissingValue(prefix) && (yield* fileExists(path.join(prefixPath, '.git')))) {
    issues.push(issue('pin.gitlink', `pin prefix contains nested git metadata: ${prefix}/.git`, `${prefix}/.git`))
  }
  if (!contract.agent.readOnly) {
    issues.push(issue('pin.read_only_missing', 'GitHub subtree pin must be marked read-only', prefix))
  }
  if (!contract.agent.importBlock) {
    issues.push(issue('pin.import_block_missing', 'GitHub subtree pin must enable import blocking', prefix))
  }
  else if (!isMissingValue(prefix)) {
    issues.push(...(yield* checkForbiddenImports(root, contract)))
  }
  return issues
})

function checkRequiredPublicationFields(contract: GitHubSubtreePinContract): ReadonlyArray<PinIssue> {
  const fields = [
    ['pin.name', contract.name],
    ['pin.source.repository', contract.source.repository],
    ['pin.source.trackingBranch', contract.source.trackingBranch],
    ['pin.source.revision', contract.source.revision],
    ['pin.materialization.prefix', contract.materialization.prefix],
    ['pin.materialization.mechanism', contract.materialization.mechanism],
    ['pin.materialization.split', contract.materialization.split],
    ['pin.materialization.trailer', contract.materialization.trailer],
    ['pin.ownership.mode', contract.ownership.mode],
  ] as const
  return fields
    .filter(([, value]) => isMissingValue(value))
    .map(([field]) => issue('pin.contract_missing', `missing GitHub subtree pin contract field: ${field}`))
}

function normalizeGitHubSubtreeContract(raw: unknown): GitHubSubtreePinContract {
  const value = recordAt(raw)
  const source = recordAt(value.source)
  const materialization = recordAt(value.materialization)
  const ownership = recordAt(value.ownership)
  const agent = recordAt(value.agent)
  const workspace = recordAt(value.workspace)

  return {
    schemaVersion: 2,
    name: stringAt(value.name) ?? '',
    source: {
      repository: stringAt(source.repository) ?? '',
      trackingBranch: stringAt(source.trackingBranch) ?? '',
      revision: stringAt(source.revision) ?? '',
    },
    materialization: {
      prefix: normalizeRelativePath(stringAt(materialization.prefix) ?? ''),
      mechanism: stringAt(materialization.mechanism) === 'git-subtree' ? 'git-subtree' : '',
      split: stringAt(materialization.split) ?? '',
      trailer: stringAt(materialization.trailer) ?? '',
    },
    ownership: { mode: normalizeOwnershipMode(stringAt(ownership.mode)) },
    agent: {
      anchor: normalizeRelativePath(stringAt(agent.anchor) ?? ''),
      route: normalizeRelativePath(stringAt(agent.route) ?? ''),
      readOnly: booleanAt(agent.readOnly) ?? false,
      importBlock: booleanAt(agent.importBlock) ?? false,
    },
    workspace: {
      autoImport: stringAt(workspace.autoImport) === 'excluded' ? 'excluded' : '',
      watch: normalizeInclusionDecision(stringAt(workspace.watch)),
      search: normalizeInclusionDecision(stringAt(workspace.search)),
      files: normalizeVisibilityDecision(stringAt(workspace.files)),
    },
  }
}

function checkRequiredContractFields(contract: GitHubSubtreePinContract): ReadonlyArray<PinIssue> {
  const fields = [
    ['pin.name', contract.name],
    ['pin.source.repository', contract.source.repository],
    ['pin.source.trackingBranch', contract.source.trackingBranch],
    ['pin.source.revision', contract.source.revision],
    ['pin.materialization.prefix', contract.materialization.prefix],
    ['pin.materialization.mechanism', contract.materialization.mechanism],
    ['pin.materialization.split', contract.materialization.split],
    ['pin.materialization.trailer', contract.materialization.trailer],
    ['pin.ownership.mode', contract.ownership.mode],
    ['pin.agent.anchor', contract.agent.anchor],
    ['pin.agent.route', contract.agent.route],
    ['pin.workspace.autoImport', contract.workspace.autoImport],
    ['pin.workspace.watch', contract.workspace.watch],
    ['pin.workspace.search', contract.workspace.search],
    ['pin.workspace.files', contract.workspace.files],
  ] as const
  return fields
    .filter(([, value]) => isMissingValue(value))
    .map(([field]) => issue('pin.contract_missing', `missing GitHub subtree pin contract field: ${field}`))
}

function checkRelativeContractPaths(path: Path.Path, contract: GitHubSubtreePinContract): ReadonlyArray<PinIssue> {
  const paths = [
    ['pin.materialization.prefix', contract.materialization.prefix],
    ['pin.agent.anchor', contract.agent.anchor],
    ['pin.agent.route', contract.agent.route],
  ] as const
  return paths.flatMap(([field, value]) => {
    if (isMissingValue(value) || validRelativePath(path, value)) {
      return []
    }
    return [issue('pin.path_invalid', `${field} must be a relative path inside the target repo: ${value}`, value)]
  })
}

function checkContractIdentity(contractPath: string, contract: GitHubSubtreePinContract): ReadonlyArray<PinIssue> {
  const issues = [...checkPublicationIdentity(contractPath, contract)]
  if (!pathIsSameOrInside(contract.agent.anchor, contract.materialization.prefix)) {
    issues.push(issue(
      'pin.anchor_outside_prefix',
      'Source Pin anchor must live inside pinned prefix',
      contract.agent.anchor,
    ))
  }
  return issues
}

function checkPublicationIdentity(contractPath: string, contract: GitHubSubtreePinContract): ReadonlyArray<PinIssue> {
  const issues: Array<PinIssue> = []
  if (!isMissingValue(contract.source.repository) && !githubRepositoryUrl(contract.source.repository)) {
    issues.push(issue('pin.github_only', `pin repository must be a GitHub URL: ${contract.source.repository}`))
  }
  if (!isMissingValue(contract.source.revision) && !immutableRevisionPattern.test(contract.source.revision)) {
    issues.push(issue(
      'pin.revision_mutable',
      `pin revision must be an immutable Git commit: ${contract.source.revision}`,
    ))
  }
  if (contract.materialization.mechanism !== 'git-subtree') {
    issues.push(issue('pin.mechanism_invalid', 'pin mechanism must be git-subtree'))
  }
  if (contract.ownership.mode !== 'direct') {
    issues.push(issue('pin.ownership_invalid', 'Source Pin ownership must be direct'))
  }
  if (contract.materialization.split !== contract.source.revision) {
    issues.push(issue('pin.split_mismatch', 'git-subtree split must equal source revision'))
  }
  if (contract.materialization.trailer !== `git-subtree-split: ${contract.source.revision}`) {
    issues.push(issue('pin.trailer_mismatch', 'git-subtree trailer must encode source revision exactly'))
  }
  const expectedPath = defaultPinContractPath({
    name: contract.name,
    prefix: contract.materialization.prefix,
  })
  if (contractPath !== expectedPath) {
    issues.push(issue(
      'pin.contract_not_sibling',
      `Source Pin contract must be sibling path ${expectedPath}`,
      contractPath,
    ))
  }
  return issues
}

const checkForbiddenImports = Effect.fn('checkForbiddenImports')(function* (
  root: string,
  contract: GitHubSubtreePinContract,
) {
  const path = yield* Path.Path
  const prefix = contract.materialization.prefix
  const files = yield* collectSourceCodeFiles(root, [prefix])
  const issues: Array<PinIssue> = []
  const fs = yield* FileSystem.FileSystem
  for (const file of files) {
    const text = yield* fs.readFileString(file).pipe(
      Effect.mapError(cause => new PartitaError(`Read ${relativePathFrom(path, root, file)}: ${formatUnknown(cause)}`)),
    )
    for (const specifier of importedSpecifiers(text)) {
      if (specifierTargetsPrefix(path, root, file, specifier, prefix)) {
        const relativeFile = relativePathFrom(path, root, file)
        issues.push(issue(
          'pin.import_blocked',
          `application/test code must not import from GitHub subtree prefix ${prefix}: ${specifier}`,
          relativeFile,
        ))
      }
    }
  }
  return issues
})

const checkEditorPolicy = Effect.fn('checkEditorPolicy')(function* (
  root: string,
  contract: GitHubSubtreePinContract,
) {
  const path = yield* Path.Path
  const issues: Array<PinIssue> = []
  if (contract.workspace.autoImport !== 'excluded') {
    issues.push(issue('pin.editor_auto_import_missing', 'workspace policy must exclude auto-import from pinned prefix'))
  }

  const vscodeSettings = path.join(root, '.vscode', 'settings.json')
  if (yield* fileExists(vscodeSettings)) {
    const value = yield* parseSettingsFile(vscodeSettings, '.vscode/settings.json')
    issues.push(...checkVscodeSettings(value, contract))
  }

  const zedSettings = path.join(root, '.zed', 'settings.json')
  if (yield* fileExists(zedSettings)) {
    const value = yield* parseSettingsFile(zedSettings, '.zed/settings.json')
    issues.push(...checkZedSettings(value, contract))
  }

  return issues
})

const pinStatus = Effect.fn('pinStatus')(function* (
  root: string,
  contractPath: string,
  contract: GitHubSubtreePinContract,
) {
  const path = yield* Path.Path
  const prefixExists = !isMissingValue(contract.materialization.prefix)
    && (yield* fileExists(path.resolve(root, contract.materialization.prefix)))
  const materialized = prefixExists
    ? yield* inspectMaterializedPin(root, contract.materialization.prefix)
    : null
  return {
    anchorExists: !isMissingValue(contract.agent.anchor)
      && (yield* fileExists(path.resolve(root, contract.agent.anchor))),
    contractPath,
    currentRevision: contract.source.revision,
    materializedRevision: materialized?.revision ?? '',
    mechanism: contract.materialization.mechanism,
    name: contract.name,
    ownershipMode: contract.ownership.mode,
    prefix: contract.materialization.prefix,
    prefixExists,
    repository: contract.source.repository,
    routeExists: !isMissingValue(contract.agent.route) && (yield* fileExists(path.resolve(root, contract.agent.route))),
    trackingBranch: contract.source.trackingBranch,
  } satisfies PinStatus
})

function formatPinStatus(entry: PinStatus): string {
  return [
    `- ${entry.name}`,
    `repository=${entry.repository}`,
    `branch=${entry.trackingBranch}`,
    `prefix=${entry.prefix}`,
    `contract=${entry.contractPath}`,
    `mechanism=${entry.mechanism}`,
    `ownership=${entry.ownershipMode}`,
    `contractRevision=${entry.currentRevision || '<missing>'}`,
    `materializedRevision=${entry.materializedRevision || '<missing>'}`,
    `prefix=${entry.prefixExists ? 'present' : 'missing'}`,
    `anchor=${entry.anchorExists ? 'present' : 'missing'}`,
    `route=${entry.routeExists ? 'present' : 'missing'}`,
  ].join(' ')
}

function formatPinIssue(issue: PinIssue): string {
  return issue.path !== undefined
    ? `${issue.path}: ${issue.code}: ${issue.message}`
    : `${issue.code}: ${issue.message}`
}

const buildEditorChanges = Effect.fn('buildEditorChanges')(function* (
  root: string,
  contract: GitHubSubtreePinContract,
) {
  const pathService = yield* Path.Path
  const descriptors = [
    ['.vscode/settings.json', applyWorkspaceToVscode] as const,
    ['.zed/settings.json', applyWorkspaceToZed] as const,
  ]
  const changes: Array<PinEditorChange> = []
  for (const [relativePath, converge] of descriptors) {
    const text = yield* readOptionalFile(pathService.resolve(root, relativePath))
    if (text === null) {
      changes.push({ action: 'none', beforeDigest: null, contents: null, path: relativePath })
      continue
    }
    const parsed = yield* parseJson(stripJsonComments(text), relativePath)
    if (!isRecord(parsed)) {
      return yield* new PartitaError(`${relativePath} must contain a JSON object`)
    }
    const contents = `${encodePrettyJson(converge(parsed, contract))}\n`
    changes.push({
      action: contents === text ? 'none' : 'write',
      beforeDigest: sha256(text),
      contents: contents === text ? null : contents,
      path: relativePath,
    })
  }
  return changes
})

function applyWorkspaceToVscode(settings: JsonRecord, contract: GitHubSubtreePinContract): JsonRecord {
  const value = cloneRecord(settings)
  const glob = `${contract.materialization.prefix}/**`
  value['typescript.preferences.autoImportFileExcludePatterns'] = addString(
    value['typescript.preferences.autoImportFileExcludePatterns'],
    glob,
  )
  value['javascript.preferences.autoImportFileExcludePatterns'] = addString(
    value['javascript.preferences.autoImportFileExcludePatterns'],
    glob,
  )
  setGlobDecision(value, 'files.watcherExclude', glob, contract.workspace.watch === 'excluded')
  setGlobDecision(value, 'search.exclude', glob, contract.workspace.search === 'excluded')
  setGlobDecision(value, 'files.exclude', glob, contract.workspace.files === 'hidden')
  return value
}

function applyWorkspaceToZed(settings: JsonRecord, contract: GitHubSubtreePinContract): JsonRecord {
  const value = cloneRecord(settings)
  const glob = `${contract.materialization.prefix}/**`
  const lsp = ensureRecord(value, 'lsp')
  const vtslsSettings = ensureRecord(ensureRecord(lsp, 'vtsls'), 'settings')
  for (const language of ['javascript', 'typescript']) {
    const preferences = ensureRecord(ensureRecord(vtslsSettings, language), 'preferences')
    preferences.autoImportFileExcludePatterns = addString(
      preferences.autoImportFileExcludePatterns,
      glob,
    )
  }
  const tlsPreferences = ensureRecord(
    ensureRecord(ensureRecord(lsp, 'typescript-language-server'), 'initialization_options'),
    'preferences',
  )
  tlsPreferences.autoImportFileExcludePatterns = addString(
    tlsPreferences.autoImportFileExcludePatterns,
    glob,
  )
  if (contract.workspace.files === 'hidden') {
    value.file_scan_exclusions = addString(value.file_scan_exclusions, glob)
  }
  else {
    removeString(value, 'file_scan_exclusions', glob)
  }
  return value
}

function checkVscodeSettings(
  settings: JsonRecord,
  contract: GitHubSubtreePinContract,
): ReadonlyArray<PinIssue> {
  const glob = `${contract.materialization.prefix}/**`
  const issues: Array<PinIssue> = []
  if (!stringArrayIncludes(settings['typescript.preferences.autoImportFileExcludePatterns'], glob)
    || !stringArrayIncludes(settings['javascript.preferences.autoImportFileExcludePatterns'], glob)) {
    issues.push(issue(
      'pin.editor_vscode_auto_import_missing',
      'VSCode must exclude pinned prefix from TypeScript and JavaScript auto-imports',
      '.vscode/settings.json',
    ))
  }
  checkVscodeGlobDecision(
    issues,
    settings,
    'files.watcherExclude',
    glob,
    contract.workspace.watch === 'excluded',
    'watch',
  )
  checkVscodeGlobDecision(
    issues,
    settings,
    'search.exclude',
    glob,
    contract.workspace.search === 'excluded',
    'search',
  )
  checkVscodeGlobDecision(
    issues,
    settings,
    'files.exclude',
    glob,
    contract.workspace.files === 'hidden',
    'files',
  )
  return issues
}

function checkZedSettings(
  settings: JsonRecord,
  contract: GitHubSubtreePinContract,
): ReadonlyArray<PinIssue> {
  const issues: Array<PinIssue> = []
  const glob = `${contract.materialization.prefix}/**`
  const lsp = recordAt(settings.lsp)
  const vtslsSettings = recordAt(recordAt(recordAt(lsp.vtsls).settings))
  const tsPreferences = recordAt(recordAt(vtslsSettings.typescript).preferences)
  const jsPreferences = recordAt(recordAt(vtslsSettings.javascript).preferences)
  const typescriptLanguageServer = recordAt(lsp['typescript-language-server'])
  const initializationOptions = recordAt(typescriptLanguageServer.initialization_options)
  const tlsPreferences = recordAt(initializationOptions.preferences)
  const tsgo = recordAt(lsp.tsgo)
  const tsgoInitializationOptions = recordAt(tsgo.initialization_options)
  const tsgoPreferences = recordAt(tsgoInitializationOptions.preferences)

  const vtslsConfigured = stringArrayCoversPrefix(tsPreferences.autoImportFileExcludePatterns, glob)
    && stringArrayCoversPrefix(jsPreferences.autoImportFileExcludePatterns, glob)
  const tlsConfigured = stringArrayCoversPrefix(tlsPreferences.autoImportFileExcludePatterns, glob)
  const tsgoConfigured = stringArrayCoversPrefix(tsgoPreferences.autoImportFileExcludePatterns, glob)
  if (!vtslsConfigured && !tlsConfigured && !tsgoConfigured) {
    issues.push(issue(
      'pin.editor_zed_auto_import_missing',
      'Zed must exclude pinned prefix through a TypeScript LSP auto-import preference',
      '.zed/settings.json',
    ))
  }
  const hidden = stringArrayCoversPrefix(settings.file_scan_exclusions, glob)
  if (hidden !== (contract.workspace.files === 'hidden')) {
    issues.push(issue(
      'pin.editor_zed_files_mismatch',
      'Zed file visibility must match Source Pin workspace decision',
      '.zed/settings.json',
    ))
  }
  return issues
}

const validatePlanBaseline = Effect.fn('validatePlanBaseline')(function* (
  root: string,
  plan: PinPlan,
) {
  const path = yield* Path.Path
  const head = (yield* gitOutput(root, ['rev-parse', 'HEAD'], 'Read target HEAD')).trim()
  const contractText = yield* readOptionalFile(path.resolve(root, plan.contractPath))
  const prefixExists = yield* fileExists(path.resolve(root, plan.contract.materialization.prefix))
  const materialized = prefixExists
    ? yield* inspectMaterializedPin(root, plan.contract.materialization.prefix)
    : null
  const current: PinBaseline = {
    head,
    contractDigest: contractText === null ? null : sha256(contractText),
    prefixExists,
    materializedRevision: materialized?.revision ?? null,
  }
  if (canonicalJson(current) !== canonicalJson(plan.baseline)) {
    return yield* new PartitaError('Source Pin plan has a stale local baseline; create a fresh plan.')
  }
  for (const change of plan.editorChanges) {
    const text = yield* readOptionalFile(path.resolve(root, change.path))
    const digest = text === null ? null : sha256(text)
    if (digest !== change.beforeDigest) {
      return yield* new PartitaError(
        `Source Pin plan is stale because ${change.path} changed; create a fresh plan.`,
      )
    }
  }
})

const validatePlanInternals = Effect.fn('validatePlanInternals')(function* (plan: PinPlan) {
  const path = yield* Path.Path
  if (plan.planVersion !== 1) {
    return yield* new PartitaError('Source Pin planVersion 1 is required.')
  }
  if (!immutableRevisionPattern.test(plan.desiredRevision)) {
    return yield* new PartitaError('Source Pin plan must contain an immutable desired revision.')
  }
  if (plan.contract.schemaVersion !== 2 || plan.contract.source.revision !== plan.desiredRevision) {
    return yield* new PartitaError(
      'Source Pin plan contract must use schemaVersion 2 and desired revision.',
    )
  }
  const contractIssues = [
    ...checkRequiredContractFields(plan.contract),
    ...checkRelativeContractPaths(path, plan.contract),
    ...checkContractIdentity(plan.contractPath, plan.contract),
  ]
  if (contractIssues.length > 0
    || !plan.contract.agent.readOnly
    || !plan.contract.agent.importBlock
    || plan.contract.workspace.autoImport !== 'excluded') {
    return yield* new PartitaError('Source Pin plan contains an invalid Source Pin contract.')
  }
  if (plan.contractJson !== `${encodePrettyJson(plan.contract)}\n`) {
    return yield* new PartitaError('Source Pin plan contract bytes do not match contract object.')
  }
  if (plan.git.command !== 'git'
    || canonicalJson(plan.git.args) !== canonicalJson(gitSubtreeArgs(plan.git.action, plan.contract))) {
    return yield* new PartitaError(
      'Source Pin plan Git operation does not match immutable contract.',
    )
  }
  if ((plan.operation === 'add' && plan.git.action === 'update')
    || (plan.operation === 'update' && plan.git.action === 'add')) {
    return yield* new PartitaError('Source Pin plan operation and Git action disagree.')
  }
  const editorPaths = plan.editorChanges.map(change => change.path)
  if (editorPaths.length !== 2
    || new Set(editorPaths).size !== 2
    || !editorPaths.includes('.vscode/settings.json')
    || !editorPaths.includes('.zed/settings.json')) {
    return yield* new PartitaError('Source Pin plan editor changes must cover the supported settings files.')
  }
})

function gitSubtreeArgs(
  action: PinGitAction,
  contract: GitHubSubtreePinContract,
): ReadonlyArray<string> {
  if (action === 'none') {
    return []
  }
  return [
    'subtree',
    action === 'add' ? 'add' : 'pull',
    `--prefix=${contract.materialization.prefix}`,
    contract.source.repository,
    contract.source.revision,
    '--squash',
  ]
}

const resolveTrackingRevision = Effect.fn('resolveTrackingRevision')(function* (
  root: string,
  repository: string,
  branch: string,
) {
  if (!githubRepositoryUrl(repository)) {
    return yield* new PartitaError(`Source Pin repository must be a GitHub URL: ${repository}`)
  }
  if (branch.trim().length === 0) {
    return yield* new PartitaError('Source Pin tracking branch is required.')
  }
  const output = yield* gitOutput(
    root,
    ['ls-remote', '--heads', repository, `refs/heads/${branch}`],
    `Resolve ${repository}#${branch}`,
  )
  const revisions = output.split(/\r?\n/u)
    .map(line => line.split(/\s+/u)[0])
    .filter((value): value is string =>
      value !== undefined && immutableRevisionPattern.test(value))
  if (revisions.length !== 1) {
    return yield* new PartitaError(
      `Expected exactly one immutable revision for ${repository}#${branch}; received ${revisions.length}.`,
    )
  }
  return revisions[0]!
})

const inspectMaterializedPin = Effect.fn('inspectMaterializedPin')(function* (
  root: string,
  prefix: string,
) {
  const output = yield* gitOutput(
    root,
    ['log', '--format=%H%x1f%B%x1e', '--all'],
    `Inspect git-subtree history for ${prefix}`,
  )
  for (const record of output.split('\u001E')) {
    const separator = record.indexOf('\u001F')
    if (separator === -1) {
      continue
    }
    const commit = record.slice(0, separator).trim()
    const body = record.slice(separator + 1)
    const directory = body.match(/^git-subtree-dir: (.+)$/mu)?.[1]?.trim()
    const revision = body.match(/^git-subtree-split: ([0-9a-f]{40,64})$/mu)?.[1]
    if (directory !== prefix || revision === undefined || !immutableRevisionPattern.test(commit)) {
      continue
    }
    const prefixTree = yield* gitOutput(root, ['rev-parse', `HEAD:${prefix}`], `Read prefix tree ${prefix}`)
    const squashTree = yield* gitOutput(root, ['rev-parse', `${commit}^{tree}`], `Read subtree tree ${commit}`)
    return {
      revision,
      squashCommit: commit,
      treeMatches: prefixTree.trim() === squashTree.trim(),
    } satisfies MaterializedPin
  }
  return null
})

const gitOutput = Effect.fn('gitOutput')(function* (
  root: string,
  args: ReadonlyArray<string>,
  description: string,
) {
  const executor = yield* CommandExecutor
  const result = yield* executor.run({ args, command: 'git', cwd: root })
  if (result.exitCode !== 0) {
    return yield* new PartitaError(
      `${description}: git exited with code ${result.exitCode}: ${result.output.trim()}`,
    )
  }
  return result.output
})

const pinPrefixIsGitlink = Effect.fn('pinPrefixIsGitlink')(function* (root: string, prefix: string) {
  const output = yield* inspectSourcePinGitIndex(root, prefix)
  return output.split(/\0|\r?\n/u).some((line) => {
    const match = line.match(/^160000 [0-9a-f]{40,64} \d\t(.+)$/u)
    return match !== null && normalizeRelativePath(match[1]!) === normalizeRelativePath(prefix)
  })
})

interface GitIndexEntry {
  readonly mode: string
  readonly path: string
}

const sourcePinArchiveEntries = Effect.fn('sourcePinArchiveEntries')(function* (
  root: string,
  contract: GitHubSubtreePinContract,
) {
  const pathService = yield* Path.Path
  const prefix = contract.materialization.prefix
  const prefixRoot = pathService.resolve(root, prefix)
  const index = yield* sourcePinGitIndex(root, prefix)
  const opaqueGitlinks = index.filter(entry => entry.mode === '160000').map(entry => entry.path)
  const trackedEntries = index.filter(entry => entry.mode !== '160000')
  const trackedPaths = new Set(trackedEntries.map(entry => entry.path))
  const directoryPaths = new Set<string>()
  for (const entry of trackedEntries) {
    const segments = entry.path.split('/')
    for (let index = 1; index < segments.length; index += 1) {
      directoryPaths.add(segments.slice(0, index).join('/'))
    }
  }

  const fs = yield* FileSystem.FileSystem
  const workingEntries = yield* fs.readDirectory(prefixRoot, { recursive: true }).pipe(
    Effect.mapError(cause => new PartitaError(`Read Source Pin directory ${prefix}: ${formatUnknown(cause)}`)),
  )
  for (const rawPath of workingEntries) {
    const path = normalizeRelativePath(rawPath)
    if (opaqueGitlinks.some(gitlink => pathIsSameOrInside(path, gitlink))) {
      continue
    }
    if (trackedPaths.has(path)) {
      continue
    }
    const absolutePath = pathService.resolve(prefixRoot, path)
    const stat = yield* fs.stat(absolutePath).pipe(
      Effect.mapError(cause => new PartitaError(`Stat Source Pin entry ${path}: ${formatUnknown(cause)}`)),
    )
    if (stat.type === 'Directory') {
      if (!directoryPaths.has(path)) {
        return yield* new PartitaError(`Untracked Source Pin entry: ${path}`)
      }
      continue
    }
    return yield* new PartitaError(`Untracked Source Pin entry: ${path}`)
  }

  const entries: Array<CanonicalTreeArchiveSourceEntry> = [...directoryPaths]
    .sort(compareText)
    .map(path => ({ kind: 'directory' as const, mode: 0o755, path }))

  for (const entry of trackedEntries.sort((left, right) => compareText(left.path, right.path))) {
    const absolutePath = pathService.resolve(prefixRoot, entry.path)
    if (entry.mode === '120000') {
      const target = yield* fs.readLink(absolutePath).pipe(
        Effect.mapError(cause => new PartitaError(`Tracked Source Pin entry is missing or is not a symbolic link: ${entry.path}: ${formatUnknown(cause)}`)),
      )
      if (!isSafeRelativeSymlink(entry.path, target)) {
        return yield* new PartitaError(`Unsafe Source Pin symbolic link: ${entry.path} -> ${target}`)
      }
      entries.push({ kind: 'symbolicLink', mode: SYMBOLIC_LINK_MODE, path: entry.path, target })
      continue
    }

    if (!(yield* fileExists(absolutePath))) {
      return yield* new PartitaError(`Tracked Source Pin entry is missing: ${entry.path}`)
    }
    const stat = yield* fs.stat(absolutePath).pipe(
      Effect.mapError(cause => new PartitaError(`Stat Source Pin entry ${entry.path}: ${formatUnknown(cause)}`)),
    )

    if (stat.type !== 'File' || (entry.mode !== '100644' && entry.mode !== '100755')) {
      return yield* new PartitaError(`Unsupported Source Pin entry: ${entry.path}`)
    }
    const bytes = yield* fs.readFile(absolutePath).pipe(
      Effect.mapError(cause => new PartitaError(`Read Source Pin file ${entry.path}: ${formatUnknown(cause)}`)),
    )
    entries.push({
      bytes,
      kind: 'file',
      mode: entry.mode === '100755' ? 0o755 : 0o644,
      path: entry.path,
    })
  }

  return { entries, opaqueGitlinks }
})

const sourcePinGitIndex = Effect.fn('sourcePinGitIndex')(function* (root: string, prefix: string) {
  const pathService = yield* Path.Path
  const output = yield* inspectSourcePinGitIndex(root, prefix)

  const entries: Array<GitIndexEntry> = []
  const seen = new Set<string>()
  for (const line of output.split(/\0|\r?\n/u).filter(Boolean)) {
    const match = /^(\d{6}) [0-9a-f]{40,64} \d\t(.+)$/u.exec(line)
    if (match === null) {
      return yield* new PartitaError(`Cannot decode Source Pin Git index entry: ${line}`)
    }
    const mode = match[1]!
    const indexedPath = normalizeRelativePath(match[2]!)
    if (!indexedPath.startsWith(`${prefix}/`)) {
      return yield* new PartitaError(`Source Pin Git index entry escaped ${prefix}: ${indexedPath}`)
    }
    const path = indexedPath.slice(prefix.length + 1)
    if (!validRelativePath(pathService, path) || seen.has(path)) {
      return yield* new PartitaError(`Invalid Source Pin Git index path: ${path}`)
    }
    if (!['100644', '100755', '120000', '160000'].includes(mode)) {
      return yield* new PartitaError(`Unsupported Source Pin Git mode ${mode}: ${path}`)
    }
    seen.add(path)
    entries.push({ mode, path })
  }
  if (entries.length === 0) {
    return yield* new PartitaError(`Source Pin Git index is empty: ${prefix}`)
  }
  return entries
})

const inspectSourcePinGitIndex = Effect.fn('inspectSourcePinGitIndex')(function* (root: string, prefix: string) {
  const executor = yield* CommandExecutor
  const result = yield* executor.run({
    args: ['ls-files', '--stage', '--', prefix],
    command: 'git',
    cwd: root,
  })
  if (result.exitCode !== 0) {
    return yield* new PartitaError(
      `Inspect git index for ${prefix}: git exited with code ${result.exitCode}: ${result.output.trim()}`,
    )
  }
  return result.output
})

const assertSourcePinUnmodified = Effect.fn('assertSourcePinUnmodified')(function* (
  root: string,
  prefix: string,
  opaqueGitlinks: ReadonlyArray<string>,
) {
  const executor = yield* CommandExecutor
  for (const check of [
    { args: ['diff', '--name-only', '--', prefix], message: 'Source Pin working tree differs from its Git index' },
    { args: ['diff', '--cached', '--name-only', '--', prefix], message: 'Source Pin Git index differs from its committed tree' },
  ] as const) {
    const result = yield* executor.run({ args: check.args, command: 'git', cwd: root })
    if (result.exitCode !== 0) {
      return yield* new PartitaError(
        `Inspect Git state for ${prefix}: git exited with code ${result.exitCode}: ${result.output.trim()}`,
      )
    }
    const changedPaths = result.output.split(/\r?\n/u).filter(Boolean).filter((path) => {
      const normalizedPath = normalizeRelativePath(path)
      if (!normalizedPath.startsWith(`${prefix}/`)) {
        return true
      }
      const sourcePath = normalizedPath.slice(prefix.length + 1)
      return !opaqueGitlinks.some(gitlink => pathIsSameOrInside(sourcePath, gitlink))
    })
    if (changedPaths.length > 0) {
      return yield* new PartitaError(`${check.message}: ${prefix}`)
    }
  }
})

const assertSourcePinRevisionMatches = Effect.fn('assertSourcePinRevisionMatches')(function* (
  root: string,
  contract: GitHubSubtreePinContract,
) {
  const executor = yield* CommandExecutor
  const history = yield* executor.run({
    args: [
      'log',
      '--format=%H',
      '--fixed-strings',
      `--grep=${contract.materialization.trailer}`,
    ],
    command: 'git',
    cwd: root,
  })
  if (history.exitCode !== 0) {
    return yield* new PartitaError(
      `Inspect Source Pin revision history: git exited with code ${history.exitCode}: ${history.output.trim()}`,
    )
  }
  const currentTree = yield* readGitObjectId(executor, root, `HEAD:${contract.materialization.prefix}`)
  for (const commit of history.output.split(/\r?\n/u).filter(Boolean)) {
    const pinnedTree = yield* readGitObjectId(executor, root, `${commit}^{tree}`)
    if (pinnedTree === currentTree) {
      return
    }
  }
  return yield* new PartitaError(
    `Source Pin tree does not match declared subtree revision ${contract.source.revision}: ${contract.materialization.prefix}`,
  )
})

const readGitObjectId = Effect.fn('readGitObjectId')(function* (
  executor: CommandExecutor['Service'],
  root: string,
  revisionPath: string,
) {
  const result = yield* executor.run({ args: ['rev-parse', revisionPath], command: 'git', cwd: root })
  if (result.exitCode !== 0) {
    return yield* new PartitaError(
      `Resolve Git object ${revisionPath}: git exited with code ${result.exitCode}: ${result.output.trim()}`,
    )
  }
  return result.output.trim()
})

const parsePublicationOutputPath = Effect.fn('parsePublicationOutputPath')(function* (
  root: string,
  value: string,
  label: string,
) {
  const path = yield* Path.Path
  const relativePath = normalizeRelativePath(value)
  if (!validRelativePath(path, relativePath)) {
    return yield* new PartitaError(`Source Pin ${label} path must be relative to the repository root: ${value}`)
  }
  return { absolutePath: path.resolve(root, relativePath), relativePath }
})

const resolvePublicationOutputPhysicalPath = Effect.fn('resolvePublicationOutputPhysicalPath')(function* (
  root: string,
  output: { readonly absolutePath: string, readonly relativePath: string },
) {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  let existingParent = path.dirname(output.absolutePath)
  while (!(yield* fileExists(existingParent))) {
    const next = path.dirname(existingParent)
    if (next === existingParent) {
      return yield* new PartitaError(`Cannot resolve Source Pin publication output parent: ${output.relativePath}`)
    }
    existingParent = next
  }
  const [realRoot, realParent] = yield* Effect.all([
    fs.realPath(root).pipe(
      Effect.mapError(cause => new PartitaError(`Resolve repository root ${root}: ${formatUnknown(cause)}`)),
    ),
    fs.realPath(existingParent).pipe(
      Effect.mapError(cause => new PartitaError(`Resolve output parent ${existingParent}: ${formatUnknown(cause)}`)),
    ),
  ])
  const parentFromRoot = path.relative(realRoot, realParent)
  if (path.isAbsolute(parentFromRoot) || parentFromRoot === '..' || parentFromRoot.startsWith(`..${path.sep}`)) {
    return yield* new PartitaError(`Source Pin publication output parent escapes the repository: ${output.relativePath}`)
  }
  return {
    ...output,
    physicalPath: path.resolve(realParent, path.relative(existingParent, output.absolutePath)),
  }
})

function physicalPathIsSameOrInside(pathService: Path.Path, path: string, parent: string): boolean {
  const pathFromParent = pathService.relative(parent, path)
  return pathFromParent === ''
    || (!pathService.isAbsolute(pathFromParent) && pathFromParent !== '..' && !pathFromParent.startsWith(`..${pathService.sep}`))
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0
}

const collectSourceCodeFiles = Effect.fn('collectSourceCodeFiles')(function* (
  root: string,
  sourcePrefixes: ReadonlyArray<string>,
) {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const entries = yield* fs.readDirectory(root, { recursive: true }).pipe(
    Effect.mapError(cause => new PartitaError(`Read directory ${root}: ${formatUnknown(cause)}`)),
  )
  const files: Array<string> = []
  for (const entry of entries) {
    const relativePath = normalizeRelativePath(entry)
    const name = lastPathSegment(relativePath) ?? ''
    if (ignoredDirectoryNames.has(name) || sourcePrefixes.some(prefix => pathIsSameOrInside(relativePath, prefix))) {
      continue
    }
    if (relativePath.split('/').some(segment => ignoredDirectoryNames.has(segment))) {
      continue
    }
    if (!sourceCodeExtensions.has(extensionOf(relativePath))) {
      continue
    }
    const absolutePath = path.resolve(root, relativePath)
    const stat = yield* fs.stat(absolutePath).pipe(
      Effect.mapError(cause => new PartitaError(`Stat ${relativePath}: ${formatUnknown(cause)}`)),
    )
    if (stat.type === 'File') {
      files.push(absolutePath)
    }
  }
  return files
})

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

function specifierTargetsPrefix(path: Path.Path, root: string, importer: string, specifier: string, prefix: string): boolean {
  if (specifier === prefix || specifier.startsWith(`${prefix}/`)) {
    return true
  }
  if (!specifier.startsWith('.')) {
    return false
  }
  const resolved = path.resolve(path.dirname(importer), specifier)
  return pathIsSameOrInside(relativePathFrom(path, root, resolved), prefix)
}

const parseJson = Effect.fn('parseJson')(function* (text: string, path: string) {
  return yield* Schema.decodeUnknownEffect(Schema.UnknownFromJsonString)(text).pipe(
    Effect.mapError(cause => new PartitaError(`Invalid JSON in ${path}: ${formatUnknown(cause)}`)),
  )
})

const parsePinPlan = Effect.fn('parsePinPlan')(function* (raw: unknown) {
  const value = recordAt(raw)
  const baseline = recordAt(value.baseline)
  const contract = recordAt(value.contract)
  const source = recordAt(contract.source)
  const materialization = recordAt(contract.materialization)
  const ownership = recordAt(contract.ownership)
  const agent = recordAt(contract.agent)
  const workspace = recordAt(contract.workspace)
  const git = recordAt(value.git)
  const editorChangesValid = Array.isArray(value.editorChanges)
    && value.editorChanges.every((rawChange) => {
      const change = recordAt(rawChange)
      const path = change.path
      const action = change.action
      const beforeDigest = change.beforeDigest
      const contents = change.contents
      return (path === '.vscode/settings.json' || path === '.zed/settings.json')
        && (action === 'write' || action === 'none')
        && (beforeDigest === null
          || (typeof beforeDigest === 'string' && /^[0-9a-f]{64}$/u.test(beforeDigest)))
        && ((action === 'write' && typeof contents === 'string')
          || (action === 'none' && contents === null))
    })
  const currentRevisionValid = value.currentRevision === null
    || (typeof value.currentRevision === 'string'
      && immutableRevisionPattern.test(value.currentRevision))
  const contractDigestValid = baseline.contractDigest === null
    || (typeof baseline.contractDigest === 'string'
      && /^[0-9a-f]{64}$/u.test(baseline.contractDigest))
  const materializedRevisionValid = baseline.materializedRevision === null
    || (typeof baseline.materializedRevision === 'string'
      && immutableRevisionPattern.test(baseline.materializedRevision))
  const valid = value.planVersion === 1
    && (value.operation === 'add' || value.operation === 'update')
    && typeof value.contractPath === 'string'
    && currentRevisionValid
    && typeof value.desiredRevision === 'string'
    && immutableRevisionPattern.test(value.desiredRevision)
    && typeof value.recovery === 'boolean'
    && typeof baseline.head === 'string'
    && immutableRevisionPattern.test(baseline.head)
    && contractDigestValid
    && typeof baseline.prefixExists === 'boolean'
    && materializedRevisionValid
    && contract.schemaVersion === 2
    && typeof contract.name === 'string'
    && typeof source.repository === 'string'
    && typeof source.trackingBranch === 'string'
    && typeof source.revision === 'string'
    && typeof materialization.prefix === 'string'
    && materialization.mechanism === 'git-subtree'
    && typeof materialization.split === 'string'
    && typeof materialization.trailer === 'string'
    && ownership.mode === 'direct'
    && typeof agent.anchor === 'string'
    && typeof agent.route === 'string'
    && typeof agent.readOnly === 'boolean'
    && typeof agent.importBlock === 'boolean'
    && workspace.autoImport === 'excluded'
    && (workspace.watch === 'excluded' || workspace.watch === 'included')
    && (workspace.search === 'excluded' || workspace.search === 'included')
    && (workspace.files === 'hidden' || workspace.files === 'visible')
    && typeof value.contractJson === 'string'
    && git.command === 'git'
    && (git.action === 'add' || git.action === 'update' || git.action === 'none')
    && Array.isArray(git.args)
    && git.args.every(argument => typeof argument === 'string')
    && editorChangesValid
    && typeof value.planHash === 'string'
    && /^[0-9a-f]{64}$/u.test(value.planHash)
  if (!valid) {
    return yield* new PartitaError(
      'Source Pin plan file does not match approved planVersion 1 shape.',
    )
  }
  const plan = raw as unknown as PinPlan
  yield* validatePlanInternals(plan)
  return plan
})

const parseSettingsFile = Effect.fn('parseSettingsFile')(function* (path: string, relativePath: string) {
  const fs = yield* FileSystem.FileSystem
  const text = yield* fs.readFileString(path).pipe(
    Effect.mapError(cause => new PartitaError(`Read ${relativePath}: ${formatUnknown(cause)}`)),
  )
  const parsed = yield* parseJson(stripJsonComments(text), relativePath)
  if (!isRecord(parsed)) {
    return yield* new PartitaError(`${relativePath} must contain a JSON object`)
  }
  return parsed
})

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

const readOptionalFile = Effect.fn('readOptionalFile')(function* (path: string) {
  const fs = yield* FileSystem.FileSystem
  if (!(yield* fileExists(path))) {
    return null
  }
  return yield* fs.readFileString(path).pipe(
    Effect.mapError(cause => new PartitaError(`Read ${path}: ${formatUnknown(cause)}`)),
  )
})

const fileExists = Effect.fn('fileExists')(function* (path: string) {
  const fs = yield* FileSystem.FileSystem
  return yield* fs.exists(path).pipe(
    Effect.mapError(cause => new PartitaError(`Check ${path}: ${formatUnknown(cause)}`)),
  )
})

const defaultAgentRoute = Effect.fn('defaultAgentRoute')(function* (root: string) {
  const path = yield* Path.Path
  if (yield* fileExists(path.join(root, 'AGENTS.md'))) {
    return 'AGENTS.md'
  }
  return yield* new PartitaError(
    'Source Pin planning requires --agent-route when AGENTS.md is absent.',
  )
})

function githubRepositoryUrl(value: string): boolean {
  return /^https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/?$/u.test(value)
    || /^git@github\.com:[^/\s]+\/[^/\s]+$/u.test(value)
}

function siblingSubtreeContractPath(prefix: string, name: string): string {
  const normalizedPrefix = normalizeRelativePath(prefix)
  const lastSeparator = normalizedPrefix.lastIndexOf('/')
  const parent = lastSeparator === -1 ? '' : normalizedPrefix.slice(0, lastSeparator)
  const basename = lastPathSegment(normalizedPrefix) ?? name
  if (parent === '.' || parent.length === 0) {
    return `${basename}.subtree.json`
  }
  return `${parent}/${basename}.subtree.json`
}

function pinContractPathFromOption(path: Path.Path, root: string, value: string | undefined, fallback: string): string {
  const rawPath = nonEmpty(value) ?? fallback
  const relativePath = path.isAbsolute(rawPath) ? relativePathFrom(path, root, rawPath) : rawPath
  return normalizeRelativePath(relativePath)
}

function resolveContractPath(
  path: Path.Path,
  root: string,
  options: PinCommandOptions,
): string {
  const defaultPathOptions: { name?: string, prefix?: string } = {}
  const name = nonEmpty(options.name)
  const prefix = nonEmpty(options.prefix)
  if (name !== undefined) {
    defaultPathOptions.name = name
  }
  if (prefix !== undefined) {
    defaultPathOptions.prefix = prefix
  }
  return pinContractPathFromOption(
    path,
    root,
    options.contractPath,
    defaultPinContractPath(defaultPathOptions),
  )
}

const validatePlanIdentity = Effect.fn('validatePlanIdentity')(function* (
  path: Path.Path,
  options: {
    readonly root: string
    readonly repository: string
    readonly prefix: string
    readonly contractPath: string
  },
) {
  if (!githubRepositoryUrl(options.repository)) {
    return yield* new PartitaError(
      `Source Pin repository must be a GitHub URL: ${options.repository}`,
    )
  }
  if (!validRelativePath(path, options.prefix) || options.prefix.length === 0) {
    return yield* new PartitaError(`Source Pin prefix must be relative: ${options.prefix}`)
  }
  const expected = defaultPinContractPath({ prefix: options.prefix })
  if (options.contractPath !== expected) {
    return yield* new PartitaError(`Source Pin contract must be sibling path ${expected}.`)
  }
  if (!validRelativePath(path, options.contractPath)
    || !pathIsSameOrInside(path.resolve(options.root, options.prefix), options.root)) {
    return yield* new PartitaError(
      `Source Pin path escapes repository root: ${options.prefix}`,
    )
  }
})

const requiredOption = Effect.fn('requiredPinOption')(function* (
  value: string | undefined,
  name: string,
) {
  const result = nonEmpty(value)
  return result ?? (yield* new PartitaError(`Source Pin add planning requires ${name}.`))
})

const requireInclusionDecision = Effect.fn('requirePinInclusionDecision')(function* (
  value: ParsedInclusionDecision,
  field: string,
) {
  if (value === 'excluded' || value === 'included') {
    return value
  }
  return yield* new PartitaError(`${field} must be excluded or included.`)
})

const requireVisibilityDecision = Effect.fn('requirePinVisibilityDecision')(function* (
  value: ParsedVisibilityDecision,
  field: string,
) {
  if (value === 'hidden' || value === 'visible') {
    return value
  }
  return yield* new PartitaError(`${field} must be hidden or visible.`)
})

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

function validRelativePath(path: Path.Path, value: string): boolean {
  if (path.isAbsolute(value)) {
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

function relativePathFrom(pathService: Path.Path, root: string, path: string): string {
  return pathService.relative(root, path).split(pathService.sep).join('/')
}

function extensionOf(path: string): string {
  const index = path.lastIndexOf('.')
  return index === -1 ? '' : path.slice(index)
}

function lastPathSegment(path: string): string | undefined {
  const normalized = normalizeRelativePath(path)
  if (normalized.length === 0) {
    return undefined
  }
  return normalized.split('/').filter(Boolean).at(-1)
}

function normalizeOwnershipMode(
  value: string | undefined,
): GitHubSubtreePinContract['ownership']['mode'] {
  return value === 'direct' ? 'direct' : ''
}

function normalizeInclusionDecision(value: string | undefined): ParsedInclusionDecision {
  return value === 'excluded' || value === 'included' ? value : ''
}

function normalizeVisibilityDecision(value: string | undefined): ParsedVisibilityDecision {
  return value === 'hidden' || value === 'visible' ? value : ''
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

function stringArrayCoversPrefix(value: unknown, prefix: string): boolean {
  if (!Array.isArray(value)) {
    return false
  }
  return value.some((entry) => {
    if (typeof entry !== 'string') {
      return false
    }
    const normalized = normalizeRelativePath(entry.endsWith('/**') ? entry.slice(0, -3) : entry)
    return normalized === normalizeRelativePath(prefix) || pathIsSameOrInside(prefix, normalized)
  })
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function cloneRecord(value: JsonRecord): JsonRecord {
  return JSON.parse(JSON.stringify(value)) as JsonRecord
}

function ensureRecord(parent: JsonRecord, key: string): JsonRecord {
  if (isRecord(parent[key])) {
    return parent[key]
  }
  const created: JsonRecord = {}
  parent[key] = created
  return created
}

function addString(value: unknown, entry: string): ReadonlyArray<string> {
  const existing = Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
  return existing.includes(entry) ? existing : [...existing, entry]
}

function removeString(parent: JsonRecord, key: string, entry: string) {
  const existing = Array.isArray(parent[key])
    ? parent[key].filter((item): item is string => typeof item === 'string' && item !== entry)
    : []
  if (existing.length === 0) {
    delete parent[key]
  }
  else {
    parent[key] = existing
  }
}

function setGlobDecision(
  settings: JsonRecord,
  key: string,
  glob: string,
  enabled: boolean,
) {
  const existing = cloneRecord(recordAt(settings[key]))
  if (enabled) {
    existing[glob] = true
  }
  else {
    delete existing[glob]
  }
  if (Object.keys(existing).length === 0) {
    delete settings[key]
  }
  else {
    settings[key] = existing
  }
}

function stringArrayIncludes(value: unknown, entry: string): boolean {
  return Array.isArray(value) && value.includes(entry)
}

function checkVscodeGlobDecision(
  issues: Array<PinIssue>,
  settings: JsonRecord,
  key: string,
  glob: string,
  enabled: boolean,
  decision: string,
) {
  if ((recordAt(settings[key])[glob] === true) !== enabled) {
    issues.push(issue(
      `pin.editor_vscode_${decision}_mismatch`,
      `VSCode ${decision} setting must match Source Pin workspace decision`,
      '.vscode/settings.json',
    ))
  }
}

function hashPinPlan(plan: PinPlan): string {
  const { planHash: _, ...body } = plan
  return hashPinPlanBody(body)
}

function hashPinPlanBody(body: PinPlanBody): string {
  return sha256(canonicalJson(body))
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

function canonicalJson(value: unknown): string {
  return JSON.stringify(canonicalValue(value))
}

function canonicalValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(canonicalValue)
  }
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.keys(value).sort().map(key => [key, canonicalValue(value[key])]),
    )
  }
  return value
}

function formatUnknown(cause: unknown): string {
  if (cause instanceof Error) {
    return cause.message
  }
  return String(cause)
}

function issue(code: string, message: string, path?: string): PinIssue {
  return path === undefined ? { code, message } : { code, message, path }
}
