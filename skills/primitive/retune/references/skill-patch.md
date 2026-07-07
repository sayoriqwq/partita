# Skill Patch

## Definition

`skill patch` 是根据真实 recurrence case 修补已有 skill 的最小行为变更。

## Patch Case

`patch case` 是 evidence-anchored governance sample，说明已有 skill identity 仍成立，但某个局部 surface 已经 stale。

最小 patch case：

```yaml
case:
  kind: patch
  target_skill: 要修补的已有 skill
  evidence:
    source: stable material pointer
    note: optional minimal excerpt or description
  situation: 真实发生或由材料直接证明的情境
  stale_behavior: target skill 现在怎样失败
  pressure: 为什么该 stale behavior 值得修补
  recognition:
    triggers:
      - future signal that should recall this patch case
    non_triggers:
      - optional boundary that should not recall this patch case
  expected_governance: 应该怎样防止复发
```

## Terms

`target skill` 是本次要修补的已有 skill。

`identity` 是 target skill 仍然成立的核心职责和治理动作。

`stale surface` 是 case 暴露出的局部过时面，例如 trigger、boundary、workflow、effects、reference、metadata、validation 或 Partita source structure。

`source structure` 是 Partita source skill 的 family、path、handle、marker、metadata default prompt、reference placement 或 generated projection shape。

`minimum patch` 是能防止该 recurrence 复发的最小修改。

`identity invalid` 表示 target skill 的核心职责已经不成立，不能继续 patch。

## Rules

- target skill、evidence、recurrence、stale surface、pressure、recognition surface 或 expected governance 不可读时，材料不足。
- 材料不足时，MUST 打回，并列出最小缺失字段。
- agent MUST NOT 编造 patch case、evidence、target identity、stale surface、pressure、recognition surface 或 expected governance。
- patch MUST 保持 target skill identity。
- identity invalid 时，agent MUST 停止并报告 blocker。
- patch MUST 小于 rewrite。
- patch MUST 只更新 stale surface 和直接需要的支撑文件。
- 当 stale surface 是 source structure 时，patch MAY move source skill folder，但 MUST 保持 target identity、runtime shape 和 references self-contained。
- case feedback MUST 写到治理失败的 target skill；如果 recurrence 暴露的是 creation/patch workflow 失败，不能只给 leaf skill 加局部 case。
- 没有 patch case 时，agent MUST NOT 运行 structure audit。
- agent MUST NOT 把 external skill migration 当作 patch。
