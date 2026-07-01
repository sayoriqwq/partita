# Partita Skill

## Family

Partita family 是 source 组织方式。

- target skill 可以是 direct、expression、link、primitive、orientation 或 maintenance source skill。
- Partita family 是 source 组织方式，不是 OpenAI target requirement。
- Partita skill 仍然 MUST 满足 OpenAI skill target shape。

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

如果 patch 改变 trigger precision 或 side-effect risk，MUST 重新判断 invocation policy。

## Checks

Partita landing 中：

- 当 skill frontmatter、`agents/openai.yaml`、source skill files 或 generated files 变化时，MUST 运行 `pnpm verify`。
- 完成 Partita repo change 前，MUST 运行 `pnpm verify`。
- 如果 checks 无法运行，报告准确 blocker。
