<!-- partita:projection:file source="packages/wiki/documentation/assertion.md" mode="copy" -->

---
audience: [agent, human]
authors:
  - codex
reviewed_by:
  - sayori
purpose: 定义 Markdown 中最小可审查语义判断。
status: active
sources: []
updated: 2026-06-27
---

# Assertion

## Definition

`assertion` 是 Markdown 里一条可以单独审查的语义判断。

## Format

一个 `assertion` 默认写成一句完整的陈述句，表达一个可单独审查的语义判断。

## Rules

- `assertion` 可以是定义、规则、约束或偏好。
- `assertion` 不表示内容一定正确。
- 一句话默认只承载一个 `assertion`。
- 列表项如果承载 `assertion`，也 SHOULD 写成完整陈述句。
- 标题通常不是 `assertion`，它负责给下面的 assertions 分组。
- 过渡句、铺垫句、总结腔通常 SHOULD NOT 成为 `assertion`。
