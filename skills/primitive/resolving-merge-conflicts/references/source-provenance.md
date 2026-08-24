# Matt Resolving Merge Conflicts source provenance

## Status

This Partita V1 is provisional and case-pending. It is source-backed, not a Captain-observed or Captain-validated Partita Resolving Merge Conflicts case. Static checks establish source identity and protect selected semantics; they do not prove real-use effectiveness.

## Immutable source

This distillation uses only the pinned Matt source at:

- repository: [`mattpocock/skills`](https://github.com/mattpocock/skills)
- revision: [`84fdeffd12f2ee307994d1eb6feb48173b6e0502`](https://github.com/mattpocock/skills/tree/84fdeffd12f2ee307994d1eb6feb48173b6e0502)

The complete Resolving Merge Conflicts runtime source and metadata were read and byte-verified against the pinned Git tree. The maintainer documentation was read as supporting evidence about intent and the source's completion posture.

| Source file | Git blob | SHA-256 | Immutable source |
| --- | --- | --- | --- |
| `skills/engineering/resolving-merge-conflicts/SKILL.md` | `aadb3fcb1dfb43413dff30c2fb4b18b7cf58e90e` | `c7c9ba81362a786aac05d2223123bf1bd2f8a99c3243a72882ede9c68bedfb24` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/skills/engineering/resolving-merge-conflicts/SKILL.md) |
| `skills/engineering/resolving-merge-conflicts/agents/openai.yaml` | `331ffb9d38937877f51a5f867a66dc61eee259ae` | `a1f4f96838f2ed6282eb28abbbf99029cb8fadce552baf53da90a025b8bffddf` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/skills/engineering/resolving-merge-conflicts/agents/openai.yaml) |
| `docs/engineering/resolving-merge-conflicts.md` | `6a05a003bef359587042c6e073930bdd691673b8` | `cef782a8232b901a7757368095b858d22e7c04595d93cbd5eeb5616f6a379935` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/docs/engineering/resolving-merge-conflicts.md) |

The runtime source and metadata define the shipped source identity. The documentation explains why primary intent and feedback checks are the source's added value and why Matt assumed every invoked operation should finish; it does not replace the runtime contract.

## Core governing idea

A merge conflict is an intent conflict, not a text-selection problem. The agent reads each side's commit, diff, PR, issue, specification, and relevant tests before editing; preserves both behaviors where compatible; and, where incompatible, follows the stated merge goal only when it clearly owns the trade-off. Repository checks then verify the combined behavior rather than merely the absence of conflict markers.

This is distinct from Diagnosing Bugs, which starts after an observable defect and develops causal evidence. Resolving Merge Conflicts starts from Git's in-progress conflict state and governs the resolution itself.

## Source completion posture and Captain authority

Matt's source says to always resolve, never abort, stage everything, commit, and continue every rebase. Its documentation makes the assumption explicit: invocation means the merge is definitely going to happen. That posture is secondary to the intent-centered core and cannot override Captain or outer-task authority.

Partita replaces unconditional completion with an authority ledger and safe stop. Ambiguous intent, unavailable primary evidence, new behavior, security or data-loss choices, destructive Git operations, and effects beyond granted edit/stage/continue/commit scope leave the operation intact and return the exact decision. Abort, reset, clean, blanket side selection, history rewrite beyond the active authorized rebase, push, and remote mutation never follow from Skill invocation.

## Partita adaptation

Partita makes top-level invocation explicit-only and classifies Resolving Merge Conflicts as a Primitive because its implementation calls no Skill. It adds the Partita marker/effects shell, pre-existing-work preservation, per-hunk intent records, generated-source handling, explicit completion authority, final behavior verification, truthful provisional disclosure, and a final Recall handoff.

This projection adds no selector, automatic invocation, merge runtime, compatibility layer, Gate object, state/error model, workflow composition, bug diagnosis, remote mutation, or broad Git authority.

## Pending evidence and evolution

No real Captain Resolving Merge Conflicts use yet validates this projection. Evidence must test whether primary intent can be recovered at practical cost, whether the authority ledger catches real destructive ambiguity, whether safe stops preserve a resumable operation, whether generated artifacts route correctly, whether checks demonstrate both sides' behavior, and whether multi-commit rebases remain understandable without importing unconditional completion.

A later real use MUST be reconstructed through a separate explicit `recall` before evolution is judged. Every patch to this identity-valid Skill MUST then be performed through a separate explicit `retune`; neither the handoff, Recall, provenance, nor static source-fidelity checks authorize editing.
