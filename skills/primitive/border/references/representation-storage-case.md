---
audience: agent
authors:
  - codex
reviewed_by: []
purpose: 记录 border 的 Representation 与 Storage 分层边界复发样例。
status: active
sources: []
updated: 2026-07-06
---

# Representation Storage Case

## Case

一次 canon 的 agent-memory 论文学习线程中，用户问：“为什么这里要分成两层，表示层和存储层有什么最核心的 border。”

agent 当时没有 `border` skill，但给出了一条高质量边界解释：`Representation` 决定 memory 对系统长成什么语义对象，`Storage` 决定这个对象怎么被持久化、索引和访问。随后用论文中的 logical representation / physical storage 定义、判别表、同一句 memory 的不同表达/存储例子，以及“不拆层会误判问题来源”的说明完成解释。

用户确认这个回答质量高，并要求作为 query record 保存。

## Failure

`border` 初版已经要求核心差别、判别测试和例子，但没有明确治理分层概念的输出形状。

`border` 允许 agent 把“核心 border”写成属性差异清单，或者只回答 A/B 各是什么，而没有说明二者在同一系统里的 responsibility axis、为什么要拆开、以及不拆开会造成什么误诊。

## Governance

当用户询问两个分层概念的核心 border 时，agent MUST 先给出二者的责任边界轴。

agent MUST NOT 把分层 border 降级成泛泛的相似点/不同点清单。

验证时 MUST 确认回复包含核心边界轴、判别测试，以及在需要时用同一个对象或场景分别展示 A 改变和 B 改变。
