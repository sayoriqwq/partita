---
audience: agent
authors:
  - codex
reviewed_by: []
purpose: 作为 workflow theory 入口，帮助 agent 从个人交付流 gate 定位 case 和 pressure。
updated: 2026-06-26
---

# Workflow Theory

Workflow 是个人交付流。Gate 是交付流中的质量闸门。Gate contract 定义阶段资产、风险和 exit condition。Gate span 是 skill 在阶段型工作流上的生命周期投影。

本区域不定义 skill catalog。它定义 case 在工作流中的位置：一个真实 case 暴露的默认失败，到底阻断了哪个 gate。

## Documents

- [Gate Model](gate-model.md)：workflow gate、case、pressure、skill 的关系。
- [Gate Contract](gate-contract.md)：gate entry context、gate assets、pressure map、exit condition 和 handoff。
- [Gate Span](gate-span.md)：skill 从哪个 gate 激活、持续到哪个 gate 边界，以及为什么它不能替代 pressure。
- [Workflow Orchestration](orchestration.md)：orchestrator 如何识别 gate、调用 primitive skill，并避免吞掉 primitive 语义。

## Working Chain

```text
workflow -> gate -> case -> pressure -> minimal governance action -> skill
```

Gate 只能组织 pressure，不能替代 pressure。不能因为有 Research gate 就直接创建 research skill；必须先说明 Research gate 中哪个真实 case 暴露了哪个默认 agent 失败。

Gate contract 负责说明阶段资产和 exit condition。Skill validation 只验证某个治理动作是否正确生效，不能替代 gate exit condition。

Gate span 只能描述 skill 的生命周期，不能把一个 skill 扩展成多个 gate 的职责包。跨 gate 持续的 skill 仍然必须保持同一个治理动作。
