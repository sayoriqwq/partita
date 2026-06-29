# Skill Case

## Definition

`skill case` 是证明一个单一 skill 为什么需要存在的真实情境。

skill case 关注一个复发的 agent 行为问题，以及一个 skill 应该怎样改变该行为。

## Minimum

```yaml
case:
  situation: 当时发生了什么
  default_failure: agent 无 skill 治理时会怎样失败
  pressure: 为什么这个失败值得被 skill 固化治理
  governance_action: skill 应该怎样改变 agent 行为
```

## Rules

- `default_failure` 是没有该 skill 时 agent 的自然错误行为。
- `pressure` 是该错误为什么会复发、产生代价或污染后续上下文。
- `governance_action` 是 skill 对 agent 行为施加的最小改变。
- 任何最小字段不可读时，材料不足。
- 材料不足时，MUST 打回，并列出最小缺失字段。
- agent MUST NOT 编造 skill case、pressure 或 governance action。

## Reject

```md
材料不足，不能继续创建 skill。

缺少：
- <missing field>

请补<最小补充材料>。
```
