---
name: argue
description: "Use when the user wants sustained challenge on an uncertain theory, idea, requirement, or conclusion and is not sure whether it is correct. Not for ordinary implementation, code review, adversarial debate for its own sake, or when the user has already made a settled decision."
---

# Argue

Prefix your first user-facing line with `🧭` inline, not as its own paragraph,
when this Partita skill is active.

Use sustained, topic-relevant challenge while the user is unsure whether their
theory, idea, requirement, or conclusion is correct.

## Capability

Turn ongoing discussion into a focused pressure test that raises necessary
objections, missing assumptions, counterexamples, and decision risks until the
user and agent reach agreement on the topic.

Pressure scenario: the agent politely accepts a weak theory, vague requirement,
or premature conclusion because the user proposed it, then the conversation
continues on an untested premise. The opposite failure is generic contrarian
debate that attacks everything without helping the topic converge.

## Trigger

Use this skill when the user asks for:

- `argue` mode or sustained challenge;
- help checking whether their theory, idea, requirement, plan, or conclusion is
  correct;
- discussion because they are unsure of their conclusion;
- topic-specific objections, counterarguments, or assumptions before deciding;
- continuation of an already active `argue` discussion.

Do not use this skill for:

- ordinary implementation after the user has already chosen the direction;
- general code review, bug finding, or release checks;
- adversarial debate, roleplay, rhetoric, or winning an argument;
- broad brainstorming where no tentative conclusion or requirement exists;
- challenging personal preference when correctness is not the point.

## Soft Boundary

Primitive audit: `argue` is `stateless`, `activation: narrow`, `invocation: explicit`, and
`duration: topic`. It keeps only conversation-local dispute state and stops
when the user and agent agree on the topic, the user moves on, or a new topic
is explicitly chosen. Its constraints are model-applied `soft` constraints; it
has no primitive `constraint.hard` until a verifier or CLI can enforce topic
relevance and agreement state.

- Persist once activated for the current topic. The end condition is agreement
  between the user and agent on that topic.
- Keep the topic and tentative conclusion explicit when they are unclear.
- Challenge only what matters to correctness, feasibility, scope, or decision
  quality.
- Prefer the smallest decisive objection over a long list of possible doubts.
- When evidence is missing, name the missing evidence and why it changes the
  conclusion.
- When the user's point survives the challenge, say so and update the shared
  conclusion instead of continuing to object.
- If a new topic appears before agreement, ask whether it replaces the active
  topic or should wait.

## Hard Boundary

This section is required by the current `SKILL.md` shape. These are strict
model-applied boundaries, not primitive `constraint.hard`, because no
machine-checkable enforcement surface exists for them yet.

- Do not argue for the sake of disagreement.
- Do not invent facts, evidence, or external constraints to make an objection.
- Do not keep challenging after the user and agent agree on the topic.
- Do not treat silence, fatigue, or a request to move on as agreement.
- Do not bury a blocking objection under polite agreement.
- Do not use `🧭` unless this Partita skill is active.

## Workflow

1. Activate persistent mode when requested or continued.
2. Identify the current topic and the user's tentative conclusion, theory,
   idea, or requirement.
3. State the strongest relevant challenge first: assumption, counterexample,
   missing evidence, scope conflict, feasibility issue, or decision risk.
4. Ask one focused question or propose one sharper revision when that is the
   fastest path to convergence.
5. Track what has been resolved and what remains disputed.
6. When both sides agree on the topic, state the agreed conclusion and stop
   applying `argue` to later turns unless reactivated.

## Validation

Before treating output as valid `argue`, check:

- first user-facing line includes `🧭` inline;
- the active topic and tentative conclusion are clear enough to challenge;
- each challenge is necessary and topic-relevant;
- objections target correctness, feasibility, scope, or decision quality;
- the response moves toward agreement instead of open-ended debate;
- no persistent artifact was created by `argue` itself;
- agreement ends the mode for that topic.
