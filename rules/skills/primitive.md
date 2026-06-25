# Primitive

Primitive is the semantic source for a skill before it becomes `SKILL.md`.

It is not a file shape, runtime export shape, plugin namespace, command wrapper,
or template. It names the behavior pressure, the intended agent intervention,
and the choices that must survive materialization.

## Terms

- `pressure`: the repeated agent failure or workflow pressure that justifies a
  skill.
- `capability`: the smallest agent behavior intervention that relieves that
  pressure.
- `trigger`: the situations, user wording, or agent observations that should
  activate the skill.
- `boundary`: what belongs to the skill and what should route elsewhere.
  Use `in_scope` and `out_of_scope` only when the distinction needs to be
  explicit.
- `constraint`: what keeps the skill from drifting while it runs.
  Use `soft` for judgment that the model must apply. Use `hard` only for
  constraints that have a deterministic enforcement surface such as a script,
  CLI, verifier, schema, test, or package check.
- `state`: whether the skill leaves persistent information. Use `stateful` for
  skills that write or update persistent artifacts. Use `stateless` for skills
  that only run inside the current conversation.
- `activation`: how aggressively the skill should be routed. Use `broad` when
  natural conversation should trigger the skill automatically. Use `narrow`
  when the skill is a dedicated workflow that should mostly run by explicit
  invocation.
- `invocation`: whether Codex may select the skill without an explicit `$skill`
  mention. Use `implicit` when natural-language routing is intended. Use
  `explicit` when accidental activation would change collaboration mode,
  create sustained pressure, or run a workflow that should require a direct
  user opt-in.
- `duration`: how long the skill should remain active after activation. Use
  `turn` for one response, `task` for the current task, `topic` for the current
  discussion topic, and `mode` for a sustained collaboration mode.
- `workflow`: the reviewable moves the agent performs once the skill is active.
- `validation`: the signal that the skill was correctly triggered and used.

## Rules

- Start from pressure and capability, not folder shape or plugin export shape.
- Keep boundary and constraint separate: boundary defines scope; constraint
  defines enforcement.
- Do not call a constraint hard unless it has a machine-checkable enforcement
  surface. If it relies only on model judgment, it is soft.
- Keep state, activation, and invocation explicit when they affect routing,
  persistence, or user-visible behavior.
- Do not collapse `activation` into `invocation`: a narrow skill can still allow
  implicit invocation when its description is precise enough for safe routing.
- Keep duration explicit when the skill can outlive one response. Every duration
  needs a stop condition.
- Do not put examples, project paths, command details, or namespace mechanics in
  the primitive unless they define reusable behavior.
- Do not treat generated shape as proof that primitive semantics survived.
