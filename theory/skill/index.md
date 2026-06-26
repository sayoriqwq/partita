---
audience: agent
authors:
  - codex
reviewed_by: []
purpose: 定义 skill 作为情境化行为治理单元的上层模型。
updated: 2026-06-26
---

# Skill Theory

## Scope

Agent 行为治理是上位理论。Skill 是其中最核心、最可操作、最容易落地的治理单元。

本理论是通用 agent skill 理论，不以某个 runtime 的文件形态为本体。当前 Partita 落地阶段以 Codex 体系为准，因此具体投影 MUST 兼容 Codex 的 `SKILL.md`、`agents/openai.yaml`、plugin manifest 和 verifier 边界。

## Skill

Skill 是情境化行为治理单元。

它不是所有 agent 治理的总称，而是治理体系里用于处理某类可识别情境的核心单元：它有触发条件、行为改写、边界、持续时间、退出条件和维护回路。

Skill 的本体不是 `SKILL.md`、插件目录、命令包装或 runtime 配置文件，而是可复用的 agent 行为治理 primitive。具体文件只是这个 primitive 在某个 agent runtime 中的 projection。

Skill 的最小断言是 `Facing A, first Y, to avoid X`。`A` 是 case pattern，`Y` 是 minimal governance action，`X` 是 default failure path。这个断言必须在 agent 进入默认失败路径前触发。

Skill 的同一性由 `minimal governance action` 决定。它可以跨多个 workflow gate 持续生效，但不能在不同 gate 中承担不同治理职责。需要不同治理动作时，拆成多个 skill，并用 `pressure_family` 或 tag 关联。

Skill 还需要区分 primitive 和 orchestrator。Primitive skill 承载一个 pressure 的最小治理动作；orchestrator skill 暴露 workflow 入口、识别 gate，并组合 primitive skills。Orchestrator 不能被误读成一个巨大 primitive。

Skill projection 必须保留 primitive 语义。Description、marker、references、metadata、CLI 和 verifier 都是投影面；任何投影面都不能重新定义 skill 本体。

## Governance Need

治理层只在 agent 默认行为不足时成立。

如果没有 prompt、skill、memory、hook、verifier 或其它外部介入时，agent 已经能在某类情境下稳定做对，就不应该添加治理层。

Skill 的存在理由不是用户意图分类，而是默认 agent 行为在某类情境下存在可读出的失效压力。用户 wording 只是触发信号之一；memory 更关心用户偏好、过去决定和个人上下文；skill 更关心 agent 在什么情境下会默认做错，以及如何被治理。

## Links

- [Case And Pressure](case-pressure.md)
- [Skill Assertion](assertion.md)
- [Governance Identity](governance-identity.md)
- [Runtime Projection](projection.md)
- [Orchestration](orchestration.md)
- [Workflow Gate Model](../workflow/gate-model.md)
- [Gate Span](../workflow/gate-span.md)
