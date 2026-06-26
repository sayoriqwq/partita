---
name: retune
description: "Use when an existing Partita skill needs a local correction from a real behavior case or structure audit. Not for creating a new skill, re-founding a broken primitive, ordinary code review, prose cleanup, or hard verifier/schema work."
---

# Retune

Prefix your first user-facing line with `🧭` inline, not as its own paragraph,
when this Partita skill is active.

## Rule

Facing an existing Partita skill with observed drift or structure mismatch,
first apply the smallest local correction to the stale surface, to avoid
rewriting the whole skill, patching abstract theory only, or refusing structure
audits that expose real shape drift.

## Pattern

Use when:

- the user names an existing Partita skill and reports a real behavior problem;
- dogfood shows wrong routing, over-reading, under-reading, vague boundaries, or
  work outside the skill's responsibility;
- a concrete case should enter the target skill's care loop;
- the user asks whether a named skill preserves primitive identity, namespace,
  constraint, activation, invocation metadata, duration, gate span,
  orchestration, effects, boundary, description, validation, or runtime shape.

Do not use when:

- creating a new behavior skill from scratch; use `notate`;
- an existing skill needs full primitive re-foundation rather than local
  correction; use `notate`;
- the request is ordinary code review, bug fixing, prose editing, or hard
  verifier/schema implementation;
- the case is speculative and no structure audit was requested.

## Boundary

Soft:

- Classify the mode as `case-retune` or `structure-retune`.
- Preserve the target skill's primitive identity unless the case exposes a new
  pressure that should split.
- Choose the smallest recurrence-preventing correction.
- Keep concrete cases and long guidance in one-level references, not the
  every-run body.

Hard:

- `case-retune` must come from a real user case; `structure-retune` must not
  invent one.
- Do not add speculative examples, style galleries, or generic answer
  templates.
- Do not rewrite the whole skill when a local correction fixes the drift.
- Do not retune generated/runtime copies when this repo has editable source
  skills.
- Generated dispatcher metadata, `partita verify`, tests, `pnpm verify`, and
  Effect harness verification are hard script checks for this repo.

## Effects

- Conversation: may show the `🧭` marker, target skill, mode, retuning intent,
  changed surface, verification result, and blockers.
- Filesystem: may update the target `SKILL.md`, `agents/openai.yaml`,
  `scripts/`, `references/`, `assets/`, cases, wiki nodes, generated dispatcher
  metadata, tests, and verifier surfaces directly stale from the retune.
- External: none unless the approved retune explicitly requires checking an
  external harness or source authority.

## Workflow

1. Identify the target skill and mode: `case-retune` or `structure-retune`.
2. For `case-retune`, capture what happened, what default failure it exposes,
   and what detail to omit. Apply [case capture](references/case-capture.md)
   only when a real case is available.
3. For `structure-retune`, apply [audit practice](../../../wiki/practice/audit.md)
   to semantic preservation and materialized runtime shape. Do not invent cases.
4. Name the retuning intent and smallest patch location: description, pattern,
   boundary, effects, workflow, references, metadata, validation, or verifier
   surface.
5. Edit only the target skill and directly stale routing, metadata, resources,
   references, cases, wiki nodes, generated metadata, or verifier surfaces.
6. Regenerate dispatcher metadata if frontmatter, path, or description changed.
7. Run hard verification, including Effect harness verification through
   `pnpm verify` for this repo.
8. Report mode, target, retuning intent, changed surface, verification result,
   and any remaining blocker.

## References

- Read [case capture](references/case-capture.md) before adding, moving, or
  deleting examples or case patterns.
- Read [pressure](../../../wiki/skill/case/pressure.md) and
  [gate case](../../../wiki/workflow/gate/case.md) before deciding whether a
  case corrects, narrows, expands, or splits the existing pressure.
- Read [governance identity](../../../wiki/skill/governance/identity.md) and
  [orchestrator](../../../wiki/skill/orchestrator.md) before auditing skill
  identity, orchestrator behavior, or split decisions.
- Read [gate span](../../../wiki/workflow/gate/span.md) before auditing
  cross-gate duration.
- Read [primitive](../../../wiki/skill/primitive.md) before auditing primitive
  preservation, constraint, activation, invocation, duration, or namespace.
- Read [runtime shape](../../../wiki/projection/verifier/shape.md) before
  auditing namespace, description, OpenAI metadata, `SKILL.md` body, resources,
  or verifier surface.
- Read [cases](references/cases.md) when checking known recurrence patterns.

## Validation

Before done:

- the first user-facing line includes `🧭` inline;
- the target skill, mode, and retuning intent are explicit;
- case capture happens only for real cases, and structure audits invent none;
- primitive preservation and materialized shape are checked separately;
- primitive and orchestrator responsibilities remain separated;
- effects stay within the target skill and directly stale resources, metadata,
  wiki nodes, generated metadata, tests, or verifier surfaces;
- the edit is smaller than a rewrite;
- concrete cases live in one-level references, not the every-run body;
- generated dispatcher metadata is in sync when needed;
- `pnpm generate`, `pnpm verify`, and Effect harness verification pass, or exact
  environment blockers are reported.
