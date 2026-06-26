---
audience: agent
authors:
  - codex
reviewed_by: []
purpose: 从 workflow 视角定义 orchestrator 如何识别 gate、调用 primitive skill，并避免吞掉 primitive 语义。
updated: 2026-06-26
---

# Workflow Orchestration

## Role

Workflow orchestration 负责把用户请求放回当前交付流：

```text
workflow -> current gate -> gate assets -> pressure match -> primitive skill
```

它不是一个跨所有阶段的大 primitive。Orchestrator 可以暴露自然语言入口、
识别当前 gate、维护 gate assets、调用 primitive skills，并汇总 gate exit
condition，但不能替代 primitive skill 定义 pressure、boundary 或 validation。

## Orchestrator Pressure

Orchestrator 自己也必须有 pressure。它不是因为 workflow 存在而自动成立。

可成立的 pressure 形态是：

```text
agent 在复杂项目推进中，默认无法稳定识别当前阶段、保留阶段资产、
选择合适治理动作并推进下一 gate。
```

如果用户只是要求执行一个清晰任务，而没有阶段漂移、资产丢失或治理动作
选择问题，就不应该因为存在 workflow theory 而启用 orchestrator。

## Responsibilities

Orchestrator 可以负责：

```text
识别或确认当前 gate
检查当前 gate 的 entry context
列出当前 gate assets
发现 gate 上出现的 pressure
显式调用匹配的 primitive skill
维护 primitive skill 的 gate_span 和 close condition
汇总 gate exit condition 与下一步
```

Orchestrator 不负责：

```text
把多个 primitive skill 合成一个大 workflow body
用 gate 名称反推 skill catalog
替 primitive skill 定义 case、pressure 或 minimal governance action
替 primitive skill 承担 validation
让一个 skill 在不同 gate 中改变治理动作
```

## Invocation

推荐调用关系：

```text
user request
  -> orchestrator skill
  -> gate context
  -> pressure match
  -> primitive skill
```

Primitive skill 默认由用户显式调用或 orchestrator 调用。只有极稳定、低副
作用、低冲突的 guard，才适合在精确 gate context 下隐式触发。

## Gate Span Coordination

Orchestrator 可以管理 primitive skill 的 `gate_span`，但不能用 gate span
改写 primitive identity。

```text
same governance action across gates:
  one primitive skill with gate_span

different governance actions by gate:
  multiple primitive skills linked by pressure_family or tag
```

当 orchestrator 需要跨 gate 维护同一主题时，它应该显式区分：

```text
topic continuity:
  同一主题或 pressure family 还在持续

governance identity:
  当前运行的 primitive 是否仍然只执行同一个 minimal governance action
```

Topic continuity 不足以把多个治理动作合并成一个 skill。

## Output Contract

Workflow orchestration 的输出应让用户看到：

```text
当前 gate 是什么
当前 gate asset 或缺口是什么
触发了哪些 pressure
调用了哪些 primitive skill 或为什么没有调用
当前 gate 是否满足 exit condition
下一步是什么
```

这个输出 contract 是 workflow 层的可见性要求，不是每个 primitive skill 的
validation 要求。
