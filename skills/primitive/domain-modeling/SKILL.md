---
name: domain-modeling
description: "Use when the user explicitly invokes domain-modeling or co-invokes it while changing one bounded domain term, distinction, relationship, code/model claim, or possible architectural decision. Not for passive vocabulary lookup, broad design journeys, implementation planning, or autonomous glossary creation."
---

# Domain Modeling

当 `domain-modeling` owns 当前 response 时，每条用户可见回复的第一行 MUST 只包含 `🎼 Domain Modeling` 与可选的 ` + <Display Name>` suffix；suffix 只列出实质改变该回复的其他已显式激活/共同调用 skill，active-but-inert skill 与 local contract projection MUST 省略。显式 co-invocation 中 outer owner 保持 marker 第一位并独占 overall design outcome、response envelope、effects、termination 与 next-step choice；Domain Modeling 只在实质参与时作为 ` + Domain Modeling` contributor，不显示第二个 marker。多个 co-invoked skill 争夺 ownership 且 precedence 未确定时，MUST 在激活前只问一个不带 skill marker 的最小 owner 问题。

## Rule

面对一个正在被修改的 bounded domain-model pressure 时，MUST 立即挑战模糊、过载、冲突或不符合既有 glossary 的语言，提出精确 canonical distinction 供 human meaning authority 裁决，并在一个 resolved delta 或 judgment 被 authorized persistence 或 typed handoff 后立即归还控制，避免 agent 默选含义、制造 ubiquitous language、让 model 与 observable code 分离，或继续接管外层设计旅程。

## Pattern

Use when:

- the user explicitly invokes domain-modeling or co-invokes it while changing one bounded domain term, distinction, relationship, code/model claim, or possible architectural decision.

Do not use when:

- passive vocabulary lookup, broad design journeys, implementation planning, or autonomous glossary creation.

## Boundary

Soft:

- Entry MUST 同时具备：Codex 中显式 invocation/co-invocation、正在改变 model、exactly one bounded pressure、known evidence scope，以及 supplied authorized record target 或 explicit read-only/handoff mode。
- Primary governed object MUST 是 target project 的 domain model，而不是 Skill system；本协议是 non-meta bounded primitive，不拥有 progression。
- MUST 先读取 evidence scope 内相关的 accepted glossary/domain records；发现 fuzzy、overloaded、conflicting 或 glossary-inconsistent language 时立即指出具体冲突，不得静默选择含义。
- MUST 提出一个 precise canonical distinction，并由 human 明确接受、修正或拒绝；agent 只提供 proposal 与 evidence，human 始终是 meaning authority。
- 讨论 relationship 时 MUST 用 concrete edge case stress-test concept boundary；只有 claim 涉及 observable implementation 时，才读取 relevant code 并显式呈现 code/model agreement 或 conflict。
- Resolved glossary/domain-model delta MUST concise：term 定义只写一到两句“what it is”，必要时列出 rejected synonyms；relationship 只写 accepted concepts 与 boundary。Implementation detail、specification、decision rationale 与 scratch prose 保持分离。
- ADR 只可 offer，不可假定；仅当 `hard to reverse`、`surprising without context`、`real trade-off` 三项全部成立时 offer，任一失败则返回 failed gate。
- 每次 invocation lifecycle MUST 只处理 entry 中的 one bounded pressure，并返回 exactly one result class；新的 ambiguity、relationship 或 design choice 留给 outer owner 决定是否再次显式调用。

Hard:

- When: 用户未显式 invocation/co-invocation，或只是 passive vocabulary lookup。
  Do: MUST NOT 激活、显示 Domain Modeling marker、修改 records 或把 ordinary lookup 扩成 model change。

- When: entry 缺少 bounded pressure、evidence scope、record authority 或 explicit read-only/handoff mode。
  Do: MUST 返回 `typed_handoff_or_blocker`，列出最小缺失 input，并停止。

- When: canonical meaning 尚未由 human resolution。
  Do: MUST 返回 `typed_handoff_or_blocker` with `UnresolvedMeaning`；MUST NOT 把 agent proposal 写成 accepted language。

- When: supplied record target 不存在、未经授权或写入失败。
  Do: MUST 保持 filesystem 不变，返回 `typed_handoff_or_blocker`，携带 resolved delta、failure 与 required owner action；MUST NOT invent storage path。

- When: bounded result 已形成。
  Do: MUST 只在 supplied authorized target 持久化，或以 typed handoff/blocker 交回 outer owner，然后立即停止；MUST NOT 继续 outer design journey、选择 next task、扩大 effects 或激活其他 explicit-only skill。

## Effects

- Conversation: MAY 立即指出 ambiguity/conflict、提出 canonical distinction、给出 edge case、呈现 bounded code/model evidence、ADR gate judgment，以及 exactly one typed result。
- Filesystem: MAY 只读 known evidence scope；MAY 只把 human-resolved delta 写入 supplied target-owned authorized record。无 authorized target 时 no writes。
- External: none.

## Workflow

1. 确认 Codex explicit invocation/co-invocation，固定 outer owner、exactly one bounded model pressure、known evidence scope，以及 authorized record target 或 explicit read-only/handoff mode；任一 entry gate 不满足则返回 typed blocker 并停止。
2. 读取 scope 内相关 accepted glossary/domain-model 与 decision records，区分当前 statement 是 term/difference、relationship、observable code/model claim，还是 possible architectural decision。
3. 对 fuzzy、overloaded、conflicting 或 glossary-inconsistent language 立即点名冲突，提出一个 precise canonical distinction；不得静默选义。
4. 对 relationship 构造 concrete edge case，检验 cardinality、ownership、lifecycle 或 boundary 中与本次 pressure 相关的最小轴；只有 observable implementation claim 才 cross-check bounded relevant code，发现冲突则带 locator 和 resolution question 返回。
5. 把 proposal、edge case 与相关 evidence 交给 human meaning authority；只有 human 明确接受或修正后才形成 resolved delta，未解决则返回 `UnresolvedMeaning` blocker。
6. 将 accepted term/relationship 写成 concise glossary/domain-model delta，并与 implementation detail、specification、scratch prose 分开；若是 possible decision，逐项检查三个 ADR gates，全部通过才 offer ADR，否则返回 failed gate。
7. 选择 exactly one result class，并用以下 contract 形成 bounded result：

```yaml
result:
  class: canonical_term_or_difference | resolved_relationship | code_model_conflict_plus_question | adr_offered_or_rejected_by_gates | no_change | typed_handoff_or_blocker
  bounded_pressure: <the single entry pressure>
  resolution: <human-resolved delta, conflict/question, gate judgment, no-change reason, or typed failure>
  evidence: <bounded glossary, scenario, decision, and conditional code locators>
  completion:
    mode: persisted | handoff
    receipt_or_required_owner_action: <authorized target receipt, or explicit next action owned outside this skill>
```

8. 若有 supplied authorized target 且 resolution 已获授权，立即写入对应 target-owned glossary/domain-model 或 decision record并记录 receipt；否则保持 read-only，以 `handoff` completion 返回 resolved delta 与 required owner action，绝不创建默认 path。
9. 返回这一个 bounded result 并立即归还控制；outer owner 独占 overall design outcome、effects budget 与 next-step choice。

## References

- 核对本蒸馏的 immutable upstream identity 与 adaptation boundary 时，读取 [source provenance](references/source-provenance.md)。Runtime behavior 已完整包含在本文件中。

## Validation

Before done:

- entry 同时满足 explicit Codex invocation/co-invocation、active model change、one bounded pressure、known evidence scope 与 known record authority/read-only mode；否则返回 typed blocker；
- ambiguity/glossary conflict 已立即显式化，canonical distinction 由 human resolution 而非 agent manufacture；
- relationship 已用 concrete edge case 检验，code 只在 observable implementation claim 时 cross-check；
- glossary/domain-model delta concise 且没有混入 implementation detail、specification、decision rationale 或 scratch prose；
- ADR 仅在三个 gates 全部通过时 offered，或已准确返回 failed gate；
- exactly one result class 已返回，且 accepted delta 已写入 supplied authorized target并附 receipt，或通过 typed handoff/blocker 携带 resolved delta 与 required owner action；
- bounded result 后已立即归还控制，outer owner 仍拥有 overall design outcome、effects 与 next-step choice；
- Filesystem 没有越过 evidence scope 或 supplied authorized target，External 保持 none；
- structural/source-fidelity checks 与 real-use validation 未混为一谈；未声称 automatic invocation、fixed storage、ADR persistence、Effect runtime、Pi 或 cross-model behavior 已验证；
- target runtime 或 landing 要求的 checks 已通过，或准确 blocker 已报告。
