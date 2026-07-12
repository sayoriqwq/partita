# Question: What Belongs in the Harness?

## Question

一个设计元素什么时候属于 psychogram harness，而不是某个 fixture、template 或 instance？

## Why this is a question

如果判断过松，fixture 内容会污染 harness。如果判断过严，harness 会过于抽象，无法指导实现。

## Current answer

只有跨多个 concept wiki 都稳定需要的结构、规则、workflow、agent role、lint 标准和 projection 边界才属于 harness。单个概念里的实体、claim、workflow、问题和张力属于 fixture output 或 instance。

## Non-answer

“第一个 fixture 用到了，所以它属于 harness”不是答案。

## Related claims

- [[../claims/fixtures-must-not-leak-into-the-harness]]
- [[../claims/one-concept-should-produce-one-independent-wiki]]

## Related tensions

- [[../tensions/generality-vs-fixture-specificity]]
- [[../tensions/generality-vs-usefulness]]

## Related workflows

- [[../workflows/run-fixture]]
- [[../workflows/lint-harness]]
