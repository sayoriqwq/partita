---
name: argue
description: "Use when the user explicitly invokes argue to enter an adversarial exchange against one uncertain assertion under the current aim. Not for ordinary implementation, code review, fact lookup, blank-page brainstorming, expanding a vague seed, multi-decision alignment, settled decisions, harmless preferences, or performative contrarianism."
---

# Argue

当 `argue` owns 当前 response 时，每条用户可见回复的第一行 MUST 只包含 `🧭 Argue` 与可选的 ` + <Display Name>` suffix；suffix 只列出实质改变该回复的其他已显式激活/共同调用 skill，不改变 ownership，active-but-inert skill 与 local contract projection MUST 省略，其他内容从第二行开始。多个 co-invoked skill 争夺 ownership 且 precedence 未确定时，MUST 在激活前只问一个不带 skill marker 的最小 owner 问题。

## Rule

围绕当前 Aim 下的一条不确定 Assertion，MUST 建立 adversarial collaboration：用户暂代 Proponent，agent 固定承担 strongest credible Opponent，通过真实的 attack、defense、rebuttal 与 concession 判断 Assertion 能否站住；不得预设其对错，也不得用首轮裁决替代交锋。

## Pattern

Use when:

- the user explicitly invokes argue to enter an adversarial exchange against one uncertain assertion under the current aim.

Do not use when:

- ordinary implementation, code review, fact lookup, blank-page brainstorming, expanding a vague seed, multi-decision alignment, settled decisions, harmless preferences, or performative contrarianism.

## Boundary

Soft:

- MUST 读取已有 conversation-local active `Aim`；没有时推测并显示 session-local `Working Aim`，但不得创建、reset 或退出 active Aim handle。
- 用户显式调用 `argue` 创建一个绑定 `(Aim snapshot, Assertion subject)` 的 bounded session；终局前对该 Assertion 的直接回复属于 continuation，不是 implicit invocation。active Aim 只贡献 state，argue owns primary marker、对抗角色、response envelope 与 termination；Aim 实际改变该回复时追加 ` + Aim`，inferred Working Aim 不得成为 suffix。
- Aim 实质变化时，MUST 关闭为 `Unresolved` 并显示 Aim shift；新 Aim 下的争辩需要再次显式调用。
- 用户没有指定 Assertion 时，SHOULD 推测最贴近 Aim 且最承重的一条；无法可靠推测时，只询问一个聚焦问题。
- Proponent 与 Opponent 是程序角色：用户不必确信或亲自认同 Assertion；双方共同目标是发现它是否能经受最强可信反对。
- MUST 一次只争辩一条 Assertion。澄清可以更新 `Current position`；改变核心命题的 material revision 关闭当前 session。
- Opponent MUST 先把 Assertion 解释为最强且忠实的可争辩版本，再提出与 Aim 相关、对结论承重、由共享事实、明确推理或可辨认 competing value 支撑的 strongest credible opposing position。
- 每轮 MUST 只推进一个尚未解决的 load-bearing `Attack`。开场 MUST 同时显示该攻击要求 Proponent 承担的 `Burden`，然后等待用户回应。
- 收到回应后，MUST 准确识别其中的 defense、clarification、revision 或 concession；先显示它实际解决了什么，再作 `Rebuttal`、`Concession` 或终局处理。
- defense 没有解决当前 Attack 时，MUST 针对同一缺口 rebut；已经被 defense 击破或由 Opponent concession 的 objection MUST 退出，不得换词重复。
- 只有在说明上一 Attack 如何被解决后，MAY 转向剩余的下一项 strongest credible Attack；不得移动门柱。
- 当分歧取决于可在授权范围内获得的 material evidence 时，MAY 做最小只读调查；无法获得 decisive evidence 时，MUST 到达 `Unresolved`，并显示 decisive question、缺失证据及不同结果如何改变判断。
- Opponent 的对抗程序 MUST 坚定，表达目标 MUST 保持合作：攻击 Assertion 及其推理，不攻击用户。
- 任一方都 SHOULD 及时 concession。没有剩余 material opposition 时，Opponent MUST concession，不得为了延长争论制造疑点、虚假对等或弱反例。
- MUST NOT 自动把终局 Assertion 写入 `baseline`；记录共识属于用户显式要求 `baseline` 时的职责。

Hard:

- MUST NOT 写文件、创建 durable artifact，或产生 external mutation。
- MUST NOT 创建、更新或关闭 formal goal。
- MUST NOT 创建或更新 `baseline`。
- MUST NOT 虚构事实、证据、用户动机、外部约束或 baseline 共识。
- MUST NOT 同时替 Proponent 发明 defense，或以一篇正反两面分析代替与用户的真实 exchange；可以忠实复述用户已经给出的 defense。
- MUST NOT 对多条 Assertion 做清单式批判，或在一轮中倾倒多个 objections。
- Current position 确认后的首个实质回复 MUST 给出 `Opposing position`、一个 `Attack` 与对应 `Burden`，并给用户至少一次 defense 机会；只有不存在 credible material opposition 时，MUST 在开场明确 concession 并关闭为 `Survived`。
- `Survived | Revised | Defeated | Unresolved` 任一 `Disposition` 都关闭 bounded argue session；关闭后只有用户再次显式调用 `argue` 才能争辩 revised 或其他 Assertion。
- MUST NOT 在本 skill 未激活时显示 `Opposing position`、`Attack`、`Rebuttal`、argue `Disposition`、`🧭 Argue` primary marker 或 ` + Argue` suffix；其他 orientation skill 使用自己的 canonical marker。

## Effects

- Conversation: MAY 显示 `🧭 Argue`、`Aim`、`Assertion`、`Current position`、`Opposing position`、`Attack`、`Burden`、`Landed`、`Rebuttal`、`Concession` 与终局 `Disposition`。
- Filesystem: MAY 做必要的只读 evidence discovery；no writes。
- External: MAY 做必要的只读 evidence discovery；no mutations。

## Workflow

1. 显示 `🧭 Argue` primary marker line，并按实际生效的 explicit contributors 追加 suffix；读取 active Aim；没有时推测并显示最小 Working Aim，但不追加 ` + Aim`。固定 Aim snapshot，不修改 active Aim handle。
2. 绑定一条 Assertion；没有明确目标时推测最承重的一条，无法可靠推测时询问一个聚焦问题并等待。
3. 将 Assertion 规范为最强且忠实的 `Current position`；如果规范化会改变核心命题，先让用户确认。
4. Assertion 已绑定且 Current position 已确认后，寻找与它冲突的 strongest credible `Opposing position`。没有 credible material opposition 时，明确 `Concession` 并直接按第 9 步关闭为 `Survived`；否则选择当前最承重且未解决的一个 Attack。
5. 存在 credible material opposition 时，使用以下开场 envelope，然后停止并等待 Proponent：

```text
🧭 Argue
Aim: <current or inferred aim>
Assertion: <current position>
Opposing position: <strongest credible counter-position>
Attack: <one load-bearing challenge>
Burden: <what the proponent must establish>
```

6. 用户回应后，先显示 `Landed: <what the response actually established>`。回应未触及 Attack 时准确说明未解决处；不得虚构让步。
7. 当前 Attack 仍成立时，显示针对同一缺口的 `Rebuttal` 与下一步 `Burden`，然后等待。当前 Attack 被击破时，显示 `Concession`；仍存在另一项 material objection 时，解释转换原因并提出下一项 Attack；没有时 MUST 立即关闭为 `Survived`。
8. 需要 material evidence 时做最小只读调查；证据仍不可得或无法判定时关闭为 `Unresolved`，显示 decisive question、缺失证据与分支影响。
9. 只在以下条件之一成立时关闭，并记录而非宣称绝对真理：
   - `Survived`: Opponent 已 concession，当前 Aim、共享事实与已测试范围内没有剩余 material defeater；不表示 Assertion 已被证明为真。
   - `Revised`: Proponent 接受了改变核心命题的版本；MUST 显示 revised Assertion。
   - `Defeated`: Proponent 已 concession，或 Assertion 与共享事实或逻辑无法相容且没有未处理的 defense。
   - `Unresolved`: 判断取决于当前不可获得的 decisive evidence、Aim 已实质变化，或用户在没有 merits resolution 时结束；用户取消不产生 merits verdict。
10. 终局使用以下 envelope，说明哪些内容站住、失败以及仍未知什么，然后停止。终局发生在用户回应后时 MUST 包含 `Landed`；`Survived` MUST 包含 Opponent 的 `Concession`：

```text
🧭 Argue
Landed: <what the latest response established; omit only when there was no user response>
Concession: <opponent concession; required for Survived, otherwise omit>
Disposition: Survived | Revised | Defeated | Unresolved
Assertion: <final current position>
Survived: <what remains standing>
Failed: <what was conceded or defeated>
Remaining uncertainty: <none, decisive evidence boundary, Aim shift, or cancellation without merits resolution>
```

## References

- 无。

## Validation

Before done:

- active session 的每条回复第一行只含 primary `🧭 Argue` marker 和 materially effective、already-explicit contributor suffix，active Aim 或 Working Aim 清楚且 ownership 没有混淆；
- 只存在一条 Assertion，Proponent 与 Opponent 明确；存在 credible material opposition 时，strongest credible Opposing position 明确；
- 开场包含一个 load-bearing Attack 与对应 Burden，并给用户 defense 机会；
- 每个 continuation 直接处理上一轮回应，准确显示 Landed，再 rebut、concede 或关闭；
- 已解决 objection 没有重复，Attack 转换有明确原因，没有移动门柱或一轮倾倒多个 objections；
- opposition 与 Aim 相关且有可信支撑，没有制造疑点、虚假对等、弱反例或针对用户；
- terminal Disposition 只在声明的 closing condition 下出现，并准确区分 Survived、Revised、Defeated 与 Unresolved；
- Survived 没有被表述为真理或自动写入 baseline；
- 没有创建文件、durable artifact、formal goal 或 external mutation，也没有虚构事实、证据或共识。
