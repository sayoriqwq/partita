# Metadata

metadata checks 验证 runtime policy projection。

OpenAI metadata SHOULD 按 YAML parsing，或用 indentation-aware rules 检查。

policy location 会影响 runtime behavior。

每个 skill MUST 有 `agents/openai.yaml`。

`policy.allow_implicit_invocation` MUST 位于 `policy` block 下。
