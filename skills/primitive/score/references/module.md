
---
audience: [agent, human]
authors:
  - codex
reviewed_by:
  - sayori
purpose: 定义 Markdown 文件形成的文档作用域。
status: active
sources: []
updated: 2026-06-27
---

# Module

## Definition

`module` 是一个 `.md` 文件形成的文档作用域。

## Rules

- 一个 `.md` 文件就是一个 `module`。
- `module` 给内部 assertions 提供上下文和归属范围。
- `module` 不等于内容类型、模板、runtime object 或 assertion。
- `module` 是否成立不取决于 frontmatter、`kind`、标题或语义边界。
- 语义边界只影响 `module` 质量，不影响它是不是 `module`。
