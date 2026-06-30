# Shape

shape checks 验证 supported runtime files。

当前 `SKILL.md` body shape 是 V1：

```text
## Rule
## Pattern
## Boundary
## Effects
## Workflow
## References
## Validation
```

legacy sections 无效：`Primitive Audit`、`Capability`、`Trigger`、`Template`、`Protocol`、`Surface`、`External State`、`Soft Boundary` 和 `Hard Boundary`。

supported skill directory entries 遵循 official Codex skill resource shape：`SKILL.md`、`agents/`、`scripts/`、`references/` 和 `assets/`。

Partita 额外要求 `agents/openai.yaml`，用于 invocation policy projection。

`references/` 保持 one-level，让 conditional context 可以直接从 `SKILL.md` 发现。

`scripts/` 和 `assets/` 是 bundled resources，可以包含 implementation 或 output files。

supported namespace roots under `skills/` 由 verifier 维护。

当前 namespaces：

- `expression` 是 expression protocol source family，投影为 `ex:<name>`。
- `link` 是 external authority link source family，投影为 `lk:<name>`。
- `orientation` 是 request-orientation source family，投影为 `og:<name>`。
- `maintenance` 是 cleanup and residue source family，投影为 `mt:<name>`。
- `primitive` 是 Partita-managed base source family，投影为 `pm:<name>`。

hard verification surfaces 包括 generated-file checks、`partita verify`、tests、package checks，以及 target 使用 Effect harness 时的 Effect harness verification。
