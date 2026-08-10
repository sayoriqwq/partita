
---
audience: agent
authors:
  - codex
reviewed_by: []
purpose: 说明 case-rooted skill 创建或修补在材料不足时如何打回。
updated: 2026-07-07
---

# 材料不足

## 核心规则

case-rooted skill 工作在材料不足时 MUST 打回，MUST NOT 生成草案。

材料不足包括：

- 没有真实发生或材料直接证明的 case。
- 没有 evidence anchor。
- 不能读出 case kind 或 case pattern。
- 不能读出 default failure。
- 不能读出 pressure。
- 不能读出 recognition surface。
- 不能读出 governance action。
- 不能判断目标 skill 类型或目标已有 skill。

## 打回模板

```md
🎼 <Display Name>

材料不足，不能<目标动作>。

缺少：
- <missing item>
- <missing item>

请补<最小补充材料>。
```

## 使用规则

- MUST 明确说明当前不能继续。
- MUST 列出具体缺失项。
- MUST 只询问最小补充材料。
- MUST NOT invent case、pressure、workflow、routing 或 A/Y/X。
- MUST NOT 输出占位草案、假设方案或“先这样写”的 skill。

## 最小 case 字段

```yaml
case:
  kind: skill | workflow | patch | feedback
  evidence:
    source: 可审计的稳定材料来源
  situation: 真实发生或由材料直接证明的情境
  default_failure: agent 无目标治理时实际怎样失败或漂移
  pressure: 为什么该失败值得治理
  recognition:
    triggers:
      - 未来应该召回该 case 的信号
  governance_action: 目标治理应改变 agent 行为的介入点
```
