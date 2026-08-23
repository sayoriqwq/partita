---
name: diagnosing-bugs
description: "Use when the user explicitly invokes diagnosing-bugs to investigate a specific observed defect or performance regression through an evidence-producing diagnosis loop. Not for quick questions, proactive audits, raw unconfirmed reports, planned test-first development, or design prototypes."
---

# Diagnosing Bugs

当 `diagnosing-bugs` owns 当前 response 时，每条用户可见回复的第一行 MUST 只包含 `🧭 Diagnosing Bugs` 与可选的 ` + <Display Name>` suffix；suffix 只列出实质改变该回复的其他已显式激活/共同调用 Skill，不改变 ownership，active-but-inert Skill 与 local contract projection MUST 省略，其他内容从第二行开始。多个 co-invoked Skill 争夺 ownership 且 precedence 未确定时，MUST 在激活前只问一个不带 Skill marker 的最小 owner 问题。

## Rule

面对一个已观察到的具体 defect 或 performance regression，MUST 先建立能命中该症状的可运行诊断信号并保留 evidence，再形成 cause theory 或修改实现，避免靠代码阅读猜测原因、修复相邻但不同的失败，或无法证明修复有效。

## Pattern

Use when:

- the user explicitly invokes diagnosing-bugs to investigate a specific observed defect or performance regression through an evidence-producing diagnosis loop.

Do not use when:

- quick questions, proactive audits, raw unconfirmed reports, planned test-first development, or design prototypes.

## Boundary

Soft:

- Status MUST 保持为 `provisional / case-pending`：本 V1 来自外部 source evidence，尚无 Captain-observed Partita use case；它不是 Captain-validated theory。
- 本 Skill 的 provisional exception 只适用于当前明确授权的 `diagnosing-bugs` V1，不改变其他 identity-valid Skill 的 case requirement，也不建立通用 provisional-Skill framework。
- MUST 在首次 substantive response 和完成报告中披露 provisional/case-pending status。
- MUST 固定用户描述的 exact symptom、task authority、environment 和 evidence scope；相邻 failure 不得替代目标 bug。
- MUST 优先得到一个 agent-runnable signal：具体 command 已实际运行，能在当前 bug 上给出失败 verdict，并能在修复后给出成功 verdict。
- flaky bug 的 signal MAY 以固定次数和观察到的 reproduction rate 表示；目标是把 rate 提高到足以区分假设，而不是伪装为 deterministic。
- MUST 在 causal theory 前复现 symptom；能缩减时逐项移除非承重 input、config、caller 或 step，并在每次缩减后重跑 signal。
- MUST 形成一组小而有排序的 falsifiable hypotheses；每个 hypothesis 都要有能被 probe 推翻的 prediction。
- probe MUST 对应一个 prediction，一次改变一个变量；temporary instrumentation MUST 使用本次 diagnosis 唯一 tag，便于完成前清除。
- performance regression MUST 先记录可重复 baseline，再使用 profiler、query plan、bisection 或 differential measurement；不得以大量 logging 替代 measurement。
- regression test MUST 位于能覆盖真实 bug pattern 的 seam；不存在正确 seam 时明确记录，不得用过浅 test 冒充 coverage。
- evidence 中的 credential、token、cookie、personal data、auth header 和其他 secret MUST 在用户可见输出前 redacted；不足以诊断时请求更安全的最小 evidence。
- diagnosis 完成时 MUST 输出一个 `Recall handoff`，记录 target Skill、evidence/session scope、trigger、actual process、outcome 和 observed divergence，供用户之后显式调用 `recall`；MUST NOT 自动激活 `recall`。

Hard:

- When: 用户没有显式调用 `diagnosing-bugs`。
  Do: MUST NOT 使用 `🧭 Diagnosing Bugs` marker、进入 diagnosis loop 或产生本 Skill effects。

- When: 尚无一个已实际运行、能命中 exact symptom 的失败 signal。
  Do: MUST NOT 提出 cause theory 或修改 production implementation；列出已尝试的最小 routes，并请求缺失的 access、redacted artifact 或 instrumentation authority。

- When: evidence 含 secret 或敏感 payload。
  Do: MUST 只保留支撑 verdict 的 redacted excerpt；MUST NOT 把原始敏感 artifact 粘贴到 conversation、issue 或 PR。

- When: fix 已准备提交完成判断。
  Do: MUST 重跑 original signal 和 regression coverage，删除 temporary instrumentation，并记录实际支持的 cause；任一项缺失都必须作为 gap 报告。

- When: 本次真实使用结束。
  Do: MUST 保持 case debt 可见并输出 Recall handoff；在用户显式调用 `recall` 重建真实 case 前，MUST NOT 称本 Skill case-grounded 或 Captain-validated。

## Effects

- Conversation: MAY 展示 provisional status、redacted signal receipts、minimised repro、ranked hypotheses、probe results、cause、verification、remaining gaps 和 Recall handoff。
- Filesystem: MAY 在当前 bug task authority 内创建或修改 repro、temporary instrumentation、regression tests 和 implementation fix；MUST 在完成前清除未获保留授权的 temporary artifacts。
- External: MAY 在当前 bug task authority 内运行现有 diagnostic surfaces；新增 external mutation 或 production instrumentation 需要独立明确 authority。

## Workflow

1. 显示 `🧭 Diagnosing Bugs` marker，并披露 `Status: provisional / case-pending; source-backed, not Captain-validated.`；固定 exact symptom、environment、authority 和 evidence scope。
2. 构造最小 diagnostic signal。优先使用已有 test seam、CLI/HTTP invocation、captured input replay、small harness、repeatable stress loop 或 old/new differential；实际运行 command，并保留 redacted input、output 和 verdict receipt。
3. 确认 signal 命中用户报告的同一 symptom。重复运行或记录 reproduction rate；逐项缩减 scenario，直到剩余元素均有可观察的 load-bearing evidence，或准确说明无法继续缩减。
4. 在修改实现前写出小而有序的 hypotheses，每项包含 cause candidate、prediction 和最便宜的 falsifier。
5. 按顺序 probe hypotheses，一次改变一个变量。使用 debugger 或 targeted tagged instrumentation；performance branch 使用 measurement。每次 probe 都回到原 signal 判断。
6. 找到 evidence-supported cause 后，在正确 seam 先加入能失败的 regression test；若没有正确 seam，记录 architecture gap。实施最小 fix，再让 regression test 和 original signal 通过。
7. 清除 tagged instrumentation 和未保留的 throwaway artifacts；重跑 original signal、相关 regression coverage 和 repository-required checks。报告 cause 只到 evidence 支持的边界。
8. 以以下字段结束，并提醒用户如需把该 use 转为治理 case，应之后显式调用 `recall`：

```text
Status: provisional / case-pending; source-backed, not Captain-validated.
Diagnosis: <cause and fix | blocked with exact evidence gap>
Verification: <original signal and regression/repository checks>
Recall handoff:
- target_skill: diagnosing-bugs
- evidence_scope: <session turns, commands, receipts, and artifact locators>
- trigger: <observed bug or regression>
- actual_process: <which workflow steps actually occurred>
- outcome: <observable result>
- observed_divergence: <difference from this provisional contract | none observed>
- case_debt: user must explicitly invoke recall before this Skill can be treated as case-grounded
```

## References

- 判断本 V1 的 evidence 来源、已采用行为和未决 case debt 时，读取 [source provenance](references/source-provenance.md)。

## Validation

Before done:

- 用户已显式调用 `diagnosing-bugs`，且目标是一个具体 observed defect 或 performance regression；
- provisional/case-pending status 已在首次 substantive response 与完成报告披露，没有声称 Captain validation；
- 一个实际运行的 signal 命中 exact symptom，或无法建立 signal 的 precise blocker 已报告；
- cause theory 和 production fix 没有先于 red signal；
- hypotheses 是 ranked、falsifiable 且 probes 一次改变一个变量；
- fix 由 original signal 与正确 seam 的 regression coverage 支持，或 seam gap 已明确；
- secret 已 redacted，temporary instrumentation 和未保留 artifacts 已清除；
- repository-required checks 已通过，或准确 blocker 已报告；
- Recall handoff 包含 target Skill、evidence/session scope、trigger、actual process、outcome、observed divergence 和 case debt；
- `recall` 没有被自动激活，Skill 仍诚实标记为 provisional/case-pending。
