# OpenAI Resources

## Definition

`OpenAI skill resources` 是随 skill 打包、用于支持 runtime 执行的可选目录。

## Shape

```text
skill-name/
  agents/
    openai.yaml
  scripts/
  references/
  assets/
```

## Rules

- 环境支持时，`agents/openai.yaml` SHOULD 提供 UI metadata。
- `scripts/` SHOULD 放置 fragile 或 repeated operations 需要的 deterministic code。
- `references/` SHOULD 放置只在需要时加载的 conditional runtime documentation。
- `assets/` SHOULD 放置 templates、images、fonts 或 boilerplate 等输出资源。
- `references/` SHOULD 保持在 `SKILL.md` 的一层深度。
- 信息 SHOULD 存在于 `SKILL.md` 或 references 之一，不应在两处重复。
- 长 conditional detail SHOULD 移到 references，而不是让 `SKILL.md` 膨胀。
- 新增到 skill 的 scripts SHOULD 通过 representative commands 测试。
