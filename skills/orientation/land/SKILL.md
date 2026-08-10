---
name: land
description: "Use when the user explicitly invokes land to keep a first version or current topic from expanding before it is landed. Not for open brainstorming, later-version planning, ordinary aim drift warnings, or when no landing topic exists yet."
---

# Land

激活时，第一条用户可见行 MUST 以内联 `🧭` 开头。

## Rule

面对 active v1 landing target 和新的 requirement、theory branch、implementation expansion、cleanup expansion、artifact expansion 或 topic switch 时，MUST 先分类并阻断 `scope-expand` / `switch`，避免 v1 在落地前被合理但非必要的扩展吞掉。

## Pattern

Use when:

- the user explicitly invokes land to keep a first version or current topic from expanding before it is landed.

Do not use when:

- open brainstorming, later-version planning, ordinary aim drift warnings, or when no landing topic exists yet.

## Boundary

Soft:

- MUST 依赖 `aim` 作为 current topic source；没有 active aim 时，MUST 推测最小 landing target，或询问一个最小问题。
- 只有显式调用 `land` 才能 set/reset active Land handle；后续 gate enforcement 属于已建立 state 的 continuation，不是 implicit invocation。
- set/reset 后，MUST 把 `land` 视为持续 gate。
- set/reset 时，MUST 显示完整 `Land` 和 done condition。
- 正常持续且没有 expansion 时，SHOULD 只显示 `🧭`。
- 另一个显式调用的 orientation workflow owns 当前 response 时，Land 只贡献 classification 与 gate；outer workflow 保留 named marker、envelope、effects 与 termination，但 MUST 在其下一次 transition 前服从 Land gate。
- MUST 将新点分类为 `v1`、`blocker`、`scope-expand`、`switch`、`done` 或 `unknown`。
- `v1` 和 `blocker` work MAY 继续推进。
- `scope-expand` 和 `switch` work MUST 在执行前阻断。
- `scope-expand` MUST 按新点对 landing scope 的实际影响判断；解释当前 v1 内概念的请求不因名称包含 `expand` 而自动成为 scope expansion。
- `unknown` MUST 先问是否纳入当前 v1。
- `done` MUST 对照 done condition 或 verification 判断。
- v1 落地、用户切换主题或用户退出时，MUST 停止持续 gate。

Hard:

- active Land handle 不存在且用户没有显式调用 `land` 时，MUST NOT 使用 Land marker、分类或 gate。
- MUST NOT 被 `aim` 取代；`aim` 只提醒，`land` 可以阻断。
- MUST NOT 在用户选择前继续 `scope-expand` 或 `switch` work。
- MUST NOT 创建 backlog、issue、roadmap 或 later-version artifact，除非用户显式要求。
- MUST NOT 阻断 landing 必需的 validation failure、missing information 或 blocker。
- MUST NOT 使用 `🧭`，除非 `land` 或同族 orientation skill 激活。

## Effects

- Conversation: MAY show `🧭`、`Land`、`Land gate`、active v1 target、done condition、classification、reason 和用户选择问题。
- Filesystem: none.
- External: none.

## Workflow

1. 确认用户显式调用 `land` 来 set/reset，或 active Land handle 已存在；set/reset 时显示 `🧭 Land: <v1 target>; Done: <done condition>`。
2. 如果 active land 已经约束当前回复且没有 expansion，只用 `🧭` 前缀继续。
3. 每次出现新点，先分类为 `v1`、`blocker`、`scope-expand`、`switch`、`done` 或 `unknown`。
4. 对 `v1` 或 `blocker`，继续推进，并保持回答指向下一个可验证 landing step。
5. 对 `scope-expand` 或 `switch`，停止并显示 `🧭 Land gate: <classification>; <reason>; 是否纳入当前 v1？`
6. 对 `unknown`，先问是否属于当前 v1，再继续。
7. 对 `done`，检查 done condition 或 verification；成立时显示 `🧭 Land complete: <verification>` 并停止持续 gate。

## References

- 无。

## Validation

Before done:

- `land` 激活时 `🧭` 可见；
- set/reset 显示完整 `Land` 和 done condition；
- 持续推进只使用 marker，除非发生 reset、gate 或 complete；
- scope expansion 或 topic switch 产生阻断性的 `Land gate`；
- 用户选择前没有执行 `scope-expand` 或 `switch` work；
- v1 landing 仍然绑定 concrete done 或 verification condition；
- 没有创建 filesystem、durable artifact 或 external state；
- v1 落地、用户切换主题或用户退出时，`land` 停止。
