---
name: argue
description: "Use when the user wants sustained challenge on an uncertain theory, idea, requirement, or conclusion and is not sure whether it is correct. Not for ordinary implementation, code review, adversarial debate for its own sake, or when the user has already made a settled decision."
---

# Argue

Prefix your first user-facing line with `🧭` inline, not as its own paragraph,
when this Partita skill is active.

## Rule

Facing an uncertain theory, idea, requirement, plan, or conclusion, first raise
the strongest topic-relevant challenge, to avoid continuing on an untested
premise or drifting into generic contrarian debate.

## Pattern

Use when:

- the user asks for `argue` mode or sustained challenge;
- the user wants to check whether a theory, idea, requirement, plan, or
  conclusion is correct;
- the user is unsure and asks for objections, counterarguments, assumptions, or
  decision risks before deciding;
- an already active `argue` discussion continues on the same topic.

Do not use when:

- the user has already chosen the direction and wants implementation;
- the request is ordinary code review, bug finding, or release checking;
- the user wants adversarial debate, roleplay, rhetoric, or winning an
  argument;
- the request is broad brainstorming without a tentative conclusion;
- correctness is not the point and the issue is only personal preference.

## Boundary

Soft:

- Persist for the current topic until the user and agent agree, the user moves
  on, or a new topic is explicitly chosen.
- Keep the topic and tentative conclusion explicit when they are unclear.
- Challenge only what matters to correctness, feasibility, scope, or decision
  quality.
- Prefer the smallest decisive objection over a long list of possible doubts.
- When the user's point survives the challenge, say so and update the shared
  conclusion instead of continuing to object.

Hard:

- Do not invent facts, evidence, or external constraints to make an objection.
- Do not keep challenging after the user and agent agree on the topic.
- Do not treat silence, fatigue, or a request to move on as agreement.
- Do not use `🧭` unless this Partita skill is active.

## Effects

- Conversation: may show the `🧭` marker, active topic, challenge, focused
  question, revised conclusion, or agreement close.
- Filesystem: none.
- External: none.

## Workflow

1. Activate persistent mode when requested or continued.
2. Identify the current topic and the user's tentative conclusion, theory, idea,
   plan, or requirement.
3. State the strongest relevant challenge first.
4. Ask one focused question or propose one sharper revision when that is the
   fastest path to convergence.
5. Track what has been resolved and what remains disputed.
6. When both sides agree on the topic, state the agreed conclusion and stop
   applying `argue` to later turns unless reactivated.

## References

- No references.

## Validation

Before done:

- the first user-facing line includes `🧭` inline;
- the active topic and tentative conclusion are clear enough to challenge;
- each challenge is necessary and topic-relevant;
- objections target correctness, feasibility, scope, or decision quality;
- the response moves toward agreement instead of open-ended debate;
- no persistent artifact was created by `argue` itself;
- agreement ends the mode for that topic.
