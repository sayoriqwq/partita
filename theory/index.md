---
audience: agent
authors:
  - codex
reviewed_by: []
purpose: 作为 Partita theory 入口，帮助 agent 区分 workflow gate、case、pressure、skill 和 runtime projection。
updated: 2026-06-26
---

# Theory

`theory/` 保存 Partita 的 agent 行为治理理论。它不是 Codex 文件形态说明，也不是 skill authoring workflow。

当前落地阶段以 Codex 体系为准，但理论层保持 runtime-agnostic：Codex 的 `SKILL.md`、`agents/openai.yaml`、plugin manifest 和 verifier 是 projection，不是本体。

## Areas

- [Skill](skill/index.md)：情境化行为治理单元、case、pressure 和 care loop。
- [Workflow](workflow/index.md)：个人交付流、gate、exit condition 和 gate 上的 pressure 定位。

## Core Chain

```text
workflow gate -> case -> pressure -> minimal governance action -> skill -> projection
```

Gate 负责定位工作流风险。Case 负责保留真实情境。Pressure 负责命名默认 agent 行为失败。Skill 负责提供最小治理动作。Projection 负责适配具体 runtime。
