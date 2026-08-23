# Workflow Creation

## Definition

`workflow creation` 根据 evidence-anchored case 创建一个对用户暴露的 Workflow Skill。

所有 Skills 共享 `Skill<A, B> = A -> Effect<B>` 语义。Primitive 的 implementation 不调用 Skill；Workflow 的 implementation 调用一个或多个 predeclared Skills。这是唯一 classifier：大小、步骤数、阶段、分支、本地 state/protocol、router/controller shape 与 source family 都不决定 identity。

## Workflow Case

`workflow case` 是能证明 Skill composition 必要性的 evidence-anchored governance sample。

最小 workflow case：

```yaml
case:
  kind: workflow
  evidence:
    source: stable material pointer
    note: optional minimal excerpt or description
  situation: 真实发生或由材料直接证明的情境
  default_failure: agent 无 composition governance 时会怎样失败或漂移
  workflow_pressure: 为什么一个 Skill 必须组合一个或多个独立 Skills
  recognition:
    triggers:
      - future signal that should recall this case
    non_triggers:
      - optional boundary that should not recall this case
  orchestration_action: Workflow 应该怎样改变 agent 行为
  components:
    - predeclared Skill identity
```

`components` MUST 是 nonempty、closed、finite set。agent MUST NOT 为了制造 Workflow 身份而编造 component 或 composition pressure；没有 Skill call 的 case 属于 Primitive creation。

## Composition Contract

- top-level Workflow invocation 保持 explicit-only；显式调用 Workflow 后调用 declared component 是 composition，不是 component 的 top-level implicit invocation；
- Workflow 只能调用 predeclared component set 中的 Skill，不得 ad hoc discovery；
- runtime branch MAY 根据 typed output 选择 declared component，但不得引入 selector 或 router；
- 每个 component 都以 typed input/output 或 Effect Requirements 与 caller 连接；不得使用 hidden ambient coupling；
- component 在声明 scope 内执行自己的 Effect，typed failure 默认返回 caller；只 recover 明确可恢复的 typed error；
- outer Workflow 保留 overall outcome、primary marker、response envelope、effect authority/policy、termination 与 next-step decision；
- retry、timeout、concurrency 与 interruption 使用 native Effect semantics；资源 cleanup 仅在真实资源需要时使用相应 native scope；
- 多个显式调用的 top-level Skills 都要求 outer ownership 且 precedence 未确定时，在产生 effects 前只问一个不带 skill marker 的最小 owner 问题。

source family 只组织 Partita source，与 Primitive/Workflow classifier 正交。

## Rules

- Workflow MUST 有自己的 governance rule 和 nonempty closed predeclared component set。
- Workflow MUST 通过 typed seams 组合 components，并保留 outer ownership。
- Workflow MUST 定义完成前可检查的 validation。
- 无法识别 evidence、default failure、composition pressure、recognition surface、orchestration action 或 component set 的材料 MUST 被打回。
- agent MUST NOT 编造 workflow case、evidence、components、recognition surface 或 composition behavior。
- 普通 local/approval/phase gates 是 implementation predicates；它们不决定 Primitive/Workflow identity。
