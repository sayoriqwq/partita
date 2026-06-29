---
name: pin
description: "Use when the user asks to pin an external repository or source repo into the current repository as a durable tracked source with locator, manifest, update path, and verification. Not for Effect-specific harness setup, package-version pinning only, UI/thread pinning, or copying source without provenance."
---

# Pin

Prefix your first user-facing line with `🧭` inline, not as its own paragraph,
when this Partita skill is active.

## Rule

Facing a request to bring an external repository source into the current repo,
first record a reviewable source pin contract, to avoid copied source, version
pins, or mirrored trees without provenance, update path, and verification.

## Pattern

Use when:

- the user asks to pin, vendor, mirror, subtree, submodule, or otherwise bring
  an external repo source into the current repo;
- an upstream repository should become a durable local reference;
- the manifest, locator, update command, or verify command for a repo source
  needs design or audit;
- an ad hoc copied source tree should become a reviewable repo pin.

Do not use when:

- the task is specifically to set up Effect harness runtime;
- the request only pins npm, pnpm, Docker, or tool versions without a repo
  source surface;
- "pin" refers to UI items, notes, threads, tasks, or local workflow state;
- the user wants to read or compare an external repo without bringing it into
  the current repo.

## Boundary

Soft:

- Classify the task as `source-pin`, `mechanism-audit`, `provider-setup`, or
  `unknown-pin`.
- Prefer an existing project CLI, script, manifest schema, or documented source
  update command.
- Separate upstream source authority from local projection.
- Stop when the repo pin is materialized and verified, or when the owner,
  mechanism, or hard verifier is missing.

Hard:

- Do not copy source without recording repository URL, pinned ref, local path,
  mechanism, update path, and verify path.
- Do not call a repo pinned if the pinned ref cannot be checked by git,
  manifest validation, or a project verifier.
- Do not invent a new pin script when an owning CLI or verifier already exists.
- Do not mutate dirty user work in the current repo or upstream checkout.
- Back completion with git ref checks, manifest validation, update dry-run or
  no-op check, project verifier, and `git diff --check` where applicable.

## Effects

- Conversation: may show the `🧭` marker, pin classification, pin contract,
  report, blockers, and verification results.
- Filesystem: may write a pinned source tree, manifest, lock file,
  documentation route, update script, verifier hook, or package metadata inside
  the approved repo scope.
- External: may access the upstream repository through git or official source
  commands required to resolve the pin.

## Workflow

1. Resolve the current repo, upstream repo URL/path, intended local path, and
   owning mechanism. Ask one focused question if any are missing.
2. Preflight the current repo and any local upstream checkout with git status
   and current ref checks.
3. Prefer an existing project CLI, script, manifest schema, or documented
   source-update command.
4. Record a pin contract with upstream locator, pinned ref, local path,
   mechanism, update command, verify command, and ownership note.
5. Materialize only the source surface and directly required manifest or
   verifier files.
6. Run the owning hard checks and `git diff --check` where applicable.
7. Report changed files, pinned ref, update command, verify command, and any
   missing hard mechanism.

## References

- No references.

## Validation

Before done:

- the first user-facing line includes `🧭` inline;
- the upstream repo, pinned ref, local path, and owner are explicit;
- the request was classified as `source-pin`, `mechanism-audit`,
  `provider-setup`, or `unknown-pin`;
- upstream source and local projection are not confused;
- hard constraints are backed by git, script, CLI, schema, test, package, or
  verifier output;
- completion reports changed files, update path, verify path, and exact
  blockers.
