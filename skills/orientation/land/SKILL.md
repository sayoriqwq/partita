---
name: land
description: "Use when the user wants to keep a first version or current topic from expanding before it is landed, especially after they name a v1 landing topic. Blocks scope expansion and asks whether the new point is necessary for v1 or off-topic. Not for open brainstorming, later-version planning, ordinary aim drift warnings, or when no landing topic exists yet."
---

# Land

激活时，第一条用户可见行 MUST 以内联 `🧭` 开头。

## Rule

面对 active v1 landing target 和新的 requirement、theory branch、implementation expansion、cleanup expansion、artifact expansion 或 topic switch 时，MUST 先分类并阻断 `expand` / `switch`，避免 v1 在落地前被合理但非必要的扩展吞掉。

## Pattern

Use when:

- 用户显式要求 activate、set、维持或检查 `land`。
- 用户已经有 v1、draft、skill、feature 或 current topic 的 landing target。
- 用户想在 v1 落地前阻断 scope expansion。
- active landing target 下出现新点，且不确定它是否属于当前 v1。
- `aim` 已存在，且当前推进需要比 `aim` 更强的 landing scope gate。

Do not use when:

- 用户只是需要方向一致性提醒；使用 `aim`。
- 用户正在 open brainstorming，且没有 landing target。
- 没有 current landing topic、v1 target 或 done condition。
- v1 已经落地，当前是在做 later-version planning。
- 新点是真正阻塞当前 v1 的 blocker。

## Boundary

Soft:

- MUST 依赖 `aim` 作为 current topic source；没有 active aim 时，MUST 推测最小 landing target，或询问一个最小问题。
- set/reset 后，MUST 把 `land` 视为持续 gate。
- set/reset 时，MUST 显示完整 `Land` 和 done condition。
- 正常持续且没有 expansion 时，SHOULD 只显示 `🧭`。
- MUST 将新点分类为 `v1`、`blocker`、`expand`、`switch`、`done` 或 `unknown`。
- `v1` 和 `blocker` work MAY 继续推进。
- `expand` 和 `switch` work MUST 在执行前阻断。
- `unknown` MUST 先问是否纳入当前 v1。
- `done` MUST 对照 done condition 或 verification 判断。
- v1 落地、用户切换主题或用户退出时，MUST 停止持续 gate。

Hard:

- MUST NOT 被 `aim` 取代；`aim` 只提醒，`land` 可以阻断。
- MUST NOT 在用户选择前继续 `expand` 或 `switch` work。
- MUST NOT 创建 backlog、issue、roadmap 或 later-version artifact，除非用户显式要求。
- MUST NOT 阻断 landing 必需的 validation failure、missing information 或 blocker。
- MUST NOT 使用 `🧭`，除非 `land` 或同族 orientation skill 激活。

## Effects

- Conversation: MAY show `🧭`、`Land`、`Land gate`、active v1 target、done condition、classification、reason 和用户选择问题。
- Filesystem: none.
- External: none.

## Workflow

1. set/reset 时，显示 `🧭 Land: <v1 target>; Done: <done condition>`。
2. 如果 active land 已经约束当前回复且没有 expansion，只用 `🧭` 前缀继续。
3. 每次出现新点，先分类为 `v1`、`blocker`、`expand`、`switch`、`done` 或 `unknown`。
4. 对 `v1` 或 `blocker`，继续推进，并保持回答指向下一个可验证 landing step。
5. 对 `expand` 或 `switch`，停止并显示 `🧭 Land gate: <classification>; <reason>; 是否纳入当前 v1？`
6. 对 `unknown`，先问是否属于当前 v1，再继续。
7. 对 `done`，检查 done condition 或 verification；成立时显示 `🧭 Land complete: <verification>` 并停止持续 gate。

## References

- 无。

## Validation

Before done:

- `land` 激活时 `🧭` 可见；
- set/reset 显示完整 `Land` 和 done condition；
- 持续推进只使用 marker，除非发生 reset、gate 或 complete；
- expansion 或 topic switch 产生阻断性的 `Land gate`；
- 用户选择前没有执行 `expand` 或 `switch` work；
- v1 landing 仍然绑定 concrete done 或 verification condition；
- 没有创建 filesystem、durable artifact 或 external state；
- v1 落地、用户切换主题或用户退出时，`land` 停止。
