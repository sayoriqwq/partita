---
name: tempo
description: "Use when the user explicitly sets alignment depth and cadence for an Aim. Not for performing alignment, implementation, task planning, general response verbosity, or teaching difficulty."
---

# Tempo

激活时，第一条用户可见行 MUST 以 orientation marker `🧭` 开头，并显示 `🧭 Tempo`。

## Rule

面对用户显式调度 decision alignment 的节奏时，MUST 把当前 Aim 下的 `Depth × Cadence` 变为可见的 conversation-local contract，避免 agent 默认深挖、批量追问或过早进入实现。

## Pattern

Use when:

- the user explicitly sets alignment depth and cadence for an Aim.

Do not use when:

- performing alignment, implementation, task planning, general response verbosity, or teaching difficulty.

## Boundary

Soft:

- MUST 依赖 conversation-local `Aim`；有 active Aim 时使用并显示它，没有时推测并显示最小 Aim，无法安全推测时只问一个最小问题。
- `Depth` MUST 只使用以下值：
  - `Probe`: 只在实现前对齐会阻塞安全试做，或一旦推翻会使近期试做失效、产生实质浪费的 human-owned decision；其余判断交给实现证据与 agent 推断。
  - `Shape`: 在 `Probe` 之上，对齐 observable behavior、boundary、public seam 与昂贵或不可逆的 trade-off；局部实现判断交给 agent。
  - `Specify`: 对齐所有 material、human-owned 且无法从 evidence、code 或 active harness 可靠推导的 decision，使实现尽量只剩翻译。
- `Cadence` MUST 只使用以下值：
  - `Batch`: 每轮覆盖当前所有 prerequisite-ready material decisions。
  - `Step`: 每轮只处理一个最高价值的 prerequisite-ready material decision。
- `Depth` 与 `Cadence` MUST 保持正交；任意 depth 都可以和任意 cadence 组合。
- 用户显式表达“赶紧做出来再看”“先试做”或等价语义时，SHOULD 设为 `Probe + Batch`。
- 用户显式表达“一个个慢慢问”“实现只剩翻译”或等价语义时，SHOULD 设为 `Specify + Step`。
- 用户激活 `tempo` 但没有提供可区分的偏好时，MUST 推荐并设置 `Shape + Batch`，允许用户随后 reset。
- active Tempo MUST 在当前 Aim 内持续，直到用户 reset、显式退出或 Aim shift；中途更新只约束下一轮 alignment，不重开已经 aligned 的 decision。
- MUST 显示 `Aim`、`Depth` 与 `Cadence`；用户原话已经精确指定 pair 时直接确认，不追加解释。

Hard:

- MUST NOT 在用户没有显式调用 `tempo` 时创建、推测或显示 Tempo contract。
- MUST NOT 建立或遍历 decision tree、提出 alignment questions、执行原始任务或代替 `align`。
- MUST NOT 把 Tempo 解释为 response length、reasoning effort、tool speed、implementation deadline 或 teaching difficulty。
- MUST NOT 把 active Tempo 静默带入新的 Aim。
- MUST NOT 创建 baseline、formal goal、文件、durable artifact 或 external state。

## Effects

- Conversation: MAY 显示 `🧭 Tempo`、Aim、Depth、Cadence 或一个最小缺失 Aim 问题。
- Filesystem: none.
- External: none.

## Workflow

1. 确认用户显式调用了 `tempo`；否则不激活。
2. 解析 active 或可安全推测的 Aim；无法确定时只问一个最小问题并停止。
3. 从用户显式措辞解析 `Depth`；没有可区分偏好时使用 `Shape`。
4. 从用户显式措辞解析 `Cadence`；没有可区分偏好时使用 `Batch`。
5. 使用以下 receipt 确认 contract，然后停止；不得同轮开始 alignment：

```text
🧭 Tempo
Aim: <current Aim>
Depth: <Probe | Shape | Specify>
Cadence: <Batch | Step>
```

## References

- 无。

## Validation

Before done:

- 第一条用户可见行以 `🧭 Tempo` 开头；
- active 或 inferred Aim 可见；
- Depth 只使用 `Probe | Shape | Specify`，Cadence 只使用 `Batch | Step`；
- Depth 与 Cadence 由显式措辞确定，或准确使用 `Shape + Batch` default；
- contract 保持 Aim-local，没有跨 Aim 静默继承；
- 没有开始 alignment、提出 subject-matter question 或执行原始任务；
- 没有改变 response verbosity、reasoning effort 或 teaching difficulty；
- 没有创建 filesystem、durable artifact 或 external state。
