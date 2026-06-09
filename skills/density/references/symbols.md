# Density Symbols

Use this reference when `density` uses non-obvious operators, explains the
symbol system, or extends the vocabulary.

## Principle

- Use symbols only when they express the relation uniquely.
- Use controlled Chinese when a symbol would lose pragmatic nuance.
- Do not invent new operators for relations already shorter and clearer in
  Chinese.

## Vocabulary

| Symbol | Meaning |
| --- | --- |
| `A -> B` | cause, derivation, or flow |
| `A => B` | decision consequence or execution result |
| `A = B` | definition or equivalence |
| `A ≠ B` | exclusion or non-equivalence |
| `A > B` | priority |
| `A/B/C` | candidate alternatives, not simultaneous truth |
| `A & B` | A and B both hold |
| `A: B` | field, label, or key-value relation |
| `!A` | forbidden A |
| `A -x> B` | A blocks B |
| `A @B` | A belongs to or is mounted on B |
| `A @>B` | A applies to B |
| `[state]` | current state |
| `(?)` | uncertainty or needs confirmation |

`A @>B` does not inherit `>` priority semantics.

## Validation Markers

- `✅` means positive example or compliant case.
- `❌` means counterexample or non-compliant case.
- Use them only for examples, review, or validation.
- Do not use them as semantic operators inside inference chains.

## Rejected Forms

- Use `A -x> B`, not `A !-> B`, for blocking.
- Use controlled Chinese, not `A &> B`, for progressive conjunction.
- Use `A @>B`, not `A @=>B`, for scope/application.
