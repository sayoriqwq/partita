# Tension: System Docs vs Generated Wiki Docs

## Tension

Psychogram 需要系统文档来维护 harness，也需要 generated wiki 文档来维护每个 concept wiki。

## Pole A

System docs: 描述 psychogram 如何工作。

## Pole B

Generated wiki docs: 描述某个 concept wiki 的内容和维护方式。

## Why they conflict

两者都使用 Markdown、Obsidian links、agent roles 和 workflows，形式相似，容易被混在一起。

## Current resolution

Harness 文档放在 `harness/`。Generated wiki skeleton 放在 `template/`。Fixture output 放在 `fixtures/*/output/`。Runtime adaptation 放在 `projections/`。

## Tradeoff

目录层级更深，但边界更清楚。

## Revisit when

当 agent 仍然把系统层和 generated wiki 层混写时，强化 lint 或 projection 规则。

## Related questions

- [[../questions/when-should-a-runtime-feature-become-a-projection]]

## Related claims

- [[../claims/agent-operations-should-not-pollute-content-space]]

## Related workflows

- [[../workflows/lint-harness]]
- [[../workflows/project-runtime-config]]
