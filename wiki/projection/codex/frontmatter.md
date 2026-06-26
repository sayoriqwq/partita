# Frontmatter

Codex skill frontmatter requires:

```yaml
name: <skill-name>
description: "Use when ... Not for ..."
```

Official optional keys are `license`, `allowed-tools`, and `metadata`.

Partita reads only `name` and `description` for routing. Do not put Partita
namespace, wiki area, status, kind, plugin name, or other invented metadata in
skill frontmatter.
