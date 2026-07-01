---
name: retune
description: "Use when patching an existing identity-valid OpenAI/Codex skill from a real recurrence case that exposes a stale local surface. In Partita landing, patches an existing valid Partita source skill. Not for creating new skills, structure audits without a patch case, identity-invalid skills, external skill migration, ordinary code review, or prose cleanup."
---

# Retune

激活时，第一条用户可见行 MUST 以内联 `🎼 retune` 开头。

## Rule

面对真实 recurrence case 暴露已有且 identity 成立的 skill 局部 stale surface 时，MUST 先做最小 case-patch，避免无 case 的 structure-audit、整 skill rewrite，或把 identity 已不成立的 skill 当作可修补对象。

## Pattern

Use when:

- 用户提供真实 patch case，且该 case 指向一个已有 skill 的局部错误、过宽、过窄、误触发、漏触发、越权 Effects 或错误 output pattern。
- 目标 skill 的 identity 仍然成立，只是某个局部 Rule、Pattern、Boundary、Effects、Workflow、References、Validation 或 metadata surface 已 stale。
- 用户明确要求根据这次真实 case patch 目标 skill。

Do not use when:

- 用户要创建非 workflow 的 case-rooted skill；使用 `notate`。
- 用户要创建 public workflow skill；使用 `conduct`。
- 用户只要求 structure-audit，且没有真实 patch case。
- 目标 skill identity 不成立；MUST 停止并报告，删除旧 skill 是用户或普通文件操作。
- 用户要改造外部 skill 进入目标体系；外部 skill 只能作为创建新 skill 的参考材料。
- 用户要普通 code review、bug fix、prose cleanup、verifier/schema/CLI implementation。

## Boundary

Soft:

- MUST 在修改 skill 前要求真实 patch case。
- MUST 识别 target skill 和 case 暴露的 stale surface。
- MUST 保持 target skill identity。
- target identity 不成立时，MUST 停止并报告；MUST NOT patch 它。
- MUST 默认 patch OpenAI/Codex skill，除非用户指定其他 target。
- MUST 只在 Partita landing 中应用 Partita family、source shape、policy 和 checks。
- MUST 让 skill runtime 携带执行自身 Rule、Pattern、Boundary、Workflow 和 Validation 所需的本地概念定义。
- 没有真实 case 时，MUST NOT 运行 structure-audit。
- MUST 在修改前定位 target skill source truth。
- installed/global/runtime skill copies MUST 视为 installed runtime copies；MUST NOT 直接把 runtime copy 当作 patch target。
- 当用户给出 runtime copy path 时，MUST 找到 owning source skill 并 patch source；找不到 source truth 时，MUST 停止并报告 blocker。
- MUST 选择能防止复发的最小 patch。
- MUST 按 [case feedback](references/case-feedback.md) 在 target skill references 中添加或更新真实 recurrence case，除非同一 case 已经存在。

Hard:

- When: Partita landing 中修改 skill source、local references、frontmatter、`agents/openai.yaml` 或 generated files。
  Do: MUST 运行 `pnpm verify`。

- When: Partita landing 中完成 repo 变更前。
  Do: MUST 运行 `pnpm verify`。

- When: Partita landing 中需要同步 installed/global Codex skill runtime。
  Do: MUST 运行 owning install/sync command；MUST NOT 手动编辑 installed runtime copy。

## Effects

- Conversation: MAY 展示 target skill、patch case summary、stale surface、变更后的 rule 和验证结果。
- Filesystem: MAY 只更新 target source skill、case feedback reference、直接 stale 的本地 references、`agents/openai.yaml`；在 Partita landing 中 MAY 更新直接需要的 generated files。
- Filesystem: MUST NOT 直接编辑 installed/global/runtime skill copy。
- External: none.

## Workflow

1. 读取 target skill 和真实 patch case。材料不足时，MUST 使用本地 insufficient-material reference 并停止。
2. 读取 [case](references/case.md)，确认输入是可治理的真实 patch case。
3. 读取 [skill patch](references/skill-patch.md) 和 [case feedback](references/case-feedback.md)，确认 patch case 字段可读。
4. 定位 target skill source truth；如果读到的是 installed/runtime copy，先找到 owning source skill。
5. 读取 [OpenAI skill](references/openai-skill.md)，确认 target runtime shape 仍然成立。
6. 如果目标是 Partita landing，读取 [Partita skill](references/partita-skill.md)，确认 Partita family、shape、policy 和 checks 仍然成立。
7. 确认 target skill identity 仍然成立；否则 MUST 停止并报告 identity invalid。
8. 定位 case 暴露的最小 stale surface。
9. 在 target skill references 中添加或更新 case feedback。
10. 只 patch 该 stale surface，以及直接需要同步的 metadata、references 或 generated files。
11. 运行 target source 或 Partita landing 要求的 checks；需要同步 runtime copy 时运行 owning install/sync command。

## References

- 材料不足时，MUST 使用 [insufficient material](references/insufficient-material.md)。
- 判断 case 概念和最小字段时，MUST 使用 [case](references/case.md)。
- patch skill 时，MUST 使用 [skill patch](references/skill-patch.md)。
- 写回真实 recurrence case 时，MUST 使用 [case feedback](references/case-feedback.md)。
- patch OpenAI/Codex skill 时，MUST 使用 [OpenAI skill](references/openai-skill.md)。
- 目标是 Partita landing 时，MUST 使用 [Partita skill](references/partita-skill.md)。
- 避免 installed runtime copy 被直接 patch 时，MUST 使用 [runtime copy case](references/runtime-copy-case.md)。

## Validation

Before done:

- 已识别真实 patch case 和 target skill，或材料不足已被打回；
- 已定位 target skill source truth，没有直接 patch installed/global/runtime copy；
- patch 前 target identity 仍然成立；
- target skill references 已按 case feedback 格式添加或更新真实 recurrence case；
- patch 小于 rewrite，且限制在 case 暴露的 stale surface 内；
- target runtime shape 仍然成立；
- Partita landing 中 Partita shape、metadata 和 checks 仍然成立；
- 如果需要同步 installed runtime，已运行 owning install/sync command；
- `retune` 没有执行 structure-audit、外部 skill 迁移、新 skill 创建或 identity repair；
- Effects 保持在声明的 filesystem scope 内；
- target runtime 或 Partita landing 要求的 checks 已通过，或准确 blocker 已报告。
