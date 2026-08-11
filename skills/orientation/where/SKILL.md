---
name: where
description: "Use when the user explicitly invokes where for a current-session bearing. Not for ordinary summaries, setting or sustaining an aim, standalone baseline capture, exhaustive workspace inventory, workflow design, or continuing the work automatically."
---

# Where?

当 `where` owns 当前 response 时，每条用户可见回复的第一行 MUST 只包含 `🧭 Where?` 与可选的 ` + <Display Name>` suffix；suffix 只列出实质改变该回复的其他已显式激活/共同调用 skill，不改变 ownership，active-but-inert skill 与 local contract projection MUST 省略，其他内容从第二行开始。多个 co-invoked skill 争夺 ownership 且 precedence 未确定时，MUST 在激活前只问一个不带 skill marker 的最小 owner 问题。

## Rule

面对用户显式调用 `where`，MUST 由当前 response-owning agent 从其已持有的 current-session context 直接综合一次性 bearing，复用 `Aim` 和 `Baseline` 语言，使用户无需重读 session 即可知道方向、已确认内容、当前位置与下一步。

## Pattern

Use when:

- the user explicitly invokes where for a current-session bearing.

Do not use when:

- ordinary summaries, setting or sustaining an aim, standalone baseline capture, exhaustive workspace inventory, workflow design, or continuing the work automatically.

## Boundary

Soft:

- MUST 以当前 session 为 primary scope 和 primary evidence。
- MUST 复用 active `Aim`；没有 active aim 时，从证据推测一个最小 `Aim`，但不激活或持续维护它。
- `Baseline` MUST 只包含 displayed Aim 所辖 conversation span 内的 accepted consensus；使用 active Aim 时从该 Aim 建立处开始扫描，使用 inferred Aim 时只扫描对应的 current work slice。process history、未决问题和普通上下文属于 `Position`，不属于 baseline。
- `Position` MUST 说明最近确认的进展、当前阶段，以及仍影响推进的 blocker 或 uncertainty。
- `Next` SHOULD 只给一个由当前证据支持的自然下一步。
- 当前工具立即提供同 workspace 的近期 task metadata 且信息明显有用时，MAY 增加一句 `Workspace` 判断；不得为此深读 sibling sessions。
- MUST 把 `where` 作为一次性 snapshot；交付后停止，不建立持续 handle。
- response-owning agent MUST 校验 draft 中每个 assertion 都有当前 session 或允许的只读状态证据。

Hard:

- `where` 协议只有 response owner 一个执行角色；该 owner MUST 使用其已持有的 current-session context 直接完成 evidence selection、synthesis 与 validation，并保留 envelope、effects 与 termination ownership。
- response owner MUST 始终能从已持有的 current-session evidence 交付 bearing；允许的最小只读检查 MAY 补充或校验 `Position` 与可选 `Workspace`，但其 availability 不影响交付。没有 confirmed baseline 时在 `Baseline` 写明 `no confirmed baseline`，其余 unknown 保留在 `Position`。
- MUST NOT 创建、修改或持续维护 `aim`、`baseline`、goal、workflow、workspace protocol 或其他 durable state。
- MUST NOT 写文件、修改 task/thread、发送消息、继续实现工作或产生其他 external mutation。
- MUST NOT 扩大为 workspace-wide inventory，也不得根据 title 或 stale summary 虚构进展。

## Effects

- Conversation: MAY 显示 `🧭 Where?`、`Aim`、`Baseline`、`Position`、`Next` 和可选的一句 `Workspace`。
- Filesystem: MAY 在验证 `Position` 必需时做最小只读检查；no writes。
- External: MAY 只读当前 Codex task/thread 和近期同 workspace task metadata；no mutations。

## Workflow

1. 确定 `🧭 Where?` primary marker，并只为实际生效的 explicit contributors 追加 suffix；识别 active 或 inferred Aim 及其所辖 conversation span，再收集该 scope 内的 user intent、已完成 turns、已确认结果和仍然有效的 open state；只在必要时补一个最小只读 workspace check。
2. 在 response owner 已持有的 current-session context 中，使用 `Aim`、`Baseline`、`Position`、`Next` 直接生成 brief；`Baseline` 只从第一步确定的 span 提取 accepted consensus，只有同 workspace metadata 已经清楚时才附一句 `Workspace`。
3. 校验并删除无证据、重复或超出 scope 的内容；没有 confirmed baseline 时写明 `no confirmed baseline`，其余缺失证据和关键 uncertainty 保留在 `Position`。
4. 使用以下稳定形状交付，省略没有必要的 `Workspace`：

```text
🧭 Where?

Aim: <one sentence>

Baseline:
- <accepted assertion, or no confirmed baseline>

Position: <current phase, latest confirmed progress, and material uncertainty>

Next: <one evidence-supported action>

Workspace: <optional one-sentence lightweight judgment>
```

## References

- 无。

## Validation

Before done:

- 每条回复的第一行只含 primary `🧭 Where?` marker 和 materially effective、already-explicit contributor suffix；
- synthesis 由 `where` response owner 从已持有的 current-session context 直接完成，协议没有其他 internal execution role 或 availability dependency；
- brief 使用 `Aim`、`Baseline`、`Position` 和 `Next`，且只有一个自然下一步；
- `Baseline` 只包含 accepted consensus，`Aim` 没有被激活或持续维护；
- `Workspace` 至多一句，且没有深读 sibling sessions；
- 每个 assertion 都有证据，缺失证据和 uncertainty 保持可见且不阻断 evidence-supported delivery；
- 没有 filesystem write、task/thread mutation、durable state 或自动继续工作。
