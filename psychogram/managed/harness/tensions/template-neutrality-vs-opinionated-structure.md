# Tension: Template Neutrality vs Opinionated Structure

## Tension

Template 需要保持领域中立，但也需要有足够明确的结构来让生成 wiki 可维护。

## Pole A

Neutrality: template 不预装具体领域内容或样例。

## Pole B

Opinionated structure: template 提供稳定 page type、agent workflow 和导航。

## Why they conflict

结构越明确，越可能携带隐含偏见；结构越空，越难稳定维护。

## Current resolution

Template 保留通用文件和空目录，提供维护 workflow，但不提供领域内容样例。

## Tradeoff

Agent 需要在实例化时填充更多初始内容，但 template 不会污染新 wiki。

## Revisit when

当空 template 导致生成质量不稳定时，考虑增加通用说明，而不是具体样例。

## Related questions

- [[../questions/what-is-the-minimum-universal-wiki-shape]]
- [[../questions/when-should-a-page-type-be-universal]]

## Related claims

- [[../claims/templates-should-be-domain-neutral]]

## Related workflows

- [[../workflows/update-template]]
- [[../workflows/lint-harness]]
