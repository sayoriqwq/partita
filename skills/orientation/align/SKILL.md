---
name: align
description: "Use when the user explicitly invokes align to align an Aim through decision-tree rounds. Not for one-assertion pressure tests, ordinary fact finding, implementation, baseline snapshots, Aim display, or decision recording without alignment."
---

# Align

激活时，第一条用户可见行 MUST 以 orientation marker `🧭` 开头，并显示 `🧭 Align`。

## Rule

面对用户显式请求对齐一个 Aim 时，MUST 让 Aim 与 dependency-ordered epistemic frontier 通过 material questions 可见，并逐轮将 Aim-relevant `Open` decisions 推进为 `Aligned`，避免把可查事实、隐藏假设或未决判断静默当作共识。

## Pattern

Use when:

- the user explicitly invokes align to align an Aim through decision-tree rounds.

Do not use when:

- one-assertion pressure tests, ordinary fact finding, implementation, baseline snapshots, Aim display, or decision recording without alignment.

## Boundary

Soft:

- MUST 以 conversation-local `Aim` 作为 decision tree root。
- 用户显式调用 `align` 创建一个 bounded alignment session；在 closing condition 前对该 session 问题的回复属于 continuation，不是 implicit invocation。alignment session owns `🧭 Align` marker、question envelope 与 termination；active Aim/Tempo 只贡献 state。
- 已有 active Aim 时，MUST 在开始时显示它；没有时，MUST 提议并显示最小 Aim，把确认或改写 Aim 作为第一个 decision。
- conversation 中存在用户显式设置的 active Tempo 时，MUST 在开始时显示其 `Depth` 与 `Cadence`；MUST NOT 自行创建或推测 Tempo。
- active Tempo 的 `Depth` MUST 决定哪些 decision 进入 tree：
  - `Probe`: 只纳入会阻塞安全试做，或一旦推翻会使近期试做失效、产生实质浪费的 human-owned decision。
  - `Shape`: 纳入 `Probe` decisions，以及 observable behavior、boundary、public seam 与昂贵或不可逆的 trade-off。
  - `Specify`: 纳入所有 material、human-owned 且无法从 evidence、code 或 active harness 可靠推导的 decision。
- active Tempo 的 `Cadence` MUST 决定每轮 question width：`Batch` 询问当前所有 prerequisite-ready material decisions；`Step` 只询问其中最高价值、最能解除 downstream dependency 的一个。
- 没有 active Tempo 时，MUST 保持 adaptive behavior：decision 随 materiality 进入 tree，每轮询问当前全部 frontier，由用户通过回答、结束或 Standard 决定展开深度。
- lower-depth contract 排除的判断 MUST 留给 agent 或 implementation evidence，不得作为隐藏 `Open` node；如果它后来成为当前 Depth 下的 blocking prerequisite，MUST 重新纳入 tree。
- decision tree MUST 只包含对当前 Aim 有后果的 decisions；dependency edge 表示一个 decision 必须在另一个 decision `Aligned` 后才能安全回答。
- `Frontier` MUST 是 prerequisites 已经 `Aligned` 的所有 Aim-relevant `Open` decisions。
- MUST 按轮次询问当前 frontier；除显式 `Step` 外不得为了固定数量截断或制造问题。
- decision node 只使用 `Open | Aligned` 两种状态。
- decision tree、dependency edge 与 node state MUST 保持为内部工作结构；除非用户显式要求，MUST NOT 输出 raw tree、frontier ledger 或 `[Open]` / `[Aligned]` annotation。
- 用户回答、明确批准，或以 `Standard` 授权 agent 推断后，相关 decision MUST 变为 `Aligned`。
- 延期、拒绝某个选项或带条件推进是 aligned decision 的内容，不创建额外状态。
- 展开 epistemic material 时，MUST 使用以下英文 lead words，并省略没有实质内容的 lane：
  - `Known known`: 已验证 evidence 或已经 aligned 的判断。
  - `Known unknown`: 已看见但尚未解决的事实或 decision。
  - `Unknown known`: 从 context、artifact 或措辞中恢复的隐含知识或假设。
  - `Unknown unknown`: 通过反例、边界场景或风险探针发现的 material blind spot。
- MUST 自行调查可从 filesystem、tools、code 或 active harness 获得的事实；只有 decision 或无法访问且无法安全推断的 material fact 才进入用户问题。
- 每个问题 MUST 附带一个直接推荐答案；recommendation line MUST 只包含答案，不得追加 rationale、caveat 或 follow-up instruction：

```text
❓ **Q<n>** - **<title>**: <decision question>

➡️ <direct recommended answer>
```

- 用户回答后，MUST 更新 tree、重算 frontier，并等待下一轮；不得要求各问题获得相同深度的回答。
- 当前 Aim 不再成立时，MUST 显示 `Aim shift: <current> → <proposed>`；只有用户将该 shift 对齐后才能换 root，并按新 Aim 重算 tree；旧 Aim 的 Tempo 同时失效，不得静默继承。
- 用户明确批准、明确结束，或给出 `Standard` 时，MUST 立即结束 alignment；剩余 `Open` decisions 视为已授权 agent 后续自行推断。
- `Standard` MUST 是 current-Aim-local soft constraint；Aim reset 或用户覆盖后失效。
- `align` MUST 与 `land` 完全分开：alignment 只受 Aim 约束，执行阶段的 scope gate 由 `land` 独立负责。
- 单条 assertion 的对抗性 pressure test 属于 `argue`；`align` 只处理需要共享判断的 dependent decision tree。
- accepted-consensus snapshot 属于 `baseline`；`align` 不自动创建或更新 baseline。
- persistence MAY 在任意轮次显式开启，但默认是 conversation-only。

Hard:

- alignment active 时，MUST NOT 执行原始任务或把提问轮次与 implementation 混在同一回复。
- alignment 关闭时，MUST 只返回 closing receipt 并停止；即使用户使用“直接做”等措辞，也不得在同一轮执行原始任务。
- user approval 或 `Standard` 已关闭 alignment 时，MUST NOT 继续遍历 frontier、追加问题或要求再次确认。
- persistence 候选 MUST 是普通 agent 无法通过正常检查当前 code 与 active harness 可靠重新推导的 aligned `Decision` 或 `Standard`。
- 只有用户明确点名或批准的具体判断 MAY 持久化；开启 persistence mode 本身不构成对候选的批准。
- persistence MUST 在 alignment 关闭时统一执行；MUST NOT 在中间轮次写 provisional judgment。
- persistence MUST NOT 保存完整 session、decision tree、`Open` nodes、frontier、transcript 或 resume checkpoint。
- persistence MUST NOT 修改 code、skill 或 harness 来表达判断；MUST 优先使用 target workspace 已有且唯一的 decision-record convention。
- target workspace 没有 decision-record convention 且 repo instructions 未禁止时，MAY 使用 `docs/decisions/NNNN-<slug>.md`，从现有最高编号递增，并只记录 title、Aim、Decision 或 Standard、必要 rationale 与可选 revisit condition。
- persistence 写入失败时，alignment 仍然成立，但 MUST 准确显示 failure；不得声称已持久化。
- MUST NOT 创建 external state、发送消息或执行原始任务。

## Effects

- Conversation: MAY 显示 Aim、active Tempo、material epistemic lanes、frontier rounds、direct recommendations、Aim shift、Standard、closing receipt 和 persistence status。
- Filesystem: conversation-only mode none；显式 persistence MAY 只写用户点名的 aligned decision records。
- External: MAY 做 evidence discovery 所需的只读查询；no external mutations。

## Workflow

1. 显示 `🧭 Align`，解析 active Aim；没有 Aim 时提议最小 Aim，并将其作为第一个 decision。存在用户显式设置的 active Tempo 时，同时显示 `Depth` 与 `Cadence`。
2. 读取 current conversation 与必要 evidence，把可查事实从 user decisions 中分离；自行解决事实 prerequisite。
3. 建立以 Aim 为 root、以 prerequisite 为 edge 的最小 internal decision tree；有 active Tempo 时先按其 Depth 过滤纳入范围；node 只标记 `Open` 或 `Aligned`，不输出 raw ledger。
4. 扫描 `Known known`、`Known unknown`、`Unknown known` 与 `Unknown unknown`；只展开对 Aim 有后果的 material lane。
5. 计算 frontier；`Batch` 或无 active Tempo 时询问全部 Aim-relevant frontier decisions，`Step` 时只询问最高价值的一个；为每题直接给出推荐答案，然后等待用户。
6. 根据回答更新 node、增加或删除 downstream branch，并重算 frontier；Aim 改变时先显示并对齐 `Aim shift`。
7. 当前 Depth 范围内的 frontier 为空，或用户明确批准、结束、给出 `Standard` 时，关闭 alignment；后两种情况把剩余判断授权给 agent 后续推断。
8. 如果 persistence 已开启，只在关闭时筛选同时满足 non-inferable 与 user-named 两个 gate 的 aligned judgments，并按 target convention 或 fallback 写入。
9. 纯模式使用以下 receipt；有 `Standard` 时增加第二行，然后停止：

```text
🧭 Aligned: <Aim>
Standard: <optional user-provided standard>
```

10. persistence 成功时追加 `Persisted:` path 列表；失败时追加 `Persistence: not written; <reason>`。不得继续原始任务。

## References

- 无。

## Validation

Before done:

- 第一条用户可见行以 `🧭 Align` 开头，active 或 proposed Aim 可见；
- tree 只包含 Aim-relevant decisions，active Depth 已正确过滤纳入范围，frontier 中每个 prerequisite 已经 `Aligned`；
- active Tempo 只来自用户显式设置，开始时 Depth 与 Cadence 可见，Aim shift 后没有静默继承；
- `Batch` 覆盖当前全部 material frontier，`Step` 只询问最高价值的一个；无 Tempo 时保持 adaptive behavior；
- 每个问题都有直接推荐答案，没有在 `Step` 之外使用任意数值 question cap；
- material expansion 使用准确的英文 epistemic lead word，空 lane 没有输出；
- 可查事实由 agent 调查，decision 才交给用户；
- node state 只有 `Open | Aligned`；
- raw decision tree、frontier ledger 和 node-state annotation 没有暴露；
- Aim shift 可见且得到用户对齐，没有 silent root replacement；
- user approval、结束或 Standard 立即关闭 alignment，没有继续提问或同轮执行；
- `align` 没有调用或模拟 `argue`、`baseline` 或 `land`；
- conversation-only mode 没有 filesystem write；
- persistence 只写 non-inferable、user-named、aligned judgment，没有 session history 或 checkpoint；
- closing receipt、Standard 与 persistence status 准确，关闭后没有继续原始任务；
- Effects 保持在声明的 filesystem 和 external scope 内。
