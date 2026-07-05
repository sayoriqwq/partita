---
audience: agent
authors:
  - codex
reviewed_by: []
purpose: 记录 retune 未正确修补 Partita source structure 和 case feedback 落点的复发样例。
status: active
sources: []
updated: 2026-07-06
---

# Structure Patch Case

## Case

一次 Partita retune 中，用户指出 `expand` 没有正确分族，也没有使用适合的 emoji；`border` 同理需要对齐所属族和 marker emoji。

agent 把 `border` 和 `expand` 从 primitive family 移到 expression family，并把 marker 改为 `💬`，但同时在 `border` 和 `expand` 自己的 references 中各加了一份 family marker case。

用户纠正：family marker 不需要在这些 leaf skills 里单独加；应该修复 `notate` 为什么没有正确识别 family/marker，以及 `retune` 为什么没有修 skill 的结构问题。

## Failure

`retune` 当时没有把 Partita source family、path、handle、marker 和 case feedback 落点明确建模为 source structure stale surface。

`retune` 允许 agent 把 creation workflow 的失败反馈写到 leaf skills，而不是写回 owning governance skill。

## Governance

当真实 case 暴露 Partita source structure 错误时，agent MUST 把 family、path、handle、marker、metadata default prompt 和 reference placement 一起检查。

agent MUST NOT 把 creation 或 patch workflow 的治理失败分散写入无治理职责的 leaf skill references。

验证时 MUST 确认 source structure 已修复，case feedback 写入 owning governance skill，并且 leaf skill 没有背负不属于自身 runtime behavior 的 convention case。
