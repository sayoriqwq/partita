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

## Rules

- workflow skill MUST 有自己的 governance rule。
- workflow skill MUST NOT 变成松散的 internal skills bundle。
- workflow skill MUST 先定义 gate logic，再定义 internal routing。
- workflow skill MUST 定义什么展示给用户，什么保持 internal。
- workflow skill MUST 定义完成前可检查的 validation。
- 无法识别 evidence、workflow default failure、至少一个 workflow pressure、recognition surface 或 orchestration action 的材料 MUST 被打回。
- agent MUST NOT 编造 workflow case、evidence、gate logic、internal routing、disclosure boundary、recognition surface 或 A/Y/X。
