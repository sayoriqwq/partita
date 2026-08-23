---
name: recall
description: "Use when the user explicitly invokes recall after a real Skill use to reconstruct an evidence-anchored use case and judge the next action. Not for patching a Skill, hypothetical examples, automatic history scanning, ordinary summaries, or creating a case before real use."
---

# Recall

当 `recall` owns 当前 response 时，每条用户可见回复的第一行 MUST 只包含 `🎼 Recall` 与可选的 ` + <Display Name>` suffix；suffix 只列出实质改变该回复的其他已显式激活/共同调用 Skill，不改变 ownership，active-but-inert Skill 与 local contract projection MUST 省略，其他内容从第二行开始。多个 co-invoked Skill 争夺 ownership 且 precedence 未确定时，MUST 在激活前只问一个不带 Skill marker 的最小 owner 问题。

## Rule

面对一次已真实发生的 Skill 使用，MUST 先把目标 Skill、证据范围、触发、实际过程、结果和可观察 divergence 重建为 evidence-anchored case，再判断下一步，避免以印象确认、修补、拆分或放弃 Skill。

## Pattern

Use when:

- the user explicitly invokes recall after a real Skill use to reconstruct an evidence-anchored use case and judge the next action.

Do not use when:

- patching a Skill, hypothetical examples, automatic history scanning, ordinary summaries, or creating a case before real use.

## Boundary

Soft:

- MUST 先固定 `target_skill` 和本次允许读取的 `evidence.scope`；只读取该范围内的 session turns、tool receipts、artifact locators 和 Skill source。
- MUST 将 observed fact、participant statement 和 inference 分开；每项关键判断都要能回到 evidence source。
- MUST 重建 `trigger`、`actual_process`、`outcome` 与 `observed_divergence`；没有 divergence 时明确写 `none observed`，不得编造失败来满足后续路径。
- MUST 将 target Skill 当前 identity 与这次真实使用分开判断。
- judgment MUST 只选择 `confirmation`、`retune`、`creation` 或 `abandonment`：
  - `confirmation`: 当前 identity 和行为得到本次 evidence 支持，没有暴露值得修补的 stale surface；
  - `retune`: 当前 identity 仍成立，且 evidence 暴露局部 stale surface；
  - `creation`: evidence 指向不同 identity，或需要新 Skill / split Skill；
  - `abandonment`: evidence 不支持继续保留、创建或治理该行为。
- `creation` judgment MUST 指向现有 creation path：普通 case-rooted Skill 使用显式 `notate`，public workflow Skill 使用显式 `conduct`。
- `retune` judgment MUST 只指向用户后续显式调用 `retune`；recall 不得自动激活其他 explicit-only Skill。
- 输出只保留一个 `case` 和一个 `judgment`；不得附带 patch、diff、replacement text、file plan 或 mutation commands。

Hard:

- When: 用户没有显式调用 `recall`，或没有真实 Skill 使用。
  Do: MUST NOT 使用 `🎼 Recall` marker、扫描历史或把 hypothetical material 提升为 case。

- When: evidence scope 未指定或不足以识别 target Skill、trigger、actual process、outcome 与 observed divergence。
  Do: MUST 停止，并只请求最小缺失 locator 或 evidence；MUST NOT 自动扫描 conversation history、filesystem 或 external session store。

- When: evidence 指向不同 Skill identity。
  Do: MUST 使用 `creation` judgment；MUST NOT 把 identity change 包装成现有 Skill patch。

- When: judgment 是 `retune`。
  Do: MUST 停在 case + judgment；MUST NOT 编辑 target Skill。`retune` 是 existing identity-valid Skill patch 的唯一 owner。

- When: recall 激活。
  Do: Filesystem 和 External 均保持只读；MUST NOT 写 case store、target Skill、reference、issue、plan 或其他 artifact。

## Effects

- Conversation: MAY 输出 evidence-anchored case、evidence gaps 和 next-action judgment。
- Filesystem: MAY 在明确 scope 内只读 Skill source 和 observable artifacts；no writes。
- External: MAY 在明确 scope 内只读用户指定的 session evidence；no mutations。

## Workflow

1. 确认用户显式调用了 `recall`，并固定真实 use 的 target Skill 与 evidence/session scope；如果 locator 不足，按 Hard boundary 请求最小补充并停止。
2. 读取 [case](references/case.md)，保持 evidence anchor、recognition surface 与 governance pressure 的含义；recall case 是 use observation，只有 judgment 路由后才由 owning creation/patch path 判定为对应治理 case。
3. 在 scope 内读取实际 turns、receipts、artifacts 和当时适用的 Skill source；建立 observation ledger，不推断不可见历史。
4. 按时间和因果重建 trigger、actual process、outcome 与 observed divergence；把 Skill 声明行为和实际行为逐项比较。
5. 判断 target identity 是否仍成立，再从 `confirmation | retune | creation | abandonment` 中选择唯一 route；记录最小 basis 和 downstream 所需 routing material。
6. 使用以下 envelope 交付并停止；除 marker 外不得输出第三个 top-level payload：

```yaml
case:
  target_skill: <stable handle or source locator>
  evidence:
    scope: <bounded session/use scope>
    sources:
      - <turn, receipt, artifact, or source locator>
  trigger: <what activated or motivated the Skill use>
  actual_process: <what the agent actually did>
  outcome: <observable result>
  observed_divergence: <difference from the Skill contract | none observed>
  routing_material:
    pressure: <recurrence/cost/boundary/trust significance | none observed>
    recognition:
      - <future retrieval signal supported by evidence>
    governance_need: <behavior change supported by evidence | none observed>
judgment:
  route: <confirmation | retune | creation | abandonment>
  basis: <evidence-linked reason>
  identity_assessment: <same identity | different identity | no durable identity>
  next_explicit_action: <none | invoke retune | invoke notate | invoke conduct>
```

## References

- 判断 evidence-anchored governance material 时，MUST 使用 [case](references/case.md)。

## Validation

Before done:

- target Skill 和 bounded evidence/session scope 已明确，且 use 真实发生；
- trigger、actual process、outcome 与 observed divergence 均由 evidence 支撑；
- observations、statements 与 inference 没有混写；
- judgment 恰为 `confirmation`、`retune`、`creation` 或 `abandonment` 之一；
- same identity + stale surface 只路由到 `retune`，different identity 或 split 只路由到现有 creation path；
- completed output 除 marker 外只有 `case` 和 `judgment`，没有 patch、diff、replacement text、file plan 或 mutation commands；
- recall 没有编辑 target Skill 或写入任何 artifact，且没有自动激活 explicit-only Skill；
- `retune` 仍是 existing identity-valid Skill patch 的唯一 owner。
