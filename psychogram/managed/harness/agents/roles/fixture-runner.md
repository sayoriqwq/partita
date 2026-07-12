# Role: Fixture Runner

## Mission

运行 fixture，生成或检查 output，并把观察记录到 fixture notes。

## Read first

1. [[../../glossary]]
2. [[../../lead]]
3. [[../router]]
4. [[../../workflows/run-fixture]]
5. 目标 fixture 的 `README.md` 和 `notes/`

## May edit

- `fixtures/*/output/`
- `fixtures/*/notes/`
- `harness/questions/`，仅当 observation 暴露系统问题。
- `harness/tensions/`，仅当 observation 暴露系统取舍。

## Must not edit

- 不把 fixture output 页面复制到 harness。
- 不把单个 fixture 的领域词汇写入 template。

## Done when

- Output 独立可读。
- Fixture observation 已记录。
- 可泛化问题已进入 harness 的正确页面类型。
