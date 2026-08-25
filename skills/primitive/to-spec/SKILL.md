---
name: to-spec
description: "Use when the user explicitly invokes to-spec to preserve one settled multi-session decision context as one durable specification with user-approved test seams. Not for the work is still undecided, fits one bounded implementation context, needs ticket decomposition, asks for implementation or review, or lacks authority for one target-owned spec artifact."
---

# To Spec

When `to-spec` owns a response, its first user-visible line MUST be `🎼 To Spec`, optionally followed only by materially active, explicitly co-invoked contributors. To Spec retains artifact, envelope, effects, and termination ownership. If co-invoked owners conflict and precedence is unknown, ask one minimal owner question without a marker before activation.

## Rule

**Synthesize settled decisions; do not reopen them.** Preserve one decision context that must survive fresh sessions as one durable specification. Before drafting, propose the fewest highest public test seams and obtain the user's approval. Then record only evidenced problem, solution, decisions, tests, exclusions, and unresolved gaps; invent nothing to fill the shape.

## Pattern

Use when:

- the user explicitly invokes to-spec to preserve one settled multi-session decision context as one durable specification with user-approved test seams.

Do not use when:

- the work is still undecided, fits one bounded implementation context, needs ticket decomposition, asks for implementation or review, or lacks authority for one target-owned spec artifact.

## Boundary

Soft:

- On the first substantive response, disclose once: `Status: provisional / case-pending; source-backed, not Captain-validated.`
- Entry identifies the settled conversation or supplied decision record, target repository, multi-session pressure, and one authorized target-owned spec surface. The surface MAY be a repository-local Markdown convention or an explicitly authorized tracker.
- Read the smallest relevant code, project-owned domain language, and architectural decisions. Prefer established nouns and interfaces; do not assume a fixed glossary, ADR, tracker, or notes path.
- Propose existing public test seams before new seams, choose the highest useful boundary, and minimize their number. Seam approval and artifact authority are the only clarifications inside this Skill; product and architecture decisions remain upstream.
- The specification contains `Problem Statement`, `Solution`, `User Outcomes or Stories`, `Implementation Decisions`, `Testing Decisions`, `Out of Scope`, and `Further Notes`. A section with no settled evidence says so instead of attracting fabricated content.
- Implementation decisions describe stable modules, interfaces, invariants, schema or API contracts without volatile file paths or working code. A short decision-rich snippet from an already supplied prototype MAY appear only when prose would lose the settled decision.
- The artifact is a decision snapshot, not a live source of truth. Retention, replacement, labels, and later cleanup remain target-owned lifecycle choices.
- When the authorized surface is the Docwarden V1 FILE backend, publish only `.docwarden/issue-tracker/specs/<spec-id>.md` under its target-owned contract. The accepted record uses `kind: spec` and `status: ready`, owns its bounded outcome and acceptance criteria, and remains work/progress state rather than standing domain or current-state authority.
- Publication returns a receipt and proposed STATE delta to the outer Lead. To Spec does not write STATE or own record completion.

Hard:

- When: invocation is not explicit.
  Do: MUST produce no marker, artifact, publication, or other effect from this Skill.
- When: an essential product or architecture decision is missing, contradictory, or still under active choice.
  Do: MUST name the unresolved decision and stop before drafting; MUST NOT conduct a fresh design interview or choose for the user.
- When: test seams are not evidenced and user-approved.
  Do: MUST publish no specification until the minimum seam proposal is approved.
- When: one target-owned artifact surface or its mutation authority is absent.
  Do: MUST report the exact missing authority and stop rather than inventing a path, tracker, issue, or label.
- When: drafting and publication proceed.
  Do: MUST create or explicitly update exactly one authorized specification, inspect every material statement against the settled context, and make no other repository or tracker mutation.
- When: publishing to the Docwarden V1 FILE backend.
  Do: MUST obey its Spec path and schema, read back the record, and return the receipt plus proposed authority delta; MUST NOT mark the record `completed`, write STATE, create a Ticket, or update CONTEXT/GLOSSARY/ADR on the outer Lead's behalf.
- When: this implementation runs.
  Do: MUST call no Skill; repository reads and artifact tools are local mechanics.

## Effects

- Conversation: MAY show provisional status, the bounded source context, seam proposal and approval request, exact blocker, artifact locator, unresolved gaps, and final handoff.
- Filesystem: MAY inspect the target repository and create or explicitly update exactly one authorized target-owned Markdown specification, including one Docwarden V1 FILE Spec under its existing target contract.
- External: MAY read supplied decision evidence and publish exactly one specification to an explicitly authorized tracker surface; no label, branch, ticket decomposition, implementation, PR, or other mutation.

## Workflow

1. Confirm explicit invocation, one settled decision context, the target repository, why the work must survive fresh sessions, and authority for one target-owned specification surface. Stop if the work is still being decided or fits one bounded implementation context.
2. Read the complete supplied conversation or decision record and the smallest relevant code, domain language, and architecture records. Inventory only statements that are settled, deliberately excluded, or explicitly unresolved.
3. Sketch the fewest highest public test seams. Prefer existing interfaces and explain what behavior each seam can observe. Ask only whether those seams match the user's expectation; obtain approval before drafting.
4. Draft one specification under this exact semantic shape:
   - `Problem Statement`: the evidenced user-facing problem;
   - `Solution`: the settled user-facing outcome;
   - `User Outcomes or Stories`: complete evidenced outcomes, not boilerplate volume;
   - `Implementation Decisions`: settled interfaces, invariants, contracts, and architectural choices;
   - `Testing Decisions`: approved seams, observable behaviors, and relevant prior art;
   - `Out of Scope`: every deliberate exclusion or refused expansion;
   - `Further Notes`: unresolved gaps and source locators that belong in the snapshot.
5. Audit every material sentence against the settled input. Remove inferred requirements, generic filler, unstable implementation detail, and any choice the user did not make. Preserve unresolved or conflicting evidence visibly.
6. Create or explicitly update only the one authorized artifact. In Docwarden V1 FILE mode, write `.docwarden/issue-tracker/specs/<spec-id>.md` with `kind: spec`, `status: ready`, the bounded outcome, acceptance criteria, settled evidence, exclusions, reconciliation, and acceptance-evidence sections. Read it back and confirm the approved seams, settled decisions, and exclusions survived publication. Apply no default label or follow-on workflow.
7. Return the decision-context scope, approved seams, artifact locator, publication mode, unresolved gaps, receipt and proposed STATE delta. Leave STATE writes and completion to the outer Lead. Do not decompose tickets, implement, or review.
8. Finish a real use with exactly one handoff, without activating `recall` or `retune`:

```text
Recall handoff:
- target_skill: to-spec
- evidence_scope: <session turns or supplied decision record, repository evidence, seam approval, and artifact locator>
- trigger: <settled multi-session decision context preserved>
- actual_process: <source synthesis, seam approval, drafting, audit, and publication actually used>
- outcome: <specification locator and observable result, or exact blocker>
- observed_divergence: <difference from this provisional contract | none observed>
- patch_route: explicit recall produces the case/judgment; every patch requires a later explicit retune
```

## References

- Read [source provenance](references/source-provenance.md) to audit Matt's immutable To Spec source, governing behavior, excluded suite mechanics, Partita adaptation, and case debt.

## Validation

Before done:

- invocation was explicit, provisional/case-pending status appeared once, and no Captain-use validation was claimed;
- one settled multi-session decision context, target repository, and authorized specification surface were fixed before drafting;
- the user approved the fewest highest public test seams before publication;
- every material statement came from supplied decisions or repository evidence, while missing or conflicting decisions remained unresolved rather than invented;
- exactly one specification records the problem, solution, outcomes, implementation and testing decisions, out-of-scope boundaries, and further notes;
- Docwarden V1 FILE publication, when selected, used the distinct Spec path/schema, returned a read-back receipt and proposed STATE delta, and left STATE writes plus `completed` transition to the outer Lead;
- no fresh design interview, ticket decomposition, implementation, review, other Skill call, or unauthorized repository/tracker mutation occurred;
- exactly one final handoff records observed use, neither `recall` nor `retune` was auto-activated, and every future patch remains owned by explicit `retune` after Recall case/judgment;
- target runtime or landing checks passed, or the exact authority, evidence, or publication blocker was reported.
