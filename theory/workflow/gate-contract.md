---
audience: agent
authors:
  - codex
reviewed_by: []
purpose: 定义 workflow gate 的 contract、assets、exit condition 和 handoff 边界。
updated: 2026-06-26
---

# Gate Contract

## Contract

Gate 是 workflow 中的质量闸门。Gate contract 定义这一阶段必须稳定下来的
内容，以及进入下一阶段前不能继续悬空的风险。

一个 gate contract 至少包含：

```text
entry context:
  进入这个 gate 时已经接受的输入、约束或上游资产

owned assets:
  这个 gate 负责产出、修订或保护的材料

pressure map:
  真实 case 在这个 gate 暴露了哪些默认 agent 失败

exit condition:
  什么条件满足后可以进入下一 gate
```

Gate contract 不是 skill。它只定义 workflow 阶段责任。

## Gate Assets

Gate asset 是阶段推进时需要保留的语义材料。

例：

```text
Idea:
  seed desire, rejected alternatives, framing constraint

Research:
  question tree, source tier, uncertainty map

Prototype:
  executable slice, observed tradeoff, discarded path

PRD:
  accepted scope, non-goal, domain decision, success criterion

Kanban:
  vertical slice, dependency order, acceptance check

Execution:
  changed surface, preserved constraint, verification evidence

QA:
  regression scenario, release risk, remaining gap
```

这些 assets 不自动属于某个 skill。Skill 可以保护、读取或更新 gate asset，
但只有当真实 case 暴露默认失败压力时，才需要引入 skill。

## Exit Condition

Gate exit condition 比 skill validation 更上层。

```text
skill validation:
  某个治理动作是否在本次正确生效

gate exit condition:
  当前阶段是否已经足够稳定，可以进入下一阶段
```

一个 gate 可以使用多个 skill 的 validation 作为 evidence，但 exit condition
不能被任何单个 skill 独占。Exit condition 应围绕 gate asset 和阶段风险
表达，而不是围绕某个 skill 是否运行表达。

## Case Attachment

Case attach to gate 的作用是定位失败发生在 workflow 的哪里。

```text
gate -> real case -> pressure -> minimal governance action
```

不要从 gate 名字直接反推出 skill：

```text
Research gate != research skill
PRD gate != PRD skill
Kanban gate != issue skill
```

同一个 gate 可以挂多个 pressure；同一个 pressure 也可以跨多个 gate 持续。
但 skill identity 仍然由 minimal governance action 决定。

## Optional Gates

Workflow gate 可以是 optional，但 optional 不等于语义缺失。

跳过一个 gate 时，agent 需要判断下游 gate 是否仍然需要该 gate 通常产出的
assets。如果需要，这些 assets 必须由用户提供、由已有材料补足，或在当前
gate 内显式降级处理。

这仍然不是新增 skill 的理由。只有跳过或压缩 gate 的真实 case 暴露了默认
agent 失败压力，才进入 skill design。

## Handoff

Gate handoff 最容易发生 projection loss：上游接受的约束、排除项、证据等级
或风险在下游被 agent 默默丢失。

Cross-gate guard 可以保护 handoff，但必须保持同一个治理动作。如果 handoff
在不同 gate 需要捕获、拆分、执行、验证等不同动作，应拆成多个 skill，并
用 `pressure_family` 或 tag 关联。
