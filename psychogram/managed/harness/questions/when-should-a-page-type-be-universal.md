# Question: When Should a Page Type Be Universal?

## Question

什么时候一个 page type 应该进入 template，成为所有 concept wiki 默认拥有的类型？

## Why this is a question

Page type 会塑造所有生成 wiki 的思考方式。过早加入会污染 template；过少保留会让 agent 缺乏稳定判断面。

## Current answer

当一个 page type 跨多个 concept wiki 都反复出现，且没有它会导致 ingest、query 或 lint 质量下降时，才考虑进入 template。

## Non-answer

“某个 fixture 需要这个页面类型”不是答案。

## Related claims

- [[../claims/templates-should-be-domain-neutral]]
- [[../claims/agent-operations-should-not-pollute-content-space]]

## Related tensions

- [[../tensions/template-neutrality-vs-opinionated-structure]]
- [[../tensions/generality-vs-fixture-specificity]]

## Related workflows

- [[../workflows/run-fixture]]
- [[../workflows/update-template]]
