# Matt Research source provenance

## Status

This Partita V1 is provisional and case-pending. It is source-backed, not a Captain-observed or Captain-validated Partita Research case. Static checks establish source identity and protect selected semantics; they do not prove real-use effectiveness.

## Immutable source

This distillation uses only the pinned Matt source at:

- repository: [`mattpocock/skills`](https://github.com/mattpocock/skills)
- revision: [`84fdeffd12f2ee307994d1eb6feb48173b6e0502`](https://github.com/mattpocock/skills/tree/84fdeffd12f2ee307994d1eb6feb48173b6e0502)

The complete Research source set at that revision was read and byte-verified against the pinned Git tree:

| Source file | Git blob | SHA-256 | Immutable source |
| --- | --- | --- | --- |
| `skills/engineering/research/SKILL.md` | `0ba594a07f306479baa67104381f48e209ab6aae` | `af378829f015775a3bcd65ff466826722e99359017ae6bae227ca4c9bd14049c` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/skills/engineering/research/SKILL.md) |
| `skills/engineering/research/agents/openai.yaml` | `e18b96ca0ccc1003889d5d6991386207c2454bc2` | `9b4c470d63221c1f68f22df70b83e2f12401b317babe0d1b7b5f24a974474d0d` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/skills/engineering/research/agents/openai.yaml) |
| `docs/engineering/research.md` | `f17edac5ccdd1f4fab3cf7bfecc19d386083bc13` | `10aa8b6dfa1275b401c2996bf80d4c616fe9fef368bc77fdc8829098bf11c604` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/docs/engineering/research.md) |

The runtime source and metadata define the shipped identity. The documentation is maintainer evidence about its intended behavior, observed rough edges, placement debate, and missing stopping criterion; it does not replace the runtime contract.

## Core governing idea

Delegate reading legwork to a background worker, follow every material claim to the primary source that owns it, and leave one claim-cited Markdown report whose path is returned visibly. The artifact, primary-source discipline, and delegation distinguish Research from a conversational answer or ordinary source lookup.

Partita bounds the source's missing stopping criterion to exactly one answerable question and a closed evidence scope. It also makes the documented silent-delegation failure visible: a target without the required background worker, source-access tools, and report-write authority blocks rather than falling back to a different identity.

## Secondary repository-placement mechanics

Matt's runtime source asks the worker to follow the repository's existing notes convention and otherwise choose a sensible location. The maintainer documentation records that no canonical home or retention policy exists and that stale reports may become harmful. Therefore report placement, committing, archiving, and later deletion are target-owned lifecycle choices, not the governing Research behavior.

Partita preserves convention-first placement while requiring explicit authority for a fallback target-owned path. It does not introduce a global research folder, template system, branch, issue, publication path, or retention policy.

## Partita adaptation

Partita changes only the bounded shell: explicit-only Codex invocation, Primitive placement because the implementation calls no Skill, the Partita marker/effects contract, exactly one scoped worker with a no-redelegation brief, a visible failure when required runtime surfaces are absent, one truthful provisional disclosure, and one final Recall handoff.

Background workers and retrieval tools are runtime mechanics, not Skill composition. Ground remains a separately explicit complementary evidence protocol: it may overlay evidence semantics when co-invoked, but Research retains delegated legwork and artifact ownership and never calls Ground to perform its implementation.

This projection adds no automatic invocation, shared runtime, selector or Gate abstraction, state/error/cancellation model, template or kernel redesign, implementation or Prototype behavior, Pi compatibility, Issue workflow, or external mutation.

## Pending evidence and evolution

No real Captain Research use yet validates this projection. Evidence that the one-question bound routinely cuts across an indivisible fact set, available worker surfaces cannot reliably avoid nested delegation, primary-source-only claim support leaves useful reports systematically incomplete, claim-level citation inspection is insufficient, or target-owned report placement fails to remain durable would disconfirm part of the shell.

A later real use MUST be reconstructed through a separate explicit `recall` before evolution is judged. Every patch to this identity-valid Skill MUST then be performed through a separate explicit `retune`; neither the handoff, Recall, provenance, nor static source-fidelity checks authorize editing.
