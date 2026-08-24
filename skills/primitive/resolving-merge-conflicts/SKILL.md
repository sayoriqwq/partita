---
name: resolving-merge-conflicts
description: "Use when the user explicitly invokes resolving-merge-conflicts to resolve an in-progress Git merge or rebase by recovering both sides' intent and verifying the resulting behavior. Not for there is no in-progress conflicted merge or rebase, the task is post-merge debugging or conflict prevention, or resolution or completion authority is absent."
---

# Resolving Merge Conflicts

When `resolving-merge-conflicts` owns a response, its first user-visible line MUST be `🎼 Resolving Merge Conflicts`, optionally followed only by materially active, explicitly co-invoked contributors. Resolving Merge Conflicts retains envelope, effects, and termination ownership. If co-invoked owners conflict and precedence is unknown, ask one minimal owner question without a marker before activation.

## Rule

**Resolve intent, not markers.** For one in-progress merge or rebase, recover the primary-source intent of both sides before editing each hunk, preserve both behaviors where compatible, and choose only what the stated merge goal unambiguously authorizes where they conflict. Verify the resulting behavior with the repository's checks before claiming completion; ambiguous or destructive choices stop safely for authority.

## Pattern

Use when:

- the user explicitly invokes resolving-merge-conflicts to resolve an in-progress Git merge or rebase by recovering both sides' intent and verifying the resulting behavior.

Do not use when:

- there is no in-progress conflicted merge or rebase, the task is post-merge debugging or conflict prevention, or resolution or completion authority is absent.

## Boundary

Soft:

- On the first substantive response, disclose once: `Status: provisional / case-pending; source-backed, not Captain-validated.`
- Entry records the Git operation, current branch or detached state, unmerged paths, pre-existing unrelated changes, stated merge goal, and separately readable authority to edit conflicts, stage resolutions, and finish or stop the operation.
- Primary intent evidence begins with the conflicting commits and diffs, then supplied PRs, issues, specifications, and applicable code or tests. A branch label such as ours/theirs is orientation, not intent evidence.
- Preserve both intents when they compose. When they are incompatible, choose only if the stated merge goal and primary evidence select one behavior without a new product, architecture, security, data-loss, or history decision; record what was dropped and why.
- Generated artifacts are resolved from their owning source and regenerated when the repository supplies that path. Unrelated cleanup, refactoring, dependency upgrades, and feature work remain outside the conflict operation.
- Relevant checks include targeted behavior from both sides plus the repository-required typecheck, tests, format, build, or verification surfaces. A syntactically clean tree is not proof that both intents survived.

Hard:

- When: invocation is not explicit, Git is not stopped on an in-progress conflicted merge/rebase, or the operation state cannot be proved.
  Do: MUST produce no marker or mutation from this Skill and MUST report the exact state mismatch.
- When: a hunk's intents remain incompatible or unclear, required primary evidence is unavailable, or the resolution would introduce new behavior or a destructive choice.
  Do: MUST leave that hunk unresolved, preserve the current Git operation, ask only for the missing authority or decision, and stop safely.
- When: considering abort, reset, clean, checkout of a whole side, history rewrite beyond the active rebase, or deletion of unrelated work.
  Do: MUST NOT run it without separate explicit authority; safe stop is the default and never discards the operation or existing work.
- When: resolving files.
  Do: MUST NOT apply blanket ours/theirs selection, erase a side merely to remove markers, edit unrelated files, or stage a path until every hunk in that path has an intent-backed resolution.
- When: operation completion authority is absent or narrower than stage/continue/commit effects.
  Do: MUST stop at the authorized boundary with exact status and next command; explicit Skill invocation alone never grants commit, rebase-continue, merge-finish, push, or force-update authority.
- When: completion is claimed.
  Do: MUST prove no unmerged paths or conflict markers remain, the intended behaviors from both sides were inspected, all authorized continuation steps completed, and relevant repository checks passed.
- When: this implementation runs.
  Do: MUST call no Skill; Git, repository, evidence, and check tools are local mechanics.

## Effects

- Conversation: MAY show provisional status, operation inventory, per-hunk intent evidence, ambiguity or authority question, trade-offs, check receipts, exact safe-stop state, completion result, and final handoff.
- Filesystem: MAY inspect repository and Git state, edit only conflicted/generated artifacts within scope, stage fully resolved paths, and perform explicitly authorized local merge/rebase continuation or commit effects; MUST preserve unrelated work.
- External: MAY read explicitly in-scope PR, issue, or specification evidence; no remote branch mutation, push, force update, PR mutation, or merge.

## Workflow

1. Confirm explicit invocation. Prove the in-progress merge/rebase state and capture `git status`, unmerged paths, current ref state, operation metadata, pre-existing unrelated changes, stated merge goal, and the exact edit/stage/continue/commit authority supplied by the outer task.
2. Inventory every conflict before editing. For each path and hunk, identify both originating commits and diffs; gather only the PR, issue, specification, test, or generated-source evidence needed to explain why each side changed.
3. Write a short intent pair for each hunk: behavior or invariant from side A, behavior or invariant from side B, compatibility judgment, and evidence locators. Treat missing or contradictory intent as a blocker rather than guessing from nearby text.
4. Resolve only evidence-complete hunks:
   - compose both behaviors where compatible;
   - where incompatible, follow the stated merge goal only when it unambiguously owns the choice and record the trade-off;
   - regenerate generated output from resolved owning source when supported;
   - leave ambiguous, destructive, or novel-behavior hunks untouched and stop for authority.
5. Inspect each resolved path for remaining markers and compare it with both source diffs and intent pairs. Stage only paths whose every hunk is resolved and whose unrelated content is unchanged.
6. Run the narrowest relevant checks that exercise both sides' intended behavior at each runnable conflict stop. Fix only an unambiguous resolution defect that remains inside both intents; any new design, unrelated failure, or destructive repair stops safely with evidence.
7. If authorized, continue the merge or rebase. A newly surfaced conflict starts again at Step 2; never reuse the prior hunk judgment. For a merge, run the repository-required final checks before the merge commit. For a rebase, run relevant checks before each continuation where runnable and the complete required checks after the operation finishes.
8. Before claiming completion, prove the Git operation has ended, no unmerged paths or conflict markers remain, both sides' retained behaviors have check evidence, and the repository-required checks pass. If authority ended earlier or a post-rebase check fails, return the exact safe-stop state and do not claim completion.
9. Report the operation result, files resolved, intent evidence used, explicit trade-offs, continuation or commit effects performed, check commands and verdicts, unrelated work preserved, and any remaining authority decision. Never push or mutate a remote.
10. Finish a real use with exactly one handoff, without activating `recall` or `retune`:

```text
Recall handoff:
- target_skill: resolving-merge-conflicts
- evidence_scope: <Git state, conflicting commits/diffs, primary intent sources, resolved paths, continuation receipts, and check results>
- trigger: <in-progress merge or rebase conflict>
- actual_process: <intent recovery, hunk resolutions, safe stops, continuations, and verification actually used>
- outcome: <completed operation and verified behavior, or exact unresolved state and authority blocker>
- observed_divergence: <difference from this provisional contract | none observed>
- patch_route: explicit recall produces the case/judgment; every patch requires a later explicit retune
```

## References

- Read [source provenance](references/source-provenance.md) to audit Matt's immutable conflict-resolution source, intent-centered core, changed stop/authority posture, Partita adaptation, and case debt.

## Validation

Before done:

- invocation was explicit, provisional/case-pending status appeared once, and no Captain-use validation was claimed;
- an in-progress conflicted merge/rebase, complete unmerged-path inventory, stated merge goal, unrelated-work boundary, and effect authority were proved before mutation;
- every edited hunk has primary evidence for both intents and either preserves both or records the unambiguously authorized trade-off;
- ambiguous, destructive, unavailable-evidence, or novel-behavior choices stopped safely without aborting, resetting, cleaning, discarding, or blanket side selection;
- only fully resolved paths were staged, generated outputs came from resolved owning source, and unrelated files remained unchanged;
- no unmerged paths or markers remain before completion, retained behaviors from both sides have verification evidence, and required repository checks pass, or exact safe-stop state is reported;
- no other Skill call, unauthorized continue/commit/history operation, push, force update, PR mutation, or remote merge occurred;
- exactly one final handoff records observed use, neither `recall` nor `retune` was auto-activated, and every future patch remains owned by explicit `retune` after Recall case/judgment;
- target runtime or landing checks passed, or the exact intent, evidence, effect-authority, or verification blocker was reported.
