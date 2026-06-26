---
audience: agent
authors:
  - codex
reviewed_by: []
purpose: 定义 skill 治理动作同一性，防止跨 gate skill 退化成多职责行为包。
updated: 2026-06-26
---

# Governance Identity

## Rule

Skill 的治理动作必须保持同一性。

Skill 的同一性由 `minimal governance action` 决定，不由 pressure 名字、pressure family、gate 名称、任务类型或 runtime 文件名决定。

一个 skill 可以跨多个 workflow gate 持续生效，但它不能在不同 gate 中承担不同治理职责。如果跨 gate 后需要不同治理动作，就应该拆成多个 skill，并用同一个 `pressure_family` 或 tag 关联。

```text
allowed:
  one pressure -> one minimal governance action -> one skill -> optional gate_span

not allowed:
  one pressure family -> many gate-specific governance actions -> one large skill
```

更短地说：

```text
Skill identity = minimal governance action identity
```

## Why

Skill 是最小治理动作，不是工作流阶段包。

如果一个 skill 在 PRD gate 负责捕获架构约束，在 Kanban gate 负责检查 ticket 边界，在 Execution gate 负责阻止代码越界，在 QA gate 负责生成回归检查项，那么它已经不是一个治理动作，而是一组相关治理动作。把它们合进一个 skill 会让 trigger、boundary、workflow、validation 和 care loop 都变宽。

同一个 pressure 可以派生多个 skill。同一个 pressure family 可以覆盖多个 gate。一个 gate 可以挂多个 pressure。一个 pressure 也可以横跨多个 gate，但横跨后通常会按治理动作拆成多个 skill。

## Split Rule

遇到跨 gate 行为时，先问：

```text
这个 skill 在每个 gate 中改变的是同一个默认失败吗？
这个 skill 在每个 gate 中施加的是同一个治理动作吗？
这个 skill 的 validation 能否用同一组标准判断？
```

如果答案不是稳定的“是”，就拆分。

如果只是作用对象变化，而治理动作、边界和 validation 仍然保持稳定，可以保留同一个 skill。例如 source tiering 可以从 Research 持续到 PRD，前提是它始终只做一件事：给关键结论保留来源等级。

如果后续开始根据 source tier 改写 PRD confidence、implementation risk 或验收策略，就已经变成新的治理动作，应拆成新的 skill。

拆分后的 skill 可以共享同一个上层标记：

```yaml
pressure_family: architecture_constraint_drift
skills:
  - prd_architecture_constraint_capture
  - kanban_architecture_constraint_ticket_guard
  - execution_architecture_constraint_guard
  - qa_architecture_regression_plan
```

`pressure_family` 或 tag 只负责说明 lineage，不替代每个 skill 自己的 case、pressure、boundary、workflow 和 validation。

## Identity Boundaries

不要用下面这些东西决定 skill 同一性：

```text
skill identity != task category
skill identity != gate name
skill identity != pressure family
skill identity != runtime file name
```

允许的关系是：

```text
one pressure -> one or more skills
one pressure_family -> multiple related skills
one gate -> multiple pressures
one pressure across gates -> split when governance action changes
one skill -> one stable minimal governance action
```

## Cross-Gate Skills

Cross-gate skill 仍然可以成立，但必须满足治理动作同一性。

例如，一个 architecture constraint guard 可以从 PRD 持续到 QA，前提是它始终做同一件事：阻止 agent 为了局部推进而违反已接受的架构约束。它可以在不同 gate 读取不同产物，但不能在不同 gate 变成捕获约束、拆 ticket、写代码、设计 QA 的混合包。

```text
same governance action across gates -> one skill with gate_span
different governance actions by gate -> multiple skills linked by pressure_family/tag
```
