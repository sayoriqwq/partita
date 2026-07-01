---
name: reconcile
description: "Use when a completed and verified task phase may still contain garbage state, residue, obsolete surfaces, stale dependencies, or stale authority that could mislead future agents. Audits before cleanup. Not for ordinary formatting, code review, bug finding, CI repair, or unapproved deletion."
---

# Reconcile

激活时，第一条用户可见行 MUST 以内联 `🧹` 开头。

## Rule

面对已经完成且验证通过的 task phase，MUST 先检查 residue、garbage state、obsolete surfaces、stale dependencies 和 stale authority，再清理被批准的范围，避免旧入口、旧路径、旧术语、旧依赖、旧文档或旧生成物误导后续 agent。

## Pattern

Use when:

- 用户显式要求 reconcile、清理垃圾状态、扫 residue、收尾清理或阶段结束清理。
- 一个 task phase 已完成，并且 tests、verifier、CI 或用户确认已经形成闭环。
- 旧入口、旧路径、旧术语、旧依赖、旧文档、旧生成物或旧 workflow 可能仍然存在。
- 当前系统有明确 authority，可用于判断哪些 surface 已经 obsolete。
- 用户需要 cleanup 前的 suspicious-item list。

Do not use when:

- task phase 尚未完成，或验证闭环尚未成立。
- 没有 current topic、accepted authority、source document 或 task change surface。
- 用户只是要普通 formatting、lint cleanup、dead-code deletion 或 housekeeping。
- 用户要 general code review、bug finding、CI repair 或 release readiness。
- 用户已经批准具体 cleanup scope，只需要执行。

## Boundary

Soft:

- MUST 从 current topic、source document、accepted conclusion、generated target、current source metadata 或 explicit user frame 中选择 authority。
- MUST 先 audit，再 cleanup。
- MUST 将每个 finding 分类为 `obsolete-surface`、`orphan-surface`、`stale-dependency`、`stale-authority`、`generated-residue`、`residue` 或 `uncertain`。
- MUST 为每个 finding 给出 location、classification、evidence、suspicion 和 proposed cleanup。
- SHOULD 优先检查旧入口、旧路径、旧术语、旧依赖、旧文档、旧生成物、旧 routing、旧 metadata 和旧 workflow。
- Cleanup scope MUST 等用户显式批准。
- MUST 保持在当前 task surface 和 authority 内。

Hard:

- MUST NOT 在用户批准 cleanup scope 前 repair、delete、rename 或 rewrite suspicious items。
- MUST NOT 把 tests 或 verifier 通过当作 garbage state 不存在的证明。
- MUST NOT 在没有 authority 时发明 authority。
- MUST NOT 把普通 bug、feature work 或 code review 包装成 reconcile。
- 硬判断 MUST 尽量用 git status、diff、search output、tests、schema、package check 或 verifier output 支撑。
- MUST NOT 使用 `🧹`，除非 maintenance skill 激活。

## Effects

- Conversation: MAY show `🧹`、authority、garbage state audit list、classification、evidence、cleanup proposal、approval question 和 cleanup report。
- Filesystem: MAY read code、docs、tests、generated metadata 和 manifests；MAY write only approved cleanup 和 directly stale generated metadata。
- External: none.

## Workflow

1. 识别 completed phase、verification closure 和 cleanup authority；缺失时问一个最小问题。
2. 用 git status、git diff、recent commits、changed files、search、generated metadata 或 manifests 定位 task change surface。
3. 搜索旧入口、旧路径、旧术语、旧依赖、旧文档、旧生成物、旧 routing、旧 metadata 和旧 workflow。
4. 在编辑前输出 audit list；每项包含 location、classification、evidence、suspicion 和 proposed cleanup。
5. 询问用户批准 cleanup scope。
6. 只实施已批准 cleanup；必要时 regenerate 直接受影响的 metadata。
7. 运行最小相关 verification。
8. 报告 cleaned items、deferred findings、verification results 和 remaining risk。

## References

- 无。

## Validation

Before done:

- `reconcile` 激活时 `🧹` 可见；
- completed phase、verification closure、authority 和 task change surface 已明确；
- audit 发生在 cleanup 前；
- 每个 finding 都有 location、classification、evidence、suspicion 和 proposed cleanup；
- cleanup 等待显式批准，并保持在批准范围内；
- hard claims 尽量有 machine-checkable evidence；
- completion 报告 cleaned items、deferred findings、verification output 和 remaining risk。
