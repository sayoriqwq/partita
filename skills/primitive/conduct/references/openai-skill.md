# OpenAI Skill

## Shape

默认 target 是 OpenAI/Codex skill folder。

必要形态：

```text
skill-name/
  SKILL.md
```

`SKILL.md` frontmatter MUST 包含 `name` 和 `description`。

`description` 是主要 trigger surface，MUST 说明 workflow skill 做什么以及何时使用。

## Resources

可选资源目录是 `agents/`、`scripts/`、`references/` 和 `assets/`。

target runtime 支持时，SHOULD 创建 `agents/openai.yaml`。

`references/` SHOULD 保持在 `SKILL.md` 的一层子目录内。

skill folder 内 SHOULD NOT 创建额外 README、installation guide、quick reference、changelog 或过程历史文件。

## Metadata

`agents/openai.yaml` SHOULD 包含：

```yaml
interface:
  display_name: "Skill Name"
  short_description: "Short summary"
  default_prompt: "Use <skill> to ..."
```

metadata SHOULD 与 `SKILL.md` 匹配。

## Validation

处理 OpenAI target 时，如果存在可用 target validator，运行它。

如果没有 validator，手动检查 `SKILL.md`、frontmatter、description trigger、资源目录、本地 references 和 metadata 一致性。
