# Question: When Should a Runtime Feature Become a Projection?

## Question

什么时候某个 runtime feature 应该被记录为 projection？

## Why this is a question

Runtime feature 可以提升执行力，但如果过早进入 harness 核心，会把 psychogram 绑定到某个平台。

## Current answer

当某个 runtime feature 能稳定承载已有 harness role 或 workflow，且不改变 source of truth 时，可以在 `projections/` 中记录。

## Non-answer

“平台支持这个功能，所以 harness 应该依赖它”不是答案。

## Related claims

- [[../claims/agent-operations-should-not-pollute-content-space]]

## Related tensions

- [[../tensions/system-docs-vs-generated-wiki-docs]]

## Related workflows

- [[../workflows/project-runtime-config]]
