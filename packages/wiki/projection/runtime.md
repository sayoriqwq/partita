# Runtime

`runtime projection` 是 agent runtime 实际读取的 concrete form。

当前 Codex runtime surfaces 包括 `SKILL.md`、`agents/openai.yaml`，以及 optional `scripts/`、`references/` 和 `assets/` resource directories。

Partita harness projection surfaces 包括 `harness/skills/dispatcher.md`、`.codex-plugin/plugin.json`、`package.json` metadata 和 Partita verifier。

runtime installation 可以按 frontmatter name flatten skill directories。

source families，例如 `skills/expression/<name>`、`skills/link/<name>`、`skills/orientation/<name>`、`skills/maintenance/<name>` 和 `skills/primitive/<name>`，由 repository 和 harness dispatcher projection 维护，不要求以 nested global install paths 存在。

参见 [[projection/generic]] 和 [[projection/verifier/index]]。
