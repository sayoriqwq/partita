# Docwarden V1 module reconciliation

Use this checklist only while planning, writing, or reading back one authorized target. Once established, the target files own their content; this reference owns only the bootstrap/reconciliation projection.

## Required tracked shape

```text
AGENTS.md
.docwarden/
├── CONTEXT.md
├── GLOSSARY.md
├── STATE.md
└── issue-tracker/
    ├── CONTRACT.md
    ├── specs/
    └── tickets/
```

`.docwarden/NOTES.md` is deliberately absent from tracked shape and has an exact repository-root ignore entry. `.docwarden/adr/<scope>/<date>-<slug>.md` appears only when an accepted decision needs a record.

## Owners

- Root `AGENTS.md`: load order, write authority, reconciliation, completion, and conflict precedence. Keep one short pointer block.
- `CONTEXT.md`: stable domain meaning.
- `GLOSSARY.md`: behavior-changing collaboration leading words, excluding domain definitions.
- `STATE.md`: reconciled current reality, active work/ADR pointers, pending mutable intents, and uncertain effects; no per-turn log.
- `NOTES.md`: optional local human-authored continuity. Agents read only after explicit authorization and never write.
- `issue-tracker/CONTRACT.md`: the local tracked FILE paths, distinct Spec/Ticket schemas, and accepted lifecycle.

## Reconciliation checks

1. Load `CONTEXT.md`, then `GLOSSARY.md`, then `STATE.md`; read authorized NOTES afterward only when explicitly allowed.
2. Follow active work and ADR pointers from STATE. Do not populate or scan ambient directories.
3. Preserve one outer Lead. Workers return evidence and proposed deltas; Lead alone writes STATE and completes records.
4. Before a mutable effect, Lead records a reconcilable intent. After evidence, Lead records `Applied`, `NotApplied`, or `Unknown`; `Unknown` blocks retry until reconciled.
5. A completed record requires reconciled effects, necessary STATE/CONTEXT/GLOSSARY updates, ADR impact handling, and acceptance evidence.
6. Accepted ADRs contain `Why necessary`, `Decision`, `Context-at-the-time`, and `Revisit-when`, plus optional `Supersedes`. A changed decision creates a new file and updates STATE.
7. The FILE backend admits only `.docwarden/issue-tracker/specs/*.md` and `tickets/*.md`. It adds no remote adapters, labels, projects, milestones, templates, activity log, or index.

## Safe write

Upsert the `## Docwarden` AGENTS block and exact NOTES ignore line without replacing surrounding human text. Create missing files with minimal content. When an existing semantic owner disagrees, preserve it and return a conflict instead of projecting defaults over it. Read back every attempted path and report the observed delta.
