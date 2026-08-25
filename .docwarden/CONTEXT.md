# Partita context

This file owns stable domain meaning for Partita. Operational rules remain in root [`AGENTS.md`](../AGENTS.md); collaboration leading words remain in [`GLOSSARY.md`](GLOSSARY.md).

## Partita

Partita is a personal, CLI-backed Codex Skill workflow/source harness. It owns self-maintained Skill source, source verification, Source Pin publication, and thin adapters to external home/runtime owners; it does not own the global runtime Skill universe or target-repository runtime copies.

## Source Skill

A Source Skill is a Partita-owned runtime-installable Skill directory under `skills/`. Its checked-in files are source authority; an installed global copy is a derived runtime projection.

## Source Pin

A Source Pin is a GitHub repository materialized read-only by Partita's git-subtree lifecycle and paired with a sibling `repos/<name>.subtree.json` contract. It is external evidence, not Partita-owned Skill source.

## Docwarden authority module

`.docwarden/` is this repository's bounded authority module. It separates stable meaning, collaboration semantics, reconciled current reality, accepted decisions, and work records by owner. The FILE Issue backend is tracked work/progress state, not standing domain or current-state authority.
