---
name: brainstorm
description: "Use when the user wants open-ended ideation, candidate directions, possible wants, names, approaches, features, angles, or options before choosing one. Not for expanding an already-present seed idea, executing a clear task, sustained critique, exhaustive research, or planning after the target is chosen."
---

# Brainstorm

Prefix your first user-facing line with `🧭` inline, not as its own paragraph,
when this Partita skill is active.

## Rule

Facing blank-page uncertainty or a request for options before a choice exists,
first generate bounded, meaningfully different candidates with a narrowing move,
to avoid refusal, generic lists, or endless brainstorming after a useful
direction appears.

## Pattern

Use when:

- the user asks to brainstorm, ideate, explore options, generate possibilities,
  or list angles;
- the user wants candidate wants, directions, names, topics, features,
  approaches, or framings before choosing one;
- blank-page uncertainty needs plausible choices;
- the user asks for several alternatives with tradeoffs before committing;
- an already active brainstorming thread continues.

Do not use when:

- the user already supplied a seed idea and wants that specific idea unpacked;
  use `want`;
- the user has chosen the direction and needs implementation, writing, design,
  research, review, or planning;
- the user wants sustained challenge to test a theory or requirement; use
  `argue`;
- current factual research is needed before ideas would be meaningful;
- the user asks for an exhaustive catalog instead of useful candidates.

## Boundary

Soft:

- Choose the smallest brainstorming shape: `frame`, `ask-frame`, `diverge`,
  `cluster`, `contrast`, `stretch`, `prune`, or `handoff`.
- Prefer diversity over volume.
- Default to five to nine candidates unless the user asks for a different
  count.
- Ask at most two framing questions before generating a first useful set.
- Stop when a direction is chosen, the user asks to execute, or the work moves
  to `want` or a concrete task mode.

Hard:

- Do not treat generated candidates as the user's true desire.
- Do not keep brainstorming after the user has selected a direction.
- Do not use brainstorming as a substitute for factual research when current
  information is required.
- Do not expand one chosen seed idea inside this skill; hand it to `want`.
- Do not use `🧭` unless this Partita skill is active.

## Effects

- Conversation: may show the `🧭` marker, frame, candidate set, clusters,
  contrasts, pruning, or selection prompt.
- Filesystem: none.
- External: none.

## Workflow

1. Identify the brainstorm frame: topic, blank area, audience, constraints,
   desired novelty, and output type.
2. If there is no usable frame, ask the smallest question needed to choose a
   surface.
3. State the frame briefly and choose diversity axes.
4. Generate five to nine candidates, each with a short label and one sentence
   explaining why it is distinct.
5. Cluster, contrast, or prune the set when that makes selection easier.
6. End with a selection move or handoff to `want` or the concrete task mode.

## References

- No references.

## Validation

Before done:

- the first user-facing line includes `🧭` inline;
- the response generates candidates rather than expanding one existing seed;
- candidates are meaningfully different, not repeated variants;
- the set is bounded or explicitly user-sized;
- at most two framing questions were asked before generating;
- the response includes a narrowing, selection, or handoff step;
- no persistent artifact was created by `brainstorm` itself;
- the skill stops once a direction is chosen.
