# Dispatcher

`harness/skills/dispatcher.md` 是 Partita harness 生成的 routing index。

它的输入是 `skills/` 下 direct 或 namespaced `SKILL.md` frontmatter，以及
`agents/openai.yaml` 中的 invocation policy。

dispatcher 不属于 `skills/` 内容，不定义 portable skill，也不是 OpenAI
target requirement。

Skill semantics 保留在 wiki-guided skill files。dispatcher 只暴露 routing
metadata。

dispatcher 不投影 runtime marker。marker 属于 active skill 或 skill family。

The dispatcher table columns are:

```text
Handle | Name | Invocation | Description | File
```

`Invocation` projects `policy.allow_implicit_invocation` as `true` or `false`.

The `expression` source namespace projects to `ex:<name>` handles.
The `link` source namespace projects to `lk:<name>` handles.
The `orientation` source namespace projects to `og:<name>` handles.
The `maintenance` source namespace projects to `mt:<name>` handles.
The `primitive` source namespace projects to `pm:<name>` handles.

Installed Codex skills 按 frontmatter name 保持 flat。dispatcher handles 保留
Partita source-family semantics，不要求 global install paths 嵌套。

See [[projection/codex/projection-marker]].
