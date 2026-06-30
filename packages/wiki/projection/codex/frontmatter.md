# Frontmatter

Codex skill frontmatter 必须包含：

```yaml
name: <skill-name>
description: "Use when ... Not for ..."
```

official optional keys 是 `license`、`allowed-tools` 和 `metadata`。

Partita routing 只读取 `name` 和 `description`。

MUST NOT 在 skill frontmatter 放入 Partita namespace、wiki area、status、kind、plugin name 或其他 invented metadata。
