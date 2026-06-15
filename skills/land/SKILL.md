---
name: land
description: "Use when the user wants to keep a first version or current topic from expanding before it is landed, especially after they name a v1 landing topic. Blocks scope expansion and asks whether the new point is necessary for v1 or off-topic. Not for open brainstorming, later-version planning, ordinary aim drift warnings, or when no landing topic exists yet."
when_to_use: "land mode, v1 landing, scope creep block, first version, prevent expansion, current topic, necessary blocker, off-topic reflection"
dispatch_intent: "Block expansion until current v1 lands"
---

# Land

Prefix your first user-facing line with `🧭` inline, not as its own paragraph,
when this Craft skill is active.

Keep the current v1 landing topic from expanding before it has landed.

## Capability

Turn ongoing collaboration into a strict landing discipline: once the user names a
v1 topic, block new branches that are not necessary for that v1 and ask whether
the topic should be adjusted or the branch should be treated as off-topic.

Pressure scenario: the user notices another idea, requirement, theory question,
or design branch before the first version exists. The agent follows the
expansion, so the most important v1 never becomes a concrete, verified result.

## Trigger

Use this skill when the user asks to:

- activate `land` mode;
- keep a first version, draft, skill, feature, or current topic from expanding;
- block scope creep until v1 lands;
- decide whether a new point is necessary for the active v1.

Do not use this skill when:

- the user is explicitly brainstorming or exploring without a landing target;
- no current landing topic or v1 target exists yet;
- the work is later-version planning after v1 has landed;
- a new point is a true blocker for the current v1.

## Soft Boundary

Primitive audit: `land` is `stateless`, `activation: narrow`, and
`duration: topic`. It keeps only conversation-local landing state and stops when
the v1 lands, the user switches topic, or the user exits the mode. Its
constraints are model-applied `soft` constraints; it has no `constraint.hard`
until a verifier or CLI can enforce scope classification.

Classify each new point against the active landing topic:

- `blocker`: v1 cannot land without it; allow and handle it.
- `v1`: directly belongs to the smallest current version; allow.
- `expand`: useful or interesting, but not required for v1; block.
- `switch`: changes the landing topic; block and ask whether to revise the
  topic.
- `done`: v1 landed and was verified; stop applying `land` to later work unless
  reactivated.
- `unknown`: ask one minimal question about whether the point is necessary for
  v1.

Use `aim` as the source of the current topic when an active aim exists. If the
user supplies the landing topic in the same request, use that directly.

## Hard Boundary

This section is required by the current `SKILL.md` shape. These are strict
model-applied boundaries, not primitive `constraint.hard`, because no
machine-checkable enforcement surface exists for them yet.

- Do not continue into `expand` or `switch` work before the user chooses.
- Do not create backlog, issue, roadmap, or later-version artifacts unless the
  user explicitly asks.
- Do not block true blockers, validation failures, or missing information needed
  to land v1.
- Do not treat a preference, curiosity, or nice-to-have as necessary for v1.
- Do not use `🧭` unless this Craft skill is active.

## Workflow

1. Activate topic-duration mode when requested and identify the landing topic or
   v1 target. If missing, ask for the current v1 topic and done condition.
2. For each new idea, request, or requirement, classify it with the soft boundary
   labels before acting.
3. For `blocker` or `v1`, proceed and keep the answer focused on the next
   verifiable landing step.
4. For `expand` or `switch`, stop and show `Land block` with active v1, new
   branch, classification, and one choice:
   `Is this necessary for v1, so we adjust the topic, or is it off-topic and we return?`
5. For `unknown`, ask whether the point is necessary for v1 before doing work.
6. When v1 is concretely delivered and verified, state that `land` is complete
   for this topic.

## Validation

Before treating output as valid `land`, check:

- first user-facing line includes `🧭` inline;
- the active landing topic or missing-topic question is visible;
- expansion or topic switch produced a blocking `Land block`;
- the user was asked to choose between adjusting the topic and returning;
- no expansion work happened before that choice;
- v1 landing remains tied to a concrete done or verification condition;
- `land` does not write persistent artifacts unless another skill or explicit
  user request owns that state;
- `land` stops when the v1 lands, the user switches topic, or the user exits the
  mode.
