
---
audience: [agent, human]
authors:
  - codex
reviewed_by:
  - sayori
purpose: 定义 module 内部组织 assertions 的局部上下文。
status: active
sources: []
updated: 2026-06-27
---

# Section

## Definition

`section` 是 module 内部用于组织相关 assertions 的局部上下文。

## Rules

- section 由 heading 打开。
- heading 的层级决定 section 的层级。
- 同级 heading 打开同级 section。
- 更深一级 heading 打开当前 section 的子 section。
- heading 命名就是 section 命名。
- section 名称 SHOULD 使用简短英文词或短语。
- section 名称 SHOULD 偏概念名，不写成完整句子。
- section 名称 SHOULD 避免 `Overview`、`Notes`、`Misc` 这类泛词，除非该 module 的职责本来就是总览或笔记索引。
- heading 本身通常不是 assertion。
