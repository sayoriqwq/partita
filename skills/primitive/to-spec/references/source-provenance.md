# Matt To Spec source provenance

## Status

This Partita V1 is provisional and case-pending. It is source-backed, not a Captain-observed or Captain-validated Partita To Spec case. Static checks establish source identity and protect selected semantics; they do not prove real-use effectiveness.

## Immutable source

This distillation uses only the pinned Matt source at:

- repository: [`mattpocock/skills`](https://github.com/mattpocock/skills)
- revision: [`84fdeffd12f2ee307994d1eb6feb48173b6e0502`](https://github.com/mattpocock/skills/tree/84fdeffd12f2ee307994d1eb6feb48173b6e0502)

The complete To Spec runtime source and metadata were read and byte-verified against the pinned Git tree. The maintainer documentation was read as supporting evidence about intent, rough edges, and lifecycle limits.

| Source file | Git blob | SHA-256 | Immutable source |
| --- | --- | --- | --- |
| `skills/engineering/to-spec/SKILL.md` | `3fd64959895b7eb095a13d797e1c7544f1f08c8f` | `5d26479544b08048d3a8f79d937b39bc613a617f026b3fd083bafc1e99a7b811` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/skills/engineering/to-spec/SKILL.md) |
| `skills/engineering/to-spec/agents/openai.yaml` | `549e6f76f020a1b9ba65f52ccda336566ee6222a` | `1c5b4d1e3d8e52287ef19cc2742fdbbfae1914ac75d33af3e4c8174f08cc55bb` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/skills/engineering/to-spec/agents/openai.yaml) |
| `docs/engineering/to-spec.md` | `42cbf939af619508efa302050a9eba70ceb3e7a3` | `9f2df5180fecb168aa561edeb785e7a31ca426669adfe4e30c36c6ca3d362704` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/docs/engineering/to-spec.md) |

The runtime source and metadata define the shipped source identity. The documentation explains the intended multi-session branch, known tracker and template rough edges, and snapshot lifecycle; it does not replace the runtime contract.

## Core governing idea

To Spec preserves decisions already made before their context disappears. It reads the settled conversation and relevant codebase, proposes the fewest highest public test seams for user approval, and publishes one specification containing the problem, solution, user outcomes, implementation decisions, testing decisions, exclusions, and notes. A fresh design interview or invented section content is a source failure, not helpful completion.

This behavior is distinct from Baseline, which records accepted consensus inside the conversation, and from To Tickets, which decomposes already settled work. To Spec creates the durable decision artifact that a fresh session can consume.

## Secondary suite and publication mechanics

Matt's source assumes setup-managed tracker and label vocabulary, fixed suite neighbors, project glossary and ADR locations, a `ready-for-agent` label, and a feature-oriented template that asks for an extremely extensive user-story list. The documentation records real friction: the label can trigger the wrong automation, large tracker issues may truncate, the template fits architectural work poorly, and specifications become stale as implementation teaches new facts.

Partita keeps synthesis, seam approval, and one published decision snapshot while making the artifact surface and mutation authority target-owned. It does not call a setup Skill, impose a tracker or label, create a catalog route, treat story volume as completeness, or turn the snapshot into a durable project truth. Repository-local Markdown and an explicitly authorized tracker are delivery surfaces, not new Partita infrastructure.

## Partita adaptation

Partita makes top-level invocation explicit-only and classifies To Spec as a Primitive because its implementation calls no Skill. It adds the Partita marker/effects shell, explicit refusal to reopen unsettled product decisions, one authorized artifact limit, truthful provisional disclosure, and a final Recall handoff.

This projection adds no selector, automatic route, tracker runtime, compatibility layer, Gate object, state/error model, setup flow, ticket decomposition, implementation, review, or external mutation beyond the one authorized specification.

## Pending evidence and evolution

No real Captain To Spec use yet validates this projection. Evidence must test whether the multi-session threshold earns the artifact, whether one seam-approval exchange is sufficient without reopening design, whether the semantic section shape works beyond feature work, whether artifact authority is practical across target repositories, and whether fresh sessions recover the settled decisions without hidden invention.

A later real use MUST be reconstructed through a separate explicit `recall` before evolution is judged. Every patch to this identity-valid Skill MUST then be performed through a separate explicit `retune`; neither the handoff, Recall, provenance, nor static source-fidelity checks authorize editing.
