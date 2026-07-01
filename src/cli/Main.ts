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
  printPinPlan,
  printPinStatus,
  verifyPins,
} from '../partita/pin.ts'
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

const pinOwnershipModeFlag = Flag.choice('ownership-mode', ['direct', 'provider', 'prelude-maintain'] as const).pipe(
  Flag.withDescription('Pin ownership mode'),
  Flag.withDefault('direct' as const),
)

function pinPolicyDecisionFlag(name: string, description: string) {
  return Flag.choice(name, ['enabled', 'recommended', 'disabled'] as const).pipe(
    Flag.withDescription(description),
    Flag.withDefault('recommended' as const),
  )
}

const pinFilesExcludeFlag = Flag.choice('files-exclude', ['enabled', 'disabled'] as const).pipe(
  Flag.withDescription('Whether editor file trees should hide the pinned prefix'),
  Flag.withDefault('disabled' as const),
)

const pinPlanFlags = {
  agentRoute: Flag.string('agent-route').pipe(Flag.withDescription('Agent route file path'), Flag.withDefault('')),
  anchor: Flag.string('anchor').pipe(Flag.withDescription('Anchor or LLM document path'), Flag.withDefault('')),
  branch: Flag.string('branch').pipe(Flag.withDescription('Upstream branch'), Flag.withDefault('main')),
  contractPath: pinContractFlag,
  filesExclude: pinFilesExcludeFlag,
  name: pinNameFlag,
  ownershipMode: pinOwnershipModeFlag,
  prefix: Flag.string('prefix').pipe(Flag.withDescription('Local pinned prefix'), Flag.withDefault('')),
  ref: Flag.string('ref').pipe(Flag.withDescription('Pinned upstream ref or subtree split'), Flag.withDefault('')),
  repository: Flag.string('repository').pipe(Flag.withDescription('Upstream repository URL'), Flag.withDefault('')),
  searchExclude: pinPolicyDecisionFlag('search-exclude', 'Whether editor search should exclude the pinned prefix'),
  updateCommand: Flag.string('update-command').pipe(Flag.withDescription('Source update command'), Flag.withDefault('')),
  verifyCommand: Flag.string('verify-command').pipe(Flag.withDescription('Source verify command'), Flag.withDefault('')),
  watcherExclude: pinPolicyDecisionFlag('watcher-exclude', 'Whether editor file watching should exclude the pinned prefix'),
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

  const pinPlan = Command.make('plan', {
    ...pinPlanFlags,
    root,
  }, Effect.fnUntraced(function* (options) {
    yield* printPinPlan(options)
  })).pipe(
    Command.withDescription('Plan a GitHub git-subtree pin contract without writing files'),
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
    ...pinPlanFlags,
    dryRun: Flag.boolean('dry-run').pipe(
      Flag.withDescription('Only print the add plan; direct git subtree writes are intentionally not implemented'),
      Flag.withDefault(true),
    ),
    root,
  }, Effect.fnUntraced(function* ({ dryRun, ...options }) {
    if (!dryRun) {
      return yield* Effect.fail(new Error('partita pin add only supports --dry-run in this implementation'))
    }
    yield* printPinPlan(options)
  })).pipe(
    Command.withDescription('Dry-run a GitHub git-subtree pin add plan'),
  )

  const pinUpdate = Command.make('update', {
    contractPath: pinContractFlag,
    dryRun: Flag.boolean('dry-run').pipe(
      Flag.withDescription('Only print update status; direct git subtree update is intentionally not implemented'),
      Flag.withDefault(true),
    ),
    name: pinNameFlag,
    prefix: Flag.string('prefix').pipe(Flag.withDescription('Local pinned prefix used to derive the default contract path'), Flag.withDefault('')),
    root,
  }, Effect.fnUntraced(function* ({ dryRun, ...options }) {
    if (!dryRun) {
      return yield* Effect.fail(new Error('partita pin update only supports --dry-run in this implementation'))
    }
    yield* printPinStatus(options)
  })).pipe(
    Command.withDescription('Dry-run GitHub git-subtree update checks before a domain wrapper mutates the tree'),
  )

  const pin = Command.make('pin').pipe(
    Command.withDescription('Manage GitHub repository pins materialized with git subtree'),
    Command.withSubcommands([pinPlan, pinStatus, pinVerify, pinAdd, pinUpdate]),
  )

  return Command.make('partita').pipe(
    Command.withDescription('Partita skill harness CLI'),
    Command.withSubcommands([verify, skill, home, pin]),
  )
}

export function runCli(config: CliConfig) {
  return makeCli(config).pipe(
    Command.run({ version: config.version }),
    Effect.provide(NodeServices.layer),
  )
}
