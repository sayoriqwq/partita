# Mini-Waza

`mini-waza` is a Codex plugin skeleton for user-defined workflow skills.

It keeps the Waza-inspired skill framework shape without shipping Waza's
predefined skill taxonomy. The first useful state is a valid Codex plugin with
zero user-defined skills.

## Current State

- Codex plugin metadata: present.
- User-defined skills: none.
- Waza original skills: removed.
- Claude Code marketplace metadata: not part of this repo.

## Repository Map

- `skills/RESOLVER.md` records the current skill registry. It is empty until the user defines skills.
- `.codex-plugin/plugin.json` is the generated Codex plugin manifest.
- `scripts/dispatcher-template.md` is the source for the generated dispatcher reference.
- `scripts/build_metadata.py` regenerates `.codex-plugin/plugin.json`, `package.json`, and `scripts/dispatcher.md`.
- `scripts/verify_skills.py` validates the framework and any future `skills/*/SKILL.md`.
- `rules/` contains shared behavior rules that future skills may reference.
- `packaging.allowlist` controls what ships in `dist/mini-waza.zip`.

## Commands

```bash
make test
make regenerate
make package
```

## Adding A Skill

Only add a skill after the user defines the workflow.

Minimum shape:

```text
skills/<name>/SKILL.md
```

Required frontmatter:

```yaml
---
name: <name>
description: "Use when ... Not for ..."
when_to_use: "comma, separated, triggers"
dispatch_intent: "short routing label"
---
```

After adding or changing a skill:

```bash
make regenerate
make test
```
