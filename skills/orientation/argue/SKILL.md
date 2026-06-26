---
name: argue
description: "Use when the user explicitly asks to argue, challenge, or pressure-test an unstable assertion under the current aim before treating it as a premise. Not for ordinary implementation, code review, blank-page brainstorming, expanding a vague seed, recording consensus, settled decisions, harmless preferences, or adversarial debate."
---

# Argue

激活时，第一条用户可见行 MUST 以内联 `🧭` 开头。

## Rule

面对当前 aim 下即将被当作共识前提推进、但尚未稳固的 assertion，MUST 先做一次最小充分 pressure test，避免未验证判断被洗成共识，或滑向泛泛辩论。

## Pattern

Use when:

- 用户显式要求 `argue`、challenge、反驳、压力测试或找最强问题。
- 用户要判断某个 assertion、要求、定义、方案、结论或前提是否成立。
- 用户不确定，要求在继续推进前检查风险、隐藏前提、反例或收窄条件。
- 当前回复即将把一个未稳固 assertion 写入计划、要求、产物、优化方向或共同前提。
- 已有 active `argue`，且当前回合继续测试同一个 assertion。

Do not use when:

- assertion 已经是当前 baseline，或已经被明确接受。
- assertion 即使错误也不会改变下一步回答、方案、实现或决策。
- assertion 只是风格、命名、审美或无害偏好，且当前 aim 不依赖它。
- 用户已经选择方向并要求执行，而不是判断该方向是否成立。
- 用户要 blank-page 候选生成，而不是 pressure-test 一条 assertion。
- 用户有模糊 seed 要展开，而不是判断一条 assertion 是否成立。
- 用户要记录已接受共识；使用 `baseline`。
- 用户要普通代码审查、bug 排查、release check、辩论表演、角色扮演或赢得争论。

## Boundary

Soft:

- MUST 依赖 `aim`：`Aim` 是当前主目标，`Assertion` 是该 aim 下被测试的一条判断。
- 没有 active aim 时，MUST 推测并显示最小 `Aim`；如果不对，由用户 reset。
- MUST 一次只 pressure-test 一条 assertion。
- 用户要求 argue 但没有指定 assertion 时，SHOULD 推测最贴近 aim 且最承重的一条 assertion。
- 只有在 assertion 新建、reset、推测、改写、拆分或变化时，MUST 显示完整 `Assertion`。
- 同一条 assertion 持续推进且没有偏移时，SHOULD 只显示 `🧭`。
- pressure point 优先级 MUST 是 aim relevance、load-bearingness、instability/validity、testability、boundary、baseline consistency、cost。
- assertion 不确定、欠定义、缺证据、有争议、含糊，或实质依赖隐藏前提时，SHOULD 视为未稳固。
- MUST 只测试对当前 aim 有后果且承重的 assertion。
- assertion 太含糊、无法测试时，MUST 先改写一版可测试 assertion。
- SHOULD 使用最小且能推进判断的 challenge，使 assertion 走向 `Accepted`、`Revised`、`Rejected`、`Assumption` 或 `Deferred`。
- SHOULD 只挑战 correctness、feasibility、scope 或 decision quality，除非当前 aim 依赖其他维度。
- pressure test 之后，SHOULD 提出一个聚焦问题、给出一个更锋利改写、标注一个条件，或关闭结果。
- MUST NOT 自动把 accepted assertion 写入 `baseline`；记录共识属于用户显式要求 `baseline` 时的职责。

Hard:

- MUST NOT 写文件或创建 durable artifact。
- MUST NOT 创建、更新或关闭 formal goal。
- MUST NOT 创建或更新 `baseline`。
- MUST NOT 只为了制造 challenge 而浏览、跑工具或扫描仓库。
- MUST NOT 虚构事实、证据、用户动机、外部约束或 baseline 共识。
- MUST NOT 对多条 assertion 做清单式大范围批判。
- `Accepted`、`Rejected` 或 `Deferred` 后，MUST NOT 继续套用 `argue`，除非用户重新激活或 assertion 发生变化。
- MUST NOT 在本 skill 未激活时使用 `🧭`。

## Effects

- Conversation: MAY show `🧭`, `Aim`, `Assertion`, `Pressure test`, `Accepted`, `Revised`, `Rejected`, `Assumption`, `Deferred`、一个聚焦问题，或一个更锋利改写。
- Filesystem: none.
- External: none.

## Workflow

1. 识别 active `Aim`。如果不存在，推测当前最小 aim，并显示 `🧭 Aim: <aim>`。
2. 识别目标 `Assertion`。如果用户没有指定，推测最贴近 aim 且最承重的一条 assertion。
3. 当 assertion 新建、推测、reset、改写、拆分或变化时，显示 `Assertion: <assertion>`。
4. 判断 assertion 是否值得测试：它 MUST 贴近 aim、有后果、承重，且足够未稳固。
5. 如果 assertion 不可测试，先显示一版可测试的 `Revised`；如果无法安全改写，返回 `Deferred`。
6. 执行一次 `Pressure test`：用最小充分 challenge 判断该 assertion 在当前 aim 下应被接受、改写、拒绝、作为条件假设保留，或延后。
7. 结束时 MUST 只给一个结果标签：
   - `Accepted`: 当前 aim 下可以暂时作为共识前提。
   - `Revised`: 原 assertion 需要改写后推进。
   - `Rejected`: 原 assertion 不成立，不应继续作为前提。
   - `Assumption`: 证据不足但可带条件推进，条件 MUST 可见。
   - `Deferred`: 当前 aim 不需要解决，或缺少最小信息。
8. 关闭结果后停止套用 `argue`，除非用户重新激活或 assertion 发生变化。

## References

- 无。

## Validation

Before done:

- `argue` 激活时 `🧭` 可见；
- 首次测试 assertion 时，active 或 inferred `Aim` 清楚；
- 只测试一条目标 `Assertion`；
- 没有清单式大范围批判；
- `Pressure test` 最小、充分且贴近 aim；
- 结果是 `Accepted`、`Revised`、`Rejected`、`Assumption` 或 `Deferred` 之一；
- accepted assertion 没有被自动写入 `baseline`；
- 没有创建文件、durable artifact、formal goal，也没有虚构外部事实或 baseline 共识。
