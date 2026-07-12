# Fixture

## Definition

Fixture 是测试 psychogram 的样例输入、输出和观察记录。它用于检查 harness 和 template 是否能生成独立 concept wiki。

## Is not

Fixture 不是 harness 内容来源，也不是真实 instance。

## Role in psychogram

Fixture 让系统保持可测试。它可以暴露 template 缺陷、workflow 缺口或 projection 问题。

## Common confusions

- Fixture output 可以包含具体概念内容。
- 只有 fixture observation 可以被泛化为 harness 规则。

## Related

- [[harness]]
- [[template]]
- [[../workflows/run-fixture]]
- [[../tensions/generality-vs-fixture-specificity]]
