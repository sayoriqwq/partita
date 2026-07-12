# System Map

## Four layers

```text
concept input
  -> psychogram harness
  -> template
  -> independent concept wiki
```

## Artifact classes

- [[../concepts/harness]] — 通用系统规则。
- [[../concepts/template]] — 生成用空骨架。
- [[../concepts/fixture]] — 测试用样例输入和输出。
- [[../concepts/instance]] — 真实独立 concept wiki。

## Content boundary

`wiki/` 是 generated concept wiki 的内容区。Harness 自己不使用根级 `wiki/`，template 只提供空内容目录，fixture output 和 instance 才能填入具体内容。

## Workflow boundary

- Harness workflow: `harness/workflows/`
- Generated wiki maintenance workflow: `agents/workflows/`
- Concept content workflow pages: 只有当某个概念本身讨论 workflow 时，才进入 generated wiki 的 `wiki/`

## Projection boundary

Runtime-specific 配置或说明进入 `projections/`。Projection 可以读取 harness 和 template，但不反向成为 source of truth。

## Related

- [[../claims/agent-operations-should-not-pollute-content-space]]
- [[../tensions/system-docs-vs-generated-wiki-docs]]
- [[../workflows/lint-harness]]
