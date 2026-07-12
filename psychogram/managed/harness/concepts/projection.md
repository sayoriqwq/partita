# Projection

## Definition

Projection 是把 psychogram 的语义结构适配到具体 runtime 的说明、配置或生成目标。

## Is not

Projection 不是 source of truth，也不应反向决定 harness 的概念边界。

## Role in psychogram

Projection 让同一套 harness 和 template 能适配不同执行环境，同时保持系统核心不被 runtime 绑定。

## Common confusions

- Runtime 支持某能力，不等于 harness 必须加入该能力。
- Projection 应记录适配规则，而不是复制全部系统文档。

## Related

- [[agent-role]]
- [[workflow]]
- [[../questions/when-should-a-runtime-feature-become-a-projection]]
- [[../../projections/codex]]
