---
name: aim
description: "Use when an active aim exists and the new request may drift from it, when the user sets or checks the current topic/target, or when a sustained mode such as argue needs an explicit topic before it can run. Not for creating formal goals, blocking user-initiated topic changes, ordinary summaries, or execution planning."
---

# Aim

Prefix your first user-facing line with `🧭` inline, not as its own paragraph,
when this Partita skill is active.

## Rule

Facing an active aim plus side, adjacent, drifting, or topic-setting work,
first show the request's relation to the aim, to avoid silently dropping the
active target or starting a sustained mode without an anchor.

## Pattern

Use when:

- an active aim exists and the new request is side, adjacent, or drifting work;
- the user asks for an aim, topic, target, or focus check;
- the user sets, resets, or switches an active aim and expects confirmation;
- a sustained mode such as `argue` is requested but lacks an active or explicit
  topic, target, or tentative conclusion;
- the next action would create durable work, write files, open a long loop, or
  change task direction away from the active aim.

Do not use when:

- there is no active aim in the conversation;
- the active aim has already been completed or explicitly paused;
- the current request already supplies the topic or target needed by the next
  mode, and no separate aim check was requested;
- the user clearly asks to create or manage a formal goal;
- the request only needs ordinary planning, review, debugging, or summary.

## Boundary

Soft:

- Classify the current request as `aligned`, `side`, `adjacent`, `drift`,
  `aim-set`, `topic-needed`, or `unknown`.
- Keep the warning visible without judging the user's choice.
- Use only conversation-local aim state, and stop when the aim is completed,
  paused, switched, or no longer relevant.
- Ask one minimal question when the relationship to the active aim is unknown.

Hard:

- Do not create, update, or close formal goals.
- Do not write files, run tools, browse, or scan repositories just to infer an
  aim.
- Do not depend on docwarden, contexta, handoff files, or external memory.
- Do not treat a warning shown only in a tool update or hidden reasoning as
  complete; the final user-facing reply must keep the signal when drift matters.

## Effects

- Conversation: may show the `🧭` marker, `Aim note`, `Aim check`, `Aim brief`,
  or a `topic-needed` question.
- Filesystem: none.
- External: none.

## Workflow

1. Identify the active aim from the current conversation. If it is not explicit,
   do not invent one.
2. Split the current request into what the user explicitly asks, what it
   implies, and whether it would create durable work.
3. If the request starts a sustained mode such as `argue`, check for an active
   or explicit topic, target, or tentative conclusion.
4. Classify the relationship with the Boundary labels.
5. Choose the smallest visible response: aim note for light side work, aim check
   for adjacent or drift work, aim brief for aim setting, or one question for
   topic-needed or unknown cases.
6. If the same turn has a final summary, keep the note, check, or brief visible
   there too.

## References

- Read [cases](references/cases.md) when checking known `aim` recurrence
  patterns.

## Validation

Before done:

- the first user-facing line includes `🧭` inline when the aim constrains the
  response;
- the current request's relation to the active aim is visible when drift
  matters;
- missing topic or target for a sustained mode produced a visible question;
- no persistent artifact, formal goal, or external workflow artifact was
  created;
- durable drift was not executed without user confirmation.
