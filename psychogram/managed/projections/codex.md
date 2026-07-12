# Codex Projection

## Purpose

Explain how psychogram can be executed in Codex without making Codex the source of truth.

## Source of truth

- `AGENTS.md`
- `harness/`
- `template/`
- `fixtures/`
- `projections/`

## Mapping

- Root `AGENTS.md` gives Codex the global layering rules.
- `harness/agents/router.md` routes harness-level tasks.
- `template/AGENTS.md` becomes the generated wiki maintenance protocol.
- Generated wiki `agents/workflows/` can later be projected into Codex-specific skills or subagents.

## Rules

- Do not create runtime-specific files unless the user asks.
- Do not treat Codex-specific behavior as harness truth.
- Keep fixture-specific content out of `harness/` and `template/`.

## Related

- [[../harness/concepts/projection]]
- [[../harness/workflows/project-runtime-config]]
