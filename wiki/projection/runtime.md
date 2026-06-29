# Runtime

Runtime projection is the concrete form used by an agent runtime.

Current Codex runtime surfaces include `SKILL.md`, `agents/openai.yaml`,
optional `scripts/`, `references/`, and `assets/` resource directories.

Partita harness projection surfaces include `harness/skills/dispatcher.md`,
`.codex-plugin/plugin.json`, `package.json` metadata, and the Partita verifier.

Runtime installation may flatten skill directories by frontmatter name. Source
families such as `skills/expression/<name>`, `skills/link/<name>`,
`skills/orientation/<name>`, `skills/maintenance/<name>`, and
`skills/primitive/<name>` are maintained in the repository and harness
dispatcher projection; they are not required to appear as nested global install
paths.

See [[projection/codex/index]].
