---
audience: [agent, human]
authors:
  - codex
reviewed_by:
  - sayori
purpose: 定义 Markdown module 的主要读者类型。
status: active
sources: []
updated: 2026-06-27
---

# Audience

## Definition

`audience` 是 module metadata 中声明的主要读者类型。

## Values

```yaml
audience: agent
audience: human
audience: [agent, human]
```

## Rules

- 面向 `agent` 的 Markdown SHOULD 优先使用 pattern。
- 面向 `agent` 的内容目标是减少猜测，让文档可读取、生成、检查和继续处理。
- 面向 `human` 的 Markdown SHOULD 优先使用 description。
- 面向 `human` 的内容目标是让人理解、判断、协作、修正和确认。
- 面向 `[agent, human]` 的 Markdown SHOULD 用 pattern 承载结构，用 description 解释意图和取舍。
- human-facing 文档可读性高于规范性和可提取性。
- agent-facing 文档规范性和可提取性高于叙述流畅性。
