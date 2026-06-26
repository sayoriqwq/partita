# Description

Description checks protect the Codex selector surface.

The verifier enforces only deterministic minimums:

- 40 to 500 characters;
- starts with `Use when` or `Use for`;
- includes `Not for`;
- excludes scheduling pollution: `always use`, `use for all`, `best`,
  `safest`, and `recommended`.

Semantic quality still belongs to skill retuning. The verifier must not infer
whether a trigger is truly good.
