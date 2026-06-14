# Density Examples

Keep this file empty unless the agent has inferred a concrete recurring error
pattern from actual use.

Only add an example when it documents:

- the wrong output pattern the agent produced or was about to produce;
- the corrected output pattern;
- the rule that explains the correction.

Do not add examples as a style gallery, answer template, or speculative
preference list.

## Direct Load Means Activation

Observed: The user directly loaded or dropped `$density`, but the agent treated
that as a request to verify the skill implementation.

Correction: Activate `density` immediately and continue the conversation in
controlled high-density Chinese. Inspect or patch the skill only when the user
also asks for that work.

Rule: Direct invocation of a mode skill is itself an activation request.
