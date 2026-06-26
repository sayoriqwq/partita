---
name: land
description: "Use when the user wants to keep a first version or current topic from expanding before it is landed, especially after they name a v1 landing topic. Blocks scope expansion and asks whether the new point is necessary for v1 or off-topic. Not for open brainstorming, later-version planning, ordinary aim drift warnings, or when no landing topic exists yet."
---

# Land

Prefix your first user-facing line with `🧭` inline, not as its own paragraph,
when this Partita skill is active.

## Rule

Facing an active v1 landing topic plus a new idea, requirement, theory branch,
or scope expansion, first classify whether it is necessary for v1, to avoid the
first version never becoming a concrete verified result.

## Pattern

Use when:

- the user asks to activate `land` mode;
- the user wants to keep a first version, draft, skill, feature, or current
  topic from expanding;
- the user wants to block scope creep until v1 lands;
- a new point appears and it is unclear whether it is necessary for the active
  v1.

Do not use when:

- the user is explicitly brainstorming or exploring without a landing target;
- no current landing topic or v1 target exists yet;
- the work is later-version planning after v1 has landed;
- the new point is a true blocker for the current v1.

## Boundary

Soft:

- Classify each new point as `blocker`, `v1`, `expand`, `switch`, `done`, or
  `unknown`.
- Use `aim` as the current topic source when an active aim exists.
- Allow `blocker` and `v1` work; block `expand` and `switch` work before doing
  it.
- Stop when v1 lands, the user switches topic, or the user exits the mode.

Hard:

- Do not continue into `expand` or `switch` work before the user chooses.
- Do not create backlog, issue, roadmap, or later-version artifacts unless the
  user explicitly asks.
- Do not block validation failures or missing information needed to land v1.
- Do not use `🧭` unless this Partita skill is active.

## Effects

- Conversation: may show the `🧭` marker, active v1 topic, classification, and
  `Land block` choice.
- Filesystem: none.
- External: none.

## Workflow

1. Activate topic-duration mode when requested and identify the landing topic or
   v1 target. If missing, ask for the current v1 topic and done condition.
2. For each new idea, request, or requirement, classify it with the Boundary
   labels before acting.
3. For `blocker` or `v1`, proceed and keep the answer focused on the next
   verifiable landing step.
4. For `expand` or `switch`, stop and show `Land block` with active v1, new
   branch, classification, and one choice: necessary for v1 or off-topic.
5. For `unknown`, ask whether the point is necessary for v1 before doing work.
6. When v1 is concretely delivered and verified, state that `land` is complete
   for this topic.

## References

- No references.

## Validation

Before done:

- the first user-facing line includes `🧭` inline;
- the active landing topic or missing-topic question is visible;
- expansion or topic switch produced a blocking `Land block`;
- the user was asked to choose between adjusting the topic and returning;
- no expansion work happened before that choice;
- v1 landing remains tied to a concrete done or verification condition;
- no persistent artifact was created by `land` itself;
- `land` stops when the v1 lands, the user switches topic, or the user exits.
