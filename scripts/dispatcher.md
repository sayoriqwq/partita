---
name: craft
description: "Dispatcher for user-defined Craft workflow skills. Use when a Craft skill exists for the user's request. Not for generic work when no matching skill has been defined."
---

# Craft Dispatcher

Prefix your first user-facing line with `🧭` inline, not as its own paragraph
when a Craft skill is active.

Craft is a Codex plugin for user-defined workflow skills. Match only
against skills that exist in the routing table.

## Routing Table

<!-- routing-table:start -->
| Intent | Skill | File |
|--------|-------|------|
| Craft aim drift warning | aim | `skills/aim/SKILL.md` |
| Craft controlled high-density Chinese | density | `skills/density/SKILL.md` |
| Craft skill patch from real case | skill-patch | `skills/skill-patch/SKILL.md` |
| Craft skill writing from primitive | skill-write | `skills/skill-write/SKILL.md` |
<!-- routing-table:end -->

## How This Works

1. Read the user's message.
2. If the routing table has a matching skill, read that skill file.
3. If no skill matches, do normal agent work and do not invent a skill.

Skills chain manually, not automatically.
