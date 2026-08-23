---
name: implement
description: "Use when the user explicitly invokes implement to build settled work from a supplied spec, ticket, or agreed plan through Partita TDD, project checks, and terminal Code Review. Not for planning, undefined behavior, test-only work, review-only work, or delivery operations."
---

# Implement

When `implement` owns a response, its first user-visible line MUST be `🎼 Implement`, optionally followed only by the display names of component Skills that materially contributed to that response. Implement remains first and retains the response envelope, effects policy, termination, and next-step decision.

## Rule

**Orchestrate the settled outcome; do not imitate the components.** Build only the supplied work, call the actual Partita TDD Skill at agreed public seams, run project checks under Implement ownership, and consume an actual terminal Partita Code Review before deciding the outcome.

## Pattern

Use when:

- the user explicitly invokes implement to build settled work from a supplied spec, ticket, or agreed plan through Partita TDD, project checks, and terminal Code Review.

Do not use when:

- planning, undefined behavior, test-only work, review-only work, or delivery operations.

## Boundary

Soft:

- On the first substantive response, disclose once: `Status: provisional / case-pending; source-backed, not Captain-validated.`
- Treat the supplied spec, ticket, or agreed conversation plan as the authority for the requested outcome. Ask only for a missing load-bearing input; do not reopen settled choices.
- One invocation SHOULD cover one bounded work item. Keep direct outer implementation to connective, configuration, documentation, or other work that has no independently assertable behavior for TDD.
- Components retain their own bounded interventions and return typed results. Implement retains the overall outcome, primary marker and response envelope, effect authority and policy, final validation, termination, next-step decision, and delivery-contract governance.
- Implement alone interprets and enforces a separately supplied delivery contract; its permissions originate outside this Skill, and components cannot change them.

Hard:

- Without explicit invocation, produce no marker and no effects from this Skill.
- The complete component set is closed, finite, and predeclared:

```yaml
components:
  - skill: pm:tdd
    input: TddRequest
    output: TddResult
  - skill: pm:code-review
    input: CodeReviewRequest
    output: CodeReviewResult
```

- Call no Skill outside that set and perform no ad hoc Skill discovery. These composition calls do not change any Skill's explicit-only top-level policy.
- Invoke the actual installed Partita component Skills. Do not reproduce or locally project their rules, workflows, references, or validation.
- A TDD call requires an agreed public seam and independently specified expected behavior. Without both, stop before implementation at that seam.
- Code Review is terminal. After its call begins, make no filesystem changes in this run.
- Git commit, push, and merge authority are external to this Skill. Implement MUST NOT perform them from its own authority or weaken Code Review's committed-diff preflight.

The component seams are:

```yaml
TddRequest:
  outcome_slice: <one concrete behavior from the authority source>
  agreed_seams: <user-agreed public boundaries>
  independent_expectation: <specification, worked example, or known-good literal>
  task_scope: <allowed change scope>
TddResult:
  status: completed | blocked
  changed_paths: <paths changed by the component>
  verification_receipts: <component command and verdict receipts>
  remaining_gap: <unmet behavior or none>
CodeReviewRequest:
  fixed_point: <user-supplied git ref>
  authority_source: <originating spec, ticket, or agreed-plan evidence>
  review_scope: <committed fixed-point...HEAD diff>
CodeReviewResult:
  status: completed | blocked
  standards_report: <cited Standards result>
  spec_report: <cited Spec result or no spec available>
  axis_summary: <per-axis totals and worst issues>
  recall_handoff: <the component's evidence handoff>
```

## Effects

- Conversation: MAY disclose status, restate the bounded outcome, request one missing seam or review input, show component participation, report check receipts, and return the final typed result.
- Filesystem: MAY modify files only within the supplied work scope; TDD MAY perform its declared bounded writes, while Code Review remains read-only. No git commit, push, or merge is authorized here.
- External: MAY run existing project development and verification commands; no external mutation.

## Workflow

1. Confirm explicit invocation. Read the supplied authority source and the smallest relevant project-owned instructions, domain records, architecture decisions, and test conventions. Record the requested outcome, allowed scope, independently observable acceptance evidence, user-supplied review fixed point, and any already agreed public seams. Stop on an unresolved load-bearing contradiction.
2. Partition the work by public seam. Cite seam agreement already present in the authority source or ask the user to agree before that seam is implemented. Do not redesign settled work.
3. For each independently assertable behavior, call the actual Partita Skill `pm:tdd` with a `TddRequest`. Show `🎼 Implement + TDD` while that component materially contributes, consume its `TddResult`, and either continue within the outer scope or terminate with its exact blocker. Implement only the bounded non-behavior work directly.
4. Run focused project checks during the work where useful, then run the repository-required tests, build, typecheck, lint, and delivery checks under Implement ownership. Preserve command and verdict receipts. A failing required check blocks terminal review until corrected or reported.
5. Validate the requested outcome against its authority source and acceptance evidence. Then require the external delivery contract to furnish a committed, non-empty `fixed-point...HEAD` review scope. If it does not, return a blocker; do not commit from Implement authority.
6. Call the actual Partita Skill `pm:code-review` terminally with a `CodeReviewRequest`. Show `🎼 Implement + Code Review` while it materially contributes and consume the returned `CodeReviewResult` without collapsing its Standards and Spec axes.
7. After the terminal call, make no further filesystem changes. Use the component result and outer validation to choose exactly one disposition: `complete`, `remediation_required`, or `blocked`. Implement alone owns that decision and the next step.
8. Return this typed result and exactly one Recall handoff:

```yaml
ImplementResult:
  disposition: complete | remediation_required | blocked
  outcome_evidence: <acceptance evidence and remaining gaps>
  project_check_receipts: <commands and verdicts>
  tdd_results: <ordered TddResult values>
  code_review_result: <unaltered CodeReviewResult>
  next_step: <outer-owned decision>
  delivery_authority: external
```

```text
Recall handoff:
- target_skill: implement
- evidence_scope: <session turns, authority source, component results, commands, receipts, and artifact locators>
- trigger: <settled work item implemented>
- actual_process: <outer sequence and component calls actually used>
- outcome: <ImplementResult disposition and evidence>
- observed_divergence: <difference from this provisional contract | none observed>
- patch_route: explicit recall produces the case/judgment; every patch requires a later explicit retune
```

A later real use MUST begin its evolution through a separate explicit `recall`. Every resulting patch MUST be performed through a separate explicit `retune`; this handoff and provenance authorize neither.

## References

- Read [source provenance](references/source-provenance.md) to audit the immutable Matt source, the Partita component-authority baseline, the projection boundary, and pending case evidence.

## Validation

Before done:

- invocation was explicit, provisional/case-pending status was disclosed once, and no Captain-use validation was claimed;
- one settled authority source, bounded outcome, scope, acceptance evidence, user-supplied fixed point, and every used seam are recorded;
- the only Skill calls are the actual Partita `pm:tdd` and `pm:code-review`, connected through the declared typed seams;
- every independently assertable behavior was returned by TDD or carries an exact blocker, while direct outer work stayed non-behavioral;
- ordinary project checks ran under Implement ownership and pass, or their exact blocker is returned;
- Code Review received a committed non-empty diff, ran terminally, and its typed two-axis result was consumed without later filesystem changes;
- Implement retained overall outcome, envelope, effect policy, validation, termination, next-step, and delivery-contract boundaries while components retained bounded interventions;
- no commit, push, or merge was performed from Skill authority;
- exactly one Recall handoff routes later use through explicit `recall`, and every patch remains owned by a later explicit `retune`.
