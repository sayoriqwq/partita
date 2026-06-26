---
name: baseline
description: "Use when the user explicitly asks to record, capture, or summarize the accepted consensus since the current conversation aim began. Not for setting aims, maintaining direction, unresolved questions, decision making, meeting notes, durable documentation, or ordinary summaries."
---

# Baseline

激活时，第一条用户可见行 MUST 以内联 `🧭` 开头。

## Rule

面对一个 active 或可推测的 conversation-local aim 及其已达成共识，MUST 记录从该 aim 开始到当前已经确认的共识 assertion，避免后续对话丢失已确认约束或反复重开已解决判断。

## Pattern

Use when:

- 用户显式要求记录、整理、捕获或总结当前 baseline。
- 用户要求记录从当前 aim 开始到现在达成的共识。
- 用户要求把已确认约束压缩成后续可继续使用的基线。

Do not use when:

- 用户只是要设置、重设、维持或检查当前 aim；使用 `aim`。
- 用户要 pressure-test 未稳固 assertion、未解决争议或 open question；使用 `argue`。
- 用户要做选择、生成候选、展开模糊 seed、写会议纪要或普通摘要。
- 用户要把 baseline 写入文件、wiki、issue、PRD 或其他 durable artifact。

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

- Conversation: MAY show `🧭`、推测或 active `Aim`，以及扁平 `Baseline` 列表。
- Filesystem: none.
- External: none.

## Workflow

1. 识别 active aim；如果不存在，从当前 conversation 推测最小 aim 并显示。
2. 只扫描该 aim 约束的 conversation span。
3. 提取能约束后续工作的 accepted consensus。
4. 把每个 item 改写成一句简洁 assertion，不使用叙事主体。
5. 输出 active 或 inferred `Aim`，然后输出扁平 `Baseline` 列表。
6. snapshot 输出后停止；不要保持 active。

## References

- 无。

## Validation

Before done:

- `baseline` 激活时 `🧭` 可见；
- 输出包含 active 或 inferred `Aim`；
- 每个 baseline item 都是一句简洁的 accepted-consensus assertion；
- 未解决问题、rationale、process 和普通上下文没有进入 baseline；
- baseline items 没有分组；
- 没有创建文件、durable artifact、external state 或 sustained handle。
