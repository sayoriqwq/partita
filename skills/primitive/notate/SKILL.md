---
name: notate
description: "Use when creating a case-rooted Partita skill from an evidence-anchored skill case with default failure, pressure, recognition surface, governance action, and source family. Not for public workflow skill creation, patching existing skills, abstract capability requests, hypothetical scenarios, or verifier implementation."
---

# Notate

激活时，第一条用户可见行 MUST 以内联 `🎼 notate` 开头。

## Rule

面对足以创建 case-rooted Partita skill 的 evidence-anchored skill case 时，MUST 先填充并确认 creation form，投影出 identity、invocation、rule、metadata 和 source files，避免创建 task category prompt、泛能力文件、runtime 合法但不能治理行为的 skill，或 family/marker/reference 错配的 source skill。

## Pattern

Use when:

- creating a case-rooted Partita skill from an evidence-anchored skill case with default failure, pressure, recognition surface, governance action, and source family.

Do not use when:

- public workflow skill creation, patching existing skills, abstract capability requests, hypothetical scenarios, or verifier implementation.

## Boundary

Soft:

- MUST 在创建 case-rooted skill 前要求 evidence-anchored skill case。
- MUST 打回不能支撑 evidence、default failure、pressure、recognition surface 和 governance action 的材料。
- MUST NOT 编造 case、evidence、pressure、recognition surface、governance action、target runtime shape 或本地概念定义。
- MUST 创建 Partita source skill；OpenAI/Codex shape 只是 Partita source skill 的 runtime compatibility target。
- MUST 应用 Partita family、source shape、policy 和 checks。
- MUST 先判定 source family，再通过 projection 确定 path、handle、marker 和 `agents/openai.yaml` metadata。
- MUST NOT 把 Partita landing 的新 skill 默认放进 `skills/primitive/`；只有 Partita-managed base skill 才使用 primitive family。
- MUST 对齐 Partita family marker convention；expression 使用 `💬`，link 使用 `🔗`，orientation 使用 `🧭`，maintenance 使用 `🧹`，primitive 使用 `🎼 <name>`。
- MUST 在 skill family、handle 或 marker 有多种合理解读时先使用 interpretation gate。
- MUST 保持每个 case-rooted skill 只有一个 primary pressure 和一个 primary governance action。
- MUST 把 governance action 写成治理介入点，不把完整 skill spec 塞进 case。
- MUST 让 skill runtime 携带执行自身 Rule、Pattern、Boundary、Workflow 和 Validation 所需的本地概念定义。
- MUST 只把外部 skill 和已删除旧 skill 当作参考，不能当作 source of truth。
- 如果材料不足但可补救，SHOULD 只询问最小缺失 case material。

Hard:

- When: Partita landing 中修改 skill frontmatter、`agents/openai.yaml`、source skill files 或 generated files。
  Do: MUST 运行 `pnpm verify`。

- When: Partita landing 中完成 repo 变更前。
  Do: MUST 运行 `pnpm verify`。

## Effects

- Conversation: MAY 展示打回原因、creation brief、governance rule、skill path、handle、projection 和验证结果。
- Filesystem: MAY 在 `skills/<family>/<name>/` 下创建 Partita source skill、`agents/openai.yaml`、本地 references 和直接需要的 generated files。
- External: none.

## Workflow

1. 读取 evidence-anchored skill case。材料不足时，MUST 使用本地 insufficient-material reference 并停止。
2. 读取 [case](references/case.md)，确认输入是可治理的真实 skill case。
3. 读取 [skill creation](references/skill-creation.md)，按 information collection flow 补齐 creation fields。
4. 读取 [rule](references/rule.md)，确保新 skill 的 `## Rule` 是从 case governance action 投影出的单一 runtime imperative。
5. 读取 [Partita skill](references/partita-skill.md)，确定 Partita family、handle、marker、shape、policy 和 checks。
6. 读取 [OpenAI skill](references/openai-skill.md)，确认 Partita source skill 满足 OpenAI/Codex runtime shape。
7. 确认目标不是 public workflow skill 或已有 skill patch；否则路由到 `conduct` 或 `retune`。
8. 使用 [skill creation](references/skill-creation.md) 中的可复制模板创建 `SKILL.md`；创建可用时的 `agents/openai.yaml`、必要本地 references，以及 Partita landing 中直接需要的 generated files。
9. 运行 target runtime 或 Partita landing 要求的 checks，或报告准确 blocker。

## References

- 材料不足时，MUST 使用 [insufficient material](references/insufficient-material.md)。
- 判断 case 概念和最小字段时，MUST 使用 [case](references/case.md)。
- 定义 runtime `## Rule` 时，MUST 使用 [rule](references/rule.md)。
- 创建 case-rooted skill 时，MUST 使用 [skill creation](references/skill-creation.md)。
- 创建 Partita source skill 时，MUST 使用 [Partita skill](references/partita-skill.md)。
- 确认 OpenAI/Codex runtime shape 时，MUST 使用 [OpenAI skill](references/openai-skill.md)。
- 修补 family、handle 或 marker 误判时，MUST 使用 [family marker case](references/family-marker-case.md)。

## Validation

Before done:

- 输入是 evidence-anchored skill case，或材料不足已被打回；
- 创建文件前，evidence、default failure、pressure、recognition surface、governance action、identity、invocation、rule、target runtime shape、本地概念定义、trigger/use boundary/effects/workflow/validation 已明确；
- 创建的 `## Rule` 是单一 runtime governance constraint，没有展开 workflow、validation、boundary 或 effects；
- `SKILL.md` 使用了本地可复制模板，且 marker 没有被写成 Conversation effect 的 optional display；
- 创建的 Partita source skill 满足 OpenAI/Codex target shape；
- 创建的 source skill family、path、handle、marker 和 metadata projection 一致；
- expression/link/orientation/maintenance/primitive family 已按目标行为选择，没有默认回落到 primitive；
- 创建的 source skill 有明确的 `policy.allow_implicit_invocation`；
- `notate` 没有创建 public workflow skill、已有 skill patch、无 evidence anchor 的外部迁移或 verifier implementation；
- Effects 保持在声明的 filesystem scope 内；
- target runtime 或 Partita landing 要求的 checks 已通过，或准确 blocker 已报告。
