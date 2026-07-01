# Case Feedback

## Definition

`case feedback` 是 retune 写回 target skill 的 durable recurrence record。

case feedback 说明为什么这次 patch 存在、旧 skill 怎样失败、以及未来 agent 应该怎样避免复发。

## Location

case feedback SHOULD 写在 target skill 的 `references/` 目录。

case feedback 文件名 SHOULD 使用 `<short-kebab-case>-case.md`。

如果 target skill 没有 `references/` 目录，retune MAY 创建它。

## Format

case feedback SHOULD 使用以下 section shape：

```md
---
audience: agent
authors:
  - codex
reviewed_by: []
purpose: 记录 <target skill> 的 <short recurrence> 复发样例。
status: active
sources: []
updated: YYYY-MM-DD
---

# <Case Title>

## Case

一次 <project/context> 中，<agent/user/system> 触发了 <target skill>。

agent <did what happened>.

用户纠正：<expected behavior>.

## Failure

`<target skill>` 当时没有明确治理 <stale surface>。

`<target skill>` 允许了 <stale behavior>.

## Governance

当 <trigger condition> 时，agent MUST <required behavior>.

agent MUST NOT <forbidden behavior>.

验证时 MUST 确认 <validation>.
```

## Required Fields

case feedback MUST 能读出：

- target skill。
- situation。
- stale surface。
- stale behavior。
- expected governance。
- minimum validation。

## Rules

retune patch target skill 时，MUST 添加或更新 case feedback，除非目标 skill 已经有可复用的同一 recurrence record。

case feedback MUST 写入 target skill source truth。

case feedback MUST NOT 只写入 installed runtime projection。

case feedback SHOULD 避免本机绝对路径，除非该路径本身就是 case 的关键事实。

case feedback SHOULD 使用 repo-relative path、skill-relative path 或稳定 handle 描述材料。
