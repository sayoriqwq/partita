---
audience: [agent, human]
authors:
  - codex
reviewed_by: []
purpose: 记录 Partita skill 建设的当前理论层级。
status: active
sources: []
updated: 2026-07-01
---

# Skill Theory

## Layers

Partita skill 建设分为四层：

- `theory`: 记录 Partita 对 skill、case、runtime self-containment 和 verification 的当前理论。
- `source`: 维护 Partita 自建或 maintain 的 skill source。
- `materialization`: 把共享概念真源复制到 skill-local references，并生成 clean dispatcher audit。
- `runtime`: 由 skills.sh CLI 安装到 Codex global skill runtime。

`theory` 不直接触发 runtime skill。

`source` 是 Partita 的维护真源。

`materialization` 是可再生成的 clean copy/report 结果。

`runtime` 必须能在单个 skill 被调用时自包含执行。

## Shared Source

共享概念 MUST 只有一个 repo 内真源。

共享概念真源放在 `docs/skills/concepts/`。

当多个 skill 依赖同一概念时，generator MUST 把该概念 materialize 到每个目标 skill 的 `references/`。

skill runtime MUST NOT 依赖另一个 skill 的 `references/`。

skill runtime MUST NOT 依赖旧 wiki、root theory directory 或 global runtime reference layer。

## Self-Containment

每个 runtime skill folder MUST 自包含：

- `SKILL.md` 的触发和执行流程。
- `agents/openai.yaml` 的 OpenAI UI 和 invocation policy metadata。
- 当前 skill 执行 Rule、Pattern、Boundary、Workflow 和 Validation 所需的 local `references/`。
- 必要时的 `scripts/` 或 `assets/`。

如果 skill 的 workflow 使用 `case`、`pressure`、`governance action` 等 Partita 概念，这些概念 MUST 出现在该 skill 自己的 `references/` 中。

## Verification

Partita verification 分为三层：

| Level | Scope | Blocks |
| --- | --- | --- |
| `runtime` | OpenAI/Codex skill folder shape | `SKILL.md` 缺失、frontmatter 非法、name/description 非法、runtime 目录形态非法 |
| `source` | Partita source skill contract | runtime 层失败、Partita V1 section/marker/description policy 失败、`agents/openai.yaml` 缺失或非法、unsupported skill source path |
| `project` | Partita repo invariant | source 层失败、dispatcher drift、materialized copy drift、legacy marker 回流、broken Markdown/wiki links、迁出 surface 回流、root `SKILL.md` |

`partita verify --level runtime` 只回答 final runtime skill 是否满足 OpenAI/Codex 可用性。

`partita verify --level source` 只回答 Partita source skill 是否满足 Partita authoring contract。

`partita verify --level project` 是默认完整 repo verification。

`openai-skill-validation.ts` 的职责只属于 `runtime` 层。

Partita V1 sections、dispatcher、pin、home、skills.sh wrapper 和迁出面阻断 MUST NOT 混进 OpenAI runtime skill validator。
