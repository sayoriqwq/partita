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
- MUST 只在 Partita landing 中应用 Partita family、dispatcher、policy 和 checks。
- MUST 让 skill runtime 携带执行自身 Rule、Pattern、Boundary、Workflow 和 Validation 所需的本地概念定义。
- 没有真实 case 时，MUST NOT 运行 structure-audit。
- MUST 选择能防止复发的最小 patch。
- 当复发判断需要具体 case detail 时，SHOULD 把它保留在 references。

Hard:

- When: Partita landing 中修改 skill frontmatter、`agents/openai.yaml`、dispatcher 输入或 generated files。
  Do: MUST 运行 `pnpm generate:check`。

- When: Partita landing 中完成 repo 变更前。
  Do: MUST 运行 `pnpm verify`。

## Effects

- Conversation: MAY 展示 target skill、patch case summary、stale surface、变更后的 rule 和验证结果。
- Filesystem: MAY 只更新 target skill、直接 stale 的本地 references、`agents/openai.yaml`；在 Partita landing 中 MAY 更新直接需要的 generated files。
- External: none.

## Workflow

1. 读取 target skill 和真实 patch case。材料不足时，MUST 使用本地 insufficient-material reference 并停止。
2. 读取 [skill patch](references/skill-patch.md)，确认 target skill identity 仍然成立；否则 MUST 停止并报告 identity invalid。
3. 读取 [OpenAI skill](references/openai-skill.md)，确认 target runtime shape 仍然成立。
4. 如果目标是 Partita landing，读取 [Partita skill](references/partita-skill.md)，确认 Partita family、shape、policy、dispatcher 和 checks 仍然成立。
5. 定位 case 暴露的最小 stale surface。
6. 只 patch 该 stale surface，以及直接需要同步的 metadata 或 generated files。
7. 运行 target runtime 或 Partita landing 要求的 checks，或报告准确 blocker。

## References

- 材料不足时，MUST 使用 [insufficient material](references/insufficient-material.md)。
- patch skill 时，MUST 使用 [skill patch](references/skill-patch.md)。
- patch OpenAI/Codex skill 时，MUST 使用 [OpenAI skill](references/openai-skill.md)。
- 目标是 Partita landing 时，MUST 使用 [Partita skill](references/partita-skill.md)。

## Validation

Before done:

- 已识别真实 patch case 和 target skill，或材料不足已被打回；
- patch 前 target identity 仍然成立；
- patch 小于 rewrite，且限制在 case 暴露的 stale surface 内；
- target runtime shape 仍然成立；
- Partita landing 中 Partita shape、metadata 和 checks 仍然成立；
- `retune` 没有执行 structure-audit、外部 skill 迁移、新 skill 创建或 identity repair；
- Effects 保持在声明的 filesystem scope 内；
- target runtime 或 Partita landing 要求的 checks 已通过，或准确 blocker 已报告。
