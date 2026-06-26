---
audience: agent
authors:
  - codex
reviewed_by: []
purpose: 作为 workflow theory 入口，帮助 agent 从个人交付流 gate 定位 case 和 pressure。
updated: 2026-06-26
---

# Workflow Theory

Workflow 是个人交付流。Gate 是交付流中的质量闸门。

本区域不定义 skill catalog。它定义 case 在工作流中的位置：一个真实 case 暴露的默认失败，到底阻断了哪个 gate。

## Documents

- [Gate Model](gate-model.md)：workflow gate、case、pressure、skill 的关系。

## Working Chain

```text
workflow -> gate -> case -> pressure -> minimal governance action -> skill
```

Gate 只能组织 pressure，不能替代 pressure。不能因为有 Research gate 就直接创建 research skill；必须先说明 Research gate 中哪个真实 case 暴露了哪个默认 agent 失败。
