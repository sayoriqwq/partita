# Activation

`activation` 是判断某个 skill 是否应为当前 situation 加载的 decision。

activation 不只是 keyword match。

它需要当前 context 中存在携带 pressure 的 case pattern。

workflow-sensitive skills 使用：

```text
gate context + case pattern carrying pressure
```

参见 [[skill/case/pattern]] 和 [[workflow/gate/case]]。
