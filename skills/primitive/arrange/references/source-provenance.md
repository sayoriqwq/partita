---
audience: agent
authors:
  - codex
reviewed_by: []
purpose: 记录 Arrange 的 Score source revision、projection boundary 与 Partita-owned overlay。
status: active
sources:
  - https://github.com/sayoriqwq/score/tree/d7b2c2685e5feacc469f8a144bd5c46d13a0a6cc
updated: 2026-08-24
---

# Source Provenance

## Source

Arrange 是 independent Score repository 的 Partita runtime projection。Score product 与 repository identity 保持 `score`；Partita public runtime Skill identity 是 `arrange`。

固定 source revision：

```text
repository: https://github.com/sayoriqwq/score
revision: d7b2c2685e5feacc469f8a144bd5c46d13a0a6cc
source tree: 743c7c8ab54b939b8ba09ae2707e0a67d4a87c07
Partita predecessor tree: 743c7c8ab54b939b8ba09ae2707e0a67d4a87c07
```

该 baseline 是从 Partita predecessor `score` Skill 精确提取的 14-file public-safe runtime tree。Partita 通过 `repos/score/` 的 Source Pin 保存 read-only evidence；runtime target 保持在 `skills/primitive/arrange/`，不从 pinned tree import。

## Projection

完整 upstream runtime tree 被投影为 Arrange。Identity overlay 把 predecessor 的 `score` / `Score` public Skill identity 改为 `arrange` / `Arrange`，并把 selector 与 Rule 收束为：Arrange 在保持 meaning 的前提下，按 Score reshapes concrete Markdown artifacts。

Partita-owned overlay 只增加：

- `SKILL.md` 中对本 provenance 的 reference；
- 本 `references/source-provenance.md`；
- 已随 predecessor baseline 存在、并更新为 Arrange identity 的 Partita `pnpm verify` landing check。

`partita verify --level project` 对 source path set、target path set 和每个 projected behavior file 运行 narrow fidelity check；changed、missing 或 extra behavior files 都会 hard-fail。任何 future source update 都必须先重新审核 private/public publication boundary，再通过 Source Pin lifecycle 更新 immutable revision 和 projection。
