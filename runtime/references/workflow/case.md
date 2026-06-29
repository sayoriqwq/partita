# Workflow Case

## Definition

`workflow case` 是证明一个 workflow skill 为什么需要存在的真实情境。

workflow case 关注多步骤推进如何失败，以及 workflow 应该如何 gate、routing、disclosure 和 stop。

## Minimum

```yaml
case:
  situation: 当时发生了什么
  workflow_default_failure: agent 无 workflow 治理时会怎样失败
  gate_pressure: 哪些阶段判断会失败或缺失
  routing_pressure: 哪些内部 skill、步骤或子流程会误用、漏用或乱序
  disclosure_pressure: 哪些过程、状态或结果会错误展示或隐藏
  orchestration_action: workflow 应该怎样改变 agent 行为
```

## Rules

- `workflow_default_failure` 是没有 workflow 治理时，多步骤推进的自然失败形态。
- `gate_pressure` 说明进入、继续、停止、转交或打回的判断为什么需要治理。
- `routing_pressure` 说明内部 skill、步骤或子流程为什么需要明确路由。
- `disclosure_pressure` 说明用户可见信息和内部过程为什么需要边界。
- 任何最小字段不可读时，材料不足。
- 材料不足时，MUST 打回，并列出最小缺失字段。
- agent MUST NOT 编造 workflow case、gate logic、routing 或 disclosure boundary。
