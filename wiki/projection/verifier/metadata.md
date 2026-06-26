# Metadata

Metadata checks validate runtime policy projection.

OpenAI metadata should be parsed as YAML or checked with indentation-aware
rules, because policy location affects runtime behavior.

Every skill must have `agents/openai.yaml`; `policy.allow_implicit_invocation`
must live under the `policy` block.
