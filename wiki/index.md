# Partita Wiki

This wiki is the canonical knowledge base for Partita's agent harness.

Root files such as `CONTEXT.md` and `HARNESS.md` only map readers into this
wiki.

## Families

- [[harness/index]]: agent behavior governance.
- [[skill/index]]: skill semantics and lifecycle.
- [[workflow/index]]: delivery workflow and gates.
- [[projection/index]]: runtime and verifier projection.
- [[practice/index]]: operating flows for agents.
- [[collaboration/index]]: repo-local collaboration projection.
- [[documentation/index]]: durable document practice.
- [[vocabulary/index]]: short term definitions.

## Core Chain

```text
workflow gate -> case -> pressure -> rule -> skill -> projection
```

The wiki is canonical. Runtime files such as `SKILL.md` files under `skills/`
and harness files such as `harness/skills/dispatcher.md`,
`.codex-plugin/plugin.json`, and `package.json` metadata are materializations or
projections.
