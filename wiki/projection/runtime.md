# Runtime

Runtime projection is the concrete form used by an agent runtime.

Current Codex surfaces include `SKILL.md`, `agents/openai.yaml`, optional
`scripts/`, `references/`, and `assets/` resource directories,
`skills/DISPATCHER.md`, `.codex-plugin/plugin.json`, `package.json` metadata,
and the Partita verifier.

Runtime installation may flatten skill directories by frontmatter name. Source
families such as `skills/primitive/<name>` are maintained in the repository and
dispatcher projection; they are not required to appear as nested global install
paths.

See [[projection/codex/index]].
