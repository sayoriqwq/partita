# Tension: Generality vs Usefulness

## Tension

Psychogram 需要足够通用，也需要足够具体才能指导 agent 生成高质量 wiki。

## Pole A

Generality: harness 不绑定任何单一领域或 runtime。

## Pole B

Usefulness: harness 必须提供足够明确的默认结构和流程。

## Why they conflict

越通用，越不容易污染；越具体，越容易执行。两者都合理，但不能同时最大化。

## Current resolution

Harness 保留 artifact class、page type、workflow 和 role；template 只保留最小骨架；具体内容由 fixture 或 instance 填充。

## Tradeoff

新 instance 可能需要更多设计判断，但不会继承无关领域偏见。

## Revisit when

当多个 instance 都需要同一额外结构时，重新评估默认 template。

## Related questions

- [[../questions/what-is-the-minimum-universal-wiki-shape]]

## Related claims

- [[../claims/templates-should-be-domain-neutral]]

## Related workflows

- [[../workflows/update-template]]
