# Description

Description is the Codex selector surface.

Codex sees a skill's `name`, `description`, and path before loading the full
`SKILL.md`. This makes description the trigger contract and semantic index, not
the workflow body.

Minimum shape:

```text
Use when <trigger intent or artifact> requires <specific skill action or result>. Not for <nearest non-target cases>.
```

Keep it concise and front-loaded. Put workflow, protocol, validation, examples,
references, and long rationale in `SKILL.md`, reference files, or wiki nodes.
