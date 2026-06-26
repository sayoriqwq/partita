# Partita

`partita` is a CLI-backed Codex skill harness for user-defined workflow skills.

Zero skills remains a valid framework state, but the current customization
defines the user's Partita skill domain.

## Current State

- Codex plugin metadata: present.
- User-defined skills: read from `skills/<name>/SKILL.md` frontmatter.
- Executable maintenance is moving to the TypeScript/Effect `partita` CLI.

## Repository Map

- `.codex-plugin/plugin.json` is the generated Codex plugin manifest.
- `CONTEXT.md` maps the repository context to wiki nodes.
- `HARNESS.md` maps harness operations to wiki nodes.
- `skills/DISPATCHER.md` is the generated dispatcher reference.
- `bin/partita.ts` is the TypeScript/Effect CLI entrypoint.
- `src/partita/` owns generation, verification, and local install behavior.
- `wiki/` is the canonical Partita knowledge base for harness, skill,
  workflow, projection, practice, collaboration, documentation, and vocabulary
  nodes.

## Commands

```bash
pnpm generate
pnpm generate:check
pnpm verify
pnpm link:global
```

## Install Locally

Partita's local install path syncs skills globally first, then maps this repo
into the personal Codex plugin marketplace:

```bash
pnpm install:codex-skill
pnpm install:codex-plugin
```

Open a new Codex thread after installing so global skills are reloaded. The
local marketplace maps `~/plugins/partita` back to this repo, so source edits
stay in one place.

To run only the global sync:

```bash
pnpm install:codex-skill
```

`pnpm install:codex-plugin` maps the local plugin marketplace entry.

## Adding A Skill

Only add a skill after the user defines the workflow.

Read `wiki/practice/create.md` before writing a new skill. Use
`wiki/practice/patch.md` when changing an existing skill from a real case or
structure audit.

Minimum shape:

```text
skills/<name>/SKILL.md
skills/<name>/agents/openai.yaml
```

`agents/openai.yaml` is required for every Partita skill because it projects
the skill's invocation policy into runtime metadata.

Required frontmatter:

```yaml
---
name: <name>
description: "Use when ... Not for ..."
---
```

Keep `SKILL.md` frontmatter to `name` and `description`. Put Codex-specific
UI, `policy.allow_implicit_invocation`, and tool dependencies in
`agents/openai.yaml`; the policy key must live under the `policy` block.

After adding or changing a skill:

```bash
pnpm generate
pnpm verify
```

## Acknowledgement

Early exploration referenced [Waza](https://github.com/tw93/Waza), published
under the MIT License by Tw93. Partita does not ship Waza's skill taxonomy or
skill contents.
