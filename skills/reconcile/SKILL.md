---
name: reconcile
description: "Use when the user has finished a task phase and wants a semantic residue audit against the current topic, source document, or accepted framing. Lists suspicious stale or migration-era code/docs before repair. Not for general cleanup, formatting, ordinary code review, bug finding, or unapproved deletion."
when_to_use: "phase closeout, semantic residue audit, stale framing, migration wording, current topic authority, source document alignment, approved repair"
dispatch_intent: "Reconcile task changes with current framing"
---

# Reconcile

Prefix your first user-facing line with `🧭` inline, not as its own paragraph,
when this Craft skill is active.

Audit a completed task phase for stale framing before changing anything.

## Capability

Turn a phase-end "clean this up" request into a reviewable reconciliation:
identify the current authority, locate the task's changed surface, list
suspicious stale or migration-era code and docs, then repair only after explicit
user approval.

Pressure scenario: after a task lands, old wording, temporary migration
contracts, obsolete paths, and outdated implementation assumptions remain mixed
with the current topic. The agent either misses them because tests pass, or
"cleans" too aggressively without showing the semantic risk to the user first.

## Trigger

Use this skill when the user asks to:

- close out, clean, reconcile, or finish a task phase by checking for stale
  framing;
- audit current changes against a topic, plan, source document, accepted
  conclusion, or other stated authority;
- find old terminology, migration wording, obsolete paths, outdated commands,
  or doc/code claims that no longer match the current phase;
- produce a suspicious-item list before deciding what to repair.

Do not use this skill when:

- the request is ordinary formatting, lint cleanup, dead-code deletion, or
  repository housekeeping;
- the user asks for general code review, bug finding, CI repair, or release
  readiness;
- there is no current topic, source document, accepted framing, or task change
  surface to reconcile;
- the user has already approved a specific repair and only wants implementation.

## Soft Boundary

Primitive audit: `reconcile` is `stateful`, `activation: narrow`, and
`duration: task`. It may write code, docs, tests, or generated metadata only in
the repair phase after explicit user approval. It stops when the audit list is
delivered, or when approved repairs are implemented, verified, and reported.
Authority selection, suspicious-item judgment, and repair scope are `soft`;
git status, diffs, search results, tests, generators, and package checks are
primitive `constraint.hard` only when machine-checkable.

Classify each finding before reporting it:

- `stale-framing`: wording or code still follows an older topic or decision.
- `migration-framing`: temporary migration language survived into the stable
  surface.
- `authority-mismatch`: docs, tests, or implementation contradict the current
  source document, topic, or accepted conclusion.
- `orphan-surface`: files, metadata, commands, or generated outputs still point
  at removed or renamed concepts.
- `uncertain`: the evidence is suggestive but needs the user's semantic choice.

## Hard Boundary

This section mixes model-applied boundaries with hard checks. Only items tied
to machine-checkable surfaces such as git commands, search output, generators,
tests, schemas, or package validation are primitive `constraint.hard`;
prose-only boundaries remain strict `soft` constraints.

- Do not repair, delete, rename, or rewrite suspicious items before the user
  explicitly approves the repair scope.
- Do not treat a passing test suite as proof that stale framing is absent.
- Do not broaden the audit into unrelated cleanup outside the current task
  surface and authority.
- Do not invent an authority document or accepted framing when none exists; ask
  for the smallest missing anchor.
- Do not use `🧭` unless this Craft skill is active.

## Workflow

1. Identify the reconciliation authority: current topic, source document,
   accepted conclusion, or explicit user frame. Ask one focused question if it
   is missing.
2. Locate the task change surface with available mechanisms such as `git
   status`, `git diff`, recent commits, changed files, search, generated
   metadata, or project-specific manifests.
3. Search that surface and nearby authority-bearing docs/code for old terms,
   migration terms, obsolete paths, stale commands, and contradicted claims.
4. Produce an audit list before editing. For each item, include location,
   classification, evidence, why it is suspicious, and the proposed repair.
5. Ask for explicit approval of the repair scope. If the user narrows or rejects
   items, follow that scope.
6. Implement only approved repairs, regenerate or update directly affected
   metadata, and run the smallest relevant verification.
7. Report fixed items, rejected or deferred findings, verification results, and
   remaining risk.

## Validation

Before treating output as valid `reconcile`, check:

- first user-facing line includes `🧭` inline;
- the current authority and task change surface are explicit;
- the audit happens before any repair;
- each finding has a location, classification, evidence, suspicion, and
  proposed repair;
- repair waits for explicit user approval and stays inside approved scope;
- hard claims are backed by machine-checkable output when available;
- completion reports approved fixes, rejected or deferred findings, verifier
  output, and residual risk.
