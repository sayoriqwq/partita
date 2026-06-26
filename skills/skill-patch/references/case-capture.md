# Skill Patch Case Capture

Use this reference when a real user-observed case should enter a target skill's
care loop.

## 铁律

用户遇到的 case，就是需要被保留为真实情境的 case。

Do not replace a real case with only an abstract rule. Preserve the behavior
shape that would let the next agent read the same default failure.

## When To Capture

Capture a case when:

- the user corrects a skill's real behavior;
- a skill was too broad, too narrow, too eager, too vague, or too heavy;
- the agent read the wrong resources, missed a reference, or over-read context;
- the agent produced an output pattern the target skill should prevent.

Do not capture when:

- the case is speculative;
- the user only states a general preference;
- recording the case would expose sensitive detail that cannot be safely
  generalized;
- the target skill does not own the behavior.

## Where To Put It

- Prefer the target skill's existing `references/examples.md`,
  `references/cases.md`, or equivalent case file.
- If no case file exists, create `references/cases.md`.
- Keep case files one level below the target skill directory.
- Do not put long concrete cases in the target `SKILL.md` every-use body.

## Entry Shape

Each captured case should include:

- `Observed:` the wrong or risky behavior shape.
- `Correction:` the behavior the next agent should perform.
- `Rule:` the skill rule that explains the correction.

Use minimal, sanitized details. Preserve the decision shape, not private noise.
