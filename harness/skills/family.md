# Skill Family

## Definition

Partita `skill family` 是 Partita-managed skills 的 source 组织方式和 routing convention。

## Families

- `skills/expression/<name>/` 存放 expression protocol source skills。
- `skills/link/<name>/` 存放 external authority link source skills。
- `skills/primitive/<name>/` 存放 Partita-managed primitive source skills。
- `skills/orientation/<name>/` 存放 Partita-managed orientation source skills。
- `skills/maintenance/<name>/` 存放 Partita-managed maintenance source skills。
- direct `skills/<name>/` 存放 supported public 或 standalone source skills。

## Rules

- `skills/` 是 Partita 当前 skill source input，不是 dispatcher 输出位置。
- `skills/` 后续可以拆成独立 skill 族并 pin 回 Partita。
- `skills/expression/*` 是 Partita source family，不是 lifecycle mode 的定义。
- `skills/link/*` 是 Partita source family，不是 projection 分发机制。
- `skills/primitive/*` 是 Partita source family，不是 primitive skill 的 portable 定义。
- `skills/orientation/*` 是 Partita source family，不是 OpenAI target requirement。
- `skills/maintenance/*` 是 Partita source family，不是 OpenAI target requirement。
- source family 决定 dispatcher handle prefix。
- global Codex 安装是 flat 的；family folders 只是 Partita source 组织方式。
- Partita skill 仍然 MUST 满足 OpenAI skill target shape。
