# Skill Patch Skill Shape

Use this reference when improving a skill's structure, progressive disclosure,
or bundled resources.

## Main Skill Body

- Keep `SKILL.md` concise, ideally under 100 lines.
- Keep every-use instructions in `SKILL.md`.
- Move rare detail, long examples, case logs, and advanced guidance to one-level
  references.
- Do not create nested reference trees unless the user explicitly asks.

## Description

- Treat frontmatter `description` as the activation surface.
- State what the skill does and when to use it.
- Include important exclusions with `Not for ...`.
- Do not write a neutral summary that fails to route.

## Resources

- Add scripts only for deterministic repeated operations.
- Add references for conditional detail.
- Add examples or cases only from real use or user-provided material.
- Keep generated metadata and runtime copies out of manual patch scope.
- Do not create a cross-skill framework, docs package, schema, or automation
  just to record feedback.
- Do not preserve private source paths as Craft runtime requirements unless
  Craft explicitly owns those paths.

## Patch Size

- Patch the smallest section that prevents recurrence.
- Split content before the main skill becomes heavy.
- Prefer one directly useful case over many invented examples.
