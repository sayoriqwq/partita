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

- `score` 默认推崇 OFM wiki link 语法。
- 文档系统支持 OFM 时，SHOULD 使用类似 `[[documentation/assertion]]` 的 wiki link。
- link 目标 SHOULD 是明确 module。
- `score` 不定义复杂 relationship。
- 普通 Markdown link 只在目标 surface 不支持 OFM、链接 repo 外文件或外部 URL 时使用。

## Examples

```md
[[documentation/assertion]]
[[documentation/language]]
```
