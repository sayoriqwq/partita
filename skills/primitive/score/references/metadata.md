<!-- partita:projection:file source="wiki/documentation/metadata.md" mode="copy" -->

---
audience: [agent, human]
authors:
  - codex
reviewed_by:
  - sayori
purpose: 定义 Markdown module 的默认 frontmatter metadata。
status: active
sources: []
updated: 2026-06-27
---

# Metadata

## Definition

`metadata` 是 module 级别的机器可读状态，通常放在 frontmatter。

## Schema

```yaml
---
audience: agent | human | [agent, human]
authors:
  - codex
reviewed_by: []
purpose: 一句话说明这个 module 帮读者完成什么
status: active | draft | archived
sources: []
updated: YYYY-MM-DD
---
```

## Rules

- 在 sayoriqwq-style docs 中，module MUST 使用 frontmatter metadata。
- metadata 承载文档级状态，不承载正文论述。
- metadata SHOULD 帮 agent 稳定读取读者、作者、review 状态、用途、维护状态、来源和更新时间。
- 如果目标文件已有 metadata，`score` MUST 维护它，不应该让它和正文漂移。
- 如果当前项目或用户明确禁止 frontmatter，则遵循更高优先级约束。

## Fields

- `audience` 声明主要读者类型。
- `authors` 只记录实际 module 作者，不表示责任归属或 review 确认。
- `reviewed_by` 只记录明确 review 或确认过当前 module 的人。
- `purpose` 是一句面向读者的功能描述。
- `status` 声明当前维护状态。
- `sources` 只记录支撑当前 module 的材料来源。
- `updated` 使用 `YYYY-MM-DD`，表示最后一次语义更新日期。

## Status

- `active` 表示当前可用口径，agent 可以依赖。
- `draft` 表示草稿、未确认或还在形成，agent 只能参考。
- `archived` 表示历史保留，不作为当前口径。
- 新建且用户已明确确认的 module 可以是 `active`。
- 新建但没有确认的 module SHOULD 是 `draft`。
- 被替代但需要保留历史的 module 使用 `archived`。
- `archived` module SHOULD 指向替代位置，若有。

## Review

- agent 创建文档时，默认使用 `authors: [codex]` 和 `reviewed_by: []`。
- 用户只是提供原始材料，不等于 review。
- 用户在协作中针对该 module 指出问题、修正口径或确认内容，可以视为 review。
- 如果用户 review 后文档被实质修改，需要重新判断旧 `reviewed_by` 是否仍成立。

## Sources

- `sources` 可以是相对路径、wiki link、外部 URL、附件路径或明确文档。
- `sources` 不等于作者。
- `sources` 不等于 review。
- `sources` 不自动让 module active。
- 如果 assertion 是用户在当前聊天中确认的，`sources` 可以是 `[]`。
- `score` MUST NOT 强行发明 source。
