# Workflow: Run Fixture

## Purpose

用 fixture 输入测试 psychogram harness 和 template，并记录输出与观察。

## Read first

1. [[../glossary]]
2. [[../lead]]
3. [[../agents/roles/fixture-runner]]
4. [[instantiate-concept-wiki]]
5. [[lint-harness]]

## Steps

1. 读取 fixture 的 `README.md`、`input/` 和既有 `notes/`。
2. 使用 `template/` 生成或更新 `output/`。
3. 让 output 像真实 independent concept wiki 一样自洽。
4. 记录 fixture observations 到 `notes/`。
5. 判断观察是否属于 fixture-specific，还是能泛化为 harness/template/projection 修改。
6. 如果需要修改 harness 或 template，按对应 workflow 执行。

## Done when

- Fixture output 独立可读。
- Fixture notes 记录了重要观察。
- 没有把 fixture 内容复制到 harness 或 template。

## Related

- [[lint-harness]]
- [[update-template]]
- [[../tensions/generality-vs-fixture-specificity]]
