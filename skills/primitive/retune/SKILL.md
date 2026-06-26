---
name: retune
description: "Use when an existing Partita skill needs a local correction from a real behavior case or structure audit. Not for creating a new skill, re-founding a broken primitive, ordinary code review, prose cleanup, or hard verifier/schema work."
---

# Retune

Prefix your first user-facing line with `🧭` inline, not as its own paragraph,
when this Partita skill is active.

Retune an existing Partita skill score from observed drift.

## Capability

Convert concrete feedback, dogfood drift, or structure review into the smallest
verifiable correction to an existing skill's trigger, boundary, workflow,
references, metadata, validation, or projection.

Pressure scenario: the user reports a skill running too broad, too narrow, too
heavy, or too vague, and the agent either edits abstract theory only, rewrites
the whole skill, or refuses because the case is a structure audit rather than a
behavior case.

## Trigger

Use this skill when:

- the user names an existing Partita skill and reports a real behavior problem;
- dogfood shows wrong routing, over-reading, under-reading, vague boundaries, or
  work outside the skill's responsibility;
- a concrete case should enter the target skill's care loop;
- the user asks whether a named skill preserves primitive identity, namespace,
  constraint, state, activation, invocation, metadata, duration, gate span,
  orchestration, or runtime shape.

Do not use this skill when:

- creating a new behavior skill from scratch; use `notate`;
- an existing skill needs full primitive re-foundation rather than local
  correction; use `notate`;
- the request is ordinary code review, bug fixing, prose editing, or hard
  verifier/schema work;
- the case is speculative and no structure audit was requested.

## Soft Boundary

Primitive audit: `retune` is `stateful`, `activation: narrow`, `invocation: implicit`, and
`duration: task`. It may update target `SKILL.md`, `agents/openai.yaml`, direct
references, real case records, wiki nodes, generated dispatcher metadata, and
verifier surfaces that belong to the requested retuning task. It stops when the
local correction or structure audit is implemented, validated, and reported.
Its constraints are mixed: routing, scope, and retuning judgment are `soft`;
generated metadata, link checks, and test commands are primitive
`constraint.hard` only when enforced by CLI commands, verifiers, tests, schemas,
or package checks.

Use agent judgment for:

- whether the observed drift reveals a reusable skill-use failure;
- whether the mode is `case-retune` or `structure-retune`;
- which named skill owns the behavior when several are mentioned;
- whether to capture the case, sanitize it, or keep it as audit-only evidence;
- where the smallest recurrence-preventing correction belongs;
- whether the target should be retuned, split, renamed, or re-notated.

## Hard Boundary

This section mixes model-applied boundaries with hard checks. Only items tied to
machine-checkable surfaces such as CLI commands, verifiers, tests, schemas, or
package validation are primitive `constraint.hard`; prose-only boundaries remain
strict `soft` constraints.

- The real user case is the source situation for `case-retune`. Preserve the
  behavior shape when safe and allowed.
- A `structure-retune` may correct skill shape without case capture, but must
  not invent a case.
- Do not add speculative examples, style galleries, or generic answer
  templates.
- Do not rewrite the whole skill when a local correction fixes the drift.
- Do not re-found a broken primitive inside `retune`; route that work to
  `notate`.
- Keep concrete cases and long guidance in one-level references, not the
  every-run body.
- Do not retune generated/runtime copies when this repo has an editable source
  skill.
- Do not change hard verifier, CLI, schema, or package behavior from this skill
  alone; edit those code paths separately when requested.

## Workflow

1. Identify the target skill and mode: `case-retune` or `structure-retune`.
2. For `case-retune`, capture what happened, what default failure it exposes,
   and what detail to omit. Apply [case capture](references/case-capture.md)
   only when a real case is available.
3. For `structure-retune`, apply [audit practice](../../../wiki/practice/audit.md)
   to semantic preservation and materialized runtime shape. Do not invent cases.
4. Name the retuning intent and smallest patch location: description, trigger,
   boundary, workflow, references, metadata, validation, or verifier surface.
5. Edit only the target skill and directly stale routing, metadata, references,
   cases, or verifier surfaces.
6. Regenerate dispatcher metadata if frontmatter, path, or description changed.
7. Verify, then report mode, target, retuning intent, changed surface,
   verification result, and any remaining projection loss.

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
  preservation, constraint, state, activation, invocation, duration, or
  namespace.
- Read [runtime shape](../../../wiki/projection/verifier/shape.md) before
  auditing namespace, description, OpenAI metadata, `SKILL.md` body, references,
  or verifier surface.
- Read [projection loss](../../../wiki/projection/loss.md) before auditing cases
  or forward tests.
- Read [cases](references/cases.md) when checking known recurrence patterns.

## Validation

Before calling retuning complete, verify:

- the first user-facing line includes `🧭` inline;
- the target skill, mode, and retuning intent are explicit;
- case capture happens only for real cases, and structure audits invent none;
- primitive preservation and materialized shape are checked separately;
- primitive and orchestrator responsibilities remain separated;
- hard constraints without machine-checkable enforcement are reported as
  projection loss;
- stateful edits are limited to the target skill and directly stale metadata,
  references, cases, wiki nodes, generated dispatcher metadata, or verifier
  surfaces;
- the edit is smaller than a rewrite;
- concrete cases live in one-level references, not the every-run body;
- generated dispatcher metadata is in sync when needed;
- `pnpm generate` and `pnpm verify` pass after Partita skill changes, or the
  exact environment blocker is reported.
