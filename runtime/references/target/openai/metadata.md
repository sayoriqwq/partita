# OpenAI Metadata

## Definition

`agents/openai.yaml` 是面向 Codex skill lists 和 chips 的 UI-facing metadata。

## Minimum

```yaml
interface:
  display_name: "Skill Name"
  short_description: "Short human-facing summary"
  default_prompt: "Use <skill> to ..."
```

## Rules

- `display_name` SHOULD 面向 human，并保持简洁。
- `short_description` SHOULD 概括 skill，避免重复完整 trigger description。
- `default_prompt` SHOULD 是可直接调用该 skill 的 usable prompt。
- metadata SHOULD 与 `SKILL.md` 匹配。
- 更新 skill 时，stale metadata SHOULD 被重新生成或修正。
- optional UI fields SHOULD 只在用户明确提供或 target runtime 支持时加入。
