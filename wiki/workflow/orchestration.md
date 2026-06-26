# Orchestration

Workflow orchestration puts a request back into the delivery flow:

```text
workflow -> gate -> assets -> case pattern -> primitive skill
```

It may call primitive skills. It must not merge their assertions, boundaries,
or validations.

See [[skill/orchestrator]].
