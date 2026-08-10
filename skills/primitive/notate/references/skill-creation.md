# Skill Creation

## Definition

`skill creation` 是根据 evidence-anchored skill case 创建一个可触发、可执行、可验证的 Partita source skill。

`notate` 只处理单一 skill creation。

workflow skill creation 属于 `conduct`。

## Skill Case

`skill case` 是用于创建单一 case-rooted skill 的 evidence-anchored governance sample。

skill case 关注一个可召回、可复发的 agent 行为问题，以及一个 skill 应该在何处改变该行为。

最小 skill case：

```yaml
case:
  kind: skill
  evidence:
    source: stable material pointer
    note: optional minimal excerpt or description
  situation: 真实发生或由材料直接证明的情境
  default_failure: agent 无 skill 治理时会怎样失败
  pressure: 为什么该失败值得被 skill 固化治理
  recognition:
    triggers:
      - future signal that should recall this case
    non_triggers:
      - optional boundary that should not recall this case
  governance_action: skill 应该在何处改变 agent 行为
```

## Rules

- `evidence.source` 是 repo-relative path、skill-relative path、stable handle、conversation turn、issue link 或其他稳定材料指针。
- `default_failure` 是没有该 skill 时 agent 的自然错误行为。
- `pressure` 是该错误为什么会复发、产生代价、污染后续上下文、破坏边界或造成 trust/safety/semantic drift 风险。
- `recognition` 是未来相似情境应靠什么 signal 召回这个 case。
- `governance_action` 是 skill 对 agent 行为施加的最小介入点，不是完整 skill spec。
- `## Rule` MUST 把 `case.governance_action` 改写成单一 runtime imperative，不展开 workflow、validation、boundary 或 effects。
- 任何最小字段不可读时，材料不足。
- 材料不足时，MUST 打回，并列出最小缺失字段。
- agent MUST NOT 编造 skill case、evidence、pressure、recognition 或 governance action。
- case-rooted skill SHOULD 承载一个 primary pressure 和一个 primary governance action。
- skill MUST 定义 trigger surface、use boundary、do-not-use boundary、effects、workflow 和 validation。
- `SKILL.md` 承载 every-run instructions。
- 本地 `references/` 承载 conditional detail。

## Information Collection

创建 skill 前，MUST 先收集 creation form。agent SHOULD 尽可能从上下文预填；任一必要字段不可读时，MUST 只问一个最小问题引导用户补齐，MUST NOT 直接把空表单丢给用户填写。

```yaml
creation:
  case:
    kind: skill
    evidence:
      source: stable material pointer
      note: 可选的最小摘录或材料说明
    situation: 真实发生或由材料直接证明的情境
    default_failure: 无 skill 时 agent 的默认行为、失败或偏好 mismatch
    pressure: 为什么这个默认行为需要被 runtime skill 持续治理
    recognition:
      triggers:
        - 未来应该召回该 case 的信号
      non_triggers:
        - 可选；看起来相似但不应召回的边界
    governance_action: skill 对 agent 行为施加的最小介入点
  identity:
    slug: skill folder 和 frontmatter name
    family: Partita source family
    title: human-readable display name
  invocation:
    selector:
      use_when:
        - English selector phrase
      do_not_use_when:
        - English exclusion phrase
    policy:
      allow_implicit_invocation: false # current public default; true requires an explicit internal/model-invoked role gate
  rule:
    required_action: 从 case.governance_action 投影出的 runtime imperative
  body:
    soft_boundary: 模型判断约束
    hard_boundary: When/Do 形式的硬约束
    effects: Conversation、Filesystem、External
    workflow: 执行步骤
    references: 本地 conditional detail
    validation: done 前检查项
```

任一字段不足以填写时，MUST 打回并只询问最小缺失材料。

## Projection

creation form MUST 通过 projection 生成 runtime surfaces。

```yaml
projection:
  identity:
    handle: family + slug
    marker: family + slug
    source_path: skills/<family>/<slug>/
  skill_frontmatter:
    name: identity.slug
    description: compress(invocation.selector)
  skill_body:
    title: identity.title
    marker_instruction: projection.identity.marker
    rule: case + invocation + rule.required_action
    pattern: invocation.selector
  openai_metadata:
    interface:
      display_name: identity.title
      short_description: sentence_case(primary invocation.selector.use_when)
      default_prompt: Use <handle> when <primary invocation.selector.use_when>.
    policy:
      allow_implicit_invocation: invocation.policy.allow_implicit_invocation
```

`description` MUST NOT be hand-authored as a separate source. If generated description is wrong, fix `invocation.selector.use_when` or `invocation.selector.do_not_use_when`.

`agents/openai.yaml interface.display_name` MUST equal `identity.title`.

`invocation.selector.use_when` and `invocation.selector.do_not_use_when` MUST be English selector text.

`handle`、`marker`、`source_path`、`description`、`Pattern` 和 `agents/openai.yaml` metadata are projections, not independent form fields.

marker 不属于 optional Conversation effect。marker 的规则写在激活行、Hard boundary 或 Validation；Effects 的 Conversation 只写 skill 可能输出的业务信息。

Partita skill creation 中，family MUST 在创建文件前确定，并与 target behavior 对齐。agent MUST NOT 把 Partita source skill 默认放进 primitive family。

## Template

创建 `SKILL.md` 时，MUST 使用以下模板并删除所有占位符。

```md
---
name: <identity.slug>
description: "Use when <explicit trigger and target behavior>. Not for <exclusions>."
---

# <identity.title>

激活时，第一条用户可见行 MUST 以内联 `<marker>` 开头。

## Rule

面对<evidence-anchored case 对应的触发情境>时，MUST 先<primary governance action>，避免<default failure 或默认 mismatch>。

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
  short_description: "<Primary use_when with sentence case>"
  default_prompt: "Use <handle> when <primary use_when>."
policy:
  allow_implicit_invocation: false
```
