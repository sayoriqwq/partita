# Partita Skill

## Family

Partita family 是 source 组织方式。

- public workflow skills MAY 使用 `skills/` 下受支持的 direct skill path。
- `skills/primitive/<name>/` 是 Partita-managed base/source-governance family；目录本身不赋予 internal、private 或 model-invoked runtime role。
- expression protocol skills 使用 `skills/expression/<name>/`。
- external authority link skills 使用 `skills/link/<name>/`。
- orientation skills 使用 `skills/orientation/<name>/`。
- maintenance skills 使用 `skills/maintenance/<name>/`。
- Partita family 是 source 组织方式，不是 OpenAI target requirement。
- Primitive/Workflow 与 Partita family 分开判断：implementation 调用零个 Skill 是 Primitive；调用一个或多个 predeclared Skills 是 Workflow。
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

## Marker

Partita skill 激活期间，每条用户可见回复的第一行 MUST 是 `<family emoji> <Markdown title/display name>[ + <Display Name>...]`。owning Workflow 保持第一位，保留 overall outcome、envelope、effect policy、termination 与 next-step ownership；component 在声明 scope 内执行自己的 Effect。只追加实质改变本次回复的 contributor；active-but-inert skill 不出现。

## Policy

current Partita-owned public runtime catalog MUST 使用 `policy.allow_implicit_invocation: false`。

新 public Workflow skill MUST 使用 `false`。显式调用 Workflow 后调用其 closed predeclared components 不改变 top-level invocation policy。future internal/model-invoked top-level role 不在本 creation path 内。

## Checks

Partita landing 中：

- 当 skill frontmatter、`agents/openai.yaml`、source skill files 或 generated files 变化时，MUST 运行 `pnpm verify`。
- 完成 Partita repo change 前，MUST 运行 `pnpm verify`。
- 如果 checks 无法运行，报告准确 blocker。
