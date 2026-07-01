# Patch

`patch` 从真实 recurrence 中修补已有 skill。

patch SHOULD 只修改能阻止 recurrence 的最小 surface。

如果 case 暴露出新的 governance action，MUST split，而不是扩大旧 skill。

patch `SKILL.md` 时，MUST 保留现有 Partita source skills、verifier 和 tests 承载的 V1 section shape，并把 hard checks 保持在 verifier、script 或 test surfaces。

参见 [[skill/case/patch]] 和 [[projection/loss]]。
