---
name: aim
description: "Use when an active aim exists and the new request may drift from it, when the user sets or checks the current topic/target, or when a sustained mode such as argue needs an explicit topic before it can run. Not for creating formal goals, blocking user-initiated topic changes, ordinary summaries, or execution planning."
when_to_use: "active aim, active topic, aim drift, target switch, topic check, focus check, side request, sustained mode prerequisite, aim brief"
dispatch_intent: "Craft aim and topic alignment"
---

# Aim

Prefix your first user-facing line with `🧭` inline, not as its own paragraph,
when this Craft skill is active.

This skill is a warning and alignment check, not a formal goal system. It keeps
the active aim visible when a conversation starts drifting, and provides the
topic or target anchor needed by sustained modes such as `argue`.

## Capability

Help the agent notice when the current request no longer serves the active aim,
or when the next mode needs a clear current topic or target before it can run.
The intervention is a short visible note or brief, not a new planning workflow.

Pressure scenario: the agent follows a fresh request because it is easy or
interesting, then silently drops the target the user was originally trying to
land. A related failure is starting a sustained discussion mode without knowing
which topic or tentative conclusion should anchor that mode.

## Trigger

Use this skill when:

- an active aim exists and the new request is side, adjacent, or drifting work;
- the user asks for an aim, topic, target, or focus check;
- the user sets, resets, or switches an active aim and expects confirmation;
- a sustained mode such as `argue` is requested but lacks an active or explicit
  topic, target, or tentative conclusion;
- the next action would create durable work, write files, open a long loop, or
  change task direction away from the active aim.

Do not use this skill when:

- there is no active aim in the conversation;
- the active aim has already been completed or explicitly paused;
- the current request already supplies the topic or target needed by the next
  mode, and no separate aim check was requested;
- the user clearly asks to create or manage a formal goal;
- the request only needs ordinary planning, review, debugging, or summary.

## Soft Boundary

Primitive audit: `aim` is `stateless`, `activation: broad`, and
`duration: topic` when an active aim exists or a sustained mode needs an
anchor. It keeps only conversation-local aim state and stops when the aim is
completed, paused, switched, or no longer relevant. Its constraints are
model-applied `soft` constraints; it has no primitive `constraint.hard` until a
verifier or CLI can enforce aim-drift classification.

Classify the current request against the active aim:

- `aligned`: directly serves the aim; continue without extra ceremony unless
  the user explicitly asked for an aim check.
- `side`: unrelated but light; warn briefly, answer, then return attention.
- `adjacent`: useful but likely to slow the aim; warn and prefer a small choice.
- `drift`: starts a different durable work surface; warn and ask before acting.
- `aim-set`: user is setting or switching the aim; return an `Aim brief`.
- `topic-needed`: a sustained mode needs an active or explicit topic, target, or
  tentative conclusion before it can run; ask for that smallest missing unit.
- `unknown`: ask one minimal question about the relationship.

The warning should make drift visible without judging the user's choice.

## Hard Boundary

This section is required by the current `SKILL.md` shape. These are strict
model-applied boundaries, not primitive `constraint.hard`, because no
machine-checkable enforcement surface exists for them yet.

- Do not create, update, or close formal goals.
- Do not write files, run tools, browse, or scan repositories just to infer an
  aim.
- Do not depend on docwarden, contexta, handoff files, or external memory.
- Do not block a user-initiated topic switch.
- Do not treat a warning shown only in a tool update or hidden reasoning as
  complete; the final user-facing reply must keep the signal when drift matters.
- Do not turn this into a general planning, handoff, or task-management skill.

## Workflow

1. Identify the active aim from the current conversation. If it is not explicit,
   do not invent one.
2. Split the current request into what the user explicitly asks, what it implies,
   and whether it would create durable work.
3. If the request starts a sustained mode such as `argue`, check for an active
   or explicit topic, target, or tentative conclusion. If it is missing, classify
   as `topic-needed`.
4. Classify the relationship using the soft boundary labels.
5. Choose the smallest visible response:
   - `side`: `🧭 Aim note: This drifts from the active aim: {aim}. I will answer briefly, then return to it.`
   - `adjacent` or `drift`: show `Aim check` with active aim, current request,
     drift judgment, recommended action, and one question before durable action.
   - `aim-set`: show `Aim brief` with active aim, current request, boundary, and
     next step.
   - `topic-needed`: ask for the missing topic, target, or tentative conclusion
     before starting the sustained mode.
   - `unknown`: ask one question instead of guessing.
6. If the same turn has a final summary, keep the note, check, or brief visible
   there too.

## References

- Read [cases](references/cases.md) when checking known `aim` recurrence
  patterns.

## Validation

Before treating the skill as correctly applied, check:

- the first user-facing line includes `🧭` inline;
- drift, side work, or aim setting produced an `Aim note`, `Aim check`, or
  `Aim brief`;
- missing topic or target for a sustained mode produced a visible
  `topic-needed` question;
- no persistent artifact was created, and the topic-duration aim state stops
  when the aim is complete, paused, switched, or irrelevant;
- no formal goal or external workflow artifact was created;
- durable drift was not executed without user confirmation.
