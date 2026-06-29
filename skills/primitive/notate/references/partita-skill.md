# Partita Skill

## Family

Partita family 是 source 组织方式和 routing 约定。

- `skills/primitive/<name>/` 存放 Partita-managed primitive source skills。
- `skills/orientation/<name>/` 存放 Partita-managed orientation source skills。
- direct `skills/<name>/` 存放 supported public 或 standalone source skills。
- `skills/primitive/*` 是 Partita source family，不是 primitive skill 的 portable 定义。
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

`policy.allow_implicit_invocation` MUST 是 `true` 或 `false`。

side-effect risk 高的 skill SHOULD 默认使用 `false`。

creation、patching、migration、verification 和 file-writing workflow skills SHOULD 默认使用 `false`。

## Dispatcher

dispatcher 是 Partita harness routing mechanism。

dispatcher 将 Partita source skills 映射到 runtime handles：

- `skills/primitive/<name>/` 映射到 `pm:<name>`。
- `skills/orientation/<name>/` 映射到 `og:<name>`。
- direct `skills/<name>/` 映射到 `<name>`。

dispatcher generated output 位于 `harness/skills/dispatcher.md`，不是 `skills/` 内容。

dispatcher 不是 OpenAI skill target requirement。

installed global Codex skills 通过各自的 `description` 触发，不通过 Partita dispatcher。

## Checks

Partita landing 中：

- 当 skill frontmatter、`agents/openai.yaml`、dispatcher input 或 generated files 变化时，MUST 运行 `pnpm generate:check`。
- 完成 Partita repo change 前，MUST 运行 `pnpm verify`。
- 如果 checks 无法运行，报告准确 blocker。
