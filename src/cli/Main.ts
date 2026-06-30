import process from 'node:process'
import * as NodeServices from '@effect/platform-node/NodeServices'
import * as Effect from 'effect/Effect'
import * as Path from 'effect/Path'
import * as Command from 'effect/unstable/cli/Command'
import * as Flag from 'effect/unstable/cli/Flag'
import { generateProject } from '../partita/generator.ts'
import { installCodexPlugin, installCodexSkill } from '../partita/install.ts'
import {
  defaultSourceContractPath,
  printSourcePlan,
  printSourceStatus,
  verifySourceEntries,
} from '../partita/source-entry.ts'
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

const checkFlag = Flag.boolean('check').pipe(
  Flag.withDescription('Check generated files without writing'),
)

const sourceContractFlag = Flag.path('contract').pipe(
  Flag.withDescription('Source-entry contract path'),
  Flag.withDefault(defaultSourceContractPath),
)

const sourceNameFlag = Flag.string('name').pipe(
  Flag.withDescription('Source entry name'),
  Flag.withDefault(''),
)

const sourceMechanismFlag = Flag.choice('mechanism', ['git-subtree'] as const).pipe(
  Flag.withDescription('Source entry materialization mechanism'),
  Flag.withDefault('git-subtree' as const),
)

const sourceOwnershipModeFlag = Flag.choice('ownership-mode', ['direct', 'provider', 'prelude-maintain'] as const).pipe(
  Flag.withDescription('Source entry ownership mode'),
  Flag.withDefault('direct' as const),
)

function sourcePolicyDecisionFlag(name: string, description: string) {
  return Flag.choice(name, ['enabled', 'recommended', 'disabled'] as const).pipe(
    Flag.withDescription(description),
    Flag.withDefault('recommended' as const),
  )
}

const sourceFilesExcludeFlag = Flag.choice('files-exclude', ['enabled', 'disabled'] as const).pipe(
  Flag.withDescription('Whether editor file trees should hide the source prefix'),
  Flag.withDefault('disabled' as const),
)

const sourcePlanFlags = {
  agentRoute: Flag.string('agent-route').pipe(Flag.withDescription('Agent route file path'), Flag.withDefault('')),
  anchor: Flag.string('anchor').pipe(Flag.withDescription('Anchor or LLM document path'), Flag.withDefault('')),
  branch: Flag.string('branch').pipe(Flag.withDescription('Upstream branch'), Flag.withDefault('main')),
  contractPath: sourceContractFlag,
  filesExclude: sourceFilesExcludeFlag,
  mechanism: sourceMechanismFlag,
  name: sourceNameFlag,
  ownershipMode: sourceOwnershipModeFlag,
  prefix: Flag.string('prefix').pipe(Flag.withDescription('Local source prefix'), Flag.withDefault('')),
  ref: Flag.string('ref').pipe(Flag.withDescription('Pinned upstream ref or subtree split'), Flag.withDefault('')),
  repository: Flag.string('repository').pipe(Flag.withDescription('Upstream repository URL'), Flag.withDefault('')),
  searchExclude: sourcePolicyDecisionFlag('search-exclude', 'Whether editor search should exclude the source prefix'),
  updateCommand: Flag.string('update-command').pipe(Flag.withDescription('Source update command'), Flag.withDefault('')),
  verifyCommand: Flag.string('verify-command').pipe(Flag.withDescription('Source verify command'), Flag.withDefault('')),
  watcherExclude: sourcePolicyDecisionFlag('watcher-exclude', 'Whether editor file watching should exclude the source prefix'),
}

function makeCli(config: CliConfig) {
  const root = rootFlag(config.root)
  const sourceReadFlags = {
    contractPath: sourceContractFlag,
    name: sourceNameFlag,
    root,
  }

  const generate = Command.make('generate', {
    check: checkFlag,
    root,
  }, Effect.fnUntraced(function* ({ check, root }) {
    yield* generateProject({ check, root })
  })).pipe(
    Command.withDescription('Generate Partita plugin metadata and dispatcher files'),
  )

  const verify = Command.make('verify', {
    root,
  }, Effect.fnUntraced(function* ({ root }) {
    yield* verifyProject({ root })
  })).pipe(
    Command.withDescription('Verify Partita skill framework and generated metadata'),
  )

  const installSkill = Command.make('codex-skill', {
    root,
  }, Effect.fnUntraced(function* ({ root }) {
    yield* installCodexSkill({ root })
  })).pipe(
    Command.withDescription('Install Partita skills into global Codex skill runtime'),
  )

  const installPlugin = Command.make('codex-plugin', {
    root,
  }, Effect.fnUntraced(function* ({ root }) {
    yield* installCodexPlugin({ root })
  })).pipe(
    Command.withDescription('Map this repository into the personal Codex plugin marketplace'),
  )

  const install = Command.make('install').pipe(
    Command.withDescription('Install Partita into local agent runtimes'),
    Command.withSubcommands([installPlugin, installSkill]),
  )

  const sourcePlan = Command.make('plan', {
    ...sourcePlanFlags,
    root,
  }, Effect.fnUntraced(function* (options) {
    yield* printSourcePlan(options)
  })).pipe(
    Command.withDescription('Plan a generic source-entry contract without writing files'),
  )

  const sourceStatus = Command.make('status', sourceReadFlags, Effect.fnUntraced(function* (options) {
    yield* printSourceStatus(options)
  })).pipe(
    Command.withDescription('Show source-entry status and verification issues'),
  )

  const sourceVerify = Command.make('verify', sourceReadFlags, Effect.fnUntraced(function* (options) {
    yield* verifySourceEntries(options)
  })).pipe(
    Command.withDescription('Hard-verify source-entry contracts'),
  )

  const sourceAdd = Command.make('add', {
    ...sourcePlanFlags,
    dryRun: Flag.boolean('dry-run').pipe(
      Flag.withDescription('Only print the add plan; direct source writes are intentionally not implemented'),
      Flag.withDefault(true),
    ),
    root,
  }, Effect.fnUntraced(function* ({ dryRun, ...options }) {
    if (!dryRun) {
      return yield* Effect.fail(new Error('partita source add only supports --dry-run in this implementation'))
    }
    yield* printSourcePlan(options)
  })).pipe(
    Command.withDescription('Dry-run a source-entry add plan'),
  )

  const sourceUpdate = Command.make('update', {
    contractPath: sourceContractFlag,
    dryRun: Flag.boolean('dry-run').pipe(
      Flag.withDescription('Only print update status; direct git subtree update is intentionally not implemented'),
      Flag.withDefault(true),
    ),
    name: sourceNameFlag,
    root,
  }, Effect.fnUntraced(function* ({ dryRun, ...options }) {
    if (!dryRun) {
      return yield* Effect.fail(new Error('partita source update only supports --dry-run in this implementation'))
    }
    yield* printSourceStatus(options)
  })).pipe(
    Command.withDescription('Dry-run source-entry update checks before a domain wrapper runs git subtree'),
  )

  const source = Command.make('source').pipe(
    Command.withDescription('Manage generic source-entry pins for agent-readable upstream sources'),
    Command.withSubcommands([sourcePlan, sourceStatus, sourceVerify, sourceAdd, sourceUpdate]),
  )

  return Command.make('partita').pipe(
    Command.withDescription('Partita skill harness CLI'),
    Command.withSubcommands([generate, verify, install, source]),
  )
}

export function runCli(config: CliConfig) {
  return makeCli(config).pipe(
    Command.run({ version: config.version }),
    Effect.provide(NodeServices.layer),
  )
}
