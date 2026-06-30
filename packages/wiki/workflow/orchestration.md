# Orchestration

`workflow orchestration` 把 request 放回 delivery flow：

```text
workflow -> gate -> assets -> case pattern -> primitive skill
```

它可以调用 primitive skills。

它 MUST NOT 合并 primitive skills 的 rules、boundaries 或 validations。

public workflow skill MUST 让自己的 workflow rule、gate logic、internal skill routing 和 disclosure boundary 保持可见。

参见 [[skill/orchestrator]]。
