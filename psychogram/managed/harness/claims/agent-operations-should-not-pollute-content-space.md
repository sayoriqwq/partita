# Claim: Agent Operations Should Not Pollute Content Space

## Claim

Agent 的维护流程应放在 `agents/workflows/`，不应默认放进 generated wiki 的 `wiki/` 内容区。

## Why it matters

维护 wiki 的操作流程不等于该概念本身的内容。把两者混在一起，会让 generated wiki 看起来像系统文档，而不是围绕概念的独立 wiki。

## Supports

- [[../concepts/workflow]]
- [[../concepts/page-type]]
- [[../concepts/agent-role]]

## Challenges

- 某些概念本身可能讨论 workflow；这种情况下 workflow 可以作为内容出现。
- Agent 需要清楚区分“维护流程”和“概念主题中的流程”。

## Related questions

- [[../questions/when-should-a-page-type-be-universal]]

## Related tensions

- [[../tensions/system-docs-vs-generated-wiki-docs]]

## Related workflows

- [[../workflows/lint-harness]]
- [[../workflows/update-template]]
