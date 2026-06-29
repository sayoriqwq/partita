# Partita Context

This file is a root map for repository context. It does not define a separate
knowledge layer; durable Partita knowledge lives in `wiki/`.

## Current Frame

Partita is a CLI-backed Codex skill harness for user-defined workflow skills.

The repository owns:

- Codex plugin metadata under `.codex-plugin/plugin.json`;
- source skill files under direct skill paths and supported namespace paths such
  as `skills/orientation/<name>/SKILL.md`,
  `skills/maintenance/<name>/SKILL.md`, and
  `skills/primitive/<name>/SKILL.md`;
- generated dispatcher metadata under `harness/skills/dispatcher.md`;
- TypeScript/Effect generation, verification, and install code under
  `src/partita/`;
- canonical harness, skill, workflow, projection, practice, collaboration,
  documentation, and vocabulary nodes under `wiki/`.

The repository does not own external skill collections, user profile canon,
project-specific workflow state, or target-repo runtime copies.

`skills/` 是当前 skill source input。它可以后续拆到独立 skill 族并 pin 回
Partita；dispatcher 由 Partita harness 生成，不属于 `skills/` 内容。

## Wiki Routes

- Start at `wiki/index.md`.
- For harness behavior, read `wiki/harness/index.md`.
- For skill semantics, read `wiki/skill/index.md`.
- For workflow gates, read `wiki/workflow/index.md`.
- For runtime and verifier projection, read `wiki/projection/index.md`.
- For agent operating flows, read `wiki/practice/index.md`.
- For collaboration defaults, read `wiki/collaboration/index.md`.
- For document practice, read `wiki/documentation/index.md`.
- For terms, read `wiki/vocabulary/index.md`.

## Authority Shape

`wiki/` is the semantic layer. Runtime files and generated metadata are
projections from that layer into Codex and local verification surfaces.

`CONTEXT.md` and `HARNESS.md` only route readers into the wiki. They must stay
short and must not duplicate wiki node content.
