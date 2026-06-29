# Workflow Creation

## Definition

`workflow creation` 是根据真实 workflow case 创建一个对用户暴露的 workflow skill。

workflow skill 不是多个 internal skills 的松散集合。

## Workflow Case

`workflow case` 是证明一个 workflow skill 为什么需要存在的真实情境。

workflow case 关注多步骤推进如何失败，以及 workflow 应该如何 gate、routing、disclosure 和 stop。

最小 workflow case：

```yaml
case:
  situation: 当时发生了什么
  workflow_default_failure: agent 无 workflow 治理时会怎样失败
  gate_pressure: 哪些阶段判断会失败或缺失
  routing_pressure: 哪些内部 skill、步骤或子流程会误用、漏用或乱序
  disclosure_pressure: 哪些过程、状态或结果会错误展示或隐藏
  orchestration_action: workflow 应该怎样改变 agent 行为
```

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
- 无法识别 workflow default failure、gate logic、routing 和 disclosure boundary 的材料 MUST 被打回。
- agent MUST NOT 编造 workflow case、gate logic、internal routing、disclosure boundary 或 A/Y/X。
