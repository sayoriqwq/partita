# Skill Family

## Definition

Partita `skill family` 是 Partita-managed skills 的 source 组织方式和 routing 约定。

## Families

- `skills/primitive/<name>/` 存放 Partita-managed primitive source skills。
- `skills/orientation/<name>/` 存放 Partita-managed orientation source skills。
- direct `skills/<name>/` 存放 supported public 或 standalone source skills。

## Rules

- `skills/primitive/*` 是 Partita source family，不是 primitive skill 的 portable 定义。
- `skills/orientation/*` 是 Partita source family，不是 OpenAI target requirement。
- source family 决定 dispatcher handle prefix。
- global Codex 安装是扁平目录；family folders 只是 Partita source 组织方式。
- Partita skill 仍然 MUST 满足 OpenAI skill target shape。
