---
name: skill-patch
description: "Use when the user reports a real case where a named skill routed, read, answered, or structured work incorrectly and that case should improve the skill. Not for creating a new skill from scratch, ordinary code review, prose editing, speculative examples, or hard CLI/schema changes."
when_to_use: "skill improvement, real user case, target skill, trigger drift, boundary patch, case capture, workflow patch, validation gap"
dispatch_intent: "Craft skill patch from real case"
---

# Skill Patch

Prefix your first user-facing line with `🧭` inline, not as its own paragraph,
when this Craft skill is active.

Patch an existing skill from a real user-observed case.

## Capability

Convert concrete feedback into a reusable teaching case and the smallest
verifiable patch to trigger, boundary, workflow, resources, or validation.

Pressure scenario: the user corrects a skill from a real example, but the agent
only edits abstract rules. The next agent then lacks the concrete case shape and
repeats the same over-read, mis-trigger, boundary confusion, or validation miss.

## Trigger

Use this skill when:

- the user names a target skill and reports a real behavior problem;
- a concrete case should become a reusable skill example or regression pattern;
- dogfood shows wrong routing, over-reading, under-reading, vague boundaries, or
  work outside the skill's responsibility.

Do not use this skill when:

- creating a new behavior skill from scratch; use `skill-write`;
- inventing examples before a concrete case exists;
- the request is ordinary code review, bug fixing, prose editing, or hard
  CLI/schema work.

## Soft Boundary

Use agent judgment for:

- whether the observed case reveals a reusable skill-use failure;
- which skill is the target when multiple skills are mentioned;
- how to preserve the user's case shape without leaking unnecessary private
  detail;
- where the smallest recurrence-preventing patch belongs;
- whether the target should be improved, split, renamed, or left alone.

## Hard Boundary

- The real user case is the teaching unit. If safe and allowed, capture it in
  the target skill's references.
- Do not add speculative examples, style galleries, or generic answer templates.
- Do not rewrite the entire skill when a local patch fixes the failure.
- Keep the target `SKILL.md` concise; move concrete cases and long guidance into
  one-level references.
- Do not patch generated/runtime copies when this repo has an editable
  `skills/<name>/SKILL.md` source.
- Do not change hard validation, CLI, packaging, or schema behavior from this
  skill alone; edit those code paths separately when requested.

## Workflow

1. Identify the target skill. Prefer the user-named skill; otherwise infer only
   from explicit context.
2. Capture the observed case: what happened, what the agent must learn, and what
   detail must be omitted or generalized.
3. Name the patch intent: what went wrong, what should change next time, and
   what loss repeats if unfixed.
4. Choose the smallest patch location: description, trigger, boundary, workflow,
   references, validation, or case file.
5. Apply [case capture](references/case-capture.md) when the user provided a
   real example.
6. Apply [skill shape](references/skill-shape.md) when the patch changes skill
   structure, references, examples, or scripts.
7. Edit only the target skill and directly stale routing or metadata surfaces.
8. Regenerate generated metadata if frontmatter changed.
9. Run the fastest validation that proves the patch is usable.
10. Report the case captured, the repeated failure fixed, and any rough edge.

## References

- Read [case capture](references/case-capture.md) before adding, moving, or
  deleting examples or case patterns.
- Read [skill shape](references/skill-shape.md) before restructuring a skill,
  splitting references, or applying `write-a-skill` principles.

## Validation

Before calling the improvement done, verify:

- the first user-facing line includes `🧭` inline;
- the target skill, observed case, and patch intent are explicit;
- a real case is captured when one was available;
- the edit is smaller than a rewrite;
- concrete cases live in one-level references, not the every-use body;
- generated dispatcher/resolver metadata is in sync when needed;
- `make regenerate` and `make test` pass after Craft skill changes.
