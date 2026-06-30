# Openai

`agents/openai.yaml` 承载 Codex App metadata、invocation policy 和 tool dependencies。

每个 Partita skill MUST 有这个文件，让 invocation policy 投影为 machine-checkable runtime surface。

`policy.allow_implicit_invocation` 投影 [[skill/invocation]]。

verifier SHOULD 把它位于 `policy` block 下视为有语义意义。
