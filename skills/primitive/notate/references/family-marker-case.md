---
audience: agent
authors:
  - codex
reviewed_by: []
purpose: 记录 notate 未正确识别 Partita family、handle 和 marker 的复发样例。
status: active
sources: []
updated: 2026-07-06
---

# Family Marker Case

## Case

一次 Partita skill creation 中，用户要求创建 `expand`，用途是对单一 concept 做 source-grounded expansion，并给出贴合当前上下文和用户理解路径的例子。

agent 使用 `notate` 后，把 `expand` 创建在 `skills/primitive/expand/`，使用 `🎼 expand` marker 和 `pm:expand` handle。此前 `border` 也被创建在 `skills/primitive/border/`，使用 `🎼 border` 和 `pm:border`。

上述 lowercase slug marker 是历史 evidence，不是当前 canonical marker；当前规则使用 `<family emoji> <Markdown title/display name>` 的 marker-only first line。

用户纠正：family marker 不需要在 `border` 或 `expand` 里单独加 case；应该修复 `notate` 为什么没有正确识别到 family 和 marker。

## Failure

`notate` 当时把 Partita landing 的创建目标默认写成 primitive source skill。

`notate` 没有要求在创建文件前判定 source family、handle 和 marker，也没有明确 expression protocol 应该使用 expression family。

## Governance

当 `notate` 在 Partita landing 中创建 source skill 时，agent MUST 先根据 target behavior 判定 family、handle 和 marker。

agent MUST NOT 把 expression protocol、讲解输出协议、概念展开或概念边界说明默认放进 primitive family。

验证时 MUST 确认新 skill 的 path、handle、marker 和 `agents/openai.yaml` default prompt 属于同一 Partita family。
