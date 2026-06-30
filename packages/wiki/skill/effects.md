# Effects

`effects` 是 skill 被允许产生的 side effects。

使用以下 surfaces：

```text
conversation
filesystem
external
```

当某个 surface 不允许产生 effect 时，MUST 显式写 `none`。

effects MUST NOT 宽于 skill boundary。

参见 [[projection/runtime]]。
