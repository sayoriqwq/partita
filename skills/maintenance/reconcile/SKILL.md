---
name: reconcile
description: "Use when the user explicitly invokes reconcile to recall a settled case and audit residue before cleanup. Not for ordinary formatting, code review, bug finding, CI repair, feature work, or cleanup without exact-target approval."
---

# Reconcile

激活时，第一条用户可见行 MUST 以内联 `🧹` 开头。

## Rule

`Case recall` 是先还原 settled case 的 intent、accepted closure、verification、authority、protected/out-of-scope items 和 state transitions，再用当前证据复核。面对 completed task phase 或 settled lifecycle surface，MUST 沿 authority chain 审计 residue、garbage state、obsolete surfaces、stale dependencies 和 stale authority；每个 in-scope candidate 都有证据充分的 disposition 后，才能清理被批准的精确范围。

## Pattern

Use when:

- the user explicitly invokes reconcile to recall a settled case and audit residue before cleanup.
- the case is a current or referenced task or session, branch or worktree lifecycle, generated target, dependency change, or authority migration with possible stale or orphaned state.

Do not use when:

- ordinary formatting, code review, bug finding, CI repair, feature work, or cleanup without exact-target approval.

## Boundary

Soft:

- MUST 分开记录 `case locator`、`governing authority`、`evidence scope` 和 `cleanup approval`；历史 task/session 是 locator 和 evidence，不自动成为 authority。
- 用户指向 task/session 时，MUST 读取相关 turns 和可用 raw artifacts；title、summary 或 screenshot 只用于定位，并用当前 state 复核召回结论。
- MUST 建立 scope/authority map，覆盖当前 topic、source document、accepted conclusion、generated target、source metadata，以及用户纳入范围的 repo、worktree、ignored/local authority 或 external record。
- Authority map 可修订；新增 ignored、nested 或 external authority，或出现 contradictory evidence 时，MUST 重新审计受影响 candidates，并显式更正旧 conclusion。
- MUST 给每个 in-scope candidate 标记 provenance/owner，并给出 relation：`contained`、`equivalent`、`superseded`、`authority-transferred-or-retired`、`live-unique` 或 `unknown`；disposition 使用 `keep`、`cleanup-candidate`、`defer` 或 `out-of-scope`。
- 每个 candidate MUST 给出 subject/location、identity、provenance/owner、authority、relation、evidence 和 disposition；每个 cleanup finding 还 MUST 给出 classification、suspicion、proposed cleanup 和 recovery/rollback。
- Finding classification MUST 使用 `obsolete-surface`、`orphan-surface`、`stale-dependency`、`stale-authority`、`generated-residue`、`residue` 或 `uncertain`。
- SHOULD 优先检查旧入口、旧路径、旧术语、旧依赖、旧文档、旧生成物、旧 routing、旧 metadata、旧 workflow、同名但不同身份的 surface，以及 task 前已存在或来自其他 task 的 state。
- Cleanup approval MUST 固定 finding IDs、authority/workspace、exact targets、allowed actions 和 allowed generated derivatives。

Hard:

- When: 用户没有显式调用 `reconcile`。
  Do: MUST NOT 使用 `🧹` marker、启动 audit 或套用本协议。

- MUST NOT 在用户批准 exact cleanup scope 前 repair、delete、rename、rewrite、regenerate 或执行 external mutation。
- MUST NOT 把 previous task/session、当前 checkout 或当前 repo 当作当然 authority；authority 不可访问或冲突时 MUST 标为 `unknown` 并 defer。
- MUST NOT 仅凭“当前 repo 中不存在”、未进入目标分支、无 open PR、长期无活动、名称相同、tests/verifier 通过，断言 candidate 已被收纳、废弃或可删除。
- MUST NOT 跨越 explicit owner/scope；其他 owner 的 surface 只能作为比较证据，并保持 `out-of-scope`。
- Destructive identity MUST 包含 authority/location 和可复核的 immutable revision 或 ID；name alone 不足以授权删除。
- 硬判断 MUST 尽量用 git status、diff、worktree/branch/ref state、commit/patch/content comparison、search output、tests、schema、package check、current policy 或 authoritative service output 支撑。
- MUST NOT 把普通 bug、feature work 或 code review 包装成 reconcile。
- MUST NOT 使用 `🧹`，除非 maintenance skill 激活。

## Effects

- Conversation: MAY show `🧹`、case recall、authority map、coverage gaps、candidate ledger、cleanup proposal、approval question 和 cleanup report。
- Filesystem: MAY read in-scope code、docs、tests、worktrees、local authority、generated metadata 和 manifests；MAY write or delete only exact approved targets and approved generated derivatives。
- External: MAY read the relevant user-referenced task/session and authoritative service state；MAY mutate only exact external cleanup targets already within the user request and explicit approval tuple。

## Workflow

1. 确认用户显式调用了 `reconcile`；固定 case locator、settled/completed surface 和 expected closure。默认 locator 是 current conversation 中最近一个有 accepted closure 的 phase；用户指向其他 task/session 时以其为准。只有实质歧义会改变审计对象时，才问一个最小问题。
2. 执行 `Case recall`：从 current conversation 或 referenced task/session 还原 intent、accepted conclusion、verification、protected/out-of-scope items 和 state transitions。读取完整相关回合；不可访问的 evidence 明确列为 gap，不用当前 artifact 反推历史 rationale。
3. 对 current state 做 snapshot：记录 workspace/repo/worktree/revision、git status/diff、recent commits、refs、generated metadata、manifests 和必要的 authoritative service state；区分 `case-owned`、`pre-existing-or-unrelated` 与 `unknown` provenance。
4. 建立 scope/authority map 和 closed candidate inventory。用户指出 current repo 之外的 owning authority 时，沿链只读核对；“当前 target 看不见”只是 investigation lead，不是 orphan 结论。
5. 对每个 candidate 走 proof ladder：确认 identity 和 owner，检查 current liveness/use，再依次核对 ancestry/containment、patch/content equivalence、semantic replacement 和 current authority decision，直到 relation 与 disposition 有证据或标为 `unknown`。
6. 在任何编辑前输出 candidate ledger。列出 `keep`、`defer`、`out-of-scope` 和 cleanup findings，说明 coverage gaps；用 exact-target approval tuple 询问 cleanup scope。此时可以以 `Audit complete — approval pending` 结束本轮。
7. 获批后立即做 destructive preflight：重验 identity/revision、worktree/checkout use、dirty state、unique data/current copies、approval exclusions 和 recovery handle。状态或身份变化时回到 audit，不沿用旧批准。
8. 只实施 approved cleanup；所有 rewrite/regenerate 和 external mutation 都必须在 approval tuple 内。记录删除前 immutable ID；不可恢复的动作在执行前明确说明。
9. 复验 cleaned targets 已消失、protected/out-of-scope targets 仍存在、workspace 状态符合预期，并运行相关原验收、负向 residue search 和最小相关 verifier。以 `Cleanup complete` 报告 cleaned identities、recovery handles/windows、deferred findings、corrected conclusions、verification output 和 remaining risk。

## References

- 无。

## Validation

Before done:

- `reconcile` 激活时 `🧹` 可见；
- case locator、settled/completed surface、expected closure、governing authority 和 evidence scope 已明确，或 gap 已显式 defer；
- referenced task/session 的相关 case 已召回，并与 current state 分开记录和复核；
- in-scope inventory 已闭合，每个 candidate 的 identity、provenance、relation 和 disposition 可追踪，protected/out-of-scope items 明确保留；
- audit 发生在 cleanup 前，每个 cleanup finding 有 classification、evidence、suspicion、proposed cleanup 和 recovery/rollback；
- cleanup approval 是 exact-target tuple，destructive preflight 在执行前重新通过；
- `Audit complete — approval pending` 包含 ledger、coverage gaps、deferred items 和 approval question；
- `Cleanup complete` 包含 cleaned identities、recovery handles/windows、retained exclusions、verification output 和 remaining risk；
- hard claims 尽量有 machine-checkable evidence，无法重跑的原验收或 authority 明确列为 remaining risk。
