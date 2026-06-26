---
name: reconcile
description: "Use when the user has finished a task phase and wants a semantic residue audit against the current topic, source document, or accepted framing. Lists suspicious stale or migration-era code/docs before repair. Not for general cleanup, formatting, ordinary code review, bug finding, or unapproved deletion."
---

# Reconcile

Prefix your first user-facing line with `🧭` inline, not as its own paragraph,
when this Partita skill is active.

## Rule

Facing a completed task phase plus possible stale framing, first produce a
reviewable residue audit against the current authority, to avoid tests passing
while old wording, obsolete paths, or migration assumptions remain mixed into
the stable surface.

## Pattern

Use when:

- the user asks to close out, clean, reconcile, or finish a task phase by
  checking stale framing;
- current changes should be audited against a topic, plan, source document,
  accepted conclusion, or stated authority;
- old terminology, migration wording, obsolete paths, outdated commands, or
  contradicted claims may remain;
- the user wants a suspicious-item list before deciding what to repair.

Do not use when:

- the request is ordinary formatting, lint cleanup, dead-code deletion, or
  repository housekeeping;
- the user asks for general code review, bug finding, CI repair, or release
  readiness;
- there is no current topic, source document, accepted framing, or task change
  surface to reconcile;
- the user has already approved a specific repair and only wants implementation.

## Boundary

Soft:

- Classify each finding as `stale-framing`, `migration-framing`,
  `authority-mismatch`, `orphan-surface`, or `uncertain`.
- Select the current authority from the topic, source document, accepted
  conclusion, or explicit user frame.
- Audit before repair, and ask for explicit repair approval.
- Stay inside the current task surface and authority.

Hard:

- Do not repair, delete, rename, or rewrite suspicious items before the user
  explicitly approves the repair scope.
- Do not treat a passing test suite as proof that stale framing is absent.
- Do not invent an authority document or accepted framing when none exists.
- Back hard claims with git status, diffs, search output, generators, tests,
  schemas, package checks, or verifier output when available.
- Do not use `🧭` unless this Partita skill is active.

## Effects

- Conversation: may show the `🧭` marker, audit list, classifications, proposed
  repairs, approval question, and repair report.
- Filesystem: may read code/docs/tests/generated metadata during audit; may
  write only approved repairs and directly stale generated metadata.
- External: none.

## Workflow

1. Identify the reconciliation authority. Ask one focused question if missing.
2. Locate the task change surface with git status, git diff, recent commits,
   changed files, search, generated metadata, or project manifests.
3. Search that surface and nearby authority-bearing docs/code for old terms,
   migration terms, obsolete paths, stale commands, and contradicted claims.
4. Produce an audit list before editing. Include location, classification,
   evidence, suspicion, and proposed repair for each item.
5. Ask for explicit approval of the repair scope.
6. Implement only approved repairs, regenerate directly affected metadata, and
   run the smallest relevant verification.
7. Report fixed items, rejected or deferred findings, verification results, and
   remaining risk.

## References

- No references.

## Validation

Before done:

- the first user-facing line includes `🧭` inline;
- the current authority and task change surface are explicit;
- the audit happens before any repair;
- each finding has location, classification, evidence, suspicion, and proposed
  repair;
- repair waits for explicit user approval and stays inside approved scope;
- hard claims are backed by machine-checkable output when available;
- completion reports approved fixes, rejected or deferred findings, verifier
  output, and residual risk.
