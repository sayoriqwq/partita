---
name: expand
description: "Use when the user explicitly invokes expand to give concept A more source-grounded detail and context-fit examples for clearer explanation. Not for broad research, border comparison, summarization, rewriting, unsupported speculation, or implicit ordinary explanation."
---

# Expand

激活时，第一条用户可见行 MUST 以内联 `💬 expand` 开头。

## Rule

面对用户显式调用 `expand` 来把 concept A 解释得更清楚时，MUST 先标明扩展依据来自源材料、当前上下文、用户记忆还是 agent 推断，再给出贴合当前上下文和用户理解路径的例子，避免泛讲概念、把猜测伪装成来源、或给出脱离用户学习场景的通用例子。

## Pattern

Use when:

- the user explicitly invokes expand to give concept A more source-grounded detail and context-fit examples for clearer explanation.

Do not use when:

- broad research, border comparison, summarization, rewriting, unsupported speculation, or implicit ordinary explanation.

## Boundary

Soft:

- MUST 保持一个 primary concept A；如果有多个候选概念，先询问用户要展开哪一个。
- MUST 优先使用当前上下文中的源材料，例如代码片段、论文原文、文档段落、文件路径、当前浏览页面或用户刚刚引用的内容。
- MUST 区分 source-grounded content、context inference、user-memory fit 和 agent inference。
- MUST 在没有可验证源材料时明确说明“以下是基于当前上下文的推断”或等价说明。
- MUST 给出至少一个服务于 concept A 的 example；example SHOULD 优先来自当前上下文，其次来自仓库语境、用户长期偏好或已知学习路径。
- SHOULD 把原文或代码依据摘要化引入，而不是大段复制。
- SHOULD 让例子承担解释功能：展示 concept A 如何运作、为什么重要、何处容易误解，或如何在当前项目/论文/学习路径里落地。

Hard:

- When: 用户没有显式调用 `expand`。
  Do: MUST NOT 使用 `💬 expand` marker 或套用 `expand` 协议。

- When: 源头是代码、论文片段、文档或用户当前浏览材料。
  Do: MUST 优先基于该源头摘要扩展，并标明来源类型；不能把外部常识或 agent 推断写成源头内容。

- When: 内容来自 agent 推断、一般领域知识或用户记忆适配。
  Do: MUST 明确标注它不是直接源材料。

- When: 无法确定 concept A。
  Do: MUST 只问一个最小澄清问题，要求用户给出要 expand 的概念。

- When: `expand` 已激活并且 concept A 已确定。
  Do: MUST 返回一条 assistant message 完成展开，不能先输出计划或拆成多轮。

## Effects

- Conversation: MAY 展示 concept A 的 source-grounded expansion、来源标注、上下文推断、用户适配例子、最小澄清问题或不确定性边界。
- Filesystem: none.
- External: none.

## Workflow

1. 确认用户显式调用了 `expand`；否则不激活。
2. 从用户输入和当前上下文确定单一 concept A；不能确定时，只问一个最小澄清问题并停止。
3. 收集可用依据，并按优先级标注：直接源材料、当前上下文、仓库/项目语境、用户记忆或偏好、agent 推断。
4. 用第一段说明 concept A 需要补充的核心信息，并标明这一段依据来自哪里。
5. 如果有代码、论文、文档或实际片段，先用摘要形式引入原始依据；不要复制长段原文。
6. 展开 concept A 的关键结构、机制、边界或用途，只写能帮助解释清楚 concept A 的信息。
7. 给出贴合当前上下文的 example；如果当前上下文不足，再使用仓库语境、用户长期学习偏好或显式标注的 agent 推断例子。
8. 标出不确定性：哪些是源材料支持，哪些是为了帮助理解而作的类比、迁移或推断。

## References

- 无。

## Validation

Before done:

- 第一条用户可见行包含内联 `💬 expand`；
- `expand` 只在用户显式调用后使用；
- 回复只展开一个 primary concept A，或已只问一个最小澄清问题；
- 已标明关键内容的来源层级：源材料、当前上下文、用户记忆/偏好或 agent 推断；
- 源头是代码、论文或文档片段时，已用摘要形式引入，而不是把推断伪装成原文；
- 至少给出一个贴合当前上下文、仓库语境或用户理解路径的 example；
- 不确定性和 agent inference 已明确标注；
- 回复是一条 assistant message，没有先输出计划或拆成多轮；
- Effects 保持在声明的 filesystem 和 external scope 内；
- target runtime 或 landing 要求的 checks 已通过，或准确 blocker 已报告。
