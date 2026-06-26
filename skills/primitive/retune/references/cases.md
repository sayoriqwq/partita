# Retune Cases

Use these cases to recognize known case shapes before retuning a skill.

## Structure Audit Without Behavior Case

Observed: the user asked whether an existing skill needed improvement. The
first answer refused to patch because no concrete behavior case existed, missing
that the user also wanted a structure legality audit under primitive rules.

Correction: split requests into `case-retune` and `structure-retune`. A
`case-retune` needs a real observed behavior case. A `structure-retune` may
review and correct skill shape without inventing a case.

Rule: use `wiki/practice/audit.md` for semantic preservation and runtime shape
checks. Keep external skill-writing templates out of Partita runtime
instructions.
