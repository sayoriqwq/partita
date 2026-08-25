# Docwarden V1 FILE Issue contract

This file owns the one local tracked Issue backend. Root [`AGENTS.md`](../../AGENTS.md) owns authority, reconciliation, and completion rules.

## Boundary

- Backend: repository-local tracked Markdown files only.
- Supported kinds: `spec | ticket`.
- Supported lifecycle: `draft | ready | in-progress | blocked | completed | not-planned`.
- Specs live only at `.docwarden/issue-tracker/specs/<spec-id>.md`.
- Tickets live only at `.docwarden/issue-tracker/tickets/<ticket-id>.md`.
- A record is work/progress state. It may govern its bounded execution slice but never replaces CONTEXT, GLOSSARY, STATE, or an accepted ADR.

## Spec schema

A Spec owns one bounded outcome and its acceptance criteria.

```markdown
---
kind: spec
id: <spec-id>
status: draft | ready | in-progress | blocked | completed | not-planned
title: <bounded outcome>
---

# <title>

## Outcome

## Acceptance criteria

## Settled decisions and evidence

## Out of scope

## Reconciliation

## Acceptance evidence
```

`to-spec` publishes or reconciles an accepted output as `ready`. It returns a receipt and proposed STATE delta; it does not make the Spec standing domain/current-state authority and does not mark it `completed`.

## Ticket schema

A Ticket owns one independently verifiable vertical slice. Its parent and blockers are repository-relative links to existing FILE records, not labels or names.

```markdown
---
kind: ticket
id: <ticket-id>
status: draft | ready | in-progress | blocked | completed | not-planned
title: <vertical behavior>
parent_spec: .docwarden/issue-tracker/specs/<spec-id>.md
blocked_by:
  - .docwarden/issue-tracker/tickets/<ticket-id>.md
---

# <title>

## Vertical slice

## Acceptance criteria

## Reconciliation

## Acceptance evidence
```

An unblocked Ticket uses `blocked_by: []`. Every nonempty blocker link must resolve to a real Ticket and genuinely gate start or validity. The graph is acyclic and has at least one unblocked frontier.

## Lifecycle and completion

Writers may reconcile records within the six states above. `blocked` names a current real blocker; `not-planned` is a deliberate Lead decision, not deletion. Components return receipts and proposed deltas.

Lead alone writes `completed`, and only after mutable effects are reconciled; STATE and any necessary CONTEXT/GLOSSARY changes are applied; ADR impact is handled; and the record's acceptance evidence proves its criteria. Git history owns file evolution, so this backend adds no activity log or index.
