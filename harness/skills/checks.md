# Checks

## Definition

Partita `checks` 是验证 Partita-generated 或 Partita-managed skill surfaces 的 local commands。

## Commands

```bash
pnpm generate:check
pnpm verify
```

## Rules

- 当 skill frontmatter、`agents/openai.yaml`、dispatcher input 或 generated files 变化时，MUST 运行 `pnpm generate:check`。
- dispatcher generated output MUST 位于 `harness/skills/dispatcher.md`。
- 完成 Partita repo change 前，MUST 运行 `pnpm verify`。
- 如果 checks 无法运行，agent MUST 报告准确 blocker。
- 通过 OpenAI skill shape checks 不足以完成 Partita landing。
- 通过 Partita checks 不会取消 target runtime self-containment 的要求。
