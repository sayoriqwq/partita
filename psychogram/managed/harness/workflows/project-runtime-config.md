# Workflow: Project Runtime Config

## Purpose

把 harness 的角色、workflow 或规则投射到具体 runtime，同时不改变 source of truth。

## Read first

1. [[../glossary]]
2. [[../lead]]
3. [[../agents/roles/projection-builder]]
4. [[../questions/when-should-a-runtime-feature-become-a-projection]]
5. [[../../projections/codex]]

## Steps

1. 明确 runtime 的能力和限制。
2. 找到它对应的 harness role 或 workflow。
3. 在 `projections/` 中记录映射方式。
4. 不把 runtime-only 规则写回 harness 核心。
5. 如果 projection 暴露通用缺口，先写 fixture observation 或 harness question。

## Done when

- Projection 可解释 runtime 如何执行 psychogram。
- Harness 和 template 不依赖该 runtime。
- Source of truth 仍在 harness/template 文档中。

## Related

- [[lint-harness]]
- [[../concepts/projection]]
- [[../tensions/system-docs-vs-generated-wiki-docs]]
