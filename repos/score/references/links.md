
---
audience: [agent, human]
authors:
  - codex
reviewed_by:
  - sayori
purpose: 定义 Markdown 中连接相关 module 的显式引用。
status: active
sources: []
updated: 2026-06-27
---

# Links

## Definition

`links` 是 Markdown 中连接相关 module 的显式引用。

## Rules

- `score` 在支持 OFM 的外部文档系统里 MAY 使用 wiki link 语法。
- Partita repo-local docs SHOULD 使用明确 Markdown path 或普通文本 reference。
- link 目标 SHOULD 是明确 module。
- `score` 不定义复杂 relationship。
- 普通 Markdown link 只在目标 surface 不支持 OFM、链接 repo 外文件或外部 URL 时使用。

## Examples

```md
skills/primitive/score/references/assertion.md
skills/primitive/score/references/language.md
```
