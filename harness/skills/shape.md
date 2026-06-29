# Partita Skill Shape

## Definition

Partita `SKILL.md` shape 是 Partita-managed runtime skills 的本地 section contract。

## Sections

Partita V1 `SKILL.md` body 使用以下 section 顺序：

```text
## Rule
## Pattern
## Boundary
## Effects
## Workflow
## References
## Validation
```

## Rules

- `Rule` 说明 A/Y/X governance rule。
- `Pattern` 说明 when to use 和 when not to use。
- `Boundary` 说明 soft constraints 和 hard constraints。
- `Effects` 说明 conversation、filesystem、external 和 durable effects。
- `Workflow` 说明 execution sequence。
- `References` 说明 local references 以及何时读取。
- `Validation` 说明完成前 MUST 成立的条件。
- 每个 Partita skill MUST 有 `agents/openai.yaml`。
- local references MUST 能被 installed runtime skill 直接加载。
