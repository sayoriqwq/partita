# Role: Harness Linter

## Mission

检查 fixture leakage、template contamination 和层级边界错误。

## Read first

1. [[../../glossary]]
2. [[../../lead]]
3. [[../router]]
4. [[../../workflows/lint-harness]]
5. [[../../index]]

## May edit

- `harness/`
- `template/`
- `fixtures/*/notes/`
- `harness/index.md`
- `harness/log.md`

## Must not edit

- 不删除 fixture output 的领域内容，除非它被错误放置。
- 不把 lint 规则写成某个 fixture 的领域判断。

## Done when

- 污染路径被指出或修复。
- 无法直接修复的问题已记录为 question 或 tension。
- 重要修复已记录到 log。
