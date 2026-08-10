---
name: afk
description: "Use when the user explicitly invokes afk to continue a task unattended. Not for ordinary long-running work, passive monitoring, delegation, or tasks that still expect interactive collaboration."
---

# AFK

当 `afk` owns 当前 response 时，每条用户可见回复的第一行 MUST 只包含 `🧭 AFK` 与可选的 ` + <Display Name>` suffix；suffix 只列出实质改变该回复的其他已显式激活/共同调用 skill，不改变 ownership，active-but-inert skill 与 local contract projection MUST 省略，其他内容从第二行开始。多个 co-invoked skill 争夺 ownership 且 precedence 未确定时，MUST 在激活前只问一个不带 skill marker 的最小 owner 问题。

## Rule

面对用户显式调用 `afk` 并将离开、但要求继续当前任务时，MUST 将完整执行图中可预见的 `Need-human` 移入 `Human window`，在任务实际使用的 environment 中完成并验证这些依赖；只有剩余工作能够自主完成时才可越过 `AFK boundary`，并立即继续执行。

## Pattern

Use when:

- the user explicitly invokes afk to continue a task unattended.

Do not use when:

- ordinary long-running work, passive monitoring, delegation, or tasks that still expect interactive collaboration.

## Boundary

Soft:

- MUST 保持 current Aim、completion criteria、scope 与 authority 不变；AFK 只重排执行顺序，不扩大用户已经授权的任务。
- MUST 使用以下 execution vocabulary：
  - `Need-human`: 后续步骤必须依赖用户实时在场才能取得的 decision、approval、credential input、MFA、device confirmation、external consent 或 physical action。
  - `Human window`: 用户仍在线、可以完成 Need-human 的当前阶段。
  - `AFK boundary`: 越过后，剩余的可预见执行图不再需要用户实时参与。
  - `Ready`: 每个 material、可预见的 Need-human 已完成并验证，或相关受保护操作已经在 Human window 内执行完毕。
- Need-human scan MUST 覆盖从当前状态到 completion criteria 的可预见执行图，而不只检查下一条 command；间接 prerequisite、later publish/deploy、最终验证与 cleanup 中的 gate 同样在范围内。
- MUST 将每个 Need-human 尽早推进到安全、真实、可执行的 frontier：先完成必要的只读检查与可逆准备，再在最终会执行任务的 terminal、PTY、process、browser profile、account、working directory 或 remote context 中触发 interaction。
- SHOULD 在第一次 interaction 前用一条紧凑消息展示所有已知 Need-human；MAY 按 prerequisite 顺序合并用户操作，但不得为了批量而请求无关 privilege。
- credential、password、token、MFA 与 recovery code MUST 通过 native protected prompt 或 owning service flow 由用户直接输入；不得要求用户把 secret 发进聊天，也不得复制进 command、file、environment、log 或 relay artifact。
- MUST 对 permission 或 authentication 的 persistence 分类并验证：
  - `Durable`: 登录或授权状态可跨当前操作持续；必须用实际 task context 中的安全 probe 验证。
  - `Lease`: grant 受时间、session、TTY、process、profile、account、command prefix 或 host 约束；必须显示 constraint，并验证它足以覆盖预计的 autonomous remainder。
  - `Per-operation`: 每次 protected operation 都需要用户；必须在 Human window 内执行所有已知 protected operations，否则不得宣告 Ready。
- generic credential warming MUST 只在机制明确、最小权限且与最终执行 environment 相同时使用；优先触发任务真实需要的最小 protected operation，而不是为了便利扩大 grant。
- 没有 Need-human 时，MUST 直接宣告 Ready 并继续；用户已经表达离开意图时，Ready 后不得再次要求“可以开始吗”。
- Ready 后出现无法预见的新 Need-human 时，SHOULD 先完成所有 independent、safe work，再保存可恢复 checkpoint，并只报告一个精确 blocker 与 resume action。
- MUST 将“未发现更多 gate”表达为对当前可预见执行图的判断，不得承诺任何系统绝不会产生新的 approval、expiry 或 external failure。

Hard:

- When: 用户没有显式调用 `afk`。
  Do: MUST NOT 使用 `🧭 AFK` marker、提前触发 permission，或套用本协议。

- When: Aim、scope、destructive boundary 或其他 human-owned decision 仍无法安全推断。
  Do: MUST 在 Human window 内提出最小问题；不得把它推迟到 autonomous execution。

- When: final execution environment 尚未建立。
  Do: MUST 先完成 staging；不得用另一个 terminal、profile、account 或 session 中成功的认证宣告 Ready。

- When: grant 的 scope、persistence 或 verification 仍未知，或仍有 material Need-human open。
  Do: MUST 在 `🧭 AFK` marker line 后显示 `Status: not ready` 与具体 gate；不得暗示用户已经可以离开。

- When: permission 是 Per-operation 且后续已知 protected operation 尚未执行。
  Do: MUST 在 Human window 内执行该 operation，或准确报告任务不能进入 AFK-ready 状态。

- When: 权限不足以覆盖任务。
  Do: MUST 请求最小必要 grant，或缩窄/重排任务；不得关闭 security control、持久化 secret、请求 blanket privilege 或绕过 approval。

- When: 已宣告 Ready。
  Do: MUST 立即继续原任务，不得停止等待用户确认，也不得主动引入新的 scope、external mutation 或 destructive action。

- When: AFK boundary 后出现 Need-human。
  Do: MUST NOT 猜测 user decision、重复骚扰式触发 prompt 或采取越权 workaround；必须 checkpoint、保留已完成工作并提供精确 Resume。

## Effects

- Conversation: MAY 显示 `🧭 AFK` marker、`Status: preparing | not ready | ready | paused | complete`、Aim、Need-human、grant persistence、verification、blocker 与 Resume。
- Filesystem: 与原任务 scope 相同；MAY 做必要的只读或可逆 staging，MUST NOT 写入 secret 或仅为 AFK 创建 durable artifact。
- External: 与原任务 scope 相同；MAY 在 Human window 中触发原任务所需的 native approval/authentication，MUST NOT 扩大原任务 authority 或创建 recurring monitor/automation。

## Workflow

1. 确认用户显式调用了 `afk`；先显示 `🧭 AFK` marker line，再显示 `Status: preparing`，解析 current Aim、completion criteria、scope 与 authority；只有 material human-owned input 无法推断时才立即提问。
2. 展开到 completion 的可预见 execution graph，建立内部 Need-human ledger：记录 `Gate`、`Environment`、`Persistence`、`Verification` 与 `Status`。
3. 重排 prerequisite，把每个 Gate 移到 Human window 内最早的安全 executable frontier；先建立最终执行 environment，再进行 interaction。
4. 向用户紧凑展示已知 Need-human，并通过 native flow 完成 decision、approval、credential、MFA、device 或 consent；不得收集 secret 文本。
5. 在同一 execution environment 中验证每个 Gate：Durable 使用安全 probe；Lease 检查 scope 与预计 lifetime；Per-operation 立即完成所有已知 protected operations。
6. 仍有 open Gate 时，使用以下 receipt 停止，等待用户完成明确动作：

```text
🧭 AFK
Status: not ready
Aim: <current task aim>
Need-human:
- <open gate> — <actual environment and reason>
Ready when: <one exact user action or verification>
```

7. ledger 已清空时，使用以下 receipt；随后不等待回复，立即继续原任务：

```text
🧭 AFK
Status: ready
Aim: <current task aim>
Cleared:
- <gate> — <Durable | Lease | Per-operation completed>; <verification>
Remaining: autonomous
```

8. 按原 completion criteria 持续执行并验证。出现 unexpected Need-human 时，先完成 independent safe work，再使用以下 checkpoint 停止：

```text
🧭 AFK
Status: paused
Completed: <durable progress>
Need-human: <one exact gate>
Resume: <one exact action that resumes execution>
```

9. 原任务完成时先显示 `🧭 AFK` marker line，再显示 `Status: complete`，并按原任务要求交付结果；AFK receipt 不取代正常 completion evidence。

## References

- 无。

## Validation

Before done:

- 每条回复的第一行只含 primary `🧭 AFK` marker 和 materially effective、already-explicit contributor suffix，且用户已经显式调用 `afk`；
- preparing、not ready、ready、paused 与 complete 位于 marker line 后的 `Status` field；
- current Aim、completion criteria、scope 与 authority 没有因 AFK 被扩大或替换；
- Need-human scan 覆盖了完整可预见执行图，不只覆盖下一条 command；
- 每个 Gate 都在最终 execution environment 中完成 staging、interaction 与 verification；
- Durable、Lease 与 Per-operation 的处理符合各自 persistence，Per-operation protected work 已在 Human window 内完成；
- secret 只经过 native protected flow，没有进入聊天、command、file、environment、log 或 artifact；
- Ready 只在 ledger 清空后出现，且出现后 agent 已立即继续原任务；
- not ready、paused 与 complete 状态准确，没有虚假承诺无人值守能力；
- unexpected Need-human 没有引发猜测、越权 workaround 或重复 prompt，已有进度与 Resume 可恢复；
- filesystem 与 external effects 没有超出原任务 scope。
