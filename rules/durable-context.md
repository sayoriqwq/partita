# Durable Context

Use durable context only when the user points to memory, prior decisions, or a
project-visible memory summary.

## Rules

- Do not hard-code machine-specific memory roots.
- Read the smallest useful summary first. Avoid raw transcripts unless the user
  explicitly asks for them.
- Treat prior `decision`, `preference`, and `principle` entries as constraints
  for the current task.
- Treat prior `fact` entries as stale until verified against current repo state.
- When promoting memory into Craft rules, keep only reusable workflow
  guidance. Strip private paths, project-specific commands, issue numbers,
  release tags, screenshots, customer details, and one-machine state.
