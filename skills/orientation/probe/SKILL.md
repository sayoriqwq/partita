---
name: probe
description: "Use when the user explicitly invokes probe to test a load-bearing implementation uncertainty in the actual task environment. Not for aligning human decisions, researching source claims, prototyping design behavior, ordinary implementation, scaling a supported route, or governing side effects."
---

# Probe

激活时，第一条用户可见行 MUST 以 orientation marker `🧭` 开头，并显示 `🧭 Probe`。

## Rule

面对用户显式点名的承重实现未知时，MUST 在任务实际环境中选择最便宜的反证完成经验性验证；路线被推翻后，只在 `Aim`、scope 与 authority 均不变时自动换路，并在第一条路线达到 commitment point 时用 evidence receipt 停止，避免把“看起来可行”直接扩大成完整实现。

## Pattern

Use when:

- the user explicitly invokes probe to test a load-bearing implementation uncertainty in the actual task environment.

Do not use when:

- aligning human decisions, researching source claims, prototyping design behavior, ordinary implementation, scaling a supported route, or governing side effects.

## Boundary

Soft:

- `Load-bearing unknown` MUST 是一项经验性前提：一旦为假，会使下一段计划工作失效、改变路线，或造成实质浪费。
- `Actual environment` MUST 使用预期实施所依赖的真实 host、repository、working tree、account、identity、credential class、service、interface 与代表性 data；与目标不同的文档、mock、sandbox 或 prototype 只能帮助设计 probe，不能单独支持 `Supported`。
- `Cheapest falsifier` MUST 是能以最低合理成本推翻当前路线的最小观察或实验；不得为了获得更完整的理解先扩大读取、分类、构建或批处理。
- MUST 在执行前固定 `Aim`、probe scope、current authority、`Unknown` 与 `Next commitment`；probe 不得重新解释用户目标或扩大授权。
- 用户同时给出多个 load-bearing unknown 时，SHOULD 先验证最能使 next commitment 失效且成本最低的一项；只有它们必须共同成立才能产生任何有效 evidence 时，才可作为一个 probe 处理。
- source、documentation、code、schema 与已有 artifact MAY 用于定位真实 probe，但它们只能证明自身直接陈述的内容；当前环境的 reachability、authorization、behavior 与 end-to-end result 必须由当前观察或实际 receipt 支持。
- probe result MUST 只使用：
  - `Supported`: 至少一条路线在 actual environment 中产生了足以支持 next commitment 的最小 task-relevant end-to-end evidence。
  - `Refuted`: 当前路线的 load-bearing premise 已被实际 evidence 推翻，且同一 `Aim`、scope 与 authority 内没有可继续尝试的兼容路线。
  - `Partial`: evidence 缩小了未知，但不足以支持或推翻 next commitment。
  - `Blocked`: 无法取得决定性 evidence，原因是环境不可达、必要输入缺失、authority boundary、side-effect seam 或其他明确 gate。
- route 被 `Refuted` 时，MUST 重新计算同一 `Aim`、scope 与 authority 内的 cheapest compatible route，并继续 probe；不得仅因首选路线失败就中断用户。
- alternate route 会改变 `Aim`、scope 或 authority 时，MUST 停止为 `Blocked`，准确显示变化项；不得把 route switch 包装成原 probe 的自然延续。
- `Commitment point` MUST 是 actual evidence 已足以决定是否值得进入下一段工作的位置；它不是 completion、production readiness、scale readiness 或用户 acceptance 的代称。
- 达到 commitment point 后 MUST 停止；`Next` 只能指出已被 evidence 支持的下一段工作，不得在同一 skill execution 中开始该工作。
- MUST 区分 preparation 与 evidence：命令、脚本、清单、分类、配置和 probe artifact 只有在它们产生 task-relevant observation 时才能进入 `Evidence`；其存在本身不构成进展证明。
- MUST 将每项 evidence 连接到可解析 receipt，例如 command result、test output、UI observation、API response、exact path/revision 或 state comparison；inference 与 observation 不得混写。
- MUST 显示 probe 证明了什么以及没有证明什么；尤其不得从单个 canary 推导 scale safety、全面覆盖、长期稳定性或完整实现已经成立。
- side-effect handling MUST 保持为独立 seam：probe 只服从当前任务已经成立的 authority 与适用规则，不设计新的 side-effect policy；必要 probe 触及尚未解决的 material side effect 时，MUST 以 `Blocked` 停止并显示 `Side-effect seam`。
- probe receipt 默认只保留在 conversation；除非用户另行要求，不得创建报告、ADR、issue、plan 或其他 durable artifact。

Hard:

- When: 用户没有显式调用 `probe`。
  Do: MUST NOT 使用 `🧭 Probe` marker 或自行进入本协议。

- When: 未知属于 human-owned decision、source claim 或 sandbox design behavior。
  Do: MUST NOT 把它伪装成 empirical probe；准确说明不属于本 skill，并停止。

- When: probe 只验证了文档存在、命令可见、接口声明或 mock 行为。
  Do: MUST NOT 标记 `Supported`；继续验证 actual environment，或使用 `Partial` / `Blocked`。

- When: route switch 会改变 `Aim`、scope 或 authority。
  Do: MUST NOT 自动继续；显示精确 boundary 并停止。

- When: cheapest decisive probe 需要尚未解决的 side-effect handling。
  Do: MUST NOT 自行定义许可、回滚、审批或风险政策；显示 `Side-effect seam` 并停止。

- When: commitment point 已经达到。
  Do: MUST NOT scale、完成完整实现、批量处理、发布、迁移或顺手修复相邻问题。

- When: evidence 不足、冲突或无法复现。
  Do: MUST 使用 `Partial` 或 `Blocked` 并暴露 gap；不得用 confidence、计划或 surrogate progress 补成 `Supported`。

## Effects

- Conversation: MUST 显示 `🧭 Probe`、Aim、Unknown、result、route evidence、proof boundary、commitment point 与未执行的 Next。
- Filesystem: MAY 只执行当前 probe scope 与 authority 已允许的最小 empirical work；MUST NOT 扩大成 implementation 或 durable documentation。
- External: MAY 只执行当前 probe scope 与 authority 已允许的最小 empirical work；未解决的 side effect MUST 停在 seam。

## Workflow

1. 显示 `🧭 Probe`，解析 `Aim`、probe scope、authority、`Unknown`、actual environment 与 `Next commitment`；只有多个 materially different interpretations 会改变实验时，才问一个最小问题并停止。
2. 找出当前路线的 load-bearing premise，选择 cheapest falsifier；确认结果来自 actual environment，并检查是否触及 unresolved side-effect seam。
3. 执行最小 probe，捕获实际输入、环境、observable state 与 receipt；只补充会改变 result 的检查。
4. 将 route 标为 `Supported | Refuted | Partial | Blocked`。`Refuted` 时，在 `Aim`、scope 与 authority 不变的前提下自动选择下一条 cheapest compatible route，重复步骤 2–4。
5. 第一条 route 达到 commitment point 时停止实验；验证 evidence 只支持 next commitment，没有越级支持 scale 或 completion。
6. 使用以下 receipt 交付，然后停止，不执行 `Next`：

```text
🧭 Probe
Aim: <current task aim>
Unknown: <load-bearing empirical uncertainty>
Result: <Supported | Refuted | Partial | Blocked>

Routes:
- <route> — <route result>; <exact evidence or blocker>

Proves:
- <claim supported by actual evidence>

Does not prove:
- <material boundary of the evidence>

Commitment point: <justified next commitment | not justified; exact gap>
Next: <supported next work, not executed | none>
```

7. `Side-effect seam` 导致 `Blocked` 时，将它放在对应 route 的 evidence/blocker 中；不得在 receipt 后继续设计该 seam。

## References

- 无。

## Validation

Before done:

- 第一条用户可见行以 `🧭 Probe` 开头，且用户已经显式调用 `probe`；
- Aim、scope、authority、Unknown、actual environment 与 Next commitment 均可辨认；
- Unknown 是 load-bearing empirical premise，不是 human decision、source claim 或 sandbox design question；
- probe 使用 cheapest falsifier，没有先扩大准备性工作；
- `Supported` 来自 actual environment 的 task-relevant end-to-end evidence，不是 documentation、mock、artifact existence 或 confidence；
- route 被推翻后，只在 Aim、scope 与 authority 不变时自动换路；
- unresolved side effect 停在独立 seam，没有在本 skill 中发明治理政策；
- receipt 中 observation、inference、proof boundary 与 exact evidence 没有混写；
- commitment point 只支持下一段投入，没有冒充 completion、acceptance 或 scale readiness；
- 达到 commitment point 后已经停止，没有扩大实现或执行 Next；
- 没有创建未经要求的 durable artifact，filesystem 与 external effects 没有超出当前 probe authority。
