<!-- partita:projection:file source="packages/wiki/documentation/boundary.md" mode="copy" -->

---
audience: [agent, human]
authors:
  - codex
reviewed_by:
  - sayori
purpose: 定义 Markdown module 的单一职责边界。
status: active
sources: []
updated: 2026-06-27
---

# Boundary

## Definition

`module boundary` 是一个 module 的单一职责边界。

`module boundary` 定义一个 `.md` 文件负责承载哪些 assertions，以及拒绝承载哪些 assertions。

## Rules

- 一个 module SHOULD 有一个主要说明对象。
- 一个 module SHOULD 有一个主要 review 任务。
- 同一个 module 内的 assertions SHOULD 能用同一套上下文审查。
- 如果一组 assertions 需要不同上下文、不同判断标准或不同更新节奏，通常说明 boundary 已经裂开。
- 背景、规则、流程、历史、偏好和 metadata 可以放在同一个 module 里，前提是它们都服务同一个职责。
- 不能仅凭标题相近或目录相近把不同职责塞进一个 module。
