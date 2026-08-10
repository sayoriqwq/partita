---
name: conduct
description: "Use when the user explicitly invokes conduct to create a public workflow skill from an evidence-anchored workflow case with default failure, workflow pressure, recognition surface, orchestration action, and target runtime shape. Not for case-rooted non-workflow skill creation, patching existing skills, running workflows, abstract workflow wishes, or verifier implementation."
---

# Conduct

激活时，第一条用户可见行 MUST 以内联 `🎼 conduct` 开头。

## Rule

面对足以创建 public workflow skill 的 evidence-anchored workflow case 时，MUST 先写出 evidence、default failure、至少一个 workflow pressure、recognition surface、orchestration action、target runtime shape 和本地概念定义，避免创建 task category、大 prompt，或没有治理动作的 internal skill bundle。

## Pattern

Use when:

- the user explicitly invokes conduct to create a public workflow skill from an evidence-anchored workflow case with default failure, workflow pressure, recognition surface, orchestration action, and target runtime shape.

Do not use when:

- case-rooted non-workflow skill creation, patching existing skills, running workflows, abstract workflow wishes, or verifier implementation.

## Boundary

Soft:

- MUST 在创建 public workflow skill 前要求 evidence-anchored workflow case。
- MUST 打回不能支撑 evidence、default failure、至少一个 workflow pressure、recognition surface、orchestration action 和 target runtime shape 的材料。
- MUST NOT 编造 workflow case、evidence、routing、gate logic、disclosure boundary、recognition surface、target runtime shape 或 A/Y/X。
- MUST 默认创建 OpenAI/Codex skill，除非用户指定其他 target。
- MUST 只在 Partita landing 中应用 Partita family、source shape、policy 和 checks。
- MUST 保持 public workflow skill 自己的 governance rule，不把它和被路由的 internal skills 混在一起。
- MUST 让 public workflow owns top-level marker、response envelope、effect budget 与 termination；每个 composed state/protocol component MUST 明确 Input、Transition、Output、Effects、Termination 与 Disclosure。
- explicit-only public skill MUST NOT 被 workflow 自动激活；workflow 只能读取已由用户显式建立的 active state、处理显式 co-invocation，或携带自包含的 local contract projection。
- Partita public workflow MUST 默认使用 `policy.allow_implicit_invocation: false`；只有用户明确要求 future internal/model-invoked role 且 composition contract 已通过 interpretation gate 时，才可使用 `true`。
- MUST 让 skill runtime 携带执行自身 Rule、Pattern、Boundary、Workflow 和 Validation 所需的本地概念定义。
- MUST 只把外部 workflow skills 和已删除旧 skill 当作参考，不能当作 source of truth。
- 如果材料不足但可补救，SHOULD 只询问最小缺失 workflow material。

Hard:

- When: 用户没有显式调用 `conduct`。
  Do: MUST NOT 使用 `🎼 conduct` marker、创建 workflow skill 或套用本协议。

- When: Partita landing 中修改 skill frontmatter、`agents/openai.yaml`、source skill files 或 generated files。
  Do: MUST 运行 `pnpm verify`。

- When: Partita landing 中完成 repo 变更前。
  Do: MUST 运行 `pnpm verify`。

## Effects

- Conversation: MAY 展示打回原因、workflow rule、gate logic、internal skill routing、disclosure boundary 和验证结果。
- Filesystem: MAY 创建一个 OpenAI/Codex public workflow skill folder；在 Partita landing 中 MAY 在受支持的 direct skill path 下创建 public workflow source skill、`agents/openai.yaml`、本地 references 和直接需要的 generated files。
- External: none.

## Workflow

1. 确认用户显式调用了 `conduct`，再读取 evidence-anchored workflow case。材料不足时，MUST 使用本地 insufficient-material reference 并停止。
2. 读取 [case](references/case.md)，确认输入是可治理的 evidence-anchored workflow case。
3. 读取 [workflow creation](references/workflow-creation.md)，读出 workflow A/Y/X、gate logic、outer owner、internal skill routing、component composition contract 和 disclosure boundary。
4. 读取 [rule](references/rule.md)，确保 public workflow skill 的 `## Rule` 是单一 runtime imperative，不是 workflow steps。
5. 读取 [OpenAI skill](references/openai-skill.md)，确定默认 target runtime shape。
6. 如果目标是 Partita landing，读取 [Partita skill](references/partita-skill.md)，确定 Partita family、shape、policy 和 checks。
7. 确认目标是 public workflow skill；否则停止并给出显式调用 `notate` 或 `retune` 的 typed recommendation，不得自动激活另一个 explicit-only skill。
8. 创建 skill 文件：`SKILL.md`、可用时的 `agents/openai.yaml`、必要本地 references，以及 Partita landing 中直接需要的 generated files。
9. 运行 target runtime 或 Partita landing 要求的 checks，或报告准确 blocker。

## References

- 材料不足时，MUST 使用 [insufficient material](references/insufficient-material.md)。
- 判断 case 概念和最小字段时，MUST 使用 [case](references/case.md)。
- 定义 runtime `## Rule` 时，MUST 使用 [rule](references/rule.md)。
- 创建 workflow skill 时，MUST 使用 [workflow creation](references/workflow-creation.md)。
- 创建 OpenAI/Codex skill 时，MUST 使用 [OpenAI skill](references/openai-skill.md)。
- 目标是 Partita landing 时，MUST 使用 [Partita skill](references/partita-skill.md)。

## Validation

Before done:

- 输入是 evidence-anchored workflow case，或材料不足已被打回；
- 创建文件前，evidence、default failure、至少一个 workflow pressure、recognition surface、workflow A/Y/X、gate logic、outer owner、internal skill routing、每个 component 的 Input/Transition/Output/Effects/Termination/Disclosure、target runtime shape 和本地概念定义已明确；
- 创建的 `## Rule` 是单一 runtime governance constraint，没有展开 workflow、validation、boundary 或 effects；
- 创建的 OpenAI/Codex public workflow skill 满足 target shape；
- workflow 是唯一 top-level marker/envelope/effect/termination owner，没有自动激活 explicit-only public skill；
- Partita landing 中创建的 public workflow skill 有 `agents/openai.yaml`，且 `policy.allow_implicit_invocation` 决策明确；
- `conduct` 没有创建非 workflow skill、已有 skill patch、无 evidence anchor 的外部迁移或 verifier implementation；
- Effects 保持在声明的 filesystem scope 内；
- target runtime 或 Partita landing 要求的 checks 已通过，或准确 blocker 已报告。
