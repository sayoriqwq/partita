# Tension: Generality vs Fixture Specificity

## Tension

Psychogram 需要具体 fixture 来测试系统是否可用，但具体 fixture 也可能把自己的领域概念泄漏进 harness。

## Pole A

Concrete fixtures make the system testable and grounded.

## Pole B

The harness must stay domain-neutral.

## Why they conflict

Fixture 越真实，越容易暴露系统问题；但也越容易诱导 agent 把 fixture 的具体概念提升成通用规则。

## Current resolution

Fixture 内容只能保存在 `fixtures/`。Harness 只吸收可泛化的 observation、rule、workflow 或 lint 标准。

## Tradeoff

Harness 会显得更抽象，但保持可复用。

## Revisit when

当多个不同 fixture 都暴露同一个结构缺口时，重新判断是否需要提升为 harness 规则。

## Related questions

- [[../questions/what-belongs-in-the-harness]]
- [[../questions/when-should-a-page-type-be-universal]]

## Related claims

- [[../claims/fixtures-must-not-leak-into-the-harness]]

## Related workflows

- [[../workflows/run-fixture]]
- [[../workflows/lint-harness]]
