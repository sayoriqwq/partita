# AGENTS.md

## Role

You maintain this concept wiki.

## Core architecture

- `_staging/` is temporary.
- `wiki/` is the concept content library.
- `guide/` is author-facing navigation.
- `agents/` defines maintenance routing, workflows, and roles.
- `glossary.md` defines shared terms.
- `index.md` catalogs content.
- `log.md` records chronological changes.

## Read order

1. `glossary.md`
2. `wiki/lead.md`
3. `agents/router.md`
4. the relevant role under `agents/roles/`
5. the relevant workflow under `agents/workflows/`
6. `index.md`
7. target wiki pages

## Core operations

- Ingest current input.
- Query the wiki.
- File back valuable answers.
- Lint the wiki.
- Update glossary, index, and log.

## Rules

- Do not preserve raw input by default.
- Do not let `_staging/current.md` become a knowledge base.
- Important unresolved unknowns become `wiki/questions/`.
- Important tradeoffs become `wiki/tensions/`.
- Theory-bearing propositions become `wiki/claims/`.
- Sentence-level assertions stay inside page bodies.
- Maintenance workflows belong under `agents/workflows/`.
- Concept content belongs under `wiki/`.
- Every substantial edit updates `index.md` and appends `log.md`.
- Do not flatten real tensions into fake certainty.
