---
name: prototype
description: "Use when the user explicitly invokes prototype to answer exactly one design question with the cheapest useful throwaway runnable artifact. Not for testing a load-bearing implementation uncertainty in the actual task environment, implementation, research, debugging, production demos, or already-settled design."
---

# Prototype

When `prototype` owns a response, its first user-visible line MUST be `🎼 Prototype`, optionally followed only by material explicitly co-invoked contributors. Prototype retains envelope, effects, and termination ownership. If co-invoked owners conflict and precedence is unknown, ask one minimal owner question without a marker before activation.

## Rule

**The question decides the throwaway shape.** Answer exactly one unresolved design question with the cheapest useful runnable artifact: choose a logic/state demo when the uncertainty is how behavior should work, or visibly distinct UI alternatives when the uncertainty is what a surface should look like. Make the relevant state and interaction observable, then preserve the answer while keeping every prototype artifact outside production behavior.

## Pattern

Use when:

- the user explicitly invokes prototype to answer exactly one design question with the cheapest useful throwaway runnable artifact.

Do not use when:

- testing a load-bearing implementation uncertainty in the actual task environment, implementation, research, debugging, production demos, or already-settled design.

## Boundary

Soft:

- On the first substantive response, disclose once: `Status: provisional / case-pending; source-backed, not Captain-validated.`
- State the one question in a sentence before writing code and define what observable comparison or interaction could answer it. If the request contains several questions, obtain one choice or split them into later invocations.
- For a behavior, data-shape, transition, or API-feel question, choose the logic/state branch. Build one self-contained HTML file that opens directly, keeps exploratory state in memory, labels the question and full relevant state in domain language, and offers both free play and short guided scenarios through awkward cases. Keep the logic as a small pure module behind the page so the UI shell cannot distort the model being explored.
- For a layout, information-hierarchy, or primary-affordance question, choose the UI branch. Default to three and never exceed five structurally different variants on one clearly marked throwaway route or sandbox surface. Use the same representative read-only data across variants and make switching obvious through a visible label and shareable variant selector. Variants MUST differ in structure, not merely color or copy.
- Place the artifact in the target's existing scratch/prototype convention, or at the nearest clearly named isolated location within the authorized task scope when no convention exists. It MAY imitate production context with representative data; it MUST remain separable from production behavior and production mutations.
- Optimize only for learning this answer: trivial startup, in-memory or clearly disposable data, and only enough styling, error handling, and wiring to make the artifact runnable and observable. Tests, generalization, persistence, reusable abstractions, and speculative cases are outside this prototype.
- Prototype explores sandbox/design behavior. `probe` instead tests a load-bearing empirical premise in the actual task environment to justify a later implementation commitment. A prototype artifact or its behavior never upgrades a Probe result to actual-environment evidence.

Hard:

- Without explicit invocation, produce no marker and no effects from this Skill.
- Without exactly one unresolved design question and an observable answer criterion, write no artifact; return the smallest missing input and stop.
- Do not call another Skill. Tools and project commands used to create or run the artifact are local mechanics, so this implementation remains a Primitive.
- Do not add or change production behavior, production mutations, real persistence, or production-facing error handling. Do not promote prototype code into production; return any validated direction as input for separately authorized work.
- Do not perform Implement, Research, TDD, Probe, or debugging behavior under this Skill. Do not turn the artifact into a whole-product demo or continue after the one question is answered.
- Issue creation, ticket transitions, branch creation, commits, pushes, merges, and context pointers require authority from the outer task. This Skill never gains that authority from its source mechanics and never performs them by default.

## Effects

- Conversation: MAY show the provisional status, one design question, chosen branch and rationale, run instructions, observable states or variants, the one-sentence answer, and final Recall handoff.
- Filesystem: MAY create or modify only clearly marked throwaway prototype artifacts inside the authorized task scope; production behavior remains unchanged.
- External: none. Local project commands MAY run only to make and observe the prototype.

## Workflow

1. Confirm explicit invocation. Write the single unresolved design question in one sentence and name the observable interaction or comparison that can answer it. If either is missing or the request contains multiple questions, obtain the smallest clarification before writing.
2. Choose deliberately:
   - **Logic/state** for behavior, transitions, data shape, or API feel. Use one directly openable HTML file containing a pure logic module, a domain-language state panel that re-renders after every action, free-play controls, and guided scenarios for the smallest decisive set of normal, awkward, and illegal cases.
   - **UI** for appearance, layout, hierarchy, or affordance. Use one isolated route or sandbox surface with structurally distinct variants over the same representative data, a visible current-variant label, and a shareable switcher. Default to three variants and cap at five.
3. Mark the artifact as a prototype and keep it in an isolated project-conventional location. Add only the minimum code and presentation needed to run it and expose the question's relevant state or visual alternatives; leave production behavior and real mutations untouched.
4. Run the artifact through its trivial startup path. Exercise the decisive logic actions or switch through every UI variant, recording only observations that bear on the question. Fix only failures that prevent the artifact from running or the answer from being observable.
5. Present the artifact and run instructions. When the answer depends on human design judgment, collect that verdict from the user; otherwise state the supported verdict. Keep iterating only within the same question until it has a one-sentence answer or report that the artifact could not decide it.
6. Stop with the question, branch, artifact locator, observed comparison, one-sentence answer, and separation boundary. Do not implement the answer in production or acquire delivery authority.
7. Finish a real use with exactly one handoff, without activating `recall` or `retune`:

```text
Recall handoff:
- target_skill: prototype
- evidence_scope: <session turns, question, artifact locator, run receipt, interactions or variants, observations, and answer>
- trigger: <the one unresolved design question>
- actual_process: <chosen logic/state or UI branch and what was exercised>
- outcome: <the one-sentence answer or exact reason the artifact could not decide>
- observed_divergence: <difference from this provisional contract | none observed>
```

A later real use MUST first go through a separate explicit `recall` to produce the case and judgment. Every patch to this Skill MUST then be performed through a separate explicit `retune`; the handoff, Recall, provenance, and prototype artifact never authorize a patch.

## References

- Read [source provenance](references/source-provenance.md) to audit Matt's immutable Prototype source, the governing idea, excluded secondary mechanics, Partita adaptation, and pending case evidence.

## Validation

Before done:

- invocation was explicit, provisional/case-pending status was disclosed once, and no Captain-use validation was claimed;
- exactly one unresolved design question and its observable answer criterion were fixed before artifact work;
- logic/state or UI was chosen from the question rather than convenience;
- a logic artifact is one directly openable file with pure logic, visible relevant state after actions, free play, and decisive guided scenarios; or UI alternatives are structurally distinct, use the same representative data, and expose a visible shareable switcher;
- startup is trivial, the decisive interactions were exercised, and one answer or exact undecidable result was recorded;
- prototype artifacts remain clearly marked and separate from production behavior, mutations, persistence, and production hardening;
- no Implement, Research, TDD, Probe, debugging, whole-product demo, other Skill call, or unauthorized issue/branch/commit/delivery action occurred;
- exactly one Recall handoff records observed use, `recall` and `retune` were not auto-activated, and every future patch remains owned by a later explicit `retune` after Recall;
- target source and delivery checks passed, or the exact blocker was reported.
