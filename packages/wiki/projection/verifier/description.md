# Description

description checks 保护 Codex selector surface。

verifier 只强制 deterministic minimums：

- 长度为 40 到 500 characters；
- 以 `Use when` 或 `Use for` 开头；
- 包含 `Not for`；
- 排除 scheduling pollution：`always use`、`use for all`、`best`、`safest` 和 `recommended`。

semantic quality 仍属于 skill retuning。

verifier MUST NOT 推断 trigger 是否真的好。
