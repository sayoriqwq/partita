# Skill Patch Cases

Use these cases to recognize known case shapes before changing `skill-patch`.

## Structure Audit Without Behavior Case

Observed: the user asked whether `skill-patch` needed improvement. The first
answer refused to patch because no concrete behavior case existed, missing that
the user also wanted a structure legality audit under primitive rules.

Correction: split requests into `case-patch` and `structure-audit`. A
`case-patch` needs a real observed behavior case. A `structure-audit` may review
and patch skill shape without inventing a case.

Rule: use `rules/skills/primitive.md` for semantic preservation and
`rules/skills/shape.md` for materialized shape. Keep external skill-writing
templates out of Partita runtime instructions.
