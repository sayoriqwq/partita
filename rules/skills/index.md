# Skills

Shared design language for Partita skills.

Use this directory when creating, auditing, or maintaining skills:

- [skill theory](../../theory/skill/index.md): why a skill exists as an agent
  behavior governance unit.
- [workflow theory](../../theory/workflow/index.md): how workflow gates locate
  case and pressure before skill design.
- [runtime projection](../../theory/skill/projection.md): how primitive
  semantics survive selector, marker, metadata, references, CLI, and verifier
  projection.
- [primitive](primitive.md): what a skill is before it becomes `SKILL.md`.
- [shape](shape.md): how primitive semantics are carried by supported skill
  files.
- [care](care.md): how existing skills are patched, audited, and protected from
  drift.
- [authoring](authoring.md): the workflow for turning a primitive into a
  usable Partita skill.

## Layer Map

```text
Skill Design Language
|-- Theory
|   |-- agent_behavior_governance
|   |-- contextual_governance_unit
|   |-- case
|   |-- pressure
|   |-- assertion
|   |-- governance_identity
|   |-- projection
|   |-- orchestration
|   |-- workflow_gate
|   |-- gate_contract
|   |-- workflow_orchestration
|   `-- gate_span
|
|-- Primitive
|   |-- pressure
|   |-- capability
|   |-- trigger
|   |-- boundary
|   |-- constraint
|   |-- state
|   |-- activation
|   |-- invocation
|   |-- duration
|   |-- workflow
|   `-- validation
|
|-- Shape
|   |-- namespace
|   |-- description
|   |-- frontmatter
|   |-- openai_metadata
|   |-- body
|   |-- references
|   `-- verifier
|
`-- Care
    |-- write
    |-- patch
    |-- case
    |-- audit
    |-- projection_loss
    `-- forward_test
```

Theory decides why a skill should exist, what its A/Y/X assertion is, how it
relates to workflow gates, and whether it is a primitive or orchestrator.
Primitive decides the skill semantics. Shape carries those semantics in a
Codex-supported form. Care keeps the skill from drifting after use.
