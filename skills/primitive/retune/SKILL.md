---
name: retune
description: "Use when the user explicitly invokes retune to patch an existing identity-valid OpenAI/Codex skill from an evidence-anchored patch case that exposes a stale local surface, including Partita source structure. Not for creating new skills, structure audits without a patch case, identity-invalid skills, external skill migration, ordinary code review, or prose cleanup."
---

# Retune

当 `retune` owns 当前 response 时，每条用户可见回复的第一行 MUST 只包含 `🎼 Retune` 与可选的 ` + <Display Name>` suffix；suffix 只列出实质改变该回复的其他已显式激活/共同调用 skill，不改变 ownership，active-but-inert skill 与 local contract projection MUST 省略，其他内容从第二行开始。多个 co-invoked skill 争夺 ownership 且 precedence 未确定时，MUST 在激活前只问一个不带 skill marker 的最小 owner 问题。

## Rule

面对 evidence-anchored patch case 暴露已有且 identity 成立的 skill 局部 stale surface 时，MUST 先做最小 case-patch，避免无 case 的 structure-audit、整 skill rewrite，或把 identity 已不成立的 skill 当作可修补对象。

## Pattern

Use when:

- the user explicitly invokes retune to patch an existing identity-valid OpenAI/Codex skill from an evidence-anchored patch case that exposes a stale local surface, including Partita source structure.

Do not use when:

- creating new skills, structure audits without a patch case, identity-invalid skills, external skill migration, ordinary code review, or prose cleanup.

## Boundary

Soft:

- MUST 在修改 skill 前要求 evidence-anchored patch case。
- MUST 识别 target skill 和 case 暴露的 stale surface。
- MUST 把 Partita source family、path、handle、primary marker、metadata display name/default prompt 和 reference placement 视为可修补的 source structure surface。
- MUST 保持 target skill identity。
- target identity 不成立时，MUST 停止并报告；MUST NOT patch 它。
- MUST 默认 patch OpenAI/Codex skill，除非用户指定其他 target。
- MUST 只在 Partita landing 中应用 Partita family、source shape、policy 和 checks。
- current Partita-owned public runtime skill MUST 保持 `policy.allow_implicit_invocation: false`；改为 implicit 是 role change，必须先通过 interpretation gate。
- MUST 让 skill runtime 携带执行自身 Rule、Pattern、Boundary、Workflow 和 Validation 所需的本地概念定义。
- 没有 evidence-anchored patch case 时，MUST NOT 运行 structure-audit。
- MUST 在修改前定位 target skill source truth。
- installed/global/runtime skill copies MUST 视为 installed runtime copies；MUST NOT 直接把 runtime copy 当作 patch target。
- 当用户给出 runtime copy path 时，MUST 找到 owning source skill 并 patch source；找不到 source truth 时，MUST 停止并报告 blocker。
- MUST 选择能防止复发的最小 patch。
- MUST 按 [case feedback](references/case-feedback.md) 在 target skill references 中添加或更新真实 recurrence case，除非同一 case 已经存在。
- MUST 把 case feedback 写到治理失败的 target skill；如果 recurrence 暴露的是 creation 或 patching workflow 失败，MUST patch `notate`、`conduct` 或 `retune` 这类 owning governance skill，而不是只给被创建/被移动的 leaf skill 加局部 case。

Hard:

- When: 用户没有显式调用 `retune`。
  Do: MUST NOT 使用 `🎼 Retune` marker、patch skill 或套用本协议。

- When: Partita landing 中修改 skill source、local references、frontmatter、`agents/openai.yaml` 或 generated files。
  Do: MUST 运行 `pnpm verify`。

- When: Partita landing 中完成 repo 变更前。
  Do: MUST 运行 `pnpm verify`。

- When: Partita landing 中需要同步 installed/global Codex skill runtime。
  Do: MUST 运行 owning install/sync command；MUST NOT 手动编辑 installed runtime copy。

## Effects

- Conversation: MAY 展示 target skill、patch case summary、stale surface、变更后的 rule 和验证结果。
- Filesystem: MAY 只更新 target source skill、case feedback reference、直接 stale 的本地 references、`agents/openai.yaml`；在 Partita landing 中 MAY move target source skill folder when source family/path is the stale surface，并 MAY 更新直接需要的 generated files。
- Filesystem: MUST NOT 直接编辑 installed/global/runtime skill copy。
- External: none.

## Workflow

1. 确认用户显式调用了 `retune`，再读取 target skill 和 evidence-anchored patch case。材料不足时，MUST 使用本地 insufficient-material reference 并停止。
2. 读取 [case](references/case.md)，确认输入是可治理的 evidence-anchored patch case。
3. 读取 [skill patch](references/skill-patch.md) 和 [case feedback](references/case-feedback.md)，确认 patch case 字段可读。
4. 定位 target skill source truth；如果读到的是 installed/runtime copy，先找到 owning source skill。
5. 读取 [OpenAI skill](references/openai-skill.md)，确认 target runtime shape 仍然成立。
6. 如果目标是 Partita landing，读取 [Partita skill](references/partita-skill.md)，确认 Partita family、shape、policy 和 checks 仍然成立。
7. 确认 target skill identity 仍然成立；否则 MUST 停止并报告 identity invalid。
8. 定位 case 暴露的最小 stale surface。
9. 如果 stale surface 是 `## Rule`，读取 [rule](references/rule.md)，确认 patch 后仍是单一 runtime governance constraint。
10. 如果 stale surface 是 Partita source structure，读取 [structure patch case](references/structure-patch-case.md)，确认 family、path、handle、marker、metadata 和 case feedback 落点。
11. 在治理失败的 target skill references 中添加或更新 case feedback。
12. 只 patch 该 stale surface，以及直接需要同步的 metadata、references、source path 或 generated files。
13. 运行 target source 或 Partita landing 要求的 checks；需要同步 runtime copy 时运行 owning install/sync command。

## References

- 材料不足时，MUST 使用 [insufficient material](references/insufficient-material.md)。
- 判断 case 概念和最小字段时，MUST 使用 [case](references/case.md)。
- 修补 `## Rule` stale surface 时，MUST 使用 [rule](references/rule.md)。
- patch skill 时，MUST 使用 [skill patch](references/skill-patch.md)。
- 写回真实 recurrence case 时，MUST 使用 [case feedback](references/case-feedback.md)。
- 修补 Partita source structure、family、handle、marker 或 case feedback 落点时，MUST 使用 [structure patch case](references/structure-patch-case.md)。
- patch OpenAI/Codex skill 时，MUST 使用 [OpenAI skill](references/openai-skill.md)。
- 目标是 Partita landing 时，MUST 使用 [Partita skill](references/partita-skill.md)。
- 避免 installed runtime copy 被直接 patch 时，MUST 使用 [runtime copy case](references/runtime-copy-case.md)。

## Validation

Before done:

- 已识别 evidence-anchored patch case 和 target skill，或材料不足已被打回；
- 已定位 target skill source truth，没有直接 patch installed/global/runtime copy；
- patch 前 target identity 仍然成立；
- 治理失败的 target skill references 已按 case feedback 格式添加或更新真实 recurrence case；
- patch 小于 rewrite，且限制在 case 暴露的 stale surface 内；
- 如果 stale surface 是 `## Rule`，patch 后仍是单一 runtime governance constraint，没有展开 workflow、validation、boundary 或 effects；
- 如果 stale surface 是 Partita source structure，family、path、handle、primary marker、metadata display name/default prompt 和 case feedback 落点已一致；
- target runtime shape 仍然成立；
- Partita landing 中 Partita shape、metadata 和 checks 仍然成立；
- 如果需要同步 installed runtime，已运行 owning install/sync command；
- `retune` 没有执行 structure-audit、外部 skill 迁移、新 skill 创建或 identity repair；
- Effects 保持在声明的 filesystem scope 内；
- target runtime 或 Partita landing 要求的 checks 已通过，或准确 blocker 已报告。
