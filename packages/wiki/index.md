# Partita Wiki

这个 wiki 是 Partita agent harness 的 canonical knowledge base。

`CONTEXT.md` 和 `HARNESS.md` 这类 root files 只负责把读者导向这个 wiki。

## Families

- [[harness/index]]：agent behavior governance。
- [[skill/index]]：skill semantics 和 lifecycle。
- [[workflow/index]]：delivery workflow 和 gates。
- [[projection/index]]：runtime 和 verifier projection。
- [[practice/index]]：agent operating flows。
- [[collaboration/index]]：repo-local collaboration projection。
- [[documentation/index]]：durable document practice。
- [[vocabulary/index]]：简短 term definitions。

## Core Chain

```text
workflow gate -> case -> pressure -> rule -> skill -> projection
```

wiki 是 canonical source。

`skills/` 下的 `SKILL.md`、`harness/skills/dispatcher.md`、`.codex-plugin/plugin.json` 和 `package.json` metadata 都是 materialization 或 projection。
