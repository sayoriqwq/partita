# Matt To Tickets source provenance

## Status

This Partita V1 is provisional and case-pending. It is source-backed, not a Captain-observed or Captain-validated Partita To Tickets case. Static checks establish source identity and protect selected semantics; they do not prove real-use effectiveness.

## Immutable source

This distillation uses only the pinned Matt source at:

- repository: [`mattpocock/skills`](https://github.com/mattpocock/skills)
- revision: [`84fdeffd12f2ee307994d1eb6feb48173b6e0502`](https://github.com/mattpocock/skills/tree/84fdeffd12f2ee307994d1eb6feb48173b6e0502)

The complete To Tickets runtime source and metadata were read and byte-verified against the pinned Git tree. The maintainer documentation was read as supporting evidence about intent, failure patterns, and tracker limitations.

| Source file | Git blob | SHA-256 | Immutable source |
| --- | --- | --- | --- |
| `skills/engineering/to-tickets/SKILL.md` | `96deac51d4391a3f691478d48f85f43261516c08` | `5ecdf1d4df8a360ed39df21a2347f97ba177afd449a577da4f6b6ea8e1ebb808` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/skills/engineering/to-tickets/SKILL.md) |
| `skills/engineering/to-tickets/agents/openai.yaml` | `24605a5db64e4fc750b999aa94aea126bee814ee` | `21bc6215fffcd7614e9f772bb1760e87cc5fc7dcc707e7d282bc9414267a6090` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/skills/engineering/to-tickets/agents/openai.yaml) |
| `docs/engineering/to-tickets.md` | `c594031a5fab5c59e04d04786aaf4217356eae18` | `50810c609188fa55757226c6c853ff78ea8d7ff57926452af1b881ce169a5979` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/docs/engineering/to-tickets.md) |

The runtime source and metadata define the shipped source identity. The documentation supplies maintainer evidence about horizontal slicing, over-decomposition, blocker publication, criteria quality, and local tracker drift; it does not replace the runtime contract.

## Core governing idea

To Tickets turns settled multi-session work into a user-approved dependency graph of vertical tracer tickets. Every normal ticket delivers one narrow complete behavior, is independently demoable or verifiable, fits one fresh context, and declares only blockers that genuinely gate it. The user reviews granularity and edges before publication.

The source's load-bearing exception is a wide mechanical refactor that cannot land green in vertical slices. Expand introduces the new form beside the old, independently green migrate batches move callers, and contract removes the old form after all migrations. This exception preserves feedback rather than weakening the tracer rule.

## Secondary suite and tracker mechanics

Matt's source assumes setup-managed tracker and triage vocabulary, suite neighbors, local `.scratch` layout, `ready-for-agent` labels, and future Implement sessions. Its documentation records recurring source failures: models over-decompose, emit horizontal layers, publish prose instead of native blocker/sub-issue relationships, truncate large specifications, and write acceptance criteria that already pass or grade another ticket.

Partita keeps one artifact per approved ticket, blocker-first publication, native edges where the authorized target supports them, and explicit textual edges as fallback. It does not impose a tracker path or label, mutate a parent item, dispatch execution, call To Spec or Implement, or create a tracker compatibility layer. Artifact placement and issue relationships remain target-owned delivery mechanics.

## Partita adaptation

Partita makes top-level invocation explicit-only and classifies To Tickets as a Primitive because its implementation calls no Skill. It adds the Partita marker/effects shell, a one-context usefulness threshold, observable-falsifier and graph audits derived from the source's documented failures, truthful provisional disclosure, and a final Recall handoff.

This projection adds no router, automatic selector, tracker runtime, compatibility layer, Gate object, state/error model, component schema, parent workflow, implementation dispatch, or external mutation beyond the approved ticket graph.

## Pending evidence and evolution

No real Captain To Tickets use yet validates this projection. Evidence must test whether the one-context threshold is useful, whether vertical behavior survives realistic cross-cutting work, whether the graph audit catches false blockers and empty frontiers, whether wide-refactor batching remains green, whether target tracker edges can be read back reliably, and whether fresh Codex contexts can complete the tickets without hidden source context.

A later real use MUST be reconstructed through a separate explicit `recall` before evolution is judged. Every patch to this identity-valid Skill MUST then be performed through a separate explicit `retune`; neither the handoff, Recall, provenance, nor static source-fidelity checks authorize editing.
