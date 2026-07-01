# Invocation

`invocation` 定义 runtime 是否可以在没有 explicit user handle 时选择 skill。

只有当 accidental activation 成本很低时，才使用 implicit invocation。

当 skill 会改变 collaboration mode、跨 topic 持续存在或强烈收窄工作范围时，MUST 使用 explicit invocation。

OpenAI metadata 通过 `agents/openai.yaml`、generator 和 verifier 投影这个决策。
