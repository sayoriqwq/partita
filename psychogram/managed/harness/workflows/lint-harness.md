# Workflow: Lint Harness

## Purpose

检查 psychogram 是否发生 fixture leakage、template contamination 或 system/generated-wiki 边界混淆。

## Read first

1. [[../glossary]]
2. [[../lead]]
3. [[../agents/roles/harness-linter]]
4. [[../index]]

## Checks

- Root 不应有 generated wiki 目录：`wiki/`、`guide/`、`_staging/`、`agents/`、root `glossary.md`、root `index.md`、root `log.md`。
- `harness/` 不应保存具体 fixture 的领域页面。
- `template/` 不应保存具体领域内容或样例页面。
- `template/wiki/` 不应默认包含 maintenance workflow。
- Generated wiki maintenance workflow 应位于 `agents/workflows/`。
- Fixture output 可以有领域内容，但不能反哺为 harness 内容。
- Runtime-specific 内容应位于 `projections/`。
- Question 页必须说明 `Why this is a question`。
- Tension 页必须说明 poles、conflict、resolution、tradeoff 和 revisit condition。

## Leakage grep

对每个具体 fixture，可以维护一组 fixture-only 词，并检查它们不出现在 `harness/` 或 `template/` 中，除非是在明确的 fixture reference 或 lint 规则中。

## Done when

- 所有层级边界清楚。
- 可修复污染已移回 fixture、template 或 projection 的正确位置。
- 需要理论判断的问题已进入 harness question 或 tension。

## Related

- [[run-fixture]]
- [[update-template]]
- [[project-runtime-config]]
- [[../claims/fixtures-must-not-leak-into-the-harness]]
