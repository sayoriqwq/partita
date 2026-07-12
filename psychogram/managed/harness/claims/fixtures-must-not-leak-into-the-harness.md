# Claim: Fixtures Must Not Leak Into the Harness

## Claim

Fixture 的领域内容不得进入 psychogram harness；只有可泛化的 fixture observation 才能提升为 harness 规则。

## Why it matters

Fixture 越具体，越能测试系统；但如果 fixture 内容被写进 harness，psychogram 会从通用系统退化成某个样例的专用结构。

## Supports

- [[../concepts/fixture]]
- [[../concepts/harness]]
- [[../workflows/run-fixture]]
- [[../workflows/lint-harness]]

## Challenges

- Fixture 暴露的问题往往看起来像系统问题，需要判断哪些能泛化。
- 太严格会让 harness 变得抽象，难以指导实现。

## Related questions

- [[../questions/what-belongs-in-the-harness]]

## Related tensions

- [[../tensions/generality-vs-fixture-specificity]]

## Related workflows

- [[../workflows/run-fixture]]
- [[../workflows/lint-harness]]
