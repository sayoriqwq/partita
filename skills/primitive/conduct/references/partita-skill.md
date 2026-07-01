# Partita Skill

## Family

Partita family 是 source 组织方式和 inventory handle 约定。

- public workflow skills 使用 `skills/` 下受支持的 direct skill path。
- internal primitive skills 使用 `skills/primitive/<name>/`。
- expression protocol skills 使用 `skills/expression/<name>/`。
- external authority link skills 使用 `skills/link/<name>/`。
- orientation skills 使用 `skills/orientation/<name>/`。
- maintenance skills 使用 `skills/maintenance/<name>/`。
- Partita family 是 source 组织方式，不是 OpenAI target requirement。
- Partita skill 仍然 MUST 满足 OpenAI skill target shape。

## Shape

Partita V1 `SKILL.md` 使用以下 section 顺序：

```text
## Rule
## Pattern
## Boundary
## Effects
## Workflow
## References
## Validation
```

每个 Partita skill MUST 有 `agents/openai.yaml`。

local references MUST 能被 installed runtime skill 直接加载。

## Policy

`policy.allow_implicit_invocation` MUST 根据 Pattern precision 和 side-effect risk 决定。

side-effect risk 高的 workflow skill SHOULD 默认使用 `false`。

## Dispatcher

dispatcher 是 Partita materialized skill inventory report。

dispatcher 将 Partita source skills 列成 audit table，并暴露 invocation policy。

expression source skills 映射到 `ex:<name>`。

link source skills 映射到 `lk:<name>`。

maintenance source skills 映射到 `mt:<name>`。

dispatcher generated output 位于 `harness/skills/dispatcher.md`，不是 `skills/` 内容。

dispatcher 不是 OpenAI skill target requirement。

installed global Codex skills 通过各自的 `description` 触发，不通过 Partita dispatcher。

## Checks

Partita landing 中：

- 当 skill frontmatter、`agents/openai.yaml`、inventory input 或 generated files 变化时，MUST 运行 `pnpm generate:check`。
- 完成 Partita repo change 前，MUST 运行 `pnpm verify`。
- 如果 checks 无法运行，报告准确 blocker。
