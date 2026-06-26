---
audience: agent
authors:
  - codex
reviewed_by: []
purpose: 定义 case 和 pressure 的关系，防止 agent 把 pressure 建模成样本统计后的强弱假设。
updated: 2026-06-26
---

# Case And Pressure

## Case

Case 是真实发生的情境。

Case 不是 evidence、training material、regression test 或抽象例子。证明、校准、回归只是后续使用 case 的方式，不是 case 的定义。

没有 case，就没有 skill。至少需要一个真实反例来暴露默认 agent 行为失败；真实正例可以帮助界定期望行为；更多真实 case 可以让 skill 的边界、命名、trigger 和 workflow 更稳定。

## Case Capture

Case 的定义不要被拆成字段。字段只属于记录方式。

记录一个 case 时，至少保留：

```text
真实情境
默认失败
治理参照
```

`真实情境` 保留发生了什么。`默认失败` 保留 agent 在无治理层时自然滑向哪里。`治理参照` 保留用户认为正确的行为方向或已经接受的治理判断。

## Pressure

Pressure 是从 case 中读出的默认 agent 行为失效。

`pressure` 是 skill 成立的第一性条件。每个 skill 都必须能说明：如果没有这个治理层，agent 在这个情境下会自然滑向哪种默认失败。

正向能力增强不是另一条成立路径。所谓能力增强，必须还原为默认能力不足或默认行为不满足约束的失败。不能还原为默认失败的能力愿望不应成为 skill。

Pressure 名字不决定 skill 同一性。大范围 pressure 或 pressure family 只能说明一组失败的 lineage；具体 skill 仍然必须由最小治理动作决定。

Pressure 进入 skill design 时，应被写成 [Skill Assertion](assertion.md) 中的
`X`，再由 case pattern 和 minimal governance action 共同形成完整断言。

## Case To Pressure

单个 case 可以成立 pressure，但前提是这个 case 暴露的是默认 agent 行为失效，而不是一次性输出错误。

可复现性不是额外证明项，而是 `pressure` 概念本身的内含条件。不要把关系写成：

```text
case -> 可复现假设 -> weak pressure -> strong pressure
```

应写成：

```text
case
  ↓ 读取默认失败
pressure
```

这个箭头不是自动的。Agent 必须能从 case 中读出：

```text
agent 在这类情境下，如果没有治理层，会自然滑向某种默认失败。
```

多个 case 的作用不是让 pressure 从无到有，而是让 pressure 更准：

```text
单 case: pressure 可以成立
多 case: pressure 的边界、命名、trigger、workflow 更稳定
patch case: pressure 被修正、收窄、扩大或拆分
```

## Care Loop

Patch 是对 skill 补足 case 的机制。

新 case 出现后，维护动作不是把 case 当作证明材料归档，而是检查既有 skill 是否需要被修正、收窄、扩大或拆分。Case 进入 care loop 后，skill 的 pressure、trigger、boundary、workflow、validation 或 projection 都可能被重新校准。
