---
name: code-review
description: "Use when the user explicitly invokes code-review to review committed changes since a supplied fixed point against repository standards and an originating spec. Not for bug hunting, uncommitted changes, whole-codebase audits, implementation, or general review advice."
---

# Code Review

When `code-review` owns a response, its first user-visible line MUST be `🎼 Code Review`, optionally followed only by material explicitly co-invoked contributors. Code Review retains envelope, effects, and termination ownership. If co-invoked owners conflict and precedence is unknown, ask one minimal owner question without a marker before activation.

## Rule

**Keep Standards and Spec irreducible.** For one committed three-dot diff from a user-supplied fixed point, obtain independent, evidence-cited judgments for whether the change is built right and whether it is the right change; report the axes side by side without merging, cross-axis reranking, or letting one axis mask the other.

## Pattern

Use when:

- the user explicitly invokes code-review to review committed changes since a supplied fixed point against repository standards and an originating spec.

Do not use when:

- bug hunting, uncommitted changes, whole-codebase audits, implementation, or general review advice.

## Boundary

Soft:

- On the first substantive response, disclose once: `Status: provisional / case-pending; source-backed, not Captain-validated.`
- The fixed point MUST come from the user. If it is absent, ask for it rather than choosing one.
- The review scope is the committed three-dot diff from the resolved fixed point to `HEAD`; staged and working-tree changes are outside the review.
- Repository-documented standards override the fallback smell baseline. Documented breaches MAY be hard findings; baseline smells MUST remain labelled judgment calls. Skip rules already enforced by tooling.
- Every Standards finding MUST cite a standards file and rule, or name one baseline smell and quote the relevant hunk. Every Spec finding MUST quote the relevant spec line.
- Reviewer output is a set of cited leads, not independently verified fact. Preserve its evidence boundary and do not claim a clean pass guarantees correctness or convergence.

Hard:

- Without explicit invocation, produce no marker and no effects from this Skill.
- Resolve the supplied fixed point and confirm a non-empty diff before dispatching reviewers. A missing ref or empty diff stops the review at preflight.
- Run the Standards and Spec reviews in parallel, isolated reviewer contexts so neither receives the other's reasoning. Reviewer roles are local mechanics, not Skill calls.
- If no spec is available after the bounded lookup and user confirmation, skip the Spec reviewer and report `no spec available`; never infer requirements from the diff.
- Keep the two reports under separate headings. Never merge their findings, choose one worst finding across both axes, or produce a blended verdict.

## Effects

- Conversation: MAY show the provisional status, preflight blocker, source inventory, separate Standards and Spec reports, per-axis summary, and final Recall handoff.
- Filesystem: read-only within the target repository and user-supplied local spec scope.
- External: none.

## Workflow

### 1. Pin and prove the review scope

Obtain the fixed point from the user. Resolve it with `git rev-parse`, capture `git diff <fixed-point>...HEAD` once, and capture `git log <fixed-point>..HEAD --oneline`. Confirm that the ref resolves and the diff is non-empty before continuing. The three-dot comparison is against the merge base and covers committed changes only.

### 2. Identify the authority sources

Find the originating spec in this bounded order:

1. a local spec path supplied by the user;
2. a repo-local file under `docs/`, `specs/`, or `.scratch/` matching the branch or feature;
3. ask the user for the spec location.

If the user confirms that no spec exists, record `no spec available` and skip only the Spec reviewer.

Find repo-local documents that govern how the changed code should be written, including applicable agent instructions, contribution guidance, and coding standards. Load the [smell baseline](references/smell-baseline.md) as a fallback floor. Repository rules win over conflicting heuristics, and tooling-enforced rules stay out of the review.

### 3. Dispatch independent axes

Dispatch both available reviewer roles in parallel with the same diff command and commit list, but do not expose either role's reasoning to the other.

The Standards reviewer receives the standards-source paths and the complete smell baseline. Its brief is to report, per file or hunk, every documented-standard breach with file and rule citations, plus possible baseline smells with the smell name and quoted hunk. It distinguishes hard documented breaches from heuristic judgment calls, applies repository overrides, skips tooling-enforced rules, and stays under 400 words.

The Spec reviewer receives the spec path or supplied contents. Its brief is to report requirements that are missing or partial, behavior not requested by the spec, and requirements that appear implemented incorrectly. Every finding quotes the relevant spec line, and the report stays under 400 words.

### 4. Preserve the two-axis result

Present the reviewer reports verbatim or lightly cleaned under exactly these peer headings:

```markdown
## Standards
<standards report>

## Spec
<spec report | no spec available>
```

Do not merge or rerank findings. End the review with one line giving the finding total and worst issue within each axis, if any, while explicitly declining an overall winner.

### 5. Preserve the real-use evidence

Finish a real use with exactly one handoff, without activating `recall` or `retune`:

```text
Recall handoff:
- target_skill: code-review
- evidence_scope: <session turns, fixed point, diff/commit commands, source paths, reports, and artifact locators>
- trigger: <requested review and comparison target>
- actual_process: <preflight, source discovery, reviewer dispatch, and aggregation actually used>
- outcome: <observable review result or exact blocker>
- observed_divergence: <difference from this provisional contract | none observed>
- patch_route: explicit recall produces the case/judgment; every patch requires a later explicit retune
```

## References

- Read [the smell baseline](references/smell-baseline.md) before dispatching the Standards reviewer.
- Read [source provenance](references/source-provenance.md) to audit the immutable Matt revision, source identities, Partita adaptation boundary, and case debt.

## Validation

Before done:

- invocation was explicit, the first substantive response disclosed provisional/case-pending status once, and no Captain-use validation was claimed;
- the user supplied the fixed point, the ref resolved, and the committed three-dot diff was non-empty before reviewer dispatch;
- Standards and available Spec reviews ran in parallel isolated contexts from the same diff and commit list;
- every finding carries its axis-required citation, repository authority overrides smell heuristics, and tooling-enforced rules were skipped;
- missing spec produced `no spec available` rather than inferred requirements;
- `## Standards` and `## Spec` remained separate, with only per-axis totals and worst findings and no blended verdict;
- Filesystem remained read-only, External remained none, and no other Skill was invoked;
- exactly one Recall handoff records observed use, `recall` and `retune` were not auto-activated, and every future patch remains owned by explicit `retune` after Recall case/judgment;
- target runtime or landing checks passed, or an exact blocker was reported.
