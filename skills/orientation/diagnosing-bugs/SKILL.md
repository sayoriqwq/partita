---
name: diagnosing-bugs
description: "Use when the user explicitly invokes diagnosing-bugs to investigate a specific observed defect or performance regression through an evidence-producing diagnosis loop. Not for quick questions, proactive audits, raw unconfirmed reports, planned test-first development, or design prototypes."
---

# Diagnosing Bugs

When `diagnosing-bugs` owns a response, its first user-visible line MUST be `🧭 Diagnosing Bugs`, optionally followed only by material explicitly co-invoked contributors. Diagnosing Bugs retains envelope, effects, and termination ownership. If co-invoked owners conflict and precedence is unknown, ask one minimal owner question without a marker before activation.

## Rule

**The tight, red-capable feedback loop is the Skill. Everything else is mechanical.** Spend disproportionate effort engineering one named command that has already gone red on the user's exact symptom, runs in seconds, is deterministic or has a measured high reproduction rate, and is agent-runnable. No such loop means no cause hypothesis and no production fix.

## Pattern

Use when:

- the user explicitly invokes diagnosing-bugs to investigate a specific observed defect or performance regression through an evidence-producing diagnosis loop.

Do not use when:

- quick questions, proactive audits, raw unconfirmed reports, planned test-first development, or design prototypes.

## Boundary

Soft:

- On the first substantive response, disclose once: `Status: provisional / case-pending; source-backed, not Captain-validated.`
- Redact credentials, tokens, cookies, personal data, auth headers, and sensitive payloads before showing commands, output, or captured artifacts. If the redacted evidence is insufficient, request the smallest safer evidence.

Hard:

- Without explicit invocation, produce no marker and no effects from this Skill.
- Treat every phase gate in the Workflow as a stop condition. Stay in the current phase while its completion criterion is unmet; never replace missing evidence with code-reading theory.
- Keep filesystem and external actions within the current bug task. Ask the user before adding production instrumentation or another new external mutation.

## Effects

- Conversation: MAY show the status disclosure, redacted loop receipts, minimised repro, ranked hypotheses, probe results, cause, verification, gaps, and final handoff.
- Filesystem: MAY create or modify repros, temporary instrumentation, regression tests, and the implementation fix for the current bug; remove temporary artifacts before completion unless the user asks to retain them.
- External: MAY run existing diagnostic surfaces for the current bug; ask the user before production instrumentation or a new external mutation.

## Workflow

### Phase 1 — Build and tighten the feedback loop

Be aggressive and creative here. Try these routes in roughly this order until one catches the actual symptom:

1. A failing unit, integration, or end-to-end test at a seam that reaches the bug.
2. A curl or HTTP script against a running development server.
3. A CLI invocation with fixture input and known-good output.
4. A headless browser script that asserts on DOM, console, or network behavior.
5. Replay of a captured request, payload, trace, or event log through the code path.
6. A throwaway harness containing only the subset needed to exercise the path.
7. A property or fuzz loop for intermittently wrong output.
8. A bisection harness suitable for automated state, dataset, version, or `git bisect run` checks.
9. A differential loop that runs identical input through old/new versions or configurations.
10. As a last resort, a human-in-the-loop script based on [`scripts/hitl-loop.template.sh`](scripts/hitl-loop.template.sh): the agent runs the structured loop, the human follows prompts, and parseable observations return to the agent.

Treat the loop as a product, not a disposable setup step. Repeatedly tighten it:

- make it faster by caching setup, narrowing scope, and skipping unrelated initialization;
- make its verdict sharper by asserting the exact symptom rather than a generic crash or success;
- make it deterministic by pinning time, seeding randomness, isolating the filesystem, and freezing the network.

For a non-deterministic bug, raise and measure the reproduction rate instead of pretending it is deterministic: loop the trigger, parallelise, stress the system, narrow timing windows, or inject sleeps. Record a fixed run count and observed rate high enough to distinguish probes.

If no route can produce a loop, stop. List the routes attempted and request one of: access to the reproducing environment, a redacted captured artifact, or permission for temporary instrumentation. Do not hypothesise anyway.

**Gate to Phase 2:** name one command already run at least once and show its redacted invocation, output, and verdict. It must be:

- **exact-symptom red-capable:** it exercises the real bug path and fails on the user's symptom, then can go green when that symptom is fixed;
- **fast:** seconds rather than minutes;
- **deterministic or measured high-rate:** repeated runs give the same verdict, or a pinned flake run gives a high observed reproduction rate;
- **agent-runnable:** the agent can repeat it unattended, with human actions structured only through the shipped HITL helper.

### Phase 2 — Reproduce and minimise

Run the loop and confirm it reproduces the user's failure rather than a nearby one. Capture the exact error, wrong output, or slow measurement, and repeat enough runs to establish determinism or the measured reproduction rate.

Then shrink the repro to the smallest scenario that stays red. Remove inputs, callers, configuration, data, and steps **one variable at a time**, rerunning after every cut. Keep only elements proven load-bearing.

**Gate to Phase 3:** the exact symptom is reproduced and the repro is minimised until removing any remaining element makes the loop green. Both conditions are mandatory.

### Phase 3 — Rank falsifiable hypotheses

Generate **3–5 ranked hypotheses before testing any of them**. Each must state a falsifiable prediction:

> If X is the cause, changing Y will remove the symptom, or changing Z will make it measurably worse.

Discard or sharpen any hypothesis without a prediction. Show the ranked list to the user before probes so domain knowledge can re-rank it; if the user is away, proceed with the displayed ranking rather than blocking.

**Gate to Phase 4:** 3–5 ranked hypotheses with explicit predictions have been shown to the user.

### Phase 4 — Probe one prediction at a time

Map every probe to one Phase 3 prediction and change exactly one variable. Prefer a debugger or REPL, then targeted boundary logs; never log everything and grep. Give temporary logs one diagnosis-unique `[DEBUG-...]` prefix so one final grep proves cleanup.

For a performance regression, establish a repeatable baseline first, then use a profiler, query plan, bisection, or differential measurement. Measure first and fix second.

**Gate to Phase 5:** a one-variable probe has falsified alternatives and produced evidence for the surviving cause. A plausible story is not enough.

### Phase 5 — Fix at the real seam

Write the regression test before the fix only where it exercises the real call-site pattern. If every available seam is too shallow, record the missing seam as an architectural finding instead of adding false-confidence coverage.

When a real seam exists, turn the minimised repro into a failing test and watch it fail. Apply the smallest cause-directed fix, watch that test pass, then rerun the original un-minimised Phase 1 loop.

**Gate to Phase 6:** the real-seam regression changed red to green, or the absence of a valid seam is explicitly documented, and the original loop is green.

### Phase 6 — Verify, clean up, and learn

Rerun the original loop and regression coverage. Remove all diagnosis-tagged instrumentation and delete or explicitly retain every throwaway artifact. Record the hypothesis proved correct and its evidence in the commit or PR so the next debugger can learn the cause.

Only after the fix, ask what would have prevented the bug. If the answer is a missing seam, tangled callers, or hidden coupling, recommend a later architecture task with the concrete finding; do not auto-activate another explicit-only Skill.

Finish the real use with exactly one handoff, without activating `recall`:

```text
Recall handoff:
- target_skill: diagnosing-bugs
- evidence_scope: <session turns, commands, receipts, and artifact locators>
- trigger: <observed bug or regression>
- actual_process: <phases and routes actually used>
- outcome: <observable result>
- observed_divergence: <difference from this contract | none observed>
```

## References

- Read [source provenance](references/source-provenance.md) for the immutable Matt revision and blob identities behind this source-model replacement.
- Use [the HITL loop helper](scripts/hitl-loop.template.sh) when the final workable route requires structured human actions.

## Validation

Before done:

- every entered phase satisfied its gate, or Phase 1 stopped with the exact missing access, artifact, or instrumentation permission;
- the original loop is green and real-seam regression coverage passes, or the missing seam is documented;
- temporary instrumentation and throwaways are removed or explicitly retained;
- the proved cause is recorded durably and post-fix prevention was considered;
- visible evidence is redacted and all changes stayed within the current bug task;
- the final handoff is present and `recall` was not auto-activated.
