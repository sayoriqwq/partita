---
name: setup-effect-area
description: "Use when the user asks to set up, update, verify, or repair a TypeScript/Effect target repository against effect-harness runtime and CLI contracts. Not for updating effect-harness itself, generic repo pinning, writing Effect business features, or defining Partita skill semantics."
---

# Setup Effect Area

Prefix your first user-facing line with `🧭` inline, not as its own paragraph,
when this Partita skill is active.

## Rule

Facing an Effect target repo setup, update, verify, or repair request, first run
the owning `effect-harness` contract path, to avoid hand-copied docs, target
local dispatchers, drifted baselines, or runtime copies becoming semantic
authority.

## Pattern

Use when:

- the user asks to run, review, or repair `effect-harness init` for a target
  repo;
- a target repo must update after `effect-harness` baseline or runtime contract
  changes;
- a target repo compatibility check against the current `effect-harness` is
  needed;
- Partita skill source must be coordinated with `effect-harness` managed runtime
  copies.

Do not use when:

- the request is generic external repo pinning; use `pin`;
- the user asks to update `effect-harness` itself, `repos/effect`, or the
  official Effect source subtree; use `update-effect-harness`;
- the user wants Effect API design or target business feature work after setup;
- the task is to redesign Partita skill semantics inside `effect-harness`.

## Boundary

Soft:

- Classify the target as `fresh-setup`, `target-update`, or
  `blocked-by-harness`.
- Keep ownership separated: Partita owns skill source semantics,
  `effect-harness` owns setup CLI/runtime/verifier, targets own product code.
- Report missing roots, dirty worktree risk, or absent harness CLI support
  instead of hand-writing a replacement.
- Use focused Effect subagents only through the target runtime agent config.

Hard:

- Do not define Partita skill semantics in `effect-harness`.
- Do not copy harness-internal skills into a target repo; targets receive only
  managed runtime output from `effect-harness init`.
- Do not add target-local effect-harness dispatcher scripts.
- Do not hand-write Effect baseline versions; read them from the harness
  manifest or let the harness CLI write them.
- Verify with target `pnpm effect:status`, `pnpm effect:verify`, and
  `pnpm verify`, or report the exact machine-checkable blocker.

## Effects

- Conversation: may show the `🧭` marker, target classification, setup report,
  verifier output, and blockers.
- Filesystem: may update target package metadata, tsconfig, `.codex` runtime,
  `.effect-harness.json`, managed AGENTS blocks, lockfiles, and managed runtime
  copies through the owning harness path.
- External: may access package registries or official sources only through
  target package commands or effect-harness status/update machinery.

## Workflow

1. Resolve `HARNESS_ROOT` and `TARGET_ROOT`. Ask one focused question if either
   root is missing or ambiguous.
2. Preflight both repos with git status and preserve dirty user work.
3. Read harness authority: `HARNESS.md`, `harness/target-agent-contract.md`,
   and `repos/effect.subtree.json`.
4. Read target shape: `AGENTS.md`, `package.json`, `pnpm-workspace.yaml`,
   `tsconfig.json`, and local dispatcher scripts.
5. Classify the target. If the required harness command does not exist, report
   that blocker instead of hand-writing a replacement.
6. Run setup or update dry-run before writing when the harness supports it.
7. Run the owning harness command for actual setup or update.
8. Inspect target `.effect-harness.json` after setup/update.
9. Use `.codex/agents/effect-worker.md` for focused Effect subagents if needed.
10. Run target package setup commands when package or lockfile surfaces changed.
11. Verify with `pnpm effect:status`, `pnpm effect:verify`, and `pnpm verify`.
12. Report changed files, classification, status currency, verification results,
    and any missing harness CLI/sync mechanism.

## References

- No references.

## Validation

Before done:

- the first user-facing line includes `🧭` inline;
- target root and harness root are explicit;
- target classification is `fresh-setup`, `target-update`, or
  `blocked-by-harness`;
- Partita skill source and `effect-harness` CLI/runtime ownership are separated;
- setup or update dry-run happened before target writes when supported;
- `.effect-harness.json` was inspected after setup/update;
- no official Effect source subtree update happened for target setup;
- hard checks include target `pnpm effect:verify` and `pnpm verify`, or exact
  blockers.
