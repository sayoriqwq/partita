---
name: debrief
description: "Use when the user explicitly asks to debrief completed or paused work. Not for clarifying one concept, current-session bearings, handoff, ordinary progress updates, implementation, or command-by-command transcripts."
---

# Debrief

激活时，第一条用户可见行 MUST 以内联 `💬 debrief` 开头。

## Rule

面对用户显式要求重新铺开一段已完成或暂停的工作时，MUST 从可用的 session evidence、tool receipts 与 observable artifacts 重建完整交付，使 human 无需重读长 session 也能理解 Aim、Outcome、material work、decisions、verification 与 residuals；不得只把上一条简短汇报改写得更长。

## Pattern

Use when:

- the user explicitly asks to debrief completed or paused work.

Do not use when:

- clarifying one concept, current-session bearings, handoff, ordinary progress updates, implementation, or command-by-command transcripts.

## Boundary

Soft:

- `Scope` MUST 是一个已完成或暂停的 work slice。用户点名范围时使用该范围；否则，裸调用默认指向 immediately preceding completion or pause report 所代表的工作，再回溯其 Aim 与执行证据。
- 只有存在多个 materially different work slices 且选择会改变报告时，才问一个最小 Scope 问题。
- `Material` MUST 包含会改变 human 对交付结果判断的 artifact、behavior、contract、decision、verification、failure、publication state、open work、risk 或 uncertainty。
- MUST 让 materiality 决定篇幅；上一条回复的长度、默认 final-answer 简洁偏好或 session 已经很长，均不得成为省略 material information 的理由。
- MUST 按 concern 组织 `Work`，并说明做了什么、落在哪里、产生什么实际影响；文件清单本身不构成完整说明。
- MUST 使用当前可获得的最强 evidence：conversation 中已确认的事实、tool receipt、commit/diff、具体 path、test output 或 external confirmation。Evidence SHOULD 靠近对应 claim，并保持可解析。
- observable artifact 只能证明当前状态；除非另有历史证据，不得据此断言谁做了修改、何时修改或为什么修改。
- `Decisions` MUST 覆盖 material choice，并显示 `Gain` 与 `Loss`；`Why` 只有在 rationale 被用户陈述、当时记录或可由明确 evidence 支持时才写，未记录时明确标记 `not recorded`。
- `Verification` MUST 写出实际执行的 check、observed result 及其 coverage 或 limitation；计划执行、看似合理或 artifact 存在均不等于验证通过。
- `Residuals` MUST 覆盖 remaining work、known risk、material unknown、uncommitted or unpublished state 与 verification gap；没有发现时写 `none known`，不得写成绝对不存在。
- routine commands、无影响的中间尝试与逐 token history SHOULD 省略；失败若改变了最终设计、解释现状或仍产生风险，则属于 Material。
- MAY 只在执行顺序对理解因果关系必要时增加最小 chronology；不得把 debrief 退化为流水账。

Hard:

- When: 用户没有显式调用 `debrief`。
  Do: MUST NOT 使用 `💬 debrief` marker 或套用本协议。

- When: claim 只有 agent inference，或 current artifact 无法证明历史动作、ownership、decision 或 rationale。
  Do: MUST 标记为 inference 或 unknown；不得把推测写成已发生事实。

- When: workspace 含有与 Scope 无法关联的 dirty、untracked 或 pre-existing change。
  Do: MUST 保持其 ownership unresolved，并排除在“本次完成的工作”之外；不得把整个 worktree 归功于当前任务。

- When: validation 没有实际 receipt，或 receipt 只覆盖部分目标。
  Do: MUST 暴露 verification gap 或 limitation；不得笼统宣称全部通过。

- When: `debrief` 已激活。
  Do: MUST 保持只读，在一条 assistant message 中完成报告并停止；不得继续实现、修复、提交、推送、转交或创建持久化报告。

## Effects

- Conversation: MUST 显示 Scope、Aim、Outcome、Work、Verification 与 Residuals；有 material choice 时 MUST 显示 Decisions。
- Filesystem: MAY 做 Scope 内最小只读检查；no writes。
- External: MAY 只读 current task evidence 与已有 receipts；no mutations。

## Workflow

1. 确认用户显式调用了 `debrief`，并从用户指定范围或 immediately preceding completion/pause report 确定 Scope；无法唯一确定时只问一个最小问题并停止。
2. 回溯 Scope 对应的 Aim、accepted completion condition、conversation facts、tool receipts 与 observable artifacts；记录不可恢复的历史与 evidence gap。
3. 建立内部 delivery ledger，逐项覆盖 Outcome、material Work、Decisions、Verification 与 Residuals，并区分历史 evidence、current-state observation 与 inference。
4. 按 material concern 聚合 Work；为每组写出 action、location、impact 与最近的 evidence，删除无影响的命令流水。
5. 对每个 material decision 写出 Choice、Gain、Loss，以及有证据的 Why；未记录的 Why 保持可见，不得事后编造。
6. 使用以下稳定形状交付；只有没有 material decision 时才省略 `Decisions`：

```text
💬 debrief
Scope: <completed or paused work slice>
Aim: <intended outcome or acceptance condition>
Outcome: <Complete | Partial | Paused> — <current result>

Work:
- <concern> — <what changed>; Impact: <practical consequence>; Evidence: <receipt, commit, diff, path, or observation>

Decisions:
- <choice> — Gain: <what it obtained>; Loss: <what it gave up>; Why: <evidenced rationale | not recorded>

Verification:
- <actual check> — <observed result>; Coverage: <what it proves and material limitation>

Residuals:
- <remaining work, risk, unknown, state gap, or none known>
```

7. 反查 ledger：确认每项 Material 均已出现，evidence strength 没有被夸大，dirty ownership、verification gap 与 unknown 均保持可见，然后停止。

## References

- 无。

## Validation

Before done:

- 第一条用户可见行包含内联 `💬 debrief`；
- `debrief` 只在用户显式调用后使用，Scope 是一个可辨认的 completed or paused work slice；
- Aim、Outcome、每项 material Work、Verification 与 Residuals 均已覆盖；
- 篇幅由 materiality 决定，没有因为 session 长或上一条回复短而再次过度压缩；
- Work 说明了 action、location 与 impact，而不只是文件清单或命令流水；
- 每个 material decision 都显示 Gain、Loss，Why 没有越过 evidence；
- verification 只报告实际 receipt，并说明 coverage 或 limitation；
- current-state observation 没有冒充历史、ownership 或 rationale evidence；
- unrelated dirty worktree 没有被归入当前任务，material unknown 与 residual state 没有被隐藏；
- 回复在一条 assistant message 中完成，没有 filesystem write、external mutation、继续实现或持久化报告。
