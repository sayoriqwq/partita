# Care

Care is the maintenance language for existing skills.

Use this rule when patching a skill, auditing primitive preservation, or
recording a real user-observed case.

## Terms

- `write`: creating or rewriting a skill from a primitive.
- `patch`: changing an existing skill to prevent recurrence.
- `case`: a real user-observed behavior pattern that teaches a skill.
- `audit`: checking primitive preservation or materialized shape.
- `projection_loss`: semantic loss when a primitive becomes `SKILL.md`,
  `agents/openai.yaml`, runtime instructions, dispatcher rows, or plugin
  exports.
- `forward_test`: the next similar situation that should now trigger, avoid
  triggering, or execute differently.

## Rules

- Patch the smallest section that prevents recurrence.
- Keep real cases in one-level references, not in the every-use body.
- Split content before the main skill becomes heavy.
- Prefer one directly useful case over many invented examples.
- When auditing, check primitive preservation and shape separately.
- Treat a mismatch between primitive invocation and
  `policy.allow_implicit_invocation` as projection loss.
- Treat a prose-only hard constraint as projection loss until it has a
  machine-checkable enforcement surface.
