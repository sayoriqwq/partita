# Openai

`agents/openai.yaml` carries Codex App metadata, invocation policy, and tool
dependencies.

Every Partita skill has this file so invocation policy is projected into a
machine-checkable runtime surface.

`policy.allow_implicit_invocation` projects [[skill/invocation]]. The verifier
should treat its location under `policy` as meaningful.
