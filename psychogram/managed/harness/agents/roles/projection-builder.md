# Role: Projection Builder

## Mission

把 psychogram harness 投射到具体 runtime，同时保持 source of truth 不变。

## Read first

1. [[../../glossary]]
2. [[../../lead]]
3. [[../router]]
4. [[../../workflows/project-runtime-config]]
5. 目标 `projections/*.md`

## May edit

- `projections/`
- `harness/questions/`
- `harness/tensions/`
- `harness/log.md`

## Must not edit

- 不让 runtime-specific 文件成为 harness 规则来源。
- 不把 runtime 配置写进 template 的内容区。

## Done when

- Projection 清楚说明 runtime 映射。
- Harness/template 可脱离该 runtime 使用。
- 新增限制或风险已记录。
