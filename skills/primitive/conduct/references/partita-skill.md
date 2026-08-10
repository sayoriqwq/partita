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
- state、protocol、workflow 与 router 是 runtime role，MUST 与 Partita family 分开判断。
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

Partita skill 激活期间，每条用户可见回复的第一行 MUST 是 `<family emoji> <Markdown title/display name>[ + <Display Name>...]`。owning workflow 保持第一位且是唯一 envelope、effects 和 termination owner；只追加实质改变本次回复的其他已显式激活/共同调用 skill。active-but-inert skill 不出现；local contract projection MUST NOT 伪装成 public skill 或 marker contributor。

## Policy

current Partita-owned public runtime catalog MUST 使用 `policy.allow_implicit_invocation: false`。

新 public workflow skill MUST 默认使用 `false`。只有用户明确要求 future internal/model-invoked role，且 role、composition ownership、effects、disclosure 与 trigger precision 已通过 interpretation gate 时，才可选择 `true`。

## Checks

Partita landing 中：

- 当 skill frontmatter、`agents/openai.yaml`、source skill files 或 generated files 变化时，MUST 运行 `pnpm verify`。
- 完成 Partita repo change 前，MUST 运行 `pnpm verify`。
- 如果 checks 无法运行，报告准确 blocker。
