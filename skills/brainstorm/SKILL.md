---
name: brainstorm
description: "Use when the user wants open-ended ideation, candidate directions, possible wants, names, approaches, features, angles, or options before choosing one. Not for expanding an already-present seed idea, executing a clear task, sustained critique, exhaustive research, or planning after the target is chosen."
---

# Brainstorm

Prefix your first user-facing line with `🧭` inline, not as its own paragraph,
when this Partita skill is active.

Generate candidate directions before the user has chosen one, then create a
clear narrowing path instead of leaving the conversation as an endless idea
list.

## Capability

Turn an open prompt, blank-page uncertainty, or request for options into a
bounded set of meaningfully different candidates and a small selection step.
The intervention is structured divergence with an exit: frame the space,
generate diverse candidates, cluster or contrast them, and help the user pick
what deserves expansion or execution.

Pressure scenario: the user needs possibilities before they can know what they
want. The agent either refuses because the request is underspecified, routes the
work to `want`, produces a generic list with no shape, or keeps brainstorming
after a useful direction has appeared.

## Trigger

Use this skill when the user asks to:

- brainstorm, ideate, explore options, generate possibilities, or list angles;
- produce candidate wants, directions, names, topics, features, approaches, or
  framings before choosing one;
- break blank-page uncertainty by seeing plausible choices;
- get several alternatives with tradeoffs before committing;
- continue an already active brainstorming thread.

Do not use this skill when:

- the user already supplied a seed idea and wants that specific idea unpacked;
  use `want`;
- the user has chosen the direction and needs implementation, writing, design,
  research, review, or planning;
- the user wants sustained challenge to test a theory or requirement; use
  `argue`;
- the request needs factual research before ideas would be meaningful;
- the user asks for an exhaustive catalog instead of useful candidates.

## Soft Boundary

Primitive audit: `brainstorm` is `stateless`, `activation: broad`, `invocation: implicit`, and
`duration: task`. It keeps only conversation-local candidate state and stops
when a direction is chosen, the user asks to execute, or the conversation moves
to `want` or a concrete task mode. Its constraints are model-applied `soft`
constraints; it has no primitive `constraint.hard` until a verifier or CLI can
enforce candidate diversity, boundedness, or handoff.

Use agent judgment to choose the brainstorming shape:

- `frame`: state the topic, audience, constraints, diversity axes, and stop
  condition when they are known.
- `ask-frame`: ask one minimal framing question when no topic or surface exists.
- `diverge`: generate a bounded candidate set with distinct angles.
- `cluster`: group overlapping candidates so the user can compare choices.
- `contrast`: show tradeoffs between two or three strongest directions.
- `stretch`: include one or two unusual candidates when the user wants novelty.
- `prune`: remove weak, duplicate, or off-frame candidates before asking the
  user to choose.
- `handoff`: route the chosen candidate to `want` if it remains vague, or to the
  concrete task mode if it is already actionable.

Prefer diversity over volume. A useful set of five distinct candidates beats a
long list of variations on one idea.

## Hard Boundary

This section is required by the current `SKILL.md` shape. These are strict
model-applied boundaries, not primitive `constraint.hard`, because no
machine-checkable enforcement surface exists for them yet.

- Do not treat generated candidates as the user's true desire.
- Do not keep brainstorming after the user has selected a direction.
- Do not produce unbounded idea lists; default to five to nine candidates unless
  the user asks for a different count.
- Do not ask more than two framing questions before generating a first useful
  set.
- Do not use brainstorming as a substitute for factual research when current
  information is required.
- Do not expand one chosen seed idea inside this skill; hand it to `want`.
- Do not use `🧭` unless this Partita skill is active.

## Workflow

1. Identify the brainstorm frame: topic, blank area, audience, constraints,
   desired novelty, and output type.
2. If there is no usable frame, ask the smallest question needed to choose a
   surface, such as domain, audience, or kind of output.
3. State the frame briefly and choose diversity axes such as conservative vs.
   weird, practical vs. ambitious, emotional vs. functional, or short-term vs.
   long-term.
4. Generate five to nine candidates, each with a short label and one sentence of
   why it is distinct.
5. Cluster, contrast, or prune the set when that makes selection easier.
6. End with a selection move:
   - ask the user to pick one or two candidates;
   - recommend one candidate when the frame clearly favors it;
   - hand a vague selected candidate to `want`;
   - hand an actionable selected candidate to the concrete task mode.

## Validation

Before treating output as valid `brainstorm`, check:

- the first user-facing line includes `🧭` inline;
- the response generates candidates rather than expanding one existing seed
  idea;
- candidates are meaningfully different, not repeated variants;
- the set is bounded or explicitly user-sized;
- at most two framing questions were asked before generating;
- the response includes a narrowing, selection, or handoff step;
- no persistent artifact was created by `brainstorm` itself;
- the skill stops once a direction is chosen.
