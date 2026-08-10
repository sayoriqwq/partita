---
name: expand
description: "Use when the user explicitly invokes expand to clarify one concept with a concrete example. Not for broad research, comparison, summarization, rewriting, unsupported speculation, or implicit ordinary explanation."
---

# Expand

激活时，第一条用户可见行 MUST 以内联 `💬 expand` 开头。

## Rule

面对用户显式要求把一处模糊、抽象或不讲人话的 concept A 展开时，MUST 使用 context-fit example 建立具体理解，再把 example 映射回原表达并提炼 plain-language point，避免用更多抽象词重复同一句话。

## Pattern

Use when:

- the user explicitly invokes expand to clarify one concept with a concrete example.

Do not use when:

- broad research, comparison, summarization, rewriting, unsupported speculation, or implicit ordinary explanation.

## Boundary

Soft:

- MUST 保持一个 primary concept A；优先选择用户直接指向或上一条 agent 回复中最小的 unclear unit，只有存在多个 materially different candidates 时才问一个最小澄清问题。
- MUST 使用以下 explanation model，并省略不需要的 `Boundary`：
  - `Example`: 给出当前上下文中的具体 actors、input、action 与 result；不能只换词复述 abstraction。
  - `Mapping`: 明确指出 example 中的 material parts 分别对应 concept A 的哪些 term、relation 或 mechanism。
  - `Point`: 用 plain language 说明 concept A 真正表达什么，以及它对当前理解或动作意味着什么。
  - `Boundary`: example 是 analogy、只覆盖部分机制或可能诱发错误类推时，说明它在哪里停止成立。
- Example MUST 优先来自当前 conversation、用户刚刚引用的 artifact 或 workspace 语境；这些都不足时 MAY 使用清楚标为 hypothetical 的最小例子。
- MUST 保持 semantic invariance；术语无法删除时，MUST 在首次出现处立刻用普通语言解释。
- source、context inference 与 agent inference 的界线 MUST 保持准确，但只有其 factual status 会影响用户理解或信任时才需要显式标注。
- SHOULD 让一个例子承担主要解释工作；只有第一个例子无法覆盖 material distinction 时才增加第二个。

Hard:

- When: 用户没有显式调用 `expand`。
  Do: MUST NOT 使用 `💬 expand` marker 或套用 explanation model。

- When: 无法确定 concept A。
  Do: MUST 只问一个最小澄清问题并停止。

- When: example 来自 analogy、hypothesis 或 agent inference。
  Do: MUST NOT 把它写成 source evidence、历史事实或用户已经接受的 premise。

- When: `expand` 已激活并且 concept A 已确定。
  Do: MUST 在一条 assistant message 中完成解释，不得先输出计划、启动 research、替用户做 downstream decision 或继续原始任务。

## Effects

- Conversation: MAY 显示 concept A 的 Example、Mapping、Point、必要 Boundary、最小澄清问题或 inference label。
- Filesystem: none.
- External: none.

## Workflow

1. 确认用户显式调用了 `expand`；否则不激活。
2. 从用户指向与 immediately preceding context 确定一个最小 concept A；无法唯一确定时只问一个最小问题并停止。
3. 选择最贴近当前上下文的 concrete example；没有直接实例时创建并标明 hypothetical example。
4. 写出 `Example`，让 actors、input、action 与 result 足够具体，使用户无需先理解原 abstraction。
5. 写出 `Mapping`，逐项连接 example 与 concept A 的 material terms、relations 或 mechanism。
6. 写出 `Point`，用普通语言收束 concept A 对当前上下文的实际含义。
7. 只有 example 可能误导时追加 `Boundary`；完成后停止。

```text
💬 expand
Example: <context-fit concrete example>
Mapping: <example parts → concept A>
Point: <plain-language meaning>
Boundary: <only when the example could mislead>
```

## References

- 无。

## Validation

Before done:

- 第一条用户可见行包含内联 `💬 expand`；
- `expand` 只在用户显式调用后使用；
- 回复只解释一个最小 concept A，或已只问一个最小澄清问题；
- `Example` 具体且贴合当前 context，不是抽象改写；
- `Mapping` 已把 material example parts 映射回 concept A；
- `Point` 使用普通语言并说明当前意义；
- analogy、hypothesis 或 inference 没有被冒充为 source evidence；
- `Boundary` 只在可能误导时出现；
- 回复是一条 assistant message，没有启动 research、替用户决策或继续原始任务；
- 没有创建 filesystem 或 external state。
