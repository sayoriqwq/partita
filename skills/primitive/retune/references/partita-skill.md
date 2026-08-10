# Partita Skill

## Family

Partita family 是 source 组织方式。

- target skill 可以是 direct、expression、link、primitive、orientation 或 maintenance source skill。
- Partita family 是 source 组织方式，不是 OpenAI target requirement。
- Partita skill 仍然 MUST 满足 OpenAI skill target shape。

## Structure Surface

Partita source structure 包括 family、source path、namespaced handle、marker、metadata default prompt、local references placement 和 generated projection shape。

当 evidence-anchored patch case 暴露这些结构面错误时，retune MAY move source skill folder and update metadata，但 MUST 保持 target skill identity。

Family marker convention:

- `expression`: handle `ex:<name>`，marker `💬` 或 `💬 <name>`。
- `link`: handle `lk:<name>`，marker `🔗` 或 `🔗 <name>`。
- `orientation`: handle `og:<name>`，marker `🧭` 或 `🧭 <name>`。
- `maintenance`: handle `mt:<name>`，marker `🧹` 或 `🧹 <name>`。
- `primitive`: handle `pm:<name>`，marker `🎼 <name>`。

If family、handle 或 marker 有多种合理解读，retune MUST use interpretation gate before changing convention.

## Shape

Partita V1 `SKILL.md` shape MUST 保持不变。

Partita V1 section 顺序是：

```text
## Rule
## Pattern
## Boundary
## Effects
## Workflow
## References
## Validation
```

每个 Partita skill MUST 保持 `agents/openai.yaml` valid。

## Policy

`policy.allow_implicit_invocation` MUST 保持 `true` 或 `false`。

current Partita-owned public runtime skill MUST 保持 `false`。如果 patch 试图改为 implicit，MUST 先把它视为 future internal/model-invoked role change，并对 role、composition ownership、effects、disclosure 与 trigger precision 使用 interpretation gate。

## Checks

Partita landing 中：

- 当 skill frontmatter、`agents/openai.yaml`、source skill files 或 generated files 变化时，MUST 运行 `pnpm verify`。
- 完成 Partita repo change 前，MUST 运行 `pnpm verify`。
- 如果 checks 无法运行，报告准确 blocker。
