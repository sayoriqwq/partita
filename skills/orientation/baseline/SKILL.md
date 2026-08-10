---
name: baseline
description: "Use when the user explicitly invokes baseline to record the accepted consensus since the current conversation aim began. Not for setting aims, maintaining direction, unresolved questions, decision making, meeting notes, durable documentation, or ordinary summaries."
---

# Baseline

当 `baseline` owns 当前 response 时，每条用户可见回复的第一行 MUST 只包含 `🧭 Baseline` 与可选的 ` + <Display Name>` suffix；suffix 只列出实质改变该回复的其他已显式激活/共同调用 skill，不改变 ownership，active-but-inert skill 与 local contract projection MUST 省略，其他内容从第二行开始。多个 co-invoked skill 争夺 ownership 且 precedence 未确定时，MUST 在激活前只问一个不带 skill marker 的最小 owner 问题。

## Rule

面对一个 active 或可推测的 conversation-local aim 及其已达成共识，MUST 记录从该 aim 开始到当前已经确认的共识 assertion，避免后续对话丢失已确认约束或反复重开已解决判断。

## Pattern

Use when:

- the user explicitly invokes baseline to record the accepted consensus since the current conversation aim began.

Do not use when:

- setting aims, maintaining direction, unresolved questions, decision making, meeting notes, durable documentation, or ordinary summaries.

## Boundary

Soft:

- MUST 依赖 `aim`。
- 存在 active aim 时，MUST 使用 active aim 作为 baseline 范围。
- 没有 active aim 时，MUST 先推测并显示最小 `Aim`，再输出 baseline。
- MUST 只记录 accepted consensus。
- 每个 baseline item MUST 是一句简洁 assertion。
- 语义不变时，SHOULD 把原话规范化为约束语言。
- 没有可安全记录的共识时，MAY 输出当前没有 accepted consensus。

Hard:

- MUST NOT 记录 unresolved dispute、open question、process history、rationale 或普通上下文。
- MUST NOT 虚构共识。
- MUST NOT 把 tentative language 写成 confirmed baseline。
- MUST NOT 给 baseline items 分组。
- 输出后 MUST NOT 继续维持方向；持续方向属于 `aim`。
- MUST NOT 写文件或创建 durable artifact。

## Effects

- Conversation: MAY show `🧭 Baseline` marker、推测或 active `Aim`，以及扁平 `Baseline` 列表。
- Filesystem: none.
- External: none.

## Workflow

1. 显示 `🧭 Baseline` primary marker line，并按实际生效的 explicit contributors 追加 suffix；识别 active aim；如果不存在，从当前 conversation 推测最小 aim 并显示，但不得为 inferred aim 追加 ` + Aim`。
2. 只扫描该 aim 约束的 conversation span。
3. 提取能约束后续工作的 accepted consensus。
4. 把每个 item 改写成一句简洁 assertion，不使用叙事主体。
5. 输出 active 或 inferred `Aim`，然后输出扁平 `Baseline` 列表。
6. snapshot 输出后停止；不要保持 active。

## References

- 无。

## Validation

Before done:

- 每条回复的第一行只含 primary `🧭 Baseline` marker 和 materially effective、already-explicit contributor suffix；
- 输出包含 active 或 inferred `Aim`；
- 每个 baseline item 都是一句简洁的 accepted-consensus assertion；
- 未解决问题、rationale、process 和普通上下文没有进入 baseline；
- baseline items 没有分组；
- 没有创建文件、durable artifact、external state 或 sustained handle。
