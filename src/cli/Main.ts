import process from 'node:process'
import * as NodeServices from '@effect/platform-node/NodeServices'
import * as Effect from 'effect/Effect'
import * as Path from 'effect/Path'
import * as Command from 'effect/unstable/cli/Command'
import * as Flag from 'effect/unstable/cli/Flag'
import {
  printChezmoiHomeApply,
  printChezmoiHomeDiff,
  printChezmoiHomeStatus,
} from '../partita/home.ts'
import {
  printPinApply,
  printPinPlan,
  printPinStatus,
  verifyPins,
} from '../partita/pin.ts'
import { printPrimitiveReferenceSync } from '../partita/primitive.ts'
import {
  printSkillRuntimeStatus,
  printSkillRuntimeVerify,
  syncSkillRuntime,
} from '../partita/skill.ts'
import { verifyProject } from '../partita/verifier.ts'

export interface CliConfig {
  readonly root: string
  readonly version: string
}

const resolveFromCwd = Effect.fnUntraced(function* (value: string) {
  const path = yield* Path.Path
  return path.resolve(process.cwd(), value)
})

function rootFlag(defaultRoot: string) {
  return Flag.path('root').pipe(
    Flag.withDescription('Partita repository root'),
    Flag.withDefault(defaultRoot),
    Flag.mapEffect(resolveFromCwd),
  )
}

const verifyLevelFlag = Flag.choice('level', ['project', 'source', 'runtime'] as const).pipe(
  Flag.withDescription('Verification layer to run'),
  Flag.withDefault('project' as const),
)

const pinContractFlag = Flag.path('contract').pipe(
  Flag.withDescription('GitHub subtree pin contract path; defaults to repos/<name>.subtree.json from --name/--prefix'),
  Flag.withDefault(''),
)

const pinNameFlag = Flag.string('name').pipe(
  Flag.withDescription('Pin name'),
  Flag.withDefault(''),
)

function pinInclusionDecisionFlag(name: string, description: string) {
  return Flag.choice(name, ['excluded', 'included'] as const).pipe(
    Flag.withDescription(description),
    Flag.withDefault('excluded' as const),
  )
}

const pinFilesFlag = Flag.choice('files', ['hidden', 'visible'] as const).pipe(
  Flag.withDescription('Whether editor file trees hide or show the pinned prefix'),
  Flag.withDefault('visible' as const),
)

const pinPlanFlags = {
  agentRoute: Flag.string('agent-route').pipe(Flag.withDescription('Agent route file path'), Flag.withDefault('')),
  anchor: Flag.string('anchor').pipe(Flag.withDescription('Anchor or LLM document path'), Flag.withDefault('')),
  branch: Flag.string('branch').pipe(Flag.withDescription('GitHub tracking branch'), Flag.withDefault('main')),
  contractPath: pinContractFlag,
  files: pinFilesFlag,
  name: pinNameFlag,
  operation: Flag.choice('operation', ['add', 'update'] as const).pipe(
    Flag.withDescription('Whether to plan a new Source Pin or update an existing contract'),
    Flag.withDefault('add' as const),
  ),
  prefix: Flag.string('prefix').pipe(Flag.withDescription('Local pinned prefix'), Flag.withDefault('')),
  repository: Flag.string('repository').pipe(Flag.withDescription('GitHub repository URL'), Flag.withDefault('')),
  revision: Flag.string('revision').pipe(
    Flag.withDescription('Optional immutable revision assertion for the resolved tracking branch'),
    Flag.withDefault(''),
  ),
  search: pinInclusionDecisionFlag('search', 'Whether editor search excludes or includes the pinned prefix'),
  watch: pinInclusionDecisionFlag('watch', 'Whether editor file watching excludes or includes the pinned prefix'),
}

const pinApplyFlags = {
  planHash: Flag.string('plan-hash').pipe(
    Flag.withDescription('Approved SHA-256 hash printed in the Source Pin plan'),
  ),
  planPath: Flag.path('plan').pipe(
    Flag.withDescription('Path to the exact JSON Source Pin plan being approved'),
    Flag.mapEffect(resolveFromCwd),
  ),
  revision: Flag.string('revision').pipe(
    Flag.withDescription('Approved immutable revision printed in the Source Pin plan'),
  ),
}

function makeCli(config: CliConfig) {
  const root = rootFlag(config.root)
  const pinReadFlags = {
    contractPath: pinContractFlag,
    name: pinNameFlag,
    prefix: Flag.string('prefix').pipe(Flag.withDescription('Local pinned prefix used to derive the default contract path'), Flag.withDefault('')),
    root,
  }

  const verify = Command.make('verify', {
    level: verifyLevelFlag,
    root,
  }, Effect.fnUntraced(function* ({ level, root }) {
    yield* verifyProject({ level, root })
  })).pipe(
    Command.withDescription('Verify Partita runtime, source, or full project invariants'),
  )

  const skillSync = Command.make('sync', {
    root,
  }, Effect.fnUntraced(function* ({ root }) {
    yield* syncSkillRuntime({ root })
  })).pipe(
    Command.withDescription('Sync Partita skills into the skills.sh global Codex runtime'),
  )

  const skillStatus = Command.make('status', {
    root,
  }, Effect.fnUntraced(function* ({ root }) {
    yield* printSkillRuntimeStatus({ root })
  })).pipe(
    Command.withDescription('Show skills.sh global Codex runtime status for Partita skills'),
  )

  const skillVerify = Command.make('verify', {
    root,
  }, Effect.fnUntraced(function* ({ root }) {
    yield* printSkillRuntimeVerify({ root })
  })).pipe(
    Command.withDescription('Verify skills.sh global Codex runtime matches Partita source skills'),
  )

  const skill = Command.make('skill').pipe(
    Command.withDescription('Manage the skills.sh-backed Partita skill runtime loop'),
    Command.withSubcommands([skillSync, skillStatus, skillVerify]),
  )

  const homeStatus = Command.make('status', {
    root,
  }, Effect.fnUntraced(function* ({ root }) {
    yield* printChezmoiHomeStatus({ root })
  })).pipe(
    Command.withDescription('Show chezmoi home materialization status'),
  )

  const homeApply = Command.make('apply', {
    root,
    write: Flag.boolean('write').pipe(
      Flag.withDescription('Confirm that chezmoi should write user-home materialization'),
      Flag.withDefault(false),
    ),
  }, Effect.fnUntraced(function* ({ root, write }) {
    yield* printChezmoiHomeApply({ root, write })
  })).pipe(
    Command.withDescription('Delegate user-home materialization writes to chezmoi'),
  )

  const homeDiff = Command.make('diff', {
    root,
  }, Effect.fnUntraced(function* ({ root }) {
    yield* printChezmoiHomeDiff({ root })
  })).pipe(
    Command.withDescription('Show non-mutating chezmoi diff for user-home materialization'),
  )

  const home = Command.make('home').pipe(
    Command.withDescription('Inspect or run chezmoi-owned user-home materialization'),
    Command.withSubcommands([homeStatus, homeDiff, homeApply]),
  )

  const primitiveSync = Command.make('sync', {
    root,
  }, Effect.fnUntraced(function* ({ root }) {
    yield* printPrimitiveReferenceSync({ root })
  })).pipe(
    Command.withDescription('Copy primitive reference bodies into skill-local references'),
  )

  const primitive = Command.make('primitive').pipe(
    Command.withDescription('Manage Partita primitive reference copy sources'),
    Command.withSubcommands([primitiveSync]),
  )

  const pinPlan = Command.make('plan', {
    ...pinPlanFlags,
    root,
  }, Effect.fnUntraced(function* (options) {
    yield* printPinPlan(options)
  })).pipe(
    Command.withDescription('Resolve a GitHub branch and print a read-only, hashed Source Pin add/update plan'),
  )

  const pinStatus = Command.make('status', pinReadFlags, Effect.fnUntraced(function* (options) {
    yield* printPinStatus(options)
  })).pipe(
    Command.withDescription('Show GitHub git-subtree pin status and verification issues'),
  )

  const pinVerify = Command.make('verify', pinReadFlags, Effect.fnUntraced(function* (options) {
    yield* verifyPins(options)
  })).pipe(
    Command.withDescription('Hard-verify GitHub git-subtree pin contracts'),
  )

  const pinAdd = Command.make('add', {
    ...pinApplyFlags,
    root,
  }, Effect.fnUntraced(function* (options) {
    yield* printPinApply({ ...options, operation: 'add' })
  })).pipe(
    Command.withDescription('Apply an approved immutable Source Pin add plan with git subtree'),
  )

  const pinUpdate = Command.make('update', {
    ...pinApplyFlags,
    root,
  }, Effect.fnUntraced(function* (options) {
    yield* printPinApply({ ...options, operation: 'update' })
  })).pipe(
    Command.withDescription('Apply an approved immutable Source Pin update plan with git subtree'),
  )

  const pin = Command.make('pin').pipe(
    Command.withDescription('Manage GitHub repository pins materialized with git subtree'),
    Command.withSubcommands([pinPlan, pinStatus, pinVerify, pinAdd, pinUpdate]),
  )

  return Command.make('partita').pipe(
    Command.withDescription('Partita skill harness CLI'),
    Command.withSubcommands([verify, skill, home, primitive, pin]),
  )
}

export function runCli(config: CliConfig) {
  return makeCli(config).pipe(
    Command.run({ version: config.version }),
    Effect.provide(NodeServices.layer),
  )
}
