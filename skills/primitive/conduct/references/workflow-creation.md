# Workflow Creation

## Definition

`workflow creation` 是根据 evidence-anchored workflow case 创建一个对用户暴露的 workflow skill。

workflow skill 不是多个 internal skills 的松散集合。

## Workflow Case

`workflow case` 是用于创建 public workflow skill 的 evidence-anchored governance sample。

workflow case 关注多步骤推进如何失败，以及 workflow 应该如何 gate、routing、disclosure 和 stop。

最小 workflow case：

```yaml
case:
  kind: workflow
  evidence:
    source: stable material pointer
    note: optional minimal excerpt or description
  situation: 真实发生或由材料直接证明的情境
  default_failure: agent 无 workflow 治理时会怎样失败或漂移
  workflow_pressure:
    gate: 哪些阶段判断会失败或缺失
    routing: 哪些内部 skill、步骤或子流程会误用、漏用或乱序
    disclosure: 哪些过程、状态或结果会错误展示或隐藏
  recognition:
    triggers:
      - future signal that should recall this case
    non_triggers:
      - optional boundary that should not recall this case
  orchestration_action: workflow 应该怎样改变 agent 行为
```

`workflow_pressure.gate`、`workflow_pressure.routing` 和 `workflow_pressure.disclosure` 至少一个 MUST 成立；agent MUST NOT 为了填字段编造不存在的 pressure。

## Terms

`workflow A/Y/X` 是 workflow rule 的压缩形态：面对 A，先做 Y，避免 X。

`gate logic` 是 workflow 在每个阶段判断是否进入、继续、停止、转交或打回的规则。

`internal skill routing` 是 workflow 选择内部 skill、步骤或子流程的规则。

`disclosure boundary` 是 workflow 对用户展示多少内部过程、判断、状态和结果的边界。

`public workflow skill` 是用户可直接调用的 workflow runtime skill。

## Roles

- `state primitive` 定义 bounded state、合法 transition、reset/terminal condition 与 scope。显式调用创建或改变 handle；后续读取或约束属于已建立 state 的 continuation，不是 implicit invocation。
- `protocol primitive` 定义一个 bounded transformation、classification 或 judgment contract，包括 input、output、effect ceiling 与 stop condition。
- `public workflow` owns 用户请求的 Aim、gate order、component routing、primary marker/envelope、effect budget、disclosure 与 termination。
- `router` 是 public workflow 的一个 sub-role：它选择 destination 或 component，但仍必须遵守 workflow ownership。
- `internal` 描述 composition responsibility，不自动表示 hidden、model-invoked 或可绕过用户 invocation policy。

Partita family 与 runtime role 正交。一个 skill 位于 `orientation`、`expression`、`link`、`maintenance` 或 `primitive`，不能单独证明它是 state、protocol 或 workflow。

## Composition Contract

workflow 组装 primitive 时，MUST 为每个 component 明确：

- `Input`: workflow 提供或读取的 state/evidence；
- `Transition`: component 改变、分类或投影什么；
- `Output`: 返回给 workflow 的 typed result；
- `Effects`: component 的 effect ceiling，MUST NOT 扩大 workflow authority；
- `Termination`: component 在什么 observable condition 下结束；
- `Disclosure`: 哪些 state/result 对用户可见。

composition 只允许一个 outer owner：

- public workflow owns primary marker、response envelope、mutation effects 与 final termination；owner 保持 marker 第一位，并且是唯一 envelope/effects/termination owner；
- state/protocol primitive 在被组装时贡献 contract，不竞争 top-level output ownership；
- active state 必须来自用户先前显式创建的 handle，或由当前 workflow 明确声明为 workflow-local state；
- explicit-only public skill MUST NOT 被另一个 skill 自动激活。组合它的语义时，只能读取已经 active 的 state、处理用户显式 co-invocation，或把必要且自包含的 contract 投影进 owning workflow；
- 只有实质改变本次回复的其他已显式激活/共同调用 skill 才以 ` + <Display Name>` 追加在 marker-only 第一行；active 但未实质参与的 skill MUST 省略；
- local contract projection 是 owning workflow 的自包含本地合约，MUST NOT 声称、显示或标记为另一个 public skill；
- 多个显式调用都要求 outer ownership 且没有确定 precedence 时，MUST 在激活任何 candidate、显示 marker 或产生 effects 前，只问一个不带 skill marker 的最小 owner 问题；
- component failure、blocked state 与 uncertainty MUST 回到 owning workflow 的 gate，不得被吞掉或改写成成功。

## Rules

- workflow skill MUST 有自己的 governance rule。
- workflow skill MUST NOT 变成松散的 internal skills bundle。
- workflow skill MUST 先定义 gate logic，再定义 internal routing。
- workflow skill MUST 先确定 outer owner，再定义每个 component 的 Input、Transition、Output、Effects、Termination 与 Disclosure。
- workflow skill MUST 定义什么展示给用户，什么保持 internal。
- workflow skill MUST 定义完成前可检查的 validation。
- workflow skill MUST NOT 把 explicit-only public skill 当作可自动调用的 internal dependency。
- 无法识别 evidence、workflow default failure、至少一个 workflow pressure、recognition surface 或 orchestration action 的材料 MUST 被打回。
- agent MUST NOT 编造 workflow case、evidence、gate logic、internal routing、disclosure boundary、recognition surface 或 A/Y/X。
