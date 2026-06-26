---
name: aim
description: "Use when the user explicitly asks to set, reset, sustain, or check the current conversation aim or asks for visible alignment against a current direction. Not for formal goals, task planning, decision making, baseline snapshots, ordinary summaries, or implicit drift policing."
---

# Aim

激活时，第一条用户可见行 MUST 以内联 `🧭` 开头。

## Rule

面对已有或被显式请求的 conversation-local aim，MUST 先让当前方向或偏移提醒可见，避免 agent 或 user 静默偏离正在推进的主题、目标或已确认 baseline。

## Pattern

Use when:

- 用户显式要求 set、reset、sustain、检查或显示当前 aim、topic、target、focus。
- 用户显式要求在当前推进中保持方向一致。
- 已有 active aim，且当前回复需要轻量 marker 才能维持方向一致。
- 已有 active aim，且 agent 或 user 明显偏离当前方向或已确认 baseline，需要可见提醒。
- 另一个持续 mode 需要 conversation-local aim 作为锚点。

Do not use when:

- 用户没有显式启用或要求 aim，且当前对话没有 active aim。
- 用户需要 formal goal、task plan、todo、issue、PRD 或项目状态管理。
- 用户要记录从 aim 开始到现在达成的共识；使用 `baseline`。
- 用户要 pressure-test 一个未稳固 assertion；使用 `argue`。
- 用户要做选择、生成候选、展开模糊 seed，且没有要求维护当前 aim。
- 当前请求只需要普通执行、总结、代码审查、调试或回答。

## Boundary

Soft:

- MUST 保持 `aim` conversation-local。
- set/reset 后，MUST 把 `Aim` 视为持续 handle。
- 只有在 set/reset 时，MUST 显示完整 `Aim`。
- active aim 仍然约束正常推进且没有偏移时，SHOULD 只显示 `🧭`。
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

## Effects

- Conversation: MAY show `🧭`, `Aim`, `Aim check`、active aim 文本、baseline 偏移提醒，或一个最小缺失 aim 问题。
- Filesystem: none.
- External: none.

## Workflow

1. 如果用户设置或重设 aim，显示 `🧭 Aim: <current aim>`，然后继续。
2. 如果 active aim 已经约束当前回复且没有偏移，只用 `🧭` 前缀继续。
3. 如果当前请求或回复会静默丢失 active aim 或 accepted baseline，显示 `🧭 Aim check: <drift>; <current aim or baseline>`，然后尽量继续。
4. 如果没有 active aim，但另一个 active skill 需要 aim，能安全推测时 MUST 推测最小 conversation-local aim；否则问一个最小问题。
5. aim 完成、被 reset、被显式退出，或不再约束当前回复时，停止显示 `🧭`。

## References

- 检查 `aim` 的复发 case 时，读取 [cases](references/cases.md)。

## Validation

Before done:

- `🧭` 只在 `aim` 激活时可见；
- set/reset 显示完整 `Aim`；
- 持续推进只使用 marker，除非发生 reset 或 drift；
- 方向或 accepted baseline 正在丢失时，`Aim check` 可见；
- `Aim check` 是 soft signal，不阻断 user choice；
- 没有创建 baseline snapshot、formal goal、文件或外部 artifact。
