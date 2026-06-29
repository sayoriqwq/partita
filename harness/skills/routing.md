# Routing

## Definition

Partita `dispatcher` 是 Partita harness 从 Partita-managed source skills 生成的 routing index。

## Role

dispatcher 将 source skills 映射到 runtime handles：

- `skills/primitive/<name>/` 映射到 `pm:<name>`。
- `skills/orientation/<name>/` 映射到 `og:<name>`。
- `skills/maintenance/<name>/` 映射到 `mt:<name>`。
- direct `skills/<name>/` 映射到 `<name>`。
- generated output 是 `harness/skills/dispatcher.md`。

## Rules

- dispatcher 是 Partita harness routing mechanism。
- dispatcher 不属于 `skills/` 内容。
- dispatcher 不是 OpenAI skill target requirement。
- dispatcher 不定义 portable skill。
- dispatcher 暴露 skill name、handle、invocation policy、description 和 source file。
- dispatcher 帮 Partita 在 local skills 之间路由，避免手动扫描每个 skill file。
- installed global Codex skills 通过各自的 `description` 触发，不通过 Partita dispatcher。
