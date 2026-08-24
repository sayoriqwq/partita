---
name: to-tickets
description: "Use when the user explicitly invokes to-tickets to decompose one settled plan, specification, or conversation into approved vertical tracer tickets with explicit blocking edges. Not for the work is unsettled, fits one bounded implementation context, asks for specification synthesis or implementation, or lacks authority for the target ticket surface."
---

# To Tickets

When `to-tickets` owns a response, its first user-visible line MUST be `🎼 To Tickets`, optionally followed only by materially active, explicitly co-invoked contributors. To Tickets retains artifact, envelope, effects, and termination ownership. If co-invoked owners conflict and precedence is unknown, ask one minimal owner question without a marker before activation.

## Rule

**Slice behavior, then expose the graph.** Decompose one settled body of work into the smallest useful set of independently verifiable vertical tracer tickets, give every ticket its genuine blocking edges, and obtain user approval of granularity and edges before publishing. Use expand–migrate–contract only when a wide mechanical refactor cannot remain green as vertical slices.

## Pattern

Use when:

- the user explicitly invokes to-tickets to decompose one settled plan, specification, or conversation into approved vertical tracer tickets with explicit blocking edges.

Do not use when:

- the work is unsettled, fits one bounded implementation context, asks for specification synthesis or implementation, or lacks authority for the target ticket surface.

## Boundary

Soft:

- On the first substantive response, disclose once: `Status: provisional / case-pending; source-backed, not Captain-validated.`
- Entry fixes exactly one settled source body, target repository, multi-session pressure, and authorized ticket surface. A source reference is read completely, including supplied comments or linked decision material within scope.
- Use project-owned domain language and applicable architectural decisions. Codebase inspection serves decomposition only; it does not authorize prefactoring, implementation, or new design decisions.
- A vertical tracer ticket delivers one narrow but complete user-visible or operator-visible behavior through every required layer. It is independently demoable or verifiable and sized for one fresh Codex context.
- Acceptance criteria belong to that ticket, name an observable falsifier, and are not already true at the ticket's starting point. They do not depend on behavior another ticket owns.
- A blocking edge exists only when the blocked ticket cannot begin or remain valid before its blocker completes. The published graph MUST be acyclic and MUST expose at least one unblocked frontier ticket.
- A wide refactor is one mechanical change whose blast radius cannot land green as a vertical slice. Sequence it as expand, independently green migrate batches, then contract; if batches cannot stay green, make that limitation and the final integration/verification gate explicit.

Hard:

- When: invocation is not explicit.
  Do: MUST produce no marker, decomposition, publication, or other effect from this Skill.
- When: the source work is unsettled, incomplete, or small enough for one bounded implementation context.
  Do: MUST report that mismatch and stop; MUST NOT create planning artifacts to manufacture work.
- When: a proposed ticket delivers only a layer, setup fragment, or acceptance owned elsewhere.
  Do: MUST merge or reshape it until it carries independently observable behavior; MUST NOT publish a horizontal stack as tracer tickets.
- When: the draft graph contains a cycle, a false edge, no frontier, or criteria that cannot fail before implementation.
  Do: MUST correct the draft and re-present it before approval.
- When: the user has not approved both ticket granularity and blocking edges.
  Do: MUST publish no ticket.
- When: publishing.
  Do: MUST use only the authorized target surface, create one artifact per approved ticket in blocker-first order, preserve native blocking relationships when available, and make no parent, label, branch, dispatch, or implementation mutation without separate outer authority.
- When: this implementation runs.
  Do: MUST call no Skill; source reads, repository inspection, and tracker tools are local mechanics.

## Effects

- Conversation: MAY show provisional status, source and scope, numbered draft tickets, blocking edges, approval questions, exact blocker, published locators, frontier, and final handoff.
- Filesystem: MAY inspect the target repository and create one target-owned local ticket file per approved ticket under an existing authorized convention; no source implementation changes.
- External: MAY read the supplied source and create approved tickets plus their blocking relationships on one explicitly authorized tracker; no parent modification, labels, dispatch, branch, PR, or implementation.

## Workflow

1. Confirm explicit invocation, exactly one settled plan/specification/conversation, the target repository, why delivery spans fresh contexts, and authority for one target ticket surface. Read the complete source and stop if decisions are still open or the whole change fits one context.
2. Inspect the smallest relevant code, domain language, architecture records, and existing ticket convention. Identify behavior boundaries and optional preparatory pressure without changing the repository.
3. Decide whether the work supports normal vertical slicing or is a genuine wide mechanical refactor:
   - normal work becomes narrow end-to-end behavior slices;
   - a wide refactor becomes expand → independently green migrate batches → contract, with a final integration gate only when isolated green is impossible.
4. Draft the smallest complete ticket set. For each ticket record a short domain title, one end-to-end behavior, acceptance criteria with observable falsifiers, and only the blockers that genuinely gate its start or validity.
5. Audit the graph: every ordinary ticket is independently demoable or verifiable, every criterion is owned and initially falsifiable, edges are acyclic, at least one frontier ticket is unblocked, and ticket size fits one fresh Codex context.
6. Present the draft as a numbered blocker-first list. For each item show `Title`, `Blocked by`, and `What it delivers`. Ask whether granularity is too coarse or fine, whether every edge is real, and which tickets should merge or split. Iterate only the decomposition until the user approves both dimensions.
7. Publish exactly the approved graph to the authorized surface in blocker-first order:
   - local mode writes one clearly identified file per ticket using the target's existing convention and textual blocker identifiers;
   - tracker mode creates one issue per ticket and uses native blocking relationships when the surface supports them, otherwise explicit blocker references in the ticket body.
8. Read back every artifact and edge. Return the source, ordered ticket locators, frontier, and any publication limitation. Stop before dispatch, implementation, parent mutation, or state transitions.
9. Finish a real use with exactly one handoff, without activating `recall` or `retune`:

```text
Recall handoff:
- target_skill: to-tickets
- evidence_scope: <source body, repository evidence, numbered draft, user approval, ticket locators, and blocker graph>
- trigger: <settled multi-session work decomposed>
- actual_process: <slice mode, graph audit, approval, and publication actually used>
- outcome: <published ticket graph and frontier, or exact blocker>
- observed_divergence: <difference from this provisional contract | none observed>
- patch_route: explicit recall produces the case/judgment; every patch requires a later explicit retune
```

## References

- Read [source provenance](references/source-provenance.md) to audit Matt's immutable To Tickets source, tracer and wide-refactor behavior, excluded suite mechanics, Partita adaptation, and case debt.

## Validation

Before done:

- invocation was explicit, provisional/case-pending status appeared once, and no Captain-use validation was claimed;
- one complete settled source body, target repository, multi-session pressure, and authorized ticket surface were fixed before decomposition;
- ordinary tickets carry narrow complete behavior through every required layer, while only genuine wide refactors use expand–migrate–contract;
- every ticket is independently demoable or verifiable, sized for one fresh context, and has acceptance criteria it owns with an observable pre-implementation falsifier;
- blocking edges are genuine and acyclic, at least one frontier ticket is unblocked, and the user approved granularity plus edges before publication;
- one artifact per approved ticket and every blocker relationship were read back from the authorized surface;
- no specification synthesis, implementation, dispatch, parent or label mutation, other Skill call, or unauthorized repository/tracker action occurred;
- exactly one final handoff records observed use, neither `recall` nor `retune` was auto-activated, and every future patch remains owned by explicit `retune` after Recall case/judgment;
- target runtime or landing checks passed, or the exact source, graph, authority, or publication blocker was reported.
