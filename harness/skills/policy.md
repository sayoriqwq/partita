# Invocation Policy

## Definition

`policy.allow_implicit_invocation` 控制 Partita skill 是否可以在用户未显式命名时激活。

## Values

```yaml
policy:
  allow_implicit_invocation: true
```

```yaml
policy:
  allow_implicit_invocation: false
```

## Rules

- `true` 表示用户请求清晰匹配 description 时，该 skill 可以被使用。
- `false` 表示该 skill 应要求 explicit routing、命名或 higher-level workflow。
- side-effect risk 高的 skill SHOULD 默认使用 `false`。
- trigger 清晰时，宽泛 writing preference 或低风险 formatting skill MAY 使用 `true`。
- 除非明确设计成 implicit use，creation、patching、migration、verification 和 file-writing workflow skills SHOULD 默认使用 `false`。
- 决策 MUST 记录在 `agents/openai.yaml`。
