<!-- partita:projection:file source="docs/skills/concepts/case.md" mode="copy" -->

---
audience: agent
authors:
  - codex
reviewed_by: []
purpose: 定义 Partita skills 共享使用的 case 概念。
status: active
sources: []
updated: 2026-07-01
---

# Case

## Definition

`case` 是证明一个 skill、workflow 或 patch 为什么需要存在的真实情境。

case 不是假设场景、抽象愿望、功能分类或普通示例。

case MUST 能说明 agent 在没有目标治理时会怎样失败，以及目标治理要怎样改变该行为。

## Kinds

`skill case` 用于创建单一 case-rooted skill。

`workflow case` 用于创建 public workflow skill。

`patch case` 用于修补已有 identity 成立的 skill。

`case feedback` 用于把真实 recurrence 写回 target skill references，防止同类失败复发。

## Fields

最小 `skill case`：

```yaml
case:
  situation: 真实发生的情境
  default_failure: agent 无 skill 治理时会怎样失败
  pressure: 为什么这个失败值得被 skill 固化治理
  governance_action: skill 应该怎样改变 agent 行为
```

最小 `workflow case`：

```yaml
case:
  situation: 真实发生的情境
  workflow_default_failure: agent 无 workflow 治理时会怎样失败
  gate_pressure: 哪些阶段判断会失败或缺失
  routing_pressure: 哪些内部 skill、步骤或子流程会误用、漏用或乱序
  disclosure_pressure: 哪些过程、状态或结果会错误展示或隐藏
  orchestration_action: workflow 应该怎样改变 agent 行为
```

最小 `patch case`：

```yaml
case:
  target_skill: 要修补的已有 skill
  situation: 真实发生的情境
  stale_behavior: target skill 现在怎样失败
  expected_governance: 应该怎样防止复发
```

## Rules

- agent MUST NOT 编造 case。
- 材料不能读出目标 case kind 的最小字段时，agent MUST 打回。
- case SHOULD 只承载一个 primary pressure 或 stale surface。
- case SHOULD 使用 repo-relative path、skill-relative path 或稳定 handle 描述材料。
- case MAY 引用本机绝对路径，仅当该路径本身是 case 的关键事实。
