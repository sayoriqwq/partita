# Case Feedback

## Definition

`case feedback` 是 retune 写回 target skill 的 durable recurrence record。

case feedback 说明哪个失败再次发生、它匹配哪个已有 case/rule/stale surface，以及未来 agent 应如何更容易召回这条治理经验。

case feedback 不是新的 patch case。若 recurrence 暴露的是治理规则缺口，retune MUST 升级为 patch case；若 recurrence 只是证明已有治理仍重要，retune MAY 写回 case feedback。

## Location

case feedback SHOULD 写在治理失败的 target skill 的 `references/` 目录。

通常 target skill 就是被 patch 的 leaf skill。若 recurrence 暴露的是 creation、patching、routing 或 source governance skill 的失败，case feedback MUST 写入 owning governance skill，而不是只写入被创建、被移动或被路由到的 leaf skill。

case feedback 文件名 SHOULD 使用 `<short-kebab-case>-case.md`。

如果 target skill 没有 `references/` 目录，retune MAY 创建它。

## Format

case feedback SHOULD 能还原以下 schema：

```yaml
case:
  kind: feedback
  target_skill: 要写回 recurrence 的 skill
  evidence:
    source: stable material pointer
    note: optional minimal excerpt or description
  recurrence: 哪个失败再次发生
  matched_surface: 复发对应的已有 case、rule 或 stale surface
  feedback_action: 写回 references、examples、anti-examples、trigger notes，还是升级为 patch case
  patch_required: true | false
```

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
- evidence source。
- recurrence。
- matched case、rule 或 stale surface。
- feedback action。
- patch required 判断。

## Rules

retune patch target skill 时，MUST 添加或更新 case feedback，除非目标 skill 已经有可复用的同一 recurrence record。

case feedback MUST 写入 target skill source truth。

case feedback MUST NOT 只写入 installed runtime copy。

case feedback MUST NOT 分散写入无治理职责的 leaf skill；如果同一个 recurrence 说明 creation 或 patch workflow 规则缺失，MUST patch owning workflow skill 的 references。

case feedback SHOULD 避免本机绝对路径，除非该路径本身就是 case 的关键事实。

case feedback SHOULD 使用 repo-relative path、skill-relative path 或稳定 handle 描述材料。
