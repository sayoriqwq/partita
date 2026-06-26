---
name: notate
description: "Use when creating a new Partita primitive skill or re-founding a broken skill from a behavior motif into a legal source projection. Not for local retuning of an existing skill, installing skills, ordinary docs, or verifier implementation."
---

# Notate

Prefix your first user-facing line with `🧭` inline, not as its own paragraph,
when this Partita skill is active.

Notate a behavior motif into a Partita primitive skill score.

## Capability

Turn a real behavior motif, correction, or primitive-shaped source into a
legal Partita skill projection: `SKILL.md`, `agents/openai.yaml`, optional
one-level references, dispatcher metadata, and verifier coverage.

Pressure scenario: the agent creates a skill from folder shape, plugin naming,
or generic scaffolding before naming the default failure, governance action, and
activation boundary. The resulting score looks valid but cannot reliably change
future agent behavior.

## Trigger

Use this skill when the user asks to:

- create, name, design, or materialize a new Partita primitive skill;
- turn a workflow, correction, repeated drift, or behavior motif into a skill;
- decide whether material belongs in a skill, wiki node, verifier, reference,
  asset, prompt/profile, or external harness;
- re-found an existing skill whose primitive identity is no longer preserved.

Do not use this skill when:

- an existing skill only needs a local trigger, boundary, workflow, reference,
  metadata, or validation correction; use `retune`;
- the task is only to install, list, or sync skills;
- the output is one-off docs, notes, prompts, or project instructions;
- the user asks for hard verifier, schema, CLI, or package implementation
  without changing skill behavior.

## Soft Boundary

Primitive audit: `notate` is `stateful`, `activation: narrow`, `invocation: implicit`, and
`duration: task`. It may create or re-found persistent skill files, direct
references, wiki nodes, generated dispatcher metadata, and verifier surfaces
that belong to the requested notation task. It stops when the skill score is
materialized, validated, and reported, or when a missing primitive decision
blocks safe notation. Its constraints are mixed: primitive judgment is `soft`;
frontmatter parsing, metadata generation, link checks, and verifier commands are
primitive `constraint.hard` only when enforced by CLI commands, tests, schemas,
or verifiers.

Use agent judgment for:

- whether the motif is strong enough to deserve a reusable skill;
- the smallest governance action that prevents the default failure;
- whether the source is a primitive skill or an orchestrator;
- whether the skill belongs under a namespace such as `primitive`;
- which detail belongs in every-run `SKILL.md` versus one-level references;
- whether a proposed rewrite is local retuning or full re-notation.

## Hard Boundary

This section mixes model-applied boundaries with hard checks. Only items tied to
machine-checkable surfaces such as CLI commands, verifiers, tests, schemas, or
package validation are primitive `constraint.hard`; prose-only boundaries remain
strict `soft` constraints.

- Do not materialize a skill before the motif, default failure, governance
  action, trigger, and exclusion boundary are clear enough to score.
- Do not use `notate` for local edits to an existing valid skill; route those to
  `retune`.
- Do not invent unsupported Codex skill frontmatter. `SKILL.md` frontmatter is
  only `name` and `description`.
- Do not put namespace, plugin name, area, status, or kind metadata in
  frontmatter. Namespace comes from the source path.
- Every Partita skill must include `agents/openai.yaml`; invocation policy must
  live under `policy.allow_implicit_invocation`.
- Do not put README, changelog, install guides, process notes, or unrelated docs
  inside a skill directory.
- Do not copy private project paths or external harness internals into Partita
  runtime instructions unless the user explicitly makes Partita own that
  dependency.

## Workflow

1. Read the real case or motif. If none exists, ask for the smallest behavior
   source needed to avoid generic scaffolding.
2. Write the assertion: facing case pattern `A`, first governance action `Y`, to
   avoid default failure `X`.
3. Decide artifact layer: `skill`, `wiki`, `CLI/verifier`, `reference`, `asset`,
   `prompt/profile`, or external harness.
4. Decide primitive versus orchestrator. If orchestration is needed, name the
   primitive skills it calls instead of merging their actions.
5. Choose source namespace and handle. For primitive skills, use
   `skills/primitive/<name>/SKILL.md`; the projected handle is `pm:<name>`.
6. Score the runtime projection:
   - `SKILL.md` contains every-run behavior, trigger, boundaries, workflow, and
     validation.
   - `agents/openai.yaml` contains UI metadata and invocation policy.
   - `references/*.md` contains conditional cases or long guidance.
7. Regenerate dispatcher metadata and run verification.
8. Report the motif, assertion, source path, projected handle, changed files,
   and verification result.

## References

- Read [create practice](../../../wiki/practice/create.md) before creating a new
  skill.
- Read [assertion](../../../wiki/skill/assertion.md),
  [primitive](../../../wiki/skill/primitive.md), and
  [governance identity](../../../wiki/skill/governance/identity.md) before
  naming a skill.
- Read [orchestrator](../../../wiki/skill/orchestrator.md) before allowing
  workflow composition.
- Read [runtime projection](../../../wiki/projection/runtime.md),
  [skill-md](../../../wiki/projection/codex/skill-md.md), and
  [OpenAI metadata](../../../wiki/projection/codex/openai.md) before writing
  files.
- Read [projection loss](../../../wiki/projection/loss.md) before deciding what
  must become verifier coverage.

## Validation

Before calling notation complete, verify:

- the first user-facing line includes `🧭` inline;
- the motif, assertion, and governance action are explicit;
- skill identity follows the governance action, not task category, plugin
  namespace, gate name, or runtime file;
- primitive and orchestrator responsibilities are separated;
- trigger includes positive use cases and exclusions;
- soft judgment and deterministic hard constraints are separated;
- state, activation, invocation, duration, and gate span are explicit when they
  affect behavior;
- the source path and projected handle are correct for the namespace;
- every skill directory contains only `SKILL.md`, `agents/openai.yaml`, and
  one-level `references/*.md`;
- generated dispatcher metadata is in sync;
- `pnpm generate` and `pnpm verify` pass after Partita skill changes, or the
  exact environment blocker is reported.
