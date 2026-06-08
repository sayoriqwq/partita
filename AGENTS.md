@/Users/sayori/.codex/RTK.md

# Agent Instructions

## Project

`mini-waza` is a Codex plugin skeleton for user-defined workflow skills.

The first baseline intentionally ships no skills. Users add their own skills
later under `skills/<name>/SKILL.md`.

## Boundaries

This repo owns:

- Codex plugin metadata under `.codex-plugin/plugin.json`;
- skill framework shape;
- resolver and dispatcher metadata;
- rules that can be shared across future skills;
- verifier and package skeleton;
- future user-defined skills under `skills/<name>/SKILL.md`.

This repo does not own:

- Waza's `think/design/check/hunt/write/learn/read/health` skill contents;
- Claude Code plugin marketplace metadata;
- project-specific commands, private local paths, or one-off workflow history.

## Current Rule

- Do not add a skill unless the user explicitly defines it.
- Do not reconstruct Waza's old skill taxonomy.
- Keep zero skills as a valid framework state.
- Keep shared rules short and reusable.
- If a new skill is added, update `skills/RESOLVER.md`, run `make regenerate`,
  then run `make test`.

## Commands

```bash
make test
make regenerate
make package
```
