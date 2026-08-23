# Matt Prototype source provenance

## Status

This Partita V1 is provisional and case-pending. It is source-backed, not a Captain-observed or Captain-validated Partita Prototype case. Static checks establish source identity and protect selected semantics; they do not prove real-use effectiveness.

## Immutable source identity

Upstream repository: [mattpocock/skills](https://github.com/mattpocock/skills)

Revision: [`84fdeffd12f2ee307994d1eb6feb48173b6e0502`](https://github.com/mattpocock/skills/tree/84fdeffd12f2ee307994d1eb6feb48173b6e0502)

The complete Prototype runtime source and its load-bearing Logic and UI references were read completely. Their local pinned-snapshot bytes were verified against the GitHub Git tree blob identities before projection. The maintainer documentation was also read as supporting intent evidence.

| Source file | Git blob | SHA-256 | Immutable source |
| --- | --- | --- | --- |
| `skills/engineering/prototype/SKILL.md` | `094571156140f5993cce8557dc31383c82817f3e` | `2579ecf89a7fb7e73345117405c7ba9b9fb5ab22a78ecb08b0ce68b73f0148c2` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/skills/engineering/prototype/SKILL.md) |
| `skills/engineering/prototype/LOGIC.md` | `5f5a3fd5a8cbd69c029854e9881ddc6e87ae5093` | `5aef84c2ef514dd2a7268433abd3ee8e47b35f42b60e0b5f7430ec4937f4f06a` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/skills/engineering/prototype/LOGIC.md) |
| `skills/engineering/prototype/UI.md` | `76c0f6012b016af04d6105fa696a9a0e29dfa53a` | `e2ca04434be54acdee2f5df582ef8038fadf582bbcc99be0d2e27737ff8ed096` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/skills/engineering/prototype/UI.md) |
| `skills/engineering/prototype/agents/openai.yaml` | `1618b147965bc729b7bf3e8da5f130132067aadc` | `5af65e43ab41a350436697b81e27b7f848d36782043b73c322bb2c9fa9cc55dc` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/skills/engineering/prototype/agents/openai.yaml) |
| `docs/engineering/prototype.md` | `de86e9cc7472338016b17b367d65893659a1f170` | `2671ee5115875b23a98524e0443e77ecdee081c22cb79e12f0f667099f807c2c` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/docs/engineering/prototype.md) |

The first four files are the complete pinned runtime source identity. The documentation explains intent, history, suite relationships, and usage claims; it does not replace the runtime contract.

## Core governing idea

Matt's governing idea is that a prototype is throwaway code that answers one question, and the question decides the artifact. A logic/state question needs a directly runnable interaction surface that exposes the complete relevant state and difficult transitions. A visual-design question needs several structurally different alternatives that can be switched in place. In both branches, cheap runnability and observability serve learning; production hardening does not.

Partita preserves that center: exactly one design question, deliberate branch selection, the cheapest useful runnable artifact, observable state or visibly distinct alternatives, and a stop once the answer is available. Logic remains behind a thin throwaway shell; UI variants share representative inputs so their structural differences can be judged.

## Secondary issue, branch, and commit mechanics

Matt's source suite also files Prototype work through decision tickets, uses implementation issues and context pointers, parks completed prototypes on throwaway branches, captures answers in issues or commits, and participates in automatic routing and neighboring Skill flows. These mechanics preserve suite history and handoffs, but they are not the behavior-governing answer loop.

Partita does not inherit their authority. Prototype creates no issue, ticket, branch, commit, push, merge, or context pointer unless an outer task independently grants that action. It neither activates nor composes wayfinder, grilling, handoff, to-spec, implement, Research, TDD, or another Skill. The artifact and answer return to the caller; the caller's delivery contract owns retention and later implementation.

## Partita adaptation and boundaries

Partita makes top-level invocation explicit-only and classifies Prototype as a Primitive because its implementation calls no Skill. It adds the Partita marker/effects shell, one truthful provisional disclosure, target-scope filesystem authority, and one final Recall handoff.

The source prefers embedding UI variants into an existing page where possible. This projection instead requires a clearly marked isolated route or sandbox surface so prototype artifacts remain separate from production behavior while still using representative read-only context. It also removes automatic invocation and source-suite issue/branch/commit capture. It adds no selector, runtime, Gate, state/error/cancellation model, template or kernel redesign, Effect runtime, Pi compatibility, production mutation, or Implement/Research behavior.

Prototype and Probe remain separate: Prototype explores sandbox/design behavior to make an idea concrete; Probe tests a load-bearing implementation premise in the actual task environment to justify a next commitment. A convincing prototype is not actual-environment Probe evidence.

## Pending evidence and evolution

No real Captain Prototype use yet validates this projection. Evidence that the one-question bound regularly prevents a useful answer, that the logic interaction surface obscures rather than exposes the model, that three structural UI variants are too costly for the useful comparison, that isolation removes necessary visual context, or that users cannot reach a verdict from the artifact would disconfirm part of the shell.

A later explicit `recall` owns reconstruction of a real use and its judgment. Recall and provenance never authorize edits. Every patch to this identity-valid Skill MUST be performed through a later explicit `retune`.
