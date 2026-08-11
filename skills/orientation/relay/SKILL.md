---
name: relay
description: "Use when the user explicitly invokes relay to transfer a work slice into another Codex task. Not for ordinary summaries, current-session bearings, standalone compaction, full-history forks, or thread/worktree/host relocation."
---

# Relay

当 `relay` owns 当前 response 时，每条用户可见回复的第一行 MUST 只包含 `🧭 Relay` 与可选的 ` + <Display Name>` suffix；suffix 只列出实质改变该回复的其他已显式激活/共同调用 skill，不改变 ownership，active-but-inert skill 与 local contract projection MUST 省略，其他内容从第二行开始。多个 co-invoked skill 争夺 ownership 且 precedence 未确定时，MUST 在激活前只问一个不带 skill marker 的最小 owner 问题。

## Rule

面对用户显式调用 `relay`，MUST 先确定 successor `Aim`，再将 current-session evidence 选择性投影为一个 bounded relay packet，并交付、立即启动新的 Codex task，或发送给用户指定的已有 task。`Branch` MUST 保持 source `Aim` 不变；`Continue` MUST 让 successor 延续 source `Aim`。

## Pattern

Use when:

- the user explicitly invokes relay to transfer a work slice into another Codex task.

Do not use when:

- ordinary summaries, current-session bearings, standalone compaction, full-history forks, or thread/worktree/host relocation.

## Boundary

Soft:

- `Relay unit` MUST 是被转交的 bounded work slice，而不是整个 source session。
- `Projection` MUST 只保留 successor `Aim` 需要的 evidence、accepted consensus、boundary 和 open state；它不是 destination-independent summary。
- `Branch` MUST 让 successor `Aim` 成为从 source conversation 中切出的新 Aim，并保持 source `Aim` 与 active `Land` gate 不变。
- `Continue` MUST 让 successor `Aim` 与 source `Aim` 相同；成功交付后，source task 停止重复推进这项工作。
- `Destination` 的 `new | existing` 与 `same workspace | another workspace` MUST 独立于 mode。
- MUST 优先从用户措辞与 current-session evidence 判断 `Branch` 或 `Continue`。
- 用户明确要求保留当前主线并转出一个 idea 时，MUST 使用 `Branch`。
- 用户要求换 session 延续当前工作，或因 context limit 续接时，MUST 使用 `Continue`。
- mode 不明确且错误分类会改变 source behavior 时，MUST 只问一个最小问题：转出新分支，还是续接当前 Aim。
- 未指定 destination 时，MUST 默认在当前 workspace/project 创建并立即启动一个新 task；使用当前 Codex task-creation policy 选择 execution environment。
- 用户指定另一 workspace/project 时，MUST 只读解析可用 project；无法唯一解析时，MUST 先问一个最小 target 问题。
- 用户指定已有 task 时，MUST 在发送前唯一解析 target；不得根据含糊 title 猜测接收方。
- SHOULD 使用 successor `Aim` 生成简洁 task title。
- MUST 复用 `Aim` 与 `Baseline` 语言，但不得把 `relay` 变成对其他 user-invoked orientation skills 的运行时依赖。
- `Baseline` MUST 只包含 successor 需要的 accepted consensus；未决问题属于 `Uncertainty`。
- `Evidence` SHOULD 引用已有 path、commit、diff 或 URL，避免复制已有 artifact。
- cross-workspace 或 cross-host destination MUST 只接收可访问的 reference；不可访问时，MUST 内联最小必要 evidence，或清楚标记 blocker。
- `Suggested skills` MAY 只在接收方明显需要时出现。
- response owner MUST 校验 packet 中每个 assertion、reference、boundary 与 uncertainty，并删除无关 source history。

Hard:

- `relay` 协议只有 response owner 一个 source-side 执行角色；该 owner MUST 使用其已持有的 current-session context 完成 mode、successor `Aim`、destination 与初始 `Boundary` 判断、packet synthesis、validation、delivery、envelope、effects 与 termination ownership。successor task 是 delivery target，不是 internal synthesis role。
- response owner MUST 在任何 task mutation 前确定 mode、successor `Aim`、destination 与初始 `Boundary`，并完成 packet validation；delivery readiness 只由这些 relay semantics、evidence、reference accessibility、secret redaction 与 target tool availability 决定。
- 新 task MUST 使用 fresh-task creation，而不是 full-history fork；已有 task MUST 使用 follow-up message delivery。
- MUST NOT 使用 thread/worktree/host handoff 操作实现 semantic relay。
- `Branch` MUST NOT reset、replace 或暂停 source `Aim` 或 active `Land` gate，也 MUST NOT 在 source task 中执行被 relay 的工作。
- `Continue` 成功交付后，MUST NOT 在 source task 中继续重复执行 successor work。
- MUST NOT 在 source workspace 写 relay document、临时 handoff 文件或其他 packet artifact。
- MUST NOT 发送 credential、token、secret 或 successor 不需要的敏感信息。
- target creation 或 message delivery 被工具明确拒绝时，MUST 报告 `not delivered`；工具没有提供可判定结果时，MUST 报告 `unconfirmed`。两者都不得显示成功 receipt。
- `Continue` 没有确认成功时，MUST 显示 source responsibility unchanged；明确失败时显示 work not transferred，结果未知时显示 transfer not established。只有成功交付才能显示 `Source: stopped`。
- 成功交付后，response owner MUST 只返回 receipt，不得在同一 turn 继续 source 或 successor work。

## Effects

- Conversation: MAY 显示 `🧭 Relay`、一个最小 mode/target 问题、delivery blocker、unsent packet、unconfirmed delivery outcome 或成功 receipt。
- Filesystem: MAY 做 packet validation 所需的最小只读检查；no relay artifact writes。
- External: MAY 只读 projects/tasks，创建并立即启动一个新 task，或向唯一解析的已有 task 发送 follow-up message；no full-history fork, thread relocation, archive, pin, or source-task mutation。

## Workflow

1. 识别 source `Aim`、用户想转交的 focus 与 destination。
2. 将 focus 分类为 `Branch` 或 `Continue`；只有 mode 或 target 无法安全确定时，问一个最小问题。
3. 固定 successor `Aim` 与初始 `Boundary`：`Branch` 创建新 Aim 并保持 source Aim；`Continue` 复用 source Aim。
4. 收集 successor 需要的 accepted consensus、current position 或 idea seed、material uncertainty、可访问 evidence 与一个自然 `Next`。
5. response owner 在已持有的 current-session context 中，将原始 evidence、mode、successor `Aim`、destination 和初始 `Boundary` 直接投影为 packet draft。
6. 校验 draft 的 evidence、scope、reference accessibility、secret redaction 与 target relevance；保留 material uncertainty，删除无关 source history。
7. 使用以下稳定形状交付；`Branch` 使用 `Seed`，`Continue` 使用 `Position`，其余 optional section 无内容时省略：

```text
Relay: Branch | Continue
Source: <optional source task reference>
Aim: <successor aim>
Origin: <why this work exists and how it relates to the source>

Baseline:
- <accepted assertion needed by the successor, or no confirmed baseline>

Seed: <Branch only: the bounded idea worth pursuing>
Position: <Continue only: latest confirmed progress and current phase>

Boundary:
- <in scope or intentionally excluded>

Evidence:
- <accessible path, commit, diff, URL, or minimal inline evidence>

Uncertainty:
- <optional material unknown>

Next: <one concrete first action>

Suggested skills:
- <optional skill with a clear reason>
```

8. 对新 destination，创建带有 packet 的 fresh task 并让它从 `Next` 立即开始；对 existing destination，发送 packet 作为 follow-up prompt。
9. 工具明确拒绝 dispatch 时，先显示 `🧭 Relay` marker line，再显示 `Delivery: <Branch | Continue> not delivered`、blocker 和 `Source: unchanged; work not transferred`；工具没有提供可判定结果时显示 `Delivery: <Branch | Continue> unconfirmed`、observed uncertainty 和 `Source: unchanged; transfer not established`。工具确认 dispatch 后，使用以下 receipt 结束 source turn；异步 setup 仍在进行时准确显示 `queued`，不得显示 `started`：

```text
🧭 Relay
Delivery: <Branch | Continue> <sent | queued | started>
Target: <task title and resolvable reference>
Aim: <successor aim>
Source: <unchanged | stopped>
```

## References

- 无。

## Validation

Before done:

- 每条回复的第一行只含 primary `🧭 Relay` marker 和 materially effective、already-explicit contributor suffix；
- mode、successor `Aim` 与 destination 在 mutation 前已经确定；
- `Branch` 保持 source `Aim` 和 active `Land` gate，`Continue` 没有在 source 重复推进；
- packet synthesis 与 validation 由 `relay` response owner 从已持有的 current-session context 直接完成，协议没有其他 internal synthesis role 或 availability dependency；
- packet 只包含 successor-relevant evidence，`Baseline` 只包含 accepted consensus；
- reference 对 target 可访问，material uncertainty 可见，secret 已清理；
- 新 task 使用 fresh creation 并立即开始，已有 task 收到 follow-up message；
- delivery status 位于 marker line 后的 `Delivery` field；有工具确认时 receipt 准确区分 `sent`、`queued` 与 `started`；
- delivery failure 或 unconfirmed outcome 没有产生成功 receipt 或 `Source: stopped`，unconfirmed 没有被写成 `not delivered`；
- 没有 full-history fork、thread relocation、relay artifact write 或 source-side execution。
