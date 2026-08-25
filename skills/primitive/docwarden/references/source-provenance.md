# Docwarden V1 source provenance

## Captain authority

Docwarden V1 was accepted for one bounded Partita delivery on 2026-08-25. The accepted identity is `docwarden`: a Codex-first, explicit-only Primitive that establishes or reconciles one target repository's `.docwarden/` authority module, calls no Skill, and returns a receipt, proposed state delta, or exact blocker.

The acceptance fixes root `AGENTS.md` as runtime entry; distinct CONTEXT, GLOSSARY, STATE, local human NOTES, immutable ADR, and FILE Issue owners; Lead-owned mutable-effect reconciliation and completion; and exactly one local tracked FILE backend with separate Spec and Ticket paths/schemas. It excludes remote tracker and generic artifact infrastructure.

## Investigation baseline

The bounded 2026-08-25 investigation used Partita `7a3c0b400be1edbae15af7e045e108095a4447f4` and byte-verified Matt's repository at `84fdeffd12f2ee307994d1eb6feb48173b6e0502`. It found no current Partita setup/standards Skill and identified Matt's setup as a repository-local tracker/domain adapter rather than engineering-standards authority.

## Pinned Matt setup lineage

The relevant source is [`setup-matt-pocock-skills`](https://github.com/mattpocock/skills/blob/84fdeffd12f2ee307994d1eb6feb48173b6e0502/skills/engineering/setup-matt-pocock-skills/SKILL.md) at immutable revision [`84fdeffd12f2ee307994d1eb6feb48173b6e0502`](https://github.com/mattpocock/skills/tree/84fdeffd12f2ee307994d1eb6feb48173b6e0502).

Docwarden preserves only the setup lineage that survives the accepted boundary: inspect before asking, present the exact delta before mutation, upsert the active instruction surface while preserving human text, keep repository-local configuration, and read back the result. It does not inherit Matt's GitHub/GitLab choice, labels, Projects, setup-managed domain defaults, `CLAUDE.md`-first selection, `.scratch/**/issues` collision, suite routing, or rerun semantics.

## Partita projection

Partita projects the accepted identity to `skills/primitive/docwarden/`, handle `pm:docwarden`, marker `🎼 Docwarden`, and `policy.allow_implicit_invocation: false`. Primitive classification follows only from zero Skill calls; filesystem and Git operations are local mechanics.

The Skill reference owns bootstrap/reconciliation behavior. Each established target owns its resulting authority content. To Spec and To Tickets remain independent explicit-only Primitives and consume a target-authorized FILE contract directly; Docwarden does not call them and they do not call Docwarden.
