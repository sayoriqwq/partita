---
name: notate
description: "Use when creating a new Partita primitive skill or re-founding a broken skill from a behavior motif into a legal source projection. Not for local retuning of an existing skill, installing skills, ordinary docs, or verifier implementation."
---

# Notate

Prefix your first user-facing line with `🧭` inline, not as its own paragraph,
when this Partita skill is active.

## Rule

Facing a real behavior motif, correction, or broken primitive-shaped source,
first score the A/Y/X governance assertion and V1 runtime projection, to avoid
generic scaffolding, task-category skills, or valid-looking files that cannot
change future agent behavior.

## Pattern

Use when:

- the user asks to create, name, design, or materialize a new Partita primitive
  skill;
- a workflow, correction, repeated drift, or behavior motif should become a
  skill;
- material must be placed in a skill, wiki node, verifier, reference, asset,
  prompt/profile, or external harness;
- an existing skill must be re-founded because its primitive identity is no
  longer preserved.

Do not use when:

- an existing valid skill only needs local trigger, boundary, workflow,
  reference, metadata, or validation correction; use `retune`;
- the task is only to install, list, or sync skills;
- the output is one-off docs, notes, prompts, or project instructions;
- the user asks for hard verifier, schema, CLI, or package implementation
  without changing skill behavior.

## Boundary

Soft:

- Decide whether the motif is strong enough to deserve a reusable skill.
- Preserve one pressure and one governance action.
- Separate primitive and orchestrator responsibilities.
- Decide whether detail belongs in every-run `SKILL.md`, references, scripts,
  assets, wiki, verifier, or external harness.
- Treat proposed local edits to an existing valid skill as `retune`.

Hard:

- Do not materialize a skill before motif, default failure, governance action,
  pattern, and exclusion boundary are clear enough to score.
- Do not invent unsupported Codex skill frontmatter. Partita reads `name` and
  `description`; official optional keys are `license`, `allowed-tools`, and
  `metadata`.
- Do not put namespace, plugin name, area, status, or kind metadata in
  frontmatter.
- Every Partita skill must include `agents/openai.yaml` with
  `policy.allow_implicit_invocation`.
- Generated dispatcher metadata, `partita verify`, tests, `pnpm verify`, and
  Effect harness verification are hard script checks for this repo.

## Effects

- Conversation: may show the `🧭` marker, motif, assertion, source path,
  projected handle, verification report, and blockers.
- Filesystem: may create or re-found `SKILL.md`, `agents/openai.yaml`,
  `scripts/`, `references/`, `assets/`, wiki nodes, generated dispatcher
  metadata, tests, and verifier surfaces inside the approved skill scope.
- External: none unless the user explicitly makes an external harness or source
  dependency part of the skill.

## Workflow

1. Read the real case or motif. If none exists, ask for the smallest behavior
   source needed to avoid generic scaffolding.
2. Write the assertion: facing case pattern `A`, first governance action `Y`, to
   avoid default failure `X`.
3. Decide artifact layer: `skill`, `wiki`, `CLI/verifier`, `reference`, `asset`,
   `prompt/profile`, or external harness.
4. Decide primitive versus orchestrator.
5. Choose source namespace and handle. For primitive skills, use
   `skills/primitive/<name>/SKILL.md`; the projected handle is `pm:<name>`.
6. Project V1 `SKILL.md`: `Rule`, `Pattern`, `Boundary`, `Effects`,
   `Workflow`, `References`, and `Validation`.
7. Create or update `agents/openai.yaml`, bundled resources, wiki nodes,
   generated dispatcher metadata, tests, and verifier surfaces as needed.
8. Run generation and hard verification, including Effect harness verification
   through `pnpm verify` for this repo.
9. Report the motif, assertion, source path, projected handle, changed files,
   verification result, and blockers.

## References

- Read [create practice](../../../wiki/practice/create.md) before creating a new
  skill.
- Read [assertion](../../../wiki/skill/assertion.md),
  [primitive](../../../wiki/skill/primitive.md), and
  [governance identity](../../../wiki/skill/governance/identity.md) before
  naming a skill.
- Read [orchestrator](../../../wiki/skill/orchestrator.md) before allowing
  workflow composition.
- Read [skill-md](../../../wiki/projection/codex/skill-md.md),
  [runtime projection](../../../wiki/projection/runtime.md), and
  [OpenAI metadata](../../../wiki/projection/codex/openai.md) before writing
  files.

## Validation

Before done:

- the first user-facing line includes `🧭` inline;
- the motif, A/Y/X assertion, and governance action are explicit;
- skill identity follows the governance action, not task category, plugin
  namespace, gate name, or runtime file;
- primitive and orchestrator responsibilities are separated;
- `Pattern` includes positive use cases and exclusions;
- `Boundary`, `Effects`, `Workflow`, `References`, and `Validation` follow V1
  shape;
- the source path and projected handle are correct for the namespace;
- generated dispatcher metadata is in sync;
- `pnpm generate`, `pnpm verify`, and Effect harness verification pass, or exact
  environment blockers are reported.
