# Skill Creation

## Definition

`skill creation` 是根据真实 skill case 创建一个可触发、可执行、可验证的 runtime skill。

`notate` 只处理单一 skill creation。

workflow skill creation 属于 `conduct`。

## Skill Case

`skill case` 是证明一个单一 skill 为什么需要存在的真实情境。

skill case 关注一个复发的 agent 行为问题，以及一个 skill 应该怎样改变该行为。

最小 skill case：

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
- case-rooted skill SHOULD 承载一个 primary pressure 和一个 primary governance action。
- skill MUST 定义 trigger surface、use boundary、do-not-use boundary、effects、workflow 和 validation。
- `SKILL.md` 承载 every-run instructions。
- 本地 `references/` 承载 conditional detail。
