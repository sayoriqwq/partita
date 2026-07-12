# Question: What Is the Minimum Universal Wiki Shape?

## Question

所有 concept wiki 都应该共享的最小结构是什么？

## Why this is a question

最小结构太少，agent 很难维护；最小结构太多，template 会变得带偏见并污染新 instance。

## Current answer

当前最小结构是 root files、短期 staging、author guide、content wiki、agent maintenance layer、index 和 log。内容 page type 保留 concepts、claims、questions、tensions，agent workflow 放在 `agents/workflows/`。

## Non-answer

“把第一个成功样例的目录复制成 template”不是答案。

## Related claims

- [[../claims/templates-should-be-domain-neutral]]
- [[../claims/agent-operations-should-not-pollute-content-space]]

## Related tensions

- [[../tensions/template-neutrality-vs-opinionated-structure]]

## Related workflows

- [[../workflows/update-template]]
- [[../workflows/instantiate-concept-wiki]]
