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

## Information Collection

创建 skill 前，MUST 先收集并写出以下字段。

```yaml
creation:
  case:
    situation: 真实发生的情境
    default_failure: 无 skill 时 agent 的默认行为、失败或偏好 mismatch
    pressure: 为什么这个默认行为需要被 runtime skill 持续治理
    governance_action: skill 对 agent 行为施加的最小改变
  identity:
    name: skill folder 和 frontmatter name
    title: Markdown H1
    marker: 激活时第一条用户可见行使用的 marker
    primary_pressure: 只写一个 primary pressure
    primary_governance_action: 只写一个 primary governance action
  runtime:
    target: 默认 OpenAI/Codex；可由用户指定其他 target
    description: frontmatter trigger surface
    use_when: 触发条件列表
    do_not_use_when: 排除条件列表
    soft_boundary: 模型判断约束
    hard_boundary: When/Do 形式的硬约束
    effects: Conversation、Filesystem、External
    workflow: 执行步骤
    references: 本地 conditional detail
    validation: done 前检查项
```

任一字段不足以填写时，MUST 打回并只询问最小缺失材料。

marker 不属于 optional Conversation effect。marker 的规则写在激活行、Hard boundary 或 Validation；Effects 的 Conversation 只写 skill 可能输出的业务信息。

## Template

创建 `SKILL.md` 时，MUST 使用以下模板并删除所有占位符。

```md
---
name: <name>
description: "Use when <explicit trigger and target behavior>. Not for <exclusions>."
---

# <Title>

激活时，第一条用户可见行 MUST 以内联 `<marker>` 开头。

## Rule

面对<真实 case 对应的触发情境>时，MUST 先<primary governance action>，避免<default failure 或默认 mismatch>。

## Pattern

Use when:

- <trigger case>
- <trigger case>

Do not use when:

- <exclusion>
- <exclusion>

## Boundary

Soft:

- MUST <soft rule>
- SHOULD <soft preference>

Hard:

- When: <machine-checkable or non-negotiable condition>.
  Do: MUST <required action>.

## Effects

- Conversation: MAY 展示<业务信息、分类、问题、报告或验证结果；不要写 marker>。
- Filesystem: <none 或 MAY 在批准 scope 内写入的文件类型>。
- External: <none 或 MAY 使用的外部 surface>。

## Workflow

1. <step>
2. <step>
3. <step>

## References

- <无。或读取 reference file 的条件。>

## Validation

Before done:

- 第一条用户可见行包含内联 `<marker>`；
- <case-specific invariant>;
- <boundary-specific invariant>;
- Effects 保持在声明的 filesystem 和 external scope 内；
- target runtime 或 landing 要求的 checks 已通过，或准确 blocker 已报告。
```

`agents/openai.yaml` 可用时，MUST 使用以下模板并删除所有占位符。

```yaml
interface:
  display_name: "<Display Name>"
  short_description: "<短描述>"
  default_prompt: "Use <name> to <do the governed behavior>."
policy:
  allow_implicit_invocation: false
```
