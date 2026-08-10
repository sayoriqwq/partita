---
name: border
description: "Use when the user explicitly invokes border to separate two concepts by their core difference, either inferred from context or named by the user. Not for broad compare-and-contrast, taxonomy surveys, analogy writing, debate, or implicit concept explanation."
---

# Border

当 `border` owns 当前 response 时，每条用户可见回复的第一行 MUST 只包含 `💬 Border` 与可选的 ` + <Display Name>` suffix；suffix 只列出实质改变该回复的其他已显式激活/共同调用 skill，不改变 ownership，active-but-inert skill 与 local contract projection MUST 省略，其他内容从第二行开始。多个 co-invoked skill 争夺 ownership 且 precedence 未确定时，MUST 在激活前只问一个不带 skill marker 的最小 owner 问题。

## Rule

面对用户显式调用 `border` 来区分两个概念时，MUST 先确定 concept A 和 concept B，再用一条消息画出二者的核心边界，避免把概念差异稀释成泛泛的 compare-and-contrast、百科式说明或不必要的澄清轮次。

## Pattern

Use when:

- the user explicitly invokes border to separate two concepts by their core difference, either inferred from context or named by the user.

Do not use when:

- broad compare-and-contrast, taxonomy surveys, analogy writing, debate, or implicit concept explanation.

## Boundary

Soft:

- MUST 优先使用用户显式给出的两个概念；只有用户未给出时，才从当前上下文推断。
- MUST 保持 exactly two concepts；如果出现多个候选概念，先询问用户要隔开哪两个。
- MUST 先给出核心 border，再补充为什么容易混淆、如何快速判别、必要例子或边界条件。
- MUST 把相似点、背景和展开解释放在核心边界之后，且只保留服务于 border 的内容。
- MUST 把核心 border 写成二者的 responsibility axis、governance axis 或 conceptual role axis，而不是罗列属性差异。
- SHOULD 在用户问“为什么要分成两层/两类/两块”时，说明不画 border 会导致哪类误诊、误归因或错误治理。
- SHOULD 使用同一个对象或同一个场景分别改变 A 和 B，证明二者边界确实不同。
- SHOULD 使用 `A | B`、`A vs B` 或清晰分段让边界可见，但不要为了格式牺牲准确性。

Hard:

- When: 用户没有显式调用 `border`。
  Do: MUST NOT 使用 `💬 Border` marker 或套用 `border` 协议。

- When: 用户显式给出了两个概念。
  Do: MUST 使用用户给出的概念，不能替换为 agent 自己推断的 pair。

- When: 无法从用户显式输入或当前上下文确定 exactly two concepts。
  Do: MUST 只问一个最小澄清问题，要求用户给出要隔开的两个概念。

- When: `border` 已激活并且两个概念已经确定。
  Do: MUST 返回一条 assistant message 完成边界解释，不能拆成多轮或先输出计划。

## Effects

- Conversation: MAY 展示一条概念边界解释、推断出的 A/B、最小澄清问题、判别测试或必要例子。
- Filesystem: none.
- External: none.

## Workflow

1. 确认用户显式调用了 `border`；否则不激活。
2. 从用户输入中优先提取显式 A/B；若没有显式 A/B，则从当前上下文推断最相关的两个概念。
3. 如果不能确定 exactly two concepts，输出一条最小澄清问题并停止。
4. 用第一句给出核心 border：A 的关键身份、B 的关键身份，以及二者真正分开的轴。
5. 当概念来自论文、文档、代码或用户正在看的材料时，先基于该材料的定义或当前上下文作答；不要把外部常识伪装成来源原意。
6. 给出一个可复用的判别测试：如果改变的是 X，归 A；如果改变的是 Y，归 B。
7. 解释为什么二者容易混淆，以及不拆开会造成的最小误诊或误归因。
8. 只在有助于边界时补充例子、反例或边界条件；优先使用同一个对象分别展示 A 变了但 B 未变、或 B 变了但 A 未变；不要扩展成完整综述。

## References

- 修补 `Representation` / `Storage` 这类分层边界输出时，MUST 参考 [representation-storage case](references/representation-storage-case.md)。

## Validation

Before done:

- 每条 `border`-owned 用户可见回复的第一行仅为 `💬 Border`，或在其他已显式且 materially active skill 存在时为 `💬 Border + <Display Name>`；marker 行没有 status 或 payload，active-but-inert skill 未进入 suffix；
- `border` 只在用户显式调用后使用；
- 已优先尊重用户显式给出的两个概念；
- 如果从上下文推断 A/B，推断依据在回复中可见；
- 回复只处理 exactly two concepts，或已只问一个最小澄清问题；
- 核心 border 出现在相似点、背景、例子和展开解释之前；
- 核心 border 使用了边界轴，而不是属性清单；
- 如果用户问为什么要分成两层、两类或两块，已说明不拆 border 会造成的误诊或误归因；
- 回复是一条 assistant message，没有先输出计划或拆成多轮；
- Effects 保持在声明的 filesystem 和 external scope 内；
- target runtime 或 landing 要求的 checks 已通过，或准确 blocker 已报告。
