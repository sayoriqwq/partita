---
name: conduct
description: "Use when creating a public workflow skill from a real workflow case with gate logic, internal skill routing, disclosure boundary, and target runtime shape. Defaults to OpenAI/Codex skill target; in Partita landing creates a public workflow source skill. Not for case-rooted non-workflow skill creation, patching existing skills, running workflows, abstract workflow wishes, or verifier implementation."
---

# Conduct

激活时，第一条用户可见行 MUST 以内联 `🎼 conduct` 开头。

## Rule

面对足以创建 public workflow skill 的真实 workflow case 时，MUST 先写出 workflow rule、gate logic、internal skill routing、disclosure boundary、target runtime shape 和本地概念定义，避免创建 task category、大 prompt，或没有治理动作的 internal skill bundle。

## Pattern

Use when:

- 用户提供真实 workflow case，且材料足以读出 workflow default failure 和 orchestration action。
- 用户要创建对用户暴露的 public workflow skill。
- 材料包含或足以确定 gate logic、internal skill routing、disclosure boundary、target runtime shape，以及 public workflow 的 invocation policy。

Do not use when:

- 用户要创建非 workflow 的 case-rooted skill；使用 `notate`。
- 用户要 patch 已有且 identity 成立的 skill；使用 `retune`。
- 用户只是要运行某个 workflow，而不是创建 workflow skill。
- 用户只有抽象 workflow 愿望、task category、假设场景，或没有真实 workflow case 的外部 skill 迁移材料。
- 用户要实现 verifier、CLI、schema、安装流程，或普通项目文档。

## Boundary

Soft:

- MUST 在创建 public workflow skill 前要求真实 workflow case。
- MUST 打回不能支撑 workflow A/Y/X、gate logic、internal skill routing、disclosure boundary 和 target runtime shape 的材料。
- MUST NOT 编造 workflow case、routing、gate logic、disclosure boundary、target runtime shape 或 A/Y/X。
- MUST 默认创建 OpenAI/Codex skill，除非用户指定其他 target。
- MUST 只在 Partita landing 中应用 Partita family、dispatcher、policy 和 checks。
- MUST 保持 public workflow skill 自己的 governance rule，不把它和被路由的 internal skills 混在一起。
- MUST 根据 Pattern 精确度和 side-effect risk 决定 `policy.allow_implicit_invocation`。
- MUST 让 skill runtime 携带执行自身 Rule、Pattern、Boundary、Workflow 和 Validation 所需的本地概念定义。
- MUST 只把外部 workflow skills 和已删除旧 skill 当作参考，不能当作 source of truth。
- 如果材料不足但可补救，SHOULD 只询问最小缺失 workflow material。

Hard:

- When: Partita landing 中修改 skill frontmatter、`agents/openai.yaml`、dispatcher 输入或 generated files。
  Do: MUST 运行 `pnpm generate:check`。

- When: Partita landing 中完成 repo 变更前。
  Do: MUST 运行 `pnpm verify`。

## Effects

- Conversation: MAY 展示打回原因、workflow rule、gate logic、internal skill routing、disclosure boundary 和验证结果。
- Filesystem: MAY 创建一个 OpenAI/Codex public workflow skill folder；在 Partita landing 中 MAY 在受支持的 direct skill path 下创建 public workflow source skill、`agents/openai.yaml`、本地 references 和直接需要的 generated files。
- External: none.

## Workflow

1. 读取真实 workflow case。材料不足时，MUST 使用本地 insufficient-material reference 并停止。
2. 读取 [workflow creation](references/workflow-creation.md)，读出 workflow A/Y/X、gate logic、internal skill routing 和 disclosure boundary。
3. 读取 [OpenAI skill](references/openai-skill.md)，确定默认 target runtime shape。
4. 如果目标是 Partita landing，读取 [Partita skill](references/partita-skill.md)，确定 Partita family、shape、policy、dispatcher 和 checks。
5. 确认目标是 public workflow skill；否则路由到 `notate` 或 `retune`。
6. 创建 skill 文件：`SKILL.md`、可用时的 `agents/openai.yaml`、必要本地 references，以及 Partita landing 中直接需要的 generated files。
7. 运行 target runtime 或 Partita landing 要求的 checks，或报告准确 blocker。

## References

- 材料不足时，MUST 使用 [insufficient material](references/insufficient-material.md)。
- 创建 workflow skill 时，MUST 使用 [workflow creation](references/workflow-creation.md)。
- 创建 OpenAI/Codex skill 时，MUST 使用 [OpenAI skill](references/openai-skill.md)。
- 目标是 Partita landing 时，MUST 使用 [Partita skill](references/partita-skill.md)。

## Validation

Before done:

- 输入是真实 workflow case，或材料不足已被打回；
- 创建文件前，workflow A/Y/X、gate logic、internal skill routing、disclosure boundary、target runtime shape 和本地概念定义已明确；
- 创建的 OpenAI/Codex public workflow skill 满足 target shape；
- Partita landing 中创建的 public workflow skill 有 `agents/openai.yaml`，且 `policy.allow_implicit_invocation` 决策明确；
- `conduct` 没有创建非 workflow skill、已有 skill patch、无真实 case 的外部迁移或 verifier implementation；
- Effects 保持在声明的 filesystem scope 内；
- target runtime 或 Partita landing 要求的 checks 已通过，或准确 blocker 已报告。
