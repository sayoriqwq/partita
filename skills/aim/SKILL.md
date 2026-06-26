---
name: aim
description: "Use when the user explicitly asks to set, reset, sustain, or check the current conversation aim or asks for visible alignment against a current direction. Not for formal goals, task planning, decision making, baseline snapshots, ordinary summaries, or implicit drift policing."
---

# Aim

激活时，第一条用户可见行 MUST 以内联 `🧭` 开头。

## Rule

面对已有或被显式请求的 conversation-local aim 时，MUST 先让当前方向或偏移提醒可见，避免 agent 或 user 静默偏离正在推进的主题、目标或已确认基线。

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
- 用户要挑战一个未定判断；使用 `argue`。
- 用户要做选择、生成候选、展开模糊 seed，且没有要求维护当前 aim。
- 当前请求只需要普通执行、总结、代码审查、调试或回答。

## Boundary

Soft:

- MUST keep `aim` conversation-local.
- MUST treat `Aim` as a sustained handle after set/reset.
- MUST show full `Aim` only when setting or resetting the aim.
- SHOULD show only `🧭` while the active aim still constrains normal continuation.
- MUST show `Aim check` when current direction or accepted baseline is being silently lost.
- SHOULD continue answering the current request after an `Aim check`.
- MAY ask one minimal question only when the missing aim prevents safe continuation.

Hard:

- MUST NOT create, update, or close formal goals.
- MUST NOT write files, run tools, browse, or scan repositories just to infer an aim.
- MUST NOT summarize accumulated consensus; use `baseline`.
- MUST NOT block a user-initiated topic switch.
- MUST NOT repeat the full aim every turn unless it was set, reset, or needed for an `Aim check`.
- MUST NOT depend on external memory or durable state.

## Effects

- Conversation: MAY show `🧭`, `Aim`, `Aim check`, active aim text, baseline drift note, or one minimal missing-aim question.
- Filesystem: none.
- External: none.

## Workflow

1. If the user sets or resets aim, show `🧭 Aim: <current aim>` and continue.
2. If an active aim already constrains the response and no drift is present, prefix the response with `🧭` only.
3. If the current request or response would silently lose the active aim or accepted baseline, show `🧭 Aim check: <drift>; <current aim or baseline>` and then continue when possible.
4. If no active aim exists but another active skill requires one, infer the smallest conversation-local aim when safe; otherwise ask one minimal question.
5. Stop showing `🧭` when the aim is completed, reset away, explicitly exited, or no longer constrains the response.

## References

- Read [cases](references/cases.md) when checking known `aim` recurrence patterns.

## Validation

Before done:

- `🧭` is visible only when `aim` is active;
- set/reset shows full `Aim`;
- sustained continuation uses only the marker unless a reset or drift occurs;
- `Aim check` is visible when direction or accepted baseline is being lost;
- `Aim check` remains a soft signal and does not block user choice;
- no baseline snapshot, formal goal, file, or external artifact was created.
