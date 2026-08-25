---
name: docwarden
description: "Use when the user explicitly invokes docwarden to establish or reconcile one target repository's bounded `.docwarden` authority module. Not for implementing product work, running engineering workflows, installing Skills, changing provider or home configuration, or selecting a tracker beyond the V1 FILE backend."
---

# Docwarden

When `docwarden` owns a response, every user-visible response MUST begin with the marker-only line `🎼 Docwarden`, optionally followed by materially active, explicitly co-invoked contributors. Docwarden remains the sole owner of its envelope, effects, and termination. If co-invoked owners conflict and precedence is unknown, ask one minimal owner question without a marker before activation.

## Rule

**Reconcile one authority module, then stop.** Establish or reconcile one target repository's Codex-first `.docwarden/` module and concise root `AGENTS.md` interface, preserving existing target authority and returning a read-back receipt, proposed state delta, or exact conflict instead of silently overwriting meaning or widening into an artifact platform.

## Pattern

Use when:

- the user explicitly invokes docwarden to establish or reconcile one target repository's bounded `.docwarden` authority module.

Do not use when:

- implementing product work, running engineering workflows, installing Skills, changing provider or home configuration, or selecting a tracker beyond the V1 FILE backend.

## Boundary

Soft:

- Entry fixes one target repository root and explicit write authority. Inspect the complete root `AGENTS.md`, `.gitignore`, existing `.docwarden/` files, and Git status before proposing a delta.
- Root `AGENTS.md` stays the concise runtime entry. Upsert one `## Docwarden` pointer block while preserving surrounding target instructions; `.docwarden/CONTEXT.md`, `GLOSSARY.md`, and `STATE.md` remain the owners of their named authority.
- Reconcile by semantic owner: preserve target-owned domain meaning and current reality, add missing structural contracts, and report contradictions for the responsible authority. Existing accepted ADRs and human `NOTES.md` contents are never copied or rewritten.
- Use native Markdown, filesystem, and Git behavior. Read [module reconciliation](references/module-reconciliation.md) only when planning or checking target bytes.
- A successful result is a read-back receipt with `created`, `updated`, `unchanged`, `conflicts`, `notes_boundary`, and `proposed_state_delta`. It does not complete work or apply the proposed STATE delta.

Hard:

- When: invocation is not explicit, the target root is unresolved, or write authority is absent.
  Do: MUST produce no marker or filesystem effect from this Skill; return the exact missing input only after explicit activation.
- When: an existing owner conflicts with the V1 authority split, root interface, FILE schema, or ignore boundary.
  Do: MUST leave the conflicting bytes unchanged and return their locators plus the smallest authority decision required.
- When: `.docwarden/NOTES.md` exists.
  Do: MUST NOT read it without explicit authorization and MUST never create, write, copy, quote, stage, or commit its contents; only ensure the exact ignore boundary exists.
- When: an accepted ADR already exists.
  Do: MUST treat it as immutable; a changed accepted decision requires a new lazy ADR and a proposed STATE pointer delta.
- When: any mutable setup write is about to occur.
  Do: MUST inventory intended paths before mutation, read back every attempted path afterward, classify the evidence as `Applied`, `NotApplied`, or `Unknown`, and never retry `Unknown` before reconciliation.
- When: this implementation runs.
  Do: MUST call no Skill and MUST NOT implement work, run TDD/review/diagnosis, install Skills, mutate provider/home state, add a remote tracker, or create a runtime, daemon, selector, dispatcher, state-machine library, generic artifact framework, activity log, or index.

## Effects

- Conversation: MAY show the target, proposed file delta, exact conflicts, approval boundary, evidence classification, receipt, and proposed STATE delta.
- Filesystem: MAY reconcile root `AGENTS.md`, `.gitignore`, tracked `.docwarden/CONTEXT.md`, `.docwarden/GLOSSARY.md`, `.docwarden/STATE.md`, and the tracked V1 FILE backend contract/directories inside one authorized target; MUST NOT write NOTES, accepted ADRs, work implementation, or provider/home files.
- External: none.

## Workflow

1. Confirm explicit invocation, one target repository root, and write authority. Capture Git status and resolve the active root `AGENTS.md`; stop on an unresolved target or conflicting active instruction surface.
2. Inventory root `AGENTS.md`, `.gitignore`, `.docwarden/`, and tracked/untracked boundaries without reading `NOTES.md`. Follow STATE pointers only; do not scan ambient ADRs or issues.
3. Read [module reconciliation](references/module-reconciliation.md). Compare each required surface by its owner and classify it as missing, coherent, safely reconcilable, or conflicting.
4. Present the smallest delta. For an existing semantic conflict, return the exact locator and authority question; otherwise continue only within the authorized write scope.
5. Before writing, record the reconcilable intent in the receipt draft. Upsert the concise `AGENTS.md` pointer block and NOTES ignore line, create missing authority files, and reconcile only non-conflicting owned structure. Create no ADR or issue record merely to populate a directory.
6. Read back every attempted path and inspect Git status plus the NOTES ignore result. Classify each mutable effect as `Applied`, `NotApplied`, or `Unknown`; reconcile `Unknown` before any retry.
7. Return exactly one result:

```yaml
result:
  target: <repository root>
  created: [<paths>]
  updated: [<paths>]
  unchanged: [<paths>]
  conflicts: [<locator plus authority question>]
  effects:
    - intent: <bounded mutable effect>
      evidence: <read-back or Git evidence>
      outcome: Applied | NotApplied | Unknown
  notes_boundary: <ignored and unread | blocker>
  proposed_state_delta: <delta for the outer Lead | none>
```

8. Stop. The outer Lead alone decides whether to write STATE, follow work/ADR pointers, or complete any Spec or Ticket.

## References

- Read [module reconciliation](references/module-reconciliation.md) only when planning, writing, or verifying a target module.
- Read [source provenance](references/source-provenance.md) only when auditing the Captain acceptance, Matt setup lineage, or excluded-suite boundary.

## Validation

Before done:

- invocation was explicit; one target root and write authority were fixed;
- root `AGENTS.md` remains a concise pointer interface and the target authority files keep one owner each;
- NOTES was ignored, was read only with explicit authorization if needed, and was never written, copied, staged, or committed;
- accepted ADRs remained immutable and no ADR, issue, activity log, or index was created without a current consumer;
- every attempted mutable effect has intent, read-back evidence, and `Applied`, `NotApplied`, or `Unknown`; no `Unknown` effect was blindly retried;
- the FILE backend supports only `spec | ticket` and the six accepted lifecycle states in physically and schematically distinct paths;
- no other Skill call, implementation workflow, remote mutation, runtime/framework, provider/home mutation, or V2 tracker machinery occurred;
- a complete receipt, proposed STATE delta, or exact blocker was returned, and the outer Lead retained STATE/completion ownership;
- target runtime or landing checks passed, or the exact blocker was reported.
