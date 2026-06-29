# Skill Md

`SKILL.md` files under `skills/` are the source skill runtime projection.

It is not an installed copy and not the full wiki. It must contain every-run
instructions and link or route to conditional detail.

V1 body section order is:

```text
## Rule
## Pattern
## Boundary
## Effects
## Workflow
## References
## Validation
```

Source namespaces come from path structure, not frontmatter. For example,
`skills/orientation/argue/SKILL.md` keeps `name: argue` and projects to
`og:argue`; `skills/maintenance/reconcile/SKILL.md` keeps `name: reconcile`
and projects to `mt:reconcile`; `skills/primitive/notate/SKILL.md` keeps
`name: notate` and projects to `pm:notate`.

Codex global skill installation is flat. The same source skill installs as
`argue`, `reconcile`, or `notate`; `orientation`, `maintenance`, and
`primitive` remain Partita source families, not global install directories.
