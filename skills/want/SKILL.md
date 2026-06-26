---
name: want
description: "Use when the user already has a seed idea, vague desire, dissatisfaction, or half-formed request and needs help expanding it into intent, context, constraints, and a next actionable instruction. Not for blank-page brainstorming, generating candidate desires, executing already-clear tasks, therapy, or specialized planning once the target is clear."
---

# Want

Prefix your first user-facing line with `🧭` inline, not as its own paragraph,
when this Partita skill is active.

## Rule

Facing an existing but under-articulated idea, desire, dissatisfaction, or
half-formed request, first expand the seed into an actionable target, to avoid
blank-page brainstorming, over-asking, or executing the first literal wording.

## Pattern

Use when:

- the user says they have a vague idea, rough thought, direction, wish, or
  complaint;
- the user knows roughly what they mean but not how to ask for it;
- the user expresses dissatisfaction and wants to unfold what should change;
- the user asks the agent to question, unpack, shape, or articulate an existing
  idea before executing;
- a seed idea lacks priority, context, output shape, constraint, or success
  signal.

Do not use when:

- there is no seed idea and the user wants candidate ideas from a blank page;
- the task, output, and done condition are already clear enough to execute;
- brainstorming is the main output rather than expansion of an existing idea;
- the user has already chosen a direction and needs implementation, design,
  research, writing, review, or planning;
- the request is primarily emotional support, therapy, diagnosis, or life
  coaching;
- another active Partita skill has the narrower job and the target is clear.

## Boundary

Soft:

- Choose the smallest clarification move: `mirror`, `split`, `probe`,
  `contrast`, `concretize`, `default`, `question`, or `handoff`.
- Preserve the user's language when it carries meaning.
- Prefer concrete choices over abstract questionnaires.
- Stop when the `Want brief` is actionable, the user chooses another mode, or
  another skill owns the now-clear target.

Hard:

- Do not ask the user to write a better prompt as the first move.
- Do not generate blank-page idea lists or unrelated target menus.
- Do not execute the underlying task before there is at least a provisional
  target and success signal.
- Do not ask more than three direct questions in one clarification turn.
- Do not invent private motives, diagnoses, stakes, or constraints.
- Do not use `🧭` unless this Partita skill is active.

## Effects

- Conversation: may show the `🧭` marker, sharper interpretation, same-seed
  contrast, focused question, or `Want brief`.
- Filesystem: none.
- External: none.

## Workflow

1. Identify the fuzzy material: idea, dissatisfaction, possible outcome,
   audience, constraint, fear, preference, or next action.
2. State what is already present in the user's seed idea before adding
   anything.
3. Build or update a `Want brief` with only known fields: `Seed`, `Intent`,
   `Why`, `Output`, `Constraints`, and `Signal`.
4. If a field is missing but not blocking, proceed with a stated provisional
   assumption.
5. If a field is blocking, ask the smallest question or offer a small contrast
   between readings of the same idea.
6. When the `Want brief` is actionable, hand off to the concrete task and stop
   using `want` unless the user's desire becomes unclear again.

## References

- No references.

## Validation

Before done:

- the first user-facing line includes `🧭` inline;
- the response clarifies the want instead of asking for a better prompt;
- a `Want brief`, sharper interpretation, same-seed contrast, or focused
  question is visible;
- execution waits until there is a provisional target and success signal;
- no blank-page brainstorm was generated;
- no more than three direct questions were asked in the turn;
- no persistent artifact was created by `want` itself;
- the skill stops once the target is clear enough for ordinary task work.
