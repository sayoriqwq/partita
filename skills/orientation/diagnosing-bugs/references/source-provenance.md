# Source Provenance

## Status

This Partita V1 is `provisional / case-pending`.

Its behavior was distilled from read-only Matt Pocock Skills source evidence supplied for this task, not from a Captain-observed Partita bug case. The source set was:

- `skills/engineering/diagnosing-bugs/SKILL.md`;
- `skills/engineering/diagnosing-bugs/agents/openai.yaml`;
- `skills/engineering/diagnosing-bugs/scripts/hitl-loop.template.sh`;
- `docs/engineering/diagnosing-bugs.md`.

Upstream project: [mattpocock/skills](https://github.com/mattpocock/skills).

## Distillation

The V1 adopts these source-backed behaviors in Partita form:

- establish an executable signal for the reported symptom before causal theory;
- reproduce and minimise against that signal;
- rank falsifiable hypotheses and map probes to predictions;
- measure performance regressions instead of replacing evidence with broad logs;
- lock the fix at a representative seam when one exists;
- remove temporary instrumentation and re-run the original signal;
- redact sensitive evidence before disclosure.

Partita changes the invocation policy to explicit-only, uses the Partita one-owner marker/effects contract, omits a shipped human-in-the-loop script, and adds a bounded Recall handoff. Those are Partita decisions, not claims about Matt's accepted theory.

## Case debt

No real Captain bug use currently confirms that this ordering, gate strength, or output shape is the right Partita governance. Active use must preserve actual process and outcome evidence in the Recall handoff. A user must later explicitly invoke `recall` to reconstruct that real use before this Skill can be treated as case-grounded.

Any patch to this existing identity-valid Skill remains owned by a later explicit `retune`; provenance and case debt do not authorize direct patching through `recall`.
