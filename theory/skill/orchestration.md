---
audience: agent
authors:
  - codex
reviewed_by: []
purpose: 区分 primitive skill 和 orchestrator skill，防止 workflow 组合被误建模成巨大 primitive。
updated: 2026-06-26
---

# Orchestration

## Primitive And Orchestrator

Partita 理论区分两种 skill 角色：

```text
primitive skill:
  针对一个 pressure 的最小治理动作

orchestrator skill:
  暴露给用户，识别 workflow gate，并组合 primitive skills
```

在 Codex 投影中，二者都可以是 `SKILL.md`。但理论上必须区分：orchestrator 不是一个巨大 primitive，也不能把多个 primitive 的 pressure、workflow 和 validation 合并成自己的本体。

## Primitive Skill

Primitive skill 的成立条件仍然是：

```text
case -> pressure -> minimal governance action -> skill
```

它只负责治理自己的 pressure。它的 validation 也只验证这个治理动作是否正确发挥作用。

默认情况下，primitive skill 不应全局隐式触发。它可以通过下面三种方式启用：

```text
1. 用户显式调用
2. orchestrator skill 在对应 gate / pressure 下调用
3. 少数低副作用、低冲突 guard 在精确 gate context 下隐式触发
```

全局隐式触发只适合极稳定、低副作用、低冲突的 guard。强约束、强收束或会改变协作模式的 primitive skill 应默认关闭全局隐式触发。

## Orchestrator Skill

Orchestrator skill 的职责是组织 workflow，而不是直接承载多个治理动作。

它可以：

- 暴露给用户作为入口；
- 识别当前 gate；
- 判断当前 gate 中出现了哪些 pressure；
- 显式调用 primitive skill；
- 管理 primitive skill 的 `gate_span` 和 close condition；
- 汇总 gate exit condition。

它不应该：

- 把多个 primitive skill 写成一个大 workflow body；
- 代替 primitive skill 定义 pressure；
- 代替 primitive skill 做 validation；
- 用 gate 名称反推 skill catalog。

从 workflow 视角看，orchestrator 的 gate 识别、asset 维护和 primitive 调用
关系见 [Workflow Orchestration](../workflow/orchestration.md)。本文件只定义
orchestrator 作为 skill 角色时与 primitive 的边界。

## Invocation Policy

推荐调用策略：

```yaml
primitive_skill:
  allow_implicit_invocation: false
  callable_by:
    - orchestrator
    - explicit_user

orchestrator_skill:
  allow_implicit_invocation: true
  exposes:
    - workflow
    - gates
  may_call:
    - primitive_skill
```

`allow_implicit_invocation: true` 不是 orchestrator 的必选项，但它更适合暴露给用户自然语言入口。Primitive skill 默认不全局隐式触发，可以减少触发冲突、上下文过载和多个 skill 抢主导权。

## Aim And Land

`aim` 和 `land` 应拆成两个 primitive guard：

| skill | pressure | minimal governance action | gate relation | duration |
| --- | --- | --- | --- | --- |
| `aim` | 目标漂移、讨论扩散 | 维护当前主目标，并要求后续动作回扣 aim | workflow-level cross-gate guard | `until aim_closed / aim_replaced / workflow_exit` |
| `land` | 落地拖延、持续解释扩张 | 压缩到第一个可落地闭环，并优先推进闭环完成 | v1-closure guard, commonly `Prototype -> Kanban -> Execution` | `until first_loop_closed` |

二者不适合全局隐式触发。`aim` 可能过度压住探索；`land` 可能过早收束。更稳的方式是由 orchestrator 在对应 gate 和 pressure 下启用，或由用户显式调用。
