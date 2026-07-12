# Workflow: Update Template

## Purpose

更新 `template/`，同时保持它 domain-neutral。

## Read first

1. [[../glossary]]
2. [[../lead]]
3. [[../agents/roles/template-architect]]
4. [[../questions/what-is-the-minimum-universal-wiki-shape]]
5. [[../tensions/template-neutrality-vs-opinionated-structure]]

## Steps

1. 判断修改是否跨多个 concept wiki 都稳定需要。
2. 如果只是 fixture-specific，不修改 template。
3. 如果是通用结构，更新 template 文件或空目录。
4. 避免添加领域样例。
5. 更新 harness index/log。
6. 用 fixture 重新验证 template 是否仍然中立。

## Done when

- Template 仍可用于任意概念。
- 没有具体领域词汇、claim、question 或 tension。
- Template agent workflows 不污染 content wiki。

## Related

- [[run-fixture]]
- [[lint-harness]]
- [[../claims/templates-should-be-domain-neutral]]
