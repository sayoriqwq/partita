---
name: why
description: "Use when the user explicitly reconstructs the Why behind one ADR. Not for drafting ADRs, comparing multiple ADRs, making or superseding decisions, general code-history research, or explaining current architecture."
---

# Why

激活时，第一条用户可见行 MUST 以 orientation marker `🧭` 开头，并显示 `🧭 Why`。

## Rule

面对一个 Choice 留下但 decision frame 或隐性 Why 已丢失的 ADR 时，MUST 通过 contemporaneous provenance 重建当时的 tradeoff landscape，并与今天的新可能性分开展示，避免用当前代码替历史决定编造理由或只替既有 Choice 辩护。

## Pattern

Use when:

- the user explicitly reconstructs the Why behind one ADR.

Do not use when:

- drafting ADRs, comparing multiple ADRs, making or superseding decisions, general code-history research, or explaining current architecture.

## Boundary

Soft:

- `Target ADR` MUST 是一个可唯一解析的 ADR path、URL、number 或 title；输入含多个 ADR 时，MUST 只处理用户指定的一个。
- target 无法唯一解析时，MUST 只问一个最小 locator 问题；target 已解析后，SHOULD 一次完成 archaeology。
- MUST 使用以下 decision vocabulary：
  - `Frame`: 当时为什么必须选择，包括 Aim、Pressure 与 Constraints。
  - `Option`: 当时可行或被考虑的选择。
  - `Gain`: 选择该 Option 得到的价值。
  - `Loss`: 选择该 Option 放弃、承担或锁定的成本。
  - `Choice`: ADR 最终记录的 Option。
  - `Why`: 在当时 Frame 下，使 Choice 的 Gain 足以接受其 Loss 的隐性优先级。
- MUST 把历史 reconstruction 放在 `Then`，把当前 reconsideration 放在 `Now`；不得把今天发现的 Option、constraint 或 consequence 倒灌为历史事实。
- 每个 material historical claim MUST 使用以下 evidence grade，并指向可解析 provenance：
  - `Recovered`: contemporaneous source 明确陈述该 claim。
  - `Corroborated`: 多个独立的 decision-time artifacts 共同支持该 claim。
  - `Inferred`: evidence 允许该解释，但仍需要分析性推断。
  - `Missing`: 现有 evidence 不能安全恢复。
- `Recovered` MUST 只用于 decision-time ADR revision、task/session、PR、issue、spec、handoff、commit message 或其他同时期明确陈述。
- later retrospective account MAY 作为 evidence，但不得仅凭其升级为 `Recovered`。
- MUST 优先寻找 decision-time evidence：target ADR history、introducing commit、关联 task/session、PR、issue、spec、handoff、commit message，以及该 revision 的 code、tests、config 与 harness。
- accessible task/session history 只有在 ADR title、Option、commit、workspace 或 time window 提供 scope anchor 时才可搜索；MUST 保持在相关 workspace 与 decision window 内。
- current code、tests、config 与 harness MAY 证明今天的 consequence 或约束仍存在，但 MUST NOT 独自证明历史 Why。
- historical Option MUST 有 contemporaneous evidence 或明确标为 `Inferred`；今天才发现的 alternative MUST 放进 `Now > New options`。
- 每个 material Option MUST 显示 Gain 与 Loss；缺失的一侧 MUST 显示 `Missing`，不得用对称填空制造 tradeoff。
- Gain 与 Loss MUST 表达 Frame 下获得或承担的 value/cost；queue、worker、retry、database 或 API 等 mechanism inventory 只能作为 evidence，不得因存在就直接充当 Gain、Loss 或 Why。
- Why MUST 解释 Choice 相对其他 Option 的 priority ordering；“最终实现了 A”或“A 产生了某结果”不构成 Why。
- SHOULD 用 accepted Loss、rejected alternative 与 binding constraint 做 counterfactual check：如果 priority 改变，Choice 是否仍会胜出。
- Then 中的 counterfactual claim MUST 同样带 evidence grade；没有 contemporaneous statement 时，MUST 标为 `Inferred`。
- `Now` MUST 重新检查 changed constraints、new options 与 Gain/Loss 变化，并显示 `Choice still wins if` 与 `Choice stops winning if`。
- MUST 只展开 material possibilities；没有可信的新 Option 时，MUST 准确说明没有找到，而不是凑数。
- ADR 已有 rationale 时，MUST 把它作为待 trace 的 historical claim，而不是默认视为完整或正确。
- ADR status 已 deprecated 或 superseded 时，MUST 显示 status，但仍按目标 revision 还原当时 Choice。

Hard:

- MUST NOT 把 `Inferred` 或 `Missing` rationale 改写成 historical fact。
- MUST NOT 用 current implementation、today's preference 或 later consequence 单独解释当时为何选择 A。
- MUST NOT 只为 Choice A 构造 Gain，或只为 alternatives 构造 Loss。
- MUST NOT 在 `Then` 中加入没有 historical provenance 的新 Option。
- MUST NOT 评价哪一个 Option 今天应该被选择，也 MUST NOT 创建、修改、supersede 或批准 ADR。
- MUST NOT 调用或模拟 `align`、`argue` 或 ADR-writing workflow；本 skill 在重新铺开 landscape 后停止。
- MUST NOT 批量审计多个 ADR、泛化为 architecture review 或扩张到与 Target ADR 无关的 repository history。
- MUST NOT 暴露从 task/session、PR、issue 或 history 中发现的 secret、credential 或无关 private context。
- MUST NOT 写 filesystem 或创建 external state；所有 evidence discovery 必须只读。

## Effects

- Conversation: MAY 显示 target ADR、Choice、Then/Now landscape、evidence grades、provenance、Missing gaps 与 reconsideration conditions。
- Filesystem: none；MAY 只读 ADR、history、code、tests、config、harness 与相关 artifacts。
- External: MAY 只读相关 task/session、PR、issue、spec 或 linked evidence；no external mutations。

## Workflow

1. 显示 `🧭 Why`，唯一解析一个 Target ADR，并读取其 title、status、Decision/Choice、references 与现有 rationale。
2. 定位 ADR 的 introducing revision 与 decision-time window；读取 ADR history、关联 commit/PR/issue/spec/handoff/task/session，以及当时 revision 的相关 code、tests、config 与 harness。
3. 建立 claim-to-source Trace；逐项把 Frame、historical Options、Gain、Loss 与候选 Why 标成 `Recovered`、`Corroborated`、`Inferred` 或 `Missing`。
4. 对 Choice 做 counterfactual check：识别它接受了哪些 Loss、拒绝了哪些 Gain，以及什么 priority ordering 使该交换在 Then 成立。
5. 使用 current evidence 建立独立的 Now：检查 constraints、Gain/Loss 与可行 Options 的变化，并主动寻找 material new options。
6. 使用以下稳定形状输出；optional section 无 material 内容时省略，但 Missing gap 必须可见：

```text
🧭 Why

ADR: <path or URL; title; status>
Choice: <A>

Then
Frame:
- Aim: <claim and grade>
- Pressure: <claim and grade>
- Constraints: <claim and grade>

Options:
- <A> — Choice
  Gain: <claim and grade>
  Loss: <claim and grade>
- <B>
  Gain: <claim and grade>
  Loss: <claim and grade>

Why:
- [Recovered | Corroborated | Inferred | Missing] <priority ordering> — <source>

Trace:
- <historical claim> ← <revision, task, PR, issue, spec, commit, path, or URL>

Missing:
- <unrecoverable historical material>

Now
Changed:
- <current material delta>

New options:
- <option>
  Gain: <current gain>
  Loss: <current loss>

Choice still wins if:
- <condition>

Choice stops winning if:
- <condition>
```

7. 输出 landscape 后停止；不得推荐新 Choice、发起 alignment、修改 ADR 或继续实现。

## References

- 无。

## Validation

Before done:

- 第一条用户可见行以 `🧭 Why` 开头，且只解析了一个 Target ADR；
- Frame、Option、Gain、Loss、Choice 与 Why 使用一致定义；
- Then 与 Now 完全分开，新可能性没有伪装成历史 Option；
- 每个 material historical claim 有 evidence grade 与可解析 provenance，无法恢复的内容明确为 Missing；
- current implementation 没有被单独当作 historical Why；
- 每个 material Option 同时显示 Gain 与 Loss，没有为 A 或 alternatives 做单边 framing；
- Gain/Loss 表达 value/cost 而不是 mechanism inventory；
- Why 表达 priority ordering，而不是 implementation fact 或 after-the-fact consequence；
- Now 显示 material changed constraints/new options，以及 Choice 的继续成立和失效条件；
- 没有替 human 重新选择、调用其他 decision skill、修改 ADR 或执行 implementation；
- filesystem 与 external effects 全部保持只读，敏感或无关 context 没有泄漏。
