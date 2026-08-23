---
name: research
description: "Use when the user explicitly invokes research to investigate one bounded question through delegated primary-source reading and leave one claim-cited Markdown report. Not for unbounded surveys, conversation-only evidence answers, decisions, implementation, prototypes, or research without a background delegation and source-access surface."
---

# Research

When `research` owns a response, its first user-visible line MUST be `🎼 Research`, optionally followed only by materially active, explicitly co-invoked contributors. Research retains artifact, envelope, effects, and termination ownership. If co-invoked owners conflict and precedence is unknown, ask one minimal owner question without a marker before activation.

## Rule

**Delegated primary-source legwork is the Skill.** Bound exactly one answerable research question and its evidence scope, send the reading to exactly one background worker, and leave exactly one durable Markdown report in which every material claim points to the primary authority that supports it. Return the report locator visibly instead of replacing the artifact with a conversational answer.

## Pattern

Use when:

- the user explicitly invokes research to investigate one bounded question through delegated primary-source reading and leave one claim-cited Markdown report.

Do not use when:

- unbounded surveys, conversation-only evidence answers, decisions, implementation, prototypes, or research without a background delegation and source-access surface.

## Boundary

Soft:

- On the first substantive response, disclose once: `Status: provisional / case-pending; source-backed, not Captain-validated.`
- Entry MUST identify exactly one answerable question, a closed evidence scope, the target repository, and authority to create one report. The scope names the permitted source set or discovery boundary and any relevant version or time bound.
- Primary authority means the source that owns the claim: official documentation, a specification, first-party API output, or the relevant source code at a fixed revision. Secondary material MAY locate a primary source but MUST NOT support a report claim when that primary source is reachable.
- Each material report claim MUST carry its nearest precise source locator. Repository evidence includes revision plus path and line or symbol when available; web evidence includes a direct page URL and heading or anchor when available. Unsupported, inaccessible, or conflicting claims remain explicitly unresolved.
- Report placement follows an existing target-repository notes convention. If none exists, obtain authority for one sensible target-owned Markdown path and report that path; placement and commit or retention policy are secondary mechanics, not Research identity.
- A background worker or target-provided equivalent MUST perform the reading legwork and write the report. The worker is already delegated and MUST do the work itself rather than delegate again.
- `ground` remains complementary. When explicitly co-invoked, it MAY constrain evidence semantics as an overlay while Research still owns delegation and the artifact. Research does not invoke Ground, and Ground cannot supply a missing worker, source-access surface, or report authority.

Hard:

- Without explicit invocation, produce no marker, delegation, source retrieval, or report from this Skill.
- If the question is multiple, unbounded, or missing a closed evidence scope, request only the minimum narrowing needed and stop before delegation.
- Before delegation, prove that the target supplies one background worker surface with the tools and permissions needed to read the evidence scope and write the authorized report path. If any required surface is unavailable, report the exact blocker and stop; do not research synchronously, answer from memory, or silently adopt a conversation-only identity.
- Dispatch exactly one worker for exactly one report. The worker MUST NOT spawn another worker, create branches or issues, or make external mutations.
- Do not overwrite an existing report without explicit authority. A successful run creates or updates only the one authorized report and completes only after its claim citations and primary-source authority have been inspected.
- This implementation calls no Skill. Background workers and source tools are runtime surfaces, not Skill composition.

## Effects

- Conversation: MAY show the provisional status, minimum scope/path questions, an exact surface blocker, and the final report locator plus Recall handoff; MUST NOT substitute a substantive research answer for the report.
- Filesystem: MAY inspect the target repository and create or explicitly update exactly one authorized Markdown report at the target-owned path.
- External: MAY read only within the bounded evidence scope through target-provided tools; no branch, issue, PR, publication, or other external mutation.

## Workflow

1. Confirm explicit invocation. Restate exactly one answerable question, the closed evidence scope with version/time bounds, the target repository, and the authority for one report. Narrow or stop until all four are concrete.
2. Inspect the target repository for its existing research or notes convention. Select one non-existing Markdown path under that convention, or obtain explicit authority for one sensible target-owned path when no convention exists.
3. Preflight the target-provided background worker and its tools. Confirm that one worker can read every required source class in scope and write the authorized path. On any missing capability or permission, return the exact unavailable surface and stop without foreground substitution.
4. Dispatch exactly one background worker with the question, evidence scope, version/time bounds, target revision where relevant, and report path. Tell it that it is already delegated, must not delegate again, and must:
   - investigate only the one question;
   - follow every material claim to the primary authority that owns it;
   - use secondary sources only for discovery;
   - write exactly one Markdown report containing the question, scope/snapshot, findings with claim-level citations, unresolved gaps or conflicts, and a source list;
   - return the report path when the file is complete.
5. Leave the reading with that worker. Continue only separately authorized work that neither answers the research question nor creates another research artifact; do not duplicate its legwork in the owning context.
6. When the worker returns, inspect the one report. Confirm it answers only the bounded question, every material claim has a precise primary-source citation, unresolved gaps are visible, and no second report or delegated worker was created. If the artifact fails these checks, report the exact failure and do not claim completion or replace it with a conversational answer.
7. Announce completion without restating the research answer in conversation:

```text
Research complete:
- question: <the one bounded question>
- evidence_scope: <closed scope and snapshot/version>
- report: <target-owned Markdown path>
- result: <complete | completed with unresolved gaps named in the report>
```

8. Finish a real use with exactly one handoff, without activating `recall` or `retune`:

```text
Recall handoff:
- target_skill: research
- evidence_scope: <session turns, worker receipt, source locators, and report path>
- trigger: <the one bounded research question>
- actual_process: <scope, delegation, primary-source reading, report write, and inspection actually used>
- outcome: <report locator and observable result, or exact blocker>
- observed_divergence: <difference from this provisional contract | none observed>
- patch_route: explicit recall produces the case/judgment; every patch requires a later explicit retune
```

## References

- Read [source provenance](references/source-provenance.md) to audit the immutable Matt revision, governing idea, secondary placement mechanics, Partita adaptation, and case debt.

## Validation

Before done:

- invocation was explicit, provisional/case-pending status appeared once, and no Captain-use validation was claimed;
- exactly one answerable question, closed evidence scope, target repository, and one authorized report path were fixed before delegation;
- one target-provided background worker had the required read/write tool surface, performed the reading itself, and created no nested worker;
- every material report claim cites the nearest primary authority, while inaccessible, unsupported, or conflicting claims remain unresolved;
- exactly one durable Markdown report exists and the conversation returns its locator without substituting the substantive answer;
- Ground was not invoked by Research and did not replace delegation or artifact ownership;
- filesystem and external effects stayed within the one authorized report and read-only evidence scope, with no branch, issue, PR, or publication mutation;
- exactly one Recall handoff records observed use, neither `recall` nor `retune` was auto-activated, and every future patch remains owned by explicit `retune` after Recall case/judgment;
- target runtime or landing checks passed, or the exact unavailable surface or artifact failure was reported.
