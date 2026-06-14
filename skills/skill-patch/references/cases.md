# Skill Patch Cases

Use these cases to recognize recurrence patterns before changing
`skill-patch`.

## Structure Audit Without Behavior Case

Observed: the user asked whether `skill-patch` needed improvement. The first
answer refused to patch because no concrete behavior case existed, missing that
the user also wanted a structure legality audit under skill-primitive rules.

Correction: split requests into `case-patch` and `structure-audit`. A
`case-patch` needs a real observed behavior case. A `structure-audit` may review
and patch skill shape without inventing a case.

Rule: use `references/skill-shape.md` as the audit surface, and keep external
skill-writing templates out of Craft runtime instructions.
