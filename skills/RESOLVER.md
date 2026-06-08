# Mini-Waza Skill Resolver

## Shared Output Marker

All Mini-Waza skills use the same output convention: prefix the first
user-facing line with `🧭` inline, not as its own paragraph. This marker is a
visible loaded-skill signal.

No skills are defined yet.

This file is the future routing registry for user-defined workflow skills.
Do not recreate Waza's original eight-skill table here.

When a skill is added:

1. apply `rules/skill-authoring.md`;
2. create `skills/<name>/SKILL.md`;
3. add one row to the table below;
4. run `make regenerate`;
5. run `make test`.

## Routing Table

| Intent | Skill | File |
| --- | --- | --- |
