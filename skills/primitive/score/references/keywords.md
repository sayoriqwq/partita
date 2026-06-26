<!-- partita:projection:file source="wiki/documentation/keywords.md" mode="copy" -->

---
audience: [agent, human]
authors:
  - codex
reviewed_by:
  - sayori
purpose: 定义 Markdown 中表达规则强度的固定词。
status: active
sources: []
updated: 2026-06-27
---

# Keywords

## Definition

`normative keywords` 是 Markdown 里表达规则强度的固定词。

## Ladder

| Keyword | Meaning |
| --- | --- |
| `MUST` | 强约束，除非和更高优先级指令冲突或现实条件阻塞，否则违反就是错误。 |
| `MUST NOT` | 强约束，除非和更高优先级指令冲突，否则不能做。 |
| `SHOULD` | 默认策略，可以偏离，但必须有具体理由。 |
| `SHOULD NOT` | 默认不应该做，可以偏离，但必须理解代价。 |
| `MAY` | 允许项，不表示任务要求。 |

## Rules

- 默认只使用 `MUST`、`MUST NOT`、`SHOULD`、`SHOULD NOT`、`MAY`。
- `MUST` 和 `MUST NOT` 只用于真正不可破坏的边界。
- 适合强约束的边界包括系统边界、文件职责边界、可检查格式、长期上下文污染、以及后续 agent 难以恢复的行为。
- 风格偏好和普通建议 SHOULD 使用 `SHOULD` 或 `MAY`，不要写成强约束。
