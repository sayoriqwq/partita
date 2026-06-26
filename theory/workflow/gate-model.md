---
audience: agent
authors:
  - codex
reviewed_by: []
purpose: 定义 workflow gate 作为质量闸门的模型，并区分 gate exit condition 和 skill validation。
updated: 2026-06-26
---

# Gate Model

## Gate

Gate 是 workflow 中的质量闸门。

Gate 的意义不是“做一个任务”，而是在进入下一阶段前治理掉某类不确定性、结构风险或质量风险。

```text
gate = workflow 中的质量闸门
skill = 为了让 agent 稳定通过某个 gate 而引入的行为治理 primitive
```

Gate 不是 skill：

```text
Research gate != research skill
PRD gate != PRD skill
Kanban gate != issue skill
QA gate != QA skill
```

## Gate To Skill

从 gate 反推 skill 时，使用这个顺序：

```text
1. Define workflow
2. Define gates
3. Attach real cases to gate
4. Read pressure from cases
5. Design minimal governance action
6. Only then project to SKILL.md / hooks / verifier / CLI
```

更紧凑地说：

```text
workflow gate -> case -> pressure -> minimal governance action -> skill
```

## Exit Condition

Gate exit condition 比 skill validation 更上层。

Gate exit condition 定义这一阶段什么时候可以进入下一阶段。Skill validation 只验证某个治理动作是否正确执行。一个 gate 可以有多个 skill，但 gate 的 exit condition 不属于任何单个 skill。

Gate exit condition 应由 [Gate Contract](gate-contract.md) 说明：当前 gate 的
entry context、owned assets、pressure map 和 handoff 风险是否已经稳定。

## Activation

Gate context 可以帮助 skill activation 更稳定：

```text
activation = gate context + pressure match
```

这不取消 Codex 的 `description` 触发面，也不替代 `agents/openai.yaml` 的 invocation policy。它说明 skill matching 不应只看全局任务类别，而要看当前工作流 gate 上是否出现对应 pressure。

当需要一个入口来识别 gate、维护 gate assets 并调用 primitive skills 时，
使用 [Workflow Orchestration](orchestration.md)。不要把 orchestrator 的
workflow 组织职责合并进 primitive skill。

## Gate Span

当 skill 的持续范围需要绑定 workflow 阶段时，用 [Gate Span](gate-span.md) 表达。

Gate span 只是 lifecycle projection。它不决定 skill 是否成立，也不允许一个 skill 在不同 gate 中承担不同治理动作。跨 gate skill 必须遵守 [Governance Identity](../skill/governance-identity.md)。

## Example Gates

当前个人交付流的工作模型：

```text
Idea -> Research optional -> Prototype optional -> PRD -> Kanban -> Execution -> QA
```

这些是 gate，不是 skill 列表。每个 gate 下可能有多个 pressure；每个 pressure 才可能对应一个最小治理动作。
