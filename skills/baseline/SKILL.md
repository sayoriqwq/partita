---
name: baseline
description: "Use when the user explicitly asks to record, capture, or summarize the accepted consensus since the current conversation aim began. Not for setting aims, maintaining direction, unresolved questions, decision making, meeting notes, durable documentation, or ordinary summaries."
---

# Baseline

激活时，第一条用户可见行 MUST 以内联 `🧭` 开头。

## Rule

面对一个 active 或可推测的 conversation-local aim 及其已达成共识时，MUST 先记录从该 aim 开始到当前已经确认的共识断言，避免后续对话丢失已确认约束或反复重开已解决判断。

## Pattern

Use when:

- 用户显式要求记录、整理、捕获或总结当前 baseline。
- 用户要求记录从当前 aim 开始到现在达成的共识。
- 用户要求把已确认约束压缩成后续可继续使用的基线。

Do not use when:

- 用户只是要设置、重设、维持或检查当前 aim；使用 `aim`。
- 用户要挑战未定判断、未解决争议或 open questions；使用 `argue`。
- 用户要做选择、生成候选、展开模糊 seed、写会议纪要或普通摘要。
- 用户要把 baseline 写入文件、wiki、issue、PRD 或其他 durable artifact。

## Boundary

Soft:

- MUST depend on `aim`.
- MUST use the active aim as the baseline range when one exists.
- MUST infer and show a minimal `Aim` before baseline when no active aim exists.
- MUST record only accepted consensus.
- MUST write each baseline item as one concise assertion.
- SHOULD normalize wording into constraint language when meaning is preserved.
- MAY output that no accepted consensus is available when no item can safely be recorded.

Hard:

- MUST NOT record unresolved disputes, open questions, process history, rationale, or ordinary context.
- MUST NOT invent consensus.
- MUST NOT turn tentative language into confirmed baseline.
- MUST NOT group baseline items.
- MUST NOT maintain direction after output; sustained direction belongs to `aim`.
- MUST NOT write files or create durable artifacts.

## Effects

- Conversation: MAY show `🧭`, inferred or active `Aim`, and a flat `Baseline` list.
- Filesystem: none.
- External: none.

## Workflow

1. Identify the active aim. If none exists, infer the smallest current aim from the conversation and show it.
2. Scan only the conversation span governed by that aim.
3. Extract accepted consensus that can constrain later work.
4. Rewrite each item as one concise assertion without narrative subject.
5. Output the active or inferred `Aim`, then a flat `Baseline` list.
6. Stop after the snapshot; do not stay active.

## References

- No references.

## Validation

Before done:

- `🧭` is visible when `baseline` is active;
- the output includes the active or inferred `Aim`;
- every baseline item is one concise accepted-consensus assertion;
- unresolved questions, rationale, process, and ordinary context are absent;
- baseline items are not grouped;
- no file, durable artifact, external state, or sustained handle was created.
