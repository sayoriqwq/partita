---
name: tdd
description: "Use when the user explicitly invokes tdd to build one concrete feature or fix one bug test-first through red-green vertical slices at agreed public seams. Not for behavior or its independent expected result is undefined, the interface shape or seam location is a design question, tests are post-hoc, the task is refactoring or review, or the change has no independently assertable behavior."
---

# TDD

When `tdd` owns a response, its first user-visible line MUST be `🎼 TDD`, optionally followed only by material explicitly co-invoked contributors. TDD retains envelope, effects, and termination ownership. If co-invoked owners conflict and precedence is unknown, ask one minimal owner question without a marker before activation.

## Rule

**The red → green loop is the Skill.** Before writing any test, name the public seams under test and obtain the user's agreement. Then work in vertical slices: one behavior test that is observed failing, one minimal implementation that makes it pass, then repeat. Every kept test MUST verify observable behavior through a public interface and remain useful across internal refactors.

## Pattern

Use when:

- the user explicitly invokes tdd to build one concrete feature or fix one bug test-first through red-green vertical slices at agreed public seams.

Do not use when:

- behavior or its independent expected result is undefined, the interface shape or seam location is a design question, tests are post-hoc, the task is refactoring or review, or the change has no independently assertable behavior.

## Boundary

Soft:

- On the first substantive response, disclose once: `Status: provisional / case-pending; source-backed, not Captain-validated.`
- Read relevant project-owned domain language, test conventions, and architectural decisions before naming seams; use the target project's own record locations rather than assuming fixed paths.
- A seam is the public boundary where callers observe behavior without reaching inside. Test names SHOULD read as capabilities, and expected values MUST come from an independent source of truth such as the specification, a worked example, or a known-good literal.
- Prefer integration-style tests through real interfaces. Mock only system boundaries such as external APIs, time, randomness, and sometimes the filesystem or database; prefer a test database where practical. Never mock owned internal collaborators.
- If the interface shape is in question, return the exact interface or seam decision to the user before writing a test. This Skill carries the seam vocabulary it needs and does not activate another Skill.

Hard:

- Without explicit invocation, produce no marker and no effects from this Skill.
- Without user-confirmed seams, write no test or production implementation.
- During each slice, write exactly one test and run it first. Production implementation MUST wait until that test has been observed failing for the intended missing behavior rather than for broken setup, syntax, or an unrelated defect.
- After red, add only enough production code to make that one test pass and run the same test to observe green. Do not anticipate later tests or batch tests ahead of implementation.
- Keep refactoring outside the red → green loop. Return refactoring or review as later work without performing or activating it here.

## Effects

- Conversation: MAY show the provisional status, candidate and confirmed seams, red/green command receipts, behavior slices, blockers, verification, and final handoff.
- Filesystem: MAY modify tests and the minimum production implementation required by the current confirmed slice within the user's task scope.
- External: MAY run existing development and verification surfaces required by the current task; no new external mutation.

## Workflow

1. Confirm explicit invocation and one concrete behavior with observable input/output, task scope, and an independent expected result. Read the smallest relevant project-owned domain, testing, and architecture records.
2. Before any test or implementation change, write down the proposed public seams and ask the user to confirm them. If seams were already agreed in supplied material, cite that agreement. Stop while no seam is confirmed.
3. Choose the smallest next behavior at one confirmed seam. Name the test as a caller-visible capability and derive its expected value independently of the implementation.
4. Write exactly one test through the public interface. Run the narrowest representative command and observe the test fail for the intended absent behavior. If it passes or fails for another reason, correct the test or setup and obtain the intended red before touching production implementation.
5. Add only enough production code to satisfy that test. Run the same command and observe green; preserve the red and green command/verdict receipts.
6. Repeat Steps 3–5 for the next behavior, one vertical slice at a time. Apply the good-test and boundary-mocking rules on every cycle; perform no refactoring in this loop.
7. After the requested behavior is complete, run the agreed relevant suite and repository-required checks. Report confirmed seams, slices completed, red/green receipts, remaining gaps, and no refactoring beyond the minimal implementations.
8. Finish the real use with exactly one handoff, without activating `recall` or `retune`:

```text
Recall handoff:
- target_skill: tdd
- evidence_scope: <session turns, commands, red/green receipts, and artifact locators>
- trigger: <feature or bug behavior built test-first>
- actual_process: <seams and vertical slices actually used>
- outcome: <observable result>
- observed_divergence: <difference from this contract | none observed>
```

A later real-use evolution MUST begin with a separate explicit `recall` to produce case/judgment. Every resulting patch MUST be performed through a separate explicit `retune`; Recall, this handoff, and provenance never authorize a patch.

## References

- Read [good and bad tests](references/tests.md) when choosing assertions or checking implementation coupling and tautology.
- Read [mocking guidance](references/mocking.md) when the slice reaches a system boundary.
- Read [source provenance](references/source-provenance.md) to verify the immutable Matt source identity, projection boundary, or pending validation status.

## Validation

Before done:

- the user explicitly invoked TDD, the provisional/case-pending status was disclosed once, and no Captain-use validation was claimed;
- every test was written at a user-confirmed public seam and verifies caller-visible behavior through that interface;
- each production implementation delta has a recorded intended red followed by green for the same single test;
- slices remained one test → one minimal implementation, never a batch of tests followed by implementation;
- expected values came from an independent source, and mocks appeared only at system boundaries;
- no refactoring or review behavior entered the loop;
- relevant tests and repository checks pass, or the exact blocker is reported;
- the final handoff is present, neither `recall` nor `retune` was auto-activated, and every future patch remains owned by an explicit `retune`.
