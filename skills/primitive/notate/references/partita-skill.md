# Partita Skill

## Family

Partita family 是 source 组织方式。

- `skills/primitive/<name>/` 存放 Partita-managed primitive source skills。
- `skills/expression/<name>/` 存放 expression protocol source skills。
- `skills/link/<name>/` 存放 external authority link source skills。
- `skills/orientation/<name>/` 存放 Partita-managed orientation source skills。
- `skills/maintenance/<name>/` 存放 Partita-managed maintenance source skills。
- direct `skills/<name>/` 存放 supported public 或 standalone source skills。
- `skills/primitive/*` 是 Partita source family，不是 primitive skill 的 portable 定义。
- Partita skill 仍然 MUST 满足 OpenAI skill target shape。

## Family Selection

Partita landing 中，agent MUST 根据 target behavior 选择 source family。

- request-orientation、目标校准、推进边界或决策姿态属于 `orientation`。
- expression protocol、讲解输出协议、文本密度、概念展开或概念边界说明属于 `expression`。
- external authority link、pin、外部来源入口属于 `link`。
- cleanup、reconcile、治理维护动作属于 `maintenance`。
- Partita-managed base skill、skill creation、skill patch、workflow creation、source governance 或本 repo 基础能力属于 `primitive`。

agent MUST NOT 因为 target 是 Partita landing 就默认选择 `primitive`。

如果 family、handle 或 marker 有多种合理解读，agent MUST 先使用 interpretation gate。

## Marker And Handle

Partita family marker convention:

- `expression`: handle `ex:<name>`，marker `💬` 或 `💬 <name>`。
- `link`: handle `lk:<name>`，marker `🔗` 或 `🔗 <name>`。
- `orientation`: handle `og:<name>`，marker `🧭` 或 `🧭 <name>`。
- `maintenance`: handle `mt:<name>`，marker `🧹` 或 `🧹 <name>`。
- `primitive`: handle `pm:<name>`，marker `🎼 <name>`。

`agents/openai.yaml` 的 `default_prompt` SHOULD 使用同一 handle。

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

## Checks

Partita landing 中：

- 当 skill frontmatter、`agents/openai.yaml`、source skill files 或 generated files 变化时，MUST 运行 `pnpm verify`。
- 完成 Partita repo change 前，MUST 运行 `pnpm verify`。
- 如果 checks 无法运行，报告准确 blocker。
