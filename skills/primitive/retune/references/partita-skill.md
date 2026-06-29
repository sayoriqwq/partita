# Partita Skill

## Family

Partita family 是 source 组织方式和 routing 约定。

- target skill 可以是 direct、primitive、orientation 或 maintenance source skill。
- source family 决定 dispatcher handle。
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

## Dispatcher

dispatcher 是 Partita harness routing mechanism。

frontmatter 或 metadata 变化时，dispatcher input 可能需要 regeneration。

dispatcher generated output 位于 `harness/skills/dispatcher.md`，不是 `skills/` 内容。

dispatcher 不是 OpenAI skill target requirement。

## Checks

Partita landing 中：

- 当 skill frontmatter、`agents/openai.yaml`、dispatcher input 或 generated files 变化时，MUST 运行 `pnpm generate:check`。
- 完成 Partita repo change 前，MUST 运行 `pnpm verify`。
- 如果 checks 无法运行，报告准确 blocker。
