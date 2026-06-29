# Skill Patch

## Definition

`skill patch` 是根据真实 recurrence case 修补已有 skill 的最小行为变更。

## Patch Case

`patch case` 是真实 recurrence case，说明已有 skill 在某个局部表面已经 stale。

最小 patch case：

```yaml
case:
  target_skill: 要修补的已有 skill
  situation: 当时发生了什么
  stale_behavior: target skill 现在怎样失败
  expected_governance: 应该怎样防止复发
```

## Terms

`target skill` 是本次要修补的已有 skill。

`identity` 是 target skill 仍然成立的核心职责和治理动作。

`stale surface` 是 case 暴露出的局部过时面，例如 trigger、boundary、workflow、effects、reference、metadata 或 validation。

`minimum patch` 是能防止该 recurrence 复发的最小修改。

`identity invalid` 表示 target skill 的核心职责已经不成立，不能继续 patch。

## Rules

- target skill、recurrence、stale surface 或 expected governance 不可读时，材料不足。
- 材料不足时，MUST 打回，并列出最小缺失字段。
- agent MUST NOT 编造 patch case、target identity、stale surface 或 expected governance。
- patch MUST 保持 target skill identity。
- identity invalid 时，agent MUST 停止并报告 blocker。
- patch MUST 小于 rewrite。
- patch MUST 只更新 stale surface 和直接需要的支撑文件。
- 没有 patch case 时，agent MUST NOT 运行 structure audit。
- agent MUST NOT 把 external skill migration 当作 patch。
