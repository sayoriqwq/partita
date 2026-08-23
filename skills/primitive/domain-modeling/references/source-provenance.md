# Matt domain-modeling source provenance

## Immutable source

This Partita distillation uses only the pinned Matt source at:

- repository: [`mattpocock/skills`](https://github.com/mattpocock/skills)
- revision: [`84fdeffd12f2ee307994d1eb6feb48173b6e0502`](https://github.com/mattpocock/skills/tree/84fdeffd12f2ee307994d1eb6feb48173b6e0502)

| Source file | Git blob | SHA-256 | Immutable source |
| --- | --- | --- | --- |
| `skills/engineering/domain-modeling/SKILL.md` | `d0f7e1a5ccb06a7184056ff9af02b67bc77f9dda` | `152e2c97239affb12a60c5f4a7e74ab546a49ae169688c81f4e2ccc42dafa579` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/skills/engineering/domain-modeling/SKILL.md) |
| `skills/engineering/domain-modeling/CONTEXT-FORMAT.md` | `eaf2a18573f0a2d8c69ed53e29e4d9e21baf81d8` | `b8cc318f2a4285b530e908b6bc43901c3c5cd11100362636bbc4216639bef597` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/skills/engineering/domain-modeling/CONTEXT-FORMAT.md) |
| `skills/engineering/domain-modeling/ADR-FORMAT.md` | `da7e78ec1c220cd0aedf7ad36424c9398034f375` | `f1f36cd3f8d3b6474ddd5855da4e233bfc4ae1a1c5024909ccf11871819a41b2` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/skills/engineering/domain-modeling/ADR-FORMAT.md) |
| `skills/engineering/domain-modeling/agents/openai.yaml` | `7f1522d2f11506ee205275ab7c282aa52366ecf6` | `f6bf2aa996c6e6f53fdd0708e18a0d16a56aed8322cca59fedbe3c0d2c75f06b` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/skills/engineering/domain-modeling/agents/openai.yaml) |
| `docs/engineering/domain-modeling.md` | `01d172876f08f68f492c9c38c18d30048c1bbc07` | `04bc349ca8f8b4bfc70e61a8edb6f30597c0b59a3b8c0ac3c39182ef66222abf` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/docs/engineering/domain-modeling.md) |

The first four files are the pinned runtime source identity. The documentation is maintainer evidence about intended and observed behavior; it does not replace the runtime contract.

## Partita adaptation

Partita preserves the active intervention: challenge imprecise language during model change, propose a canonical distinction for human resolution, test relationships with scenarios, conditionally compare observable code, keep glossary deltas distinct from implementation/specification prose, and gate ADR offers on all three Matt criteria.

Partita changes only the runtime shell and storage adapter: explicit-only Codex invocation, one bounded result with outer-owner return, target-supplied record authority, and persist-or-handoff completion. It does not carry over Matt's automatic invocation or fixed `CONTEXT.md`, `CONTEXT-MAP.md`, and `docs/adr/` paths, and it adds no Effect or Pi runtime.

Static Partita checks protect this source projection and its functional contract. They are structural/source-fidelity evidence, not a claim that real invocation, storage writes, ADR persistence, automatic selection, or cross-model behavior has been exercised.
