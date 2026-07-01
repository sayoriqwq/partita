# Partita Context

这个文件是 repository context 的 root map。

它不定义独立 knowledge layer；durable Partita knowledge 当前位于 `packages/wiki/`，但后续会从 wiki path 依赖中拆出。

## Current Frame

Partita 是 CLI-backed Codex skill harness，用来维护 sayori 自己创建或 maintain 的 skills workspace、workflow skills 和治理机制。

本 repo owns：

- `.codex-plugin/plugin.json` 下的 Codex plugin metadata；
- direct skill paths 和 supported namespace paths 下的 source skill files，例如 `skills/expression/<name>/SKILL.md`,
  `skills/link/<name>/SKILL.md`, `skills/orientation/<name>/SKILL.md`,
  `skills/maintenance/<name>/SKILL.md` 和
  `skills/primitive/<name>/SKILL.md`;
- `harness/skills/dispatcher.md` 下的 generated dispatcher metadata；
- `packages/generic-projection/` 下的 generic projection helpers；
- `src/partita/` 下的 TypeScript/Effect generation、verification、routing 和 install code；
- `packages/wiki/` 下的 canonical harness、skill、workflow、projection、practice、collaboration、documentation 和 vocabulary nodes。

本 repo 不 owns external skill collections、user profile canon、project-specific workflow state、target-repo runtime copies 或 `sayoriqwq/sayoriqwq` personal skills monorepo 路径。

`skills/` 是当前 self-owned skill source input。外部 skills 通过 pin 保留 upstream provenance；只有经过 privateize/customize workflow 后才成为 Partita-owned skill。dispatcher 由 Partita harness 生成，不属于 `skills/` 内容。

## Routes

- 从 `packages/wiki/index.md` 开始。
- harness behavior 读取 `packages/wiki/harness/index.md`。
- skill semantics 读取 `packages/wiki/skill/index.md`。
- workflow gates 读取 `packages/wiki/workflow/index.md`。
- runtime 和 verifier projection 读取 `packages/wiki/projection/index.md`。
- agent operating flows 读取 `packages/wiki/practice/index.md`。
- collaboration defaults 读取 `packages/wiki/collaboration/index.md`。
- document practice 读取 `packages/wiki/documentation/index.md`。
- terms 读取 `packages/wiki/vocabulary/index.md`。

## Authority

`packages/wiki/` 是当前 semantic layer。新实现应把可执行规则落在 CLI、verifier、tests、skill source 和 generated surfaces 中，为后续拆除 wiki 做准备。

runtime files 和 generated metadata 是从 semantic layer 到 Codex 与 local verification surfaces 的 projections。

`packages/generic-projection/` owns 通用 projection helper，不 owns Partita-specific routing。

`CONTEXT.md` 和 `HARNESS.md` 只负责 route readers into wiki，必须保持短，不重复 wiki node content。
