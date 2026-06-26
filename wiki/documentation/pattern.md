---
audience: [agent, human]
authors:
  - codex
reviewed_by:
  - sayori
purpose: 定义 Markdown 中可被 agent 稳定识别和复用的结构模式。
status: active
sources: []
updated: 2026-06-27
---

# Pattern

## Definition

`pattern` 是 Markdown 中可被 agent 稳定识别和复用的结构模式。

## Rules

- 面向 agent 的 Markdown SHOULD 使用稳定 pattern，而不是只靠自然语言说明。
- pattern 可以是 frontmatter、固定字段名、枚举值、目录和文件命名、约定 section、固定 section 顺序、必填字段、状态格式或检查清单。
- 当目标是规范 agent 行为时，SHOULD 先写可匹配的 pattern，再写解释。
- 长期复用的 pattern SHOULD 后续脚本化检查。
- pattern 错误 SHOULD 暴露出来，不应该让 agent 靠猜或静默降级。
