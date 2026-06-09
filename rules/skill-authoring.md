# Skill Authoring

Shared rule for designing future Craft skills.

## Rule

- Start from capability as agent behavior intervention, not folder shape,
  runtime package shape, CLI wrapper, or generic scaffold.
- Name the repeated pressure scenario before writing a skill. If no repeatable
  agent drift exists, do not add a skill.
- Define trigger and exclusion examples before materializing `SKILL.md`.
- Separate soft agent judgment from hard deterministic constraints. Put hard
  checks in scripts, CLI, verifier, or package validation.
- Keep workflow moves reviewable. When user confirmation is needed, ask for the
  smallest uncertain semantic unit.
- Keep export shape and validation visible before treating a skill as usable.
- Materialize only Codex-supported skill surfaces in this repo.
