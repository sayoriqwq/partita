# Matt TDD source provenance

## Status

This Partita V1 is provisional and case-pending. It is a source-backed projection, not a Captain-observed or Captain-validated Partita TDD case.

## Immutable source

This distillation uses only the pinned Matt source at:

- repository: [`mattpocock/skills`](https://github.com/mattpocock/skills)
- revision: [`84fdeffd12f2ee307994d1eb6feb48173b6e0502`](https://github.com/mattpocock/skills/tree/84fdeffd12f2ee307994d1eb6feb48173b6e0502)

Every source file was read completely and byte-verified before projection:

| Source file | Git blob | SHA-256 | Immutable source |
| --- | --- | --- | --- |
| `skills/engineering/tdd/SKILL.md` | `ead7781d79eb11cdafa1ac2db978cadef0eba240` | `5e6b9c16b547113e90afbb946489d1c1384be5c2128f0159bd0bee57251ecf08` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/skills/engineering/tdd/SKILL.md) |
| `skills/engineering/tdd/agents/openai.yaml` | `651b838a7663e027b1b8884491e867f26bb9a021` | `ea6f01cf1b8c06a4b0f5b649d74b1b8ce8685e72af1b38d70d877693e092af0b` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/skills/engineering/tdd/agents/openai.yaml) |
| `skills/engineering/tdd/tests.md` | `7ab86479f925a1f9e8ba680af33cb3b12e015381` | `859f9e592c188fda4fc7277dd180e4ce9c7a2e13f6efe1f6f29eccc9d28c106a` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/skills/engineering/tdd/tests.md) |
| `skills/engineering/tdd/mocking.md` | `71cbfee674d93244ce81d1830b930ca9a69200bd` | `3ceb807fdf4a47d6a93d4d9a891e5ba6d362a6247bd08adc451feebfc17361ef` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/skills/engineering/tdd/mocking.md) |
| `docs/engineering/tdd.md` | `5028b22f61689c6dd6ee7f428fb9d014e73c6839` | `e3cd9b5648c568e0a9183a80b07526eb2e70526d04bc7d2135b8418f0feb7682` | [source](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/docs/engineering/tdd.md) |

The first four files are the pinned runtime source identity. The documentation is maintainer evidence about intended behavior and known limitations; it does not replace the runtime contract. The shipped `tests.md` and `mocking.md` references are byte-identical to their pinned source blobs.

## Governing projection

The load-bearing semantics are Matt's red → green center, user agreement on public seams before any test, behavior tests that survive internal refactors, one-test/one-minimal-implementation vertical slices, independent expected values, boundary-only mocks, and deliberate exclusion of refactoring from the loop.

Secondary mechanics are project-language lookup, naming and assertion examples, dependency injection, SDK-shaped boundary adapters, and adjacent-skill pointers. Partita keeps the useful local references but does not compose or depend on another Skill.

Partita changes only the shell: explicit-only top-level invocation, Primitive placement because the implementation calls no Skill, the Partita marker/effects contract, one truthful initial status disclosure, target-owned record discovery instead of a fixed project path, and one final Recall handoff. It adds no automatic invocation, Skill runtime, selector or Gate abstraction, state/error/cancellation model, external mutation, Effect runtime, or Pi behavior.

## Pending evidence and evolution

Static source-fidelity checks can detect drift in this projection; they do not validate Captain use. Evidence that would disconfirm the shell includes observed real uses where prior seam agreement, strict intended-red-before-green, or one-slice vertical cadence repeatedly prevents the requested behavior rather than improving it, or where the protocol must call another Skill to perform its own implementation.

Only a later explicit `recall` may turn an observed use into case/judgment. Every patch, including one motivated by that judgment, remains owned by a separate explicit `retune`; neither Recall nor this provenance authorizes direct editing.
