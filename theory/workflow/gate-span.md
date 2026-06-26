---
audience: agent
authors:
  - codex
reviewed_by: []
purpose: 定义 gate_span 作为 skill 在 workflow 上的生命周期投影，而不是 skill 成立理由。
updated: 2026-06-26
---

# Gate Span

## Definition

`gate_span` 描述 skill 激活后在 workflow 中持续到哪里。

它是 duration 在阶段型工作流中的投影，不是 skill 的本体，也不是 skill 成立的理由。Skill 仍然必须从 real case 中读出 pressure，再定义最小治理动作。

```yaml
gate_span:
  from: prd
  until: qa_exit
```

`until` 可以是 gate boundary，也可以是明确 close condition：

```yaml
gate_span:
  from: current_gate
  until: aim_closed
```

## Scope

Gate span 只回答生命周期问题：

```text
这个 skill 从哪个 gate 起有资格激活？
一旦激活，它持续到哪个 gate 边界？
如果不是固定 gate 边界，什么 close condition 会结束它？
在哪些 gate 内它仍然施加同一个治理动作？
```

Gate span 可以被 workflow orchestrator 管理，但不能被 orchestrator 改写成
新职责。Orchestrator 只能决定某个 primitive skill 在当前 workflow 中
是否仍然处于有效生命周期。

Gate span 不回答：

```text
这个 skill 是否应该存在？
这个 gate 是否可以 exit？
这个 skill 是否可以把多个 gate 的不同职责合并到一起？
```

## Validation Split

Gate span 不改变 validation 的归属。

```text
skill_validation:
  这个 skill 是否正确治理了它负责的 pressure？

gate_exit_condition:
  这个 gate 是否满足进入下一阶段的条件？
```

`skill_validation` 可以支持 `gate_exit_condition`，但不能定义它。

Gate exit condition 的完整归属见 [Gate Contract](gate-contract.md)。

## Descriptive Classes

下面三类只是描述标签，不是 skill 本体分类：

- `gate-local`: 只在一个 gate 内持续。
- `gate-bridging`: 从一个 gate 的产物延续到下一个 gate，防止阶段转换时丢失语义。
- `cross-gate guard`: 跨多个 gate 持续施加同一个上层约束。

不要从这些标签反推 skill catalog。任何 skill 仍然必须遵循：

```text
case -> pressure -> minimal governance action -> skill
```

如果一个 cross-gate guard 在不同 gate 需要不同治理动作，按 [Governance Identity](../skill/governance-identity.md) 拆分 skill，并用 `pressure_family` 或 tag 关联。
