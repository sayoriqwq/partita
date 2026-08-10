---
name: aim
description: "Use when the user explicitly invokes aim to set, reset, sustain, or check the current conversation aim or request visible alignment against a current direction. Not for formal goals, task planning, decision making, baseline snapshots, ordinary summaries, or implicit drift policing."
---

# Aim

当 `aim` owns 当前 response 时，每条用户可见回复的第一行 MUST 只包含 `🧭 Aim` 与可选的 ` + <Display Name>` suffix；suffix 只列出实质改变该回复的其他已显式激活/共同调用 skill，不改变 ownership，active-but-inert skill 与 local contract projection MUST 省略，其他内容从第二行开始。多个 co-invoked skill 争夺 ownership 且 precedence 未确定时，MUST 在激活前只问一个不带 skill marker 的最小 owner 问题。

## Rule

面对已有或被显式请求的 conversation-local aim，MUST 先让当前方向或偏移提醒可见，避免 agent 或 user 静默偏离正在推进的主题、目标或已确认 baseline。

## Pattern

Use when:

- the user explicitly invokes aim to set, reset, sustain, or check the current conversation aim or request visible alignment against a current direction.

Do not use when:

- formal goals, task planning, decision making, baseline snapshots, ordinary summaries, or implicit drift policing.

## Boundary

Soft:

- MUST 保持 `aim` conversation-local。
- 只有显式调用 `aim` 才能创建、reset 或退出 active Aim handle；后续按该 handle 持续显示与检查属于已建立 state 的 continuation，不是 implicit invocation。
- set/reset 后，MUST 把 `Aim` 视为持续 handle。
- 只有在 set/reset 时，MUST 显示完整 `Aim`。
- Aim owns 当前 response、active aim 仍然约束正常推进且没有偏移时，SHOULD 只显示 `🧭 Aim` marker line，再继续 payload。
- 另一个已显式激活或共同调用的 skill owns 当前 response 时，Aim 只贡献 active state 或 `Aim check`；outer owner 保留 primary marker、envelope、effects 与 termination。Aim 实际改变该回复时，outer marker MUST 追加 ` + Aim`；否则省略。
- 当前方向或 accepted baseline 正在被静默丢失时，MUST 显示 `Aim check`。
- 显示 `Aim check` 后，SHOULD 继续回答当前请求。
- 缺失 aim 导致无法安全继续时，MAY 问一个最小问题。

Hard:

- MUST NOT 创建、更新或关闭 formal goal。
- MUST NOT 只为了推测 aim 而写文件、跑工具、浏览或扫描仓库。
- MUST NOT 总结累积共识；记录共识属于 `baseline`。
- MUST NOT 阻止 user 主动切换话题。
- 除非 set/reset 或需要 `Aim check`，MUST NOT 每轮重复完整 aim。
- MUST NOT 依赖外部记忆或 durable state。
- active Aim handle 不存在且用户没有显式调用 `aim` 时，MUST NOT 显示 `Aim` / `Aim check`、` + Aim` suffix 或套用本协议；其他 orientation skill 仍可使用自己的 canonical marker，并可推导 one-shot working aim，但不得据此创建 Aim handle，也不得把推导结果标成 `Aim` contributor。

## Effects

- Conversation: MAY show `🧭 Aim` marker、`Aim`、`Aim check`、active aim 文本、baseline 偏移提醒，或一个最小缺失 aim 问题。
- Filesystem: none.
- External: none.

## Workflow

1. 先确定 response owner：Aim owns 时使用 `🧭 Aim` primary marker；另一个显式 skill owns 时只在 Aim 实质改变该回复时向 outer marker 追加 ` + Aim`，不得显示第二个 marker。
2. 如果用户设置或重设 aim，显示 `Aim: <current aim>`，然后继续。
3. 如果 active aim 已经约束当前回复且没有偏移，继续 payload，不重复完整 aim。
4. 如果当前请求或回复会静默丢失 active aim 或 accepted baseline，显示 `Aim check: <drift>; <current aim or baseline>`，然后尽量继续。
5. 如果用户显式调用 `aim` 但没有提供 aim value，能安全推测时提议最小 conversation-local Aim；否则问一个最小问题。其他 skill 需要 one-shot working aim 时由其 owning workflow 自行投影，不激活本协议。
6. aim 完成、被 reset、被显式退出，或不再约束当前回复时，停止显示 `🧭 Aim` marker 或 contributor suffix。

## References

- 检查 `aim` 的复发 case 时，读取 [cases](references/cases.md)。

## Validation

Before done:

- Aim owns response 时，第一行只含 primary `🧭 Aim` marker 和 materially effective、already-explicit contributor suffix；Aim 作为 contributor 时只使用 outer marker，并仅在实际生效时追加 ` + Aim`，没有第二个 marker；
- `Aim` / `Aim check` 只在 `aim` 激活时可见，且位于 marker line 之后；其他 orientation skill 使用自己的 canonical marker；
- set/reset 显示完整 `Aim`；
- 持续推进只使用 marker，除非发生 reset 或 drift；
- 方向或 accepted baseline 正在丢失时，`Aim check` 可见；
- `Aim check` 是 soft signal，不阻断 user choice；
- 没有创建 baseline snapshot、formal goal、文件或外部 artifact。
