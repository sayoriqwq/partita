---
name: notate
description: "Use when creating a case-rooted OpenAI/Codex skill from a real case with enough material for default failure, pressure, governance action, and target runtime shape. In Partita landing, creates a Partita primitive source skill. Not for public workflow skill creation, patching existing skills, abstract capability requests, hypothetical scenarios, or verifier implementation."
---

# Notate

激活时，第一条用户可见行 MUST 以内联 `🎼 notate` 开头。

## Rule

面对足以创建 case-rooted runtime skill 的真实 case 时，MUST 先写出它的 default failure、pressure、governance action、target runtime shape 和本地概念定义，避免创建 task category prompt、泛能力文件，或 runtime 合法但不能治理行为的 skill。

## Pattern

Use when:

- 用户提供真实 case，且材料足以读出 default failure、pressure 和 governance action。
- 用户明确要从真实 case 创建新的 case-rooted skill。
- 目标是默认 OpenAI/Codex skill，或用户明确要求在 Partita landing 中创建 primitive source skill。
- 旧 skill 已被用户手动删除，旧材料只作为参考，当前目标是从真实 case 创建新 skill。

Do not use when:

- 用户要创建 public workflow skill；使用 `conduct`。
- 用户要 patch 已有且 identity 成立的 skill；使用 `retune`。
- 用户只有抽象能力愿望、task category、假设场景，或没有真实 case 的外部 skill 迁移材料。
- 用户要实现 verifier、CLI、schema、安装流程，或普通项目文档。

## Boundary

Soft:

- MUST 在创建 case-rooted skill 前要求真实 case。
- MUST 打回不能支撑 default failure、pressure 和 governance action 的材料。
- MUST NOT 编造 case、pressure、governance action、target runtime shape 或本地概念定义。
- MUST 默认创建 OpenAI/Codex skill，除非用户指定其他 target。
- MUST 只在 Partita landing 中应用 Partita family、dispatcher、policy 和 checks。
- MUST 保持每个 case-rooted skill 只有一个 primary pressure 和一个 primary governance action。
- MUST 让 skill runtime 携带执行自身 Rule、Pattern、Boundary、Workflow 和 Validation 所需的本地概念定义。
- MUST 只把外部 skill 和已删除旧 skill 当作参考，不能当作 source of truth。
- 如果材料不足但可补救，SHOULD 只询问最小缺失 case material。

Hard:

- When: Partita landing 中修改 skill frontmatter、`agents/openai.yaml`、dispatcher 输入或 generated files。
  Do: MUST 运行 `pnpm generate:check`。

- When: Partita landing 中完成 repo 变更前。
  Do: MUST 运行 `pnpm verify`。

## Effects

- Conversation: MAY 展示打回原因、governance rule、target runtime、skill path、handle 和验证结果。
- Filesystem: MAY 创建一个 OpenAI/Codex skill folder；在 Partita landing 中 MAY 在 `skills/primitive/<name>/` 下创建 Partita primitive source skill、`agents/openai.yaml`、本地 references 和直接需要的 generated files。
- External: none.

## Workflow

1. 读取真实 case。材料不足时，MUST 使用本地 insufficient-material reference 并停止。
2. 读取 [skill creation](references/skill-creation.md)，按 information collection flow 补齐 creation fields。
3. 读取 [OpenAI skill](references/openai-skill.md)，确定默认 target runtime shape。
4. 如果目标是 Partita landing，读取 [Partita skill](references/partita-skill.md)，确定 Partita family、shape、policy、dispatcher 和 checks。
5. 确认目标不是 public workflow skill 或已有 skill patch；否则路由到 `conduct` 或 `retune`。
6. 使用 [skill creation](references/skill-creation.md) 中的可复制模板创建 `SKILL.md`；创建可用时的 `agents/openai.yaml`、必要本地 references，以及 Partita landing 中直接需要的 generated files。
7. 运行 target runtime 或 Partita landing 要求的 checks，或报告准确 blocker。

## References

- 材料不足时，MUST 使用 [insufficient material](references/insufficient-material.md)。
- 创建 case-rooted skill 时，MUST 使用 [skill creation](references/skill-creation.md)。
- 创建 OpenAI/Codex skill 时，MUST 使用 [OpenAI skill](references/openai-skill.md)。
- 目标是 Partita landing 时，MUST 使用 [Partita skill](references/partita-skill.md)。

## Validation

Before done:

- 输入是真实 case，或材料不足已被打回；
- 创建文件前，default failure、pressure、governance action、target runtime shape、本地概念定义、trigger/use boundary/effects/workflow/validation 已明确；
- `SKILL.md` 使用了本地可复制模板，且 marker 没有被写成 Conversation effect 的 optional display；
- 创建的 OpenAI/Codex skill 满足 target shape；
- Partita landing 中创建的是 `policy.allow_implicit_invocation: false` 的 primitive source skill；
- `notate` 没有创建 public workflow skill、已有 skill patch、无真实 case 的外部迁移或 verifier implementation；
- Effects 保持在声明的 filesystem scope 内；
- target runtime 或 Partita landing 要求的 checks 已通过，或准确 blocker 已报告。
