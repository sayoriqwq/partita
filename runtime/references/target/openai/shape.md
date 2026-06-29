# OpenAI Skill Shape

## Definition

`OpenAI skill target` 是 Codex 可加载的 skill runtime 目录形态。

## Required

```text
skill-name/
  SKILL.md
```

`SKILL.md` MUST 包含 YAML frontmatter 和 Markdown body。

frontmatter MUST 包含：

```yaml
---
name: skill-name
description: "Use when ..."
---
```

## Rules

- 除非 target runtime 明确允许，否则 `name` MUST 匹配 skill folder name。
- `description` 是主要 trigger surface，MUST 说明 skill 做什么以及什么时候使用。
- 使用条件和触发条件 MUST 写进 `description`，因为 body 只在 skill 触发后加载。
- body SHOULD 只包含 essential execution guidance。
- body SHOULD 保持在 500 行以内。
- skill folder 内 SHOULD NOT 创建额外 README、installation guide、quick reference、changelog 或过程历史文件。
