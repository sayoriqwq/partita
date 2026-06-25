---
name: want
description: "Use when the user already has a seed idea, vague desire, dissatisfaction, or half-formed request and needs help expanding it into intent, context, constraints, and a next actionable instruction. Not for blank-page brainstorming, generating candidate desires, executing already-clear tasks, therapy, or specialized planning once the target is clear."
when_to_use: "seed idea, vague idea, unclear want, half-formed request, idea expansion, desire articulation, prompt shaping, requirement unfolding"
dispatch_intent: "Expand vague seed idea into actionable target"
---

# Want

Prefix your first user-facing line with `🧭` inline, not as its own paragraph,
when this Partita skill is active.

Help the user expand an existing but under-articulated idea before asking them
to write a better prompt or treating the surface wording as ready for execution.

## Capability

Turn a seed idea, vague desire, dissatisfaction, or half-formed request into a
small actionable target with enough context, constraints, and success signal for
the next task. The intervention is guided expansion: reflect the idea already
present, draw out missing shape, and converge on the next useful instruction.

Pressure scenario: the user has an idea but cannot express it cleanly yet. The
agent either treats that as a blank-page brainstorming request, asks them to
clarify everything at once, or executes the first literal wording, so the actual
shape of the existing idea stays hidden.

## Trigger

Use this skill when the user:

- says they have a vague idea, rough thought, direction, wish, or complaint;
- says they know roughly what they mean but not how to ask for it;
- expresses dissatisfaction with an existing object, result, workflow, or plan
  and wants to unfold what should change;
- asks the agent to question, unpack, shape, or articulate an existing idea
  before writing, designing, planning, coding, researching, or deciding;
- gives a seed idea but lacks priority, context, output shape, constraint, or
  success signal.

Do not use this skill when:

- there is no seed idea and the user wants candidate ideas, desires, or
  directions generated from a blank page;
- the task, output, and done condition are already clear enough to execute;
- the user asks for brainstorming as the main output rather than expansion of an
  already-present idea;
- the user has already chosen a direction and needs implementation, design,
  research, writing, review, or planning;
- the request is primarily emotional support, therapy, diagnosis, or life
  coaching;
- another active Partita skill already has the narrower job and the user's target
  is clear enough for that skill.

## Soft Boundary

Primitive audit: `want` is `stateless`, `activation: broad`, and
`duration: task`. It keeps only conversation-local clarification state and
stops when the `Want brief` is actionable, the user chooses a different mode,
or another skill owns the now-clear target. Its constraints are model-applied
`soft` constraints; it has no primitive `constraint.hard` until a verifier or
CLI can enforce clarification quality, question count, or handoff readiness.

Use agent judgment to choose the smallest clarification move:

- `mirror`: restate the seed idea in sharper words while preserving the user's
  meaning.
- `split`: separate mixed wants such as outcome, audience, format, constraint,
  emotional preference, and next action.
- `probe`: ask one question about the most blocking missing part of the idea.
- `contrast`: show two possible readings of the same seed idea when ambiguity
  would otherwise stay hidden.
- `concretize`: translate vague language into observable outcome, constraint,
  or success signal.
- `default`: propose a safe working interpretation when the cost of being wrong
  is low.
- `question`: ask one focused question when a missing choice blocks useful
  progress.
- `handoff`: once the target is clear, stop clarifying and route into the
  appropriate task mode or skill.

Prefer concrete choices over abstract questionnaires. Preserve the user's
language when it carries meaning, but replace vague filler with observable
outcomes, constraints, and success signals.

## Hard Boundary

This section is required by the current `SKILL.md` shape. These are strict
model-applied boundaries, not primitive `constraint.hard`, because no
machine-checkable enforcement surface exists for them yet.

- Do not ask the user to write a better prompt as the first move.
- Do not generate candidate desires, blank-page idea lists, or unrelated target
  menus.
- Do not execute the underlying task before there is at least a provisional
  target and success signal.
- Do not ask more than three direct questions in one clarification turn.
- Do not turn uncertainty into a long product-discovery, coaching, or therapy
  framework.
- Do not invent private motives, diagnoses, stakes, or constraints.
- Do not keep clarifying after the user has a workable target.
- Do not use `🧭` unless this Partita skill is active.

## Workflow

1. Identify the fuzzy material: idea, dissatisfaction, possible outcome,
   audience, constraint, fear, preference, or next action.
2. State what is already present in the user's seed idea before adding anything:
   `Your idea seems to be about {seed}, with the unclear part being {gap}.`
3. Build or update a `Want brief` with only the fields that are known:
   - `Seed`: the idea, dissatisfaction, or direction the user already supplied.
   - `Intent`: what the user seems to want the idea to do.
   - `Why`: the pressure, problem, or opportunity behind it.
   - `Output`: the artifact, answer, change, or action that would help.
   - `Constraints`: boundaries, preferences, stakes, or non-goals.
   - `Signal`: how the user will know the next step is good enough.
4. If a field is missing but not blocking, proceed with a stated provisional
   assumption. If it is blocking, ask the smallest question or offer a small
   contrast between readings of the same idea.
5. When the user answers vaguely, narrow the next turn instead of expanding the
   questionnaire.
6. When the `Want brief` is actionable, hand off to the concrete task and stop
   using `want` unless the user's desire becomes unclear again.

## Validation

Before treating output as valid `want`, check:

- the first user-facing line includes `🧭` inline;
- the response helps clarify the want instead of asking for a better prompt;
- a `Want brief`, sharper interpretation, same-seed contrast, or focused
  question is visible;
- execution waits until there is a provisional target and success signal;
- no candidate desires or blank-page brainstorm were generated;
- no more than three direct questions were asked in the turn;
- no persistent artifact was created by `want` itself;
- the skill stops once the target is clear enough for ordinary task work.
