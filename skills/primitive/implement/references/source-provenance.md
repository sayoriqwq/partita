# Matt Implement source provenance

## Status

This Partita V1 is provisional and case-pending. It is a source-backed Workflow projection, not a Captain-observed or Captain-validated Partita Implement case. Structural and semantic-fidelity checks do not prove real-use effectiveness.

## Immutable Matt source

Upstream repository: [`mattpocock/skills`](https://github.com/mattpocock/skills)

Revision: [`84fdeffd12f2ee307994d1eb6feb48173b6e0502`](https://github.com/mattpocock/skills/tree/84fdeffd12f2ee307994d1eb6feb48173b6e0502)

The complete Implement source set at that revision was read and byte-verified before projection:

| Path | Git blob | SHA-256 | Immutable source |
| --- | --- | --- | --- |
| `docs/engineering/implement.md` | `20293b523446d3089ec07822d1fd0c07c8a026ad` | `415bff7956736ee164b29f6100779f7e1975be3703f60e6b175c57373aade842` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/docs/engineering/implement.md) |
| `skills/engineering/implement/SKILL.md` | `7a0b11f5f4fe9505ea5c7983c3083ba1bf754f69` | `6d3fd9e83b8f36e5213854779db49b256a457a7ebb4a503e53fa7dcff696adc3` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/skills/engineering/implement/SKILL.md) |
| `skills/engineering/implement/agents/openai.yaml` | `f8794dc153b409052a9167baf10858cf01b36175` | `8970a8596ade0c28ab427f41a4ea242d6bdf6186c59ebf55e1238dbecaab79dc` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/skills/engineering/implement/agents/openai.yaml) |

The runtime source supplies the load-bearing sequence: build supplied settled work, use TDD at pre-agreed seams, run focused and full project checks, then use Code Review. The maintainer documentation confirms those are actual Skill invocations and records two authority failures in the source shell: unconditional commit, and review occurring before the committed diff that Code Review requires.

## Partita component authority at launch

Implement composes the public Partita component identities rather than copies of Matt's or Partita's component contracts. The launch baseline is Partita `origin/main` at `06c45a2ecffc1f835a9c860c08e999140aaf857c`:

| Path | Git blob | Role |
| --- | --- | --- |
| `skills/primitive/tdd/SKILL.md` | `c91392efcc319e07cd68af31a0e3721b8b311b29` | actual `pm:tdd` contract |
| `skills/primitive/tdd/agents/openai.yaml` | `ba31ef8aa75f83f4bd24f0a23a94c143ba971a79` | explicit-only public identity |
| `skills/primitive/code-review/SKILL.md` | `c49cefb4e947c43d6b4958984f1a93ddcb4b74ef` | actual `pm:code-review` contract |
| `skills/primitive/code-review/agents/openai.yaml` | `ecac1fd2ac88061920e087498bcc86452feaaf3f` | explicit-only public identity |

The component Skills remain the authorities for their bounded interventions. Implement declares only typed composition seams and outer orchestration; it carries no copied TDD or Code Review rule, workflow, reference, or validation body.

## Governing projection

Partita keeps Matt's settled-work boundary, agreed-seam TDD composition, ordinary project-check cadence, terminal Code Review, and one outer owner for completion evidence. It sharpens the sequence against the documented empty-review failure by requiring an externally authorized committed diff before the terminal Code Review call.

The Partita shell removes unconditional commit behavior. Commit, push, and merge remain subject to a separate task delivery contract, while Implement owns only implementation effects, component routing, validation, termination, and the next-step disposition. Its closed component set is exactly `{pm:tdd, pm:code-review}`. Research and Prototype are independent Skills and have no behavior or role in this Workflow.

The source-backed workflow case is default drift from orchestration into imitation or authority capture: an agent may write tests without a real TDD call, review an uncommitted invisible diff, flatten review findings into implementation judgment, or commit merely because the source prompt says so. The recognition surface is an explicit request to build one already-settled work item through these two public components. Captain-observed Partita use remains pending.

## Pending evidence and evolution

Evidence that would disconfirm this projection includes real uses where the two actual components cannot return through the declared seams, the external committed-review precondition makes authorized delivery impossible, terminal review prevents necessary completion, or outer ownership obscures component blockers or evidence.

A later real use MUST be reconstructed by a separate explicit `recall` before any evolution decision. Every patch to this identity-valid Skill MUST be performed through a later separate explicit `retune`; Recall, this provenance, and source fidelity never authorize direct editing.
