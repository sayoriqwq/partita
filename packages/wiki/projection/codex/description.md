# Description

`description` 是 Codex selector surface。

Codex 在加载完整 `SKILL.md` 前，会先看到 skill 的 `name`、`description` 和 path。

因此 `description` 是 trigger contract 和 semantic index，不是 workflow body。

最小 shape：

```text
Use when <trigger intent or artifact> requires <specific skill action or result>. Not for <nearest non-target cases>.
```

`description` SHOULD 简短，并把关键信息前置。

workflow、protocol、validation、examples、references 和 long rationale 应放在 `SKILL.md`、reference files 或 wiki nodes 中。
