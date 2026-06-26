---
name: update-effect-harness
description: "Use when the user asks to update effect-harness itself to the latest official Effect source pin, package baseline, or self-update workflow. Not for setting up an Effect target repo, generic repo pinning, writing Effect application code, or one-off dependency bumps outside effect-harness."
---

# Update Effect Harness

Prefix your first user-facing line with `🧭` inline, not as its own paragraph,
when this Partita skill is active.

## Rule

Facing an `effect-harness` self-update request, first use or create the hard
update mechanism, to avoid hand-edited versions, stale official source pins, or
target repos consuming an unverified harness drift.

## Pattern

Use when:

- the user asks to update `effect-harness` to the latest official Effect beta or
  source pin;
- `repos/effect`, `repos/effect.subtree.json`, pnpm catalog, overrides,
  lockfile, or baseline docs need refresh inside `effect-harness`;
- a repeated Effect baseline update checklist should become CLI, script,
  verifier, or test-backed harness contract;
- a downstream target can update only after harness drift is resolved.

Do not use when:

- the task is setting up, migrating, or repairing a target repo; use
  `setup-effect-area`;
- the task is generic external repo pinning; use `pin`;
- the task is writing Effect application features or fixing target business
  code;
- the user only wants to inspect official Effect docs without changing the
  harness.

## Boundary

Soft:

- Classify the task as `status-only`, `mechanism-gap`, `harness-update`, or
  `target-blocked`.
- Decide whether existing `effect-harness` commands are sufficient.
- Separate official source or package drift from target repo setup and business
  work.
- Keep large source subtree churn reviewable and isolated.

Hard:

- Do not call the harness current unless `pnpm effect:status` reports every
  official row current, or reports the exact blocker.
- Do not update source pins or baselines with a dirty worktree unless the dirty
  files are the accepted update scope.
- Do not treat a prose checklist as the hard update mechanism.
- Do not hand-write package versions from memory; resolve official npm
  dist-tags and source head through harness status/update machinery or direct
  official commands.
- Finish with `pnpm verify` and `pnpm effect:status`, or an exact
  machine-checkable blocker.

## Effects

- Conversation: may show the `🧭` marker, update classification, official drift,
  changed surfaces, verification output, and target blockers.
- Filesystem: may write source pins, baseline manifests, package metadata,
  lockfiles, docs, verifier contracts, tests, or update CLI surfaces in
  `effect-harness`.
- External: may query official npm dist-tags and the official Effect source
  remote needed to resolve the update.

## Workflow

1. Confirm the repo is `effect-harness` and preflight git status plus
   `pnpm effect:status`.
2. Classify the task as `status-only`, `mechanism-gap`, `harness-update`, or
   `target-blocked`.
3. If classification is `mechanism-gap`, design the smallest hard surface before
   changing source pins or baselines.
4. If classification is `harness-update`, update only official source pin,
   package baselines, pnpm policy/lockfile, docs, and tests directly required by
   official drift.
5. Read updated official guidance before changing runtime/verifier contracts.
6. Verify with `pnpm verify` and final `pnpm effect:status`.
7. Report changed files, official source ref, package baseline, update command,
   verify command, and any target repos still blocked.

## References

- No references.

## Validation

Before done:

- the first user-facing line includes `🧭` inline;
- the task is classified as `status-only`, `mechanism-gap`, `harness-update`, or
  `target-blocked`;
- no target repo setup or business work was mixed into the harness update;
- hard constraints are backed by CLI, git, npm, package, test, or verifier
  output;
- completion reports `pnpm verify` and `pnpm effect:status`, or exact blockers.
