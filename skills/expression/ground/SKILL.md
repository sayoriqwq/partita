---
name: ground
description: "Use when the user explicitly invokes ground to bound an answer to a named evidence scope. Not for ordinary unscoped answers, standalone implementation work, or open-ended research without a closed evidence boundary."
---

# Ground

`Full protocol` 中 `ground` owns 当前 response，每条用户可见回复的第一行 MUST 只包含 `💬 Ground` 与可选的 ` + <Display Name>` suffix。`Evidence overlay` 中 owner marker 追加 ` + Ground`，不显示第二个 marker。suffix 只列出实质改变该回复的其他已显式激活/共同调用 skill，不改变 ownership，active-but-inert skill 与 local contract projection MUST 省略，其他内容从第二行开始。多个 co-invoked skill 争夺 ownership 且 precedence 未确定时，MUST 在激活前只问一个不带 skill marker 的最小 owner 问题。

## Rule

面对用户显式调用 `ground` 并指定 evidence Scope 的回答时，MUST 把 Scope 当作闭合的回答依据，将每个 material claim 连接到精确 provenance，并把 evidence status 与 source authority 分开展示；当用户同时显式调用另一个 skill 来拥有 action 或 output 时，MUST 将这些 evidence semantics 作为 overlay，而不是争夺其 response protocol。

## Pattern

Use when:

- the user explicitly invokes ground to bound an answer to a named evidence scope.

Do not use when:

- ordinary unscoped answers, standalone implementation work, or open-ended research without a closed evidence boundary.

## Boundary

Soft:

- MUST 先确定 invocation mode：
  - `Full protocol`: 用户显式调用 `ground`，且没有其他 co-invoked skill owns 当前 response envelope；ground owns marker、envelope 与 read-only effects。co-invoked modifier 不影响 Full mode。
  - `Evidence overlay`: 用户同时显式调用 `ground` 与一个 compatible skill，且该 skill 明确 owns 当前 action 或 response envelope；owning skill 保留 marker、response shape、workflow 与其已授权 effects，在 canonical marker 后追加 ` + Ground`；ground 只约束 evidence Scope、claim status、provenance、Authority 与 evidence discovery。
- explicit co-invocation 中只有一个 skill MAY own top-level marker、envelope、workflow、mutation effects 与 termination；另一个 co-invoked skill 是 actual outer owner 时，`ground` MUST 作为 overlay。只有 modifier 时 ground 保持 Full。存在多个可能 owner 或 effects 不兼容时，MUST 在激活任何 candidate、显示 marker 或产生 effects 前，只问一个不带 skill marker 的最小 precedence 问题并停止。
- `Evidence overlay` MUST 把 evidence status 与 Authority 融入 owning skill 的自然结构；owning marker 必须追加 ` + Ground`，不得再显示 `💬 Ground`、强制完整 envelope，或撤销 owning skill 已有的 effects。ground 的 read-only boundary 只约束 evidence discovery。
- `Scope` MUST 是用户点名的 website、page、domain、file set、directory、repository、revision、supplied artifact 或这些来源的明确组合；“基于 X”“只看 X”“根据 X 回答”均将 X 设为闭合 evidence boundary，直到用户扩展它。
- MUST 固定可复现的 `Snapshot`：web source 使用实际读取时间与具体 page URL；file 使用具体 path；repository 使用 root、revision，并说明是否包含 working tree；versioned artifact 使用 version、page 或 section。
- 每个 material claim MUST 恰好使用一个 evidence status；MAY 用同名 section 聚合多个 claims，或以内联 lead word 标记：
  - `Grounded`: Scope 内 evidence 以当前 claim 的精度直接陈述或可直接观察到；必须有最近、最精确的 locator。
  - `Inferred`: 由一个或多个 Grounded claims 综合、归纳或推演而来；必须引用其 evidence，并给出最短 reasoning bridge。
  - `Unresolved`: Scope 因缺失、冲突、歧义、不可访问或粒度不足而不能决定；必须说明具体 gap。
  - `Outside`: 来自模型先验、常识或 Scope 外来源；默认省略，只有用户允许扩展或它对暴露 assumption 必不可少时才保留。
- `Grounded` 只表示“该来源支持这个 claim”，MUST NOT 暗示 claim 已成为客观真理、经过独立核验或由权威来源发布。
- `Authority` MUST 与 evidence status 分开，并按 claim 说明来源为什么有资格或没有资格决定它，例如 repository policy、current implementation、executable observation、official publisher、primary record、secondary account、user-supplied unverified artifact 或 unclear authority。
- Scope membership MUST NOT 自动赋予 authority；official source 只对其有治理权或第一手知识的 claims 具有相应 authority。
- MUST 在 `Authority` ledger 中覆盖每类实际使用的 material source，写出其 claim-relative role 与 limitation；同一来源对不同 claims 的 authority 不同时必须拆开说明。
- provenance MUST 贴近 claim 且可解析：web 使用具体 page URL 与可用 heading/anchor；local file 使用绝对 path 与尽可能精确的 line；repository 同时给出 revision 与 path/line；document 使用 title、version、page 或 section。
- search result、index page、README summary 或 later retelling MAY 用来定位 evidence，但只有其自身直接支持的粒度才能成为 Grounded provenance。
- source conflict MUST 作为并列 Grounded claims 展示，并把无法消解的结论放入 `Unresolved`；不得静默挑选一个来源或把冲突平均成共识。
- absence MUST 默认为 `Unresolved`；只有 Scope 已证明 exhaustive，且该系统中 absence 本身具有语义时，才可把 absence 写成 Grounded claim。
- SHOULD 只标注会影响答案、判断或后续动作的 material claims；纯过渡句、用户已给定的 premise 与显然的计算展开不需要制造 citation noise。
- 用户允许使用 Scope 外知识时，MUST 先完成 Scope 内回答，再将额外内容放入 `Outside`；“only / 仅 / 严格基于”出现时 MUST 完全省略 Outside claims。

Hard:

- When: 用户没有显式调用 `ground`。
  Do: MUST NOT 使用 `💬 Ground` marker 或套用本协议。

- When: ground 作为 `Evidence overlay`。
  Do: MUST 让 owning canonical marker 追加 ` + Ground`，且 MUST NOT 显示第二个 ground marker、强制 ground envelope 或阻断 owning skill 已授权的 non-evidence effects；MUST 在 owning shape 内保持 claim ledger 与只读 evidence discovery。

- When: material claim 没有 Scope 内直接 evidence。
  Do: MUST 标为 `Inferred`、`Unresolved` 或允许情况下的 `Outside`；不得标为 `Grounded`，也不得借相邻 citation 洗白。

- When: source 可访问但不具备该 claim 的 authority。
  Do: MUST 仍可准确标为 Grounded，但必须在 Authority 中暴露其 limitation；不得把“有出处”改写成“权威结论”。

- When: Scope 无法访问、没有足够 evidence 或内部冲突。
  Do: MUST 输出 `Unresolved` 与 gap；不得用模型记忆补齐成 source-backed answer。

- When: claim 比 locator 实际支持的内容更宽、更确定或更新。
  Do: MUST 缩窄 claim、补充 evidence 或降级 status；不得让 citation 替超出来源的部分背书。

- When: `ground` 已激活。
  Do: MUST 保持 evidence discovery 只读；本 skill 不授权 filesystem 或 external mutation。

## Effects

- Conversation: `Full protocol` MUST 显示 Scope、Snapshot、Authority 与 material claims 的 Grounded/Inferred/Unresolved/Outside status；`Evidence overlay` MUST 在 owning shape 内保持同一 evidence semantics，但不要求独立 envelope。
- Filesystem: `Full protocol` read-only within Scope；`Evidence overlay` 的 evidence discovery read-only，owning skill 的其他 effects 保持其自身 authority。
- External: `Full protocol` read-only within Scope；`Evidence overlay` 的 evidence discovery read-only。MAY 使用 navigation/search 定位 Scope 内页面，但不得把 Scope 外结果当作 evidence。

## Workflow

1. 确认用户显式调用了 `ground`，再确定 `Full protocol | Evidence overlay`：没有其他 actual envelope/action owner 时使用 Full，即使存在 modifier；与一个 compatible owner 显式共同调用时使用 overlay。解析闭合 Scope；只有 invocation ownership 或 materially different scope interpretations 会改变答案时，才问一个最小澄清问题并停止。`Full protocol` 使用 `💬 Ground`；overlay 只让 owner marker 追加 ` + Ground`。
2. 固定 Snapshot，并读取足以回答问题的 Scope 内 evidence；记录不可访问、缺失与冲突。
3. 建立内部 claim ledger：为每个 material claim 指定一个 status、精确 provenance 与 claim-relative Authority。
4. 校验 claim granularity：source 实际支持哪一层就只写哪一层；综合结论进入 Inferred，无法决定的内容进入 Unresolved。
5. `Full protocol` 使用以下最小 envelope 输出；`Evidence overlay` 将 ledger 融入 owning shape。empty status section MUST 省略，`Outside` 只有在 Boundary 允许时出现：

```text
💬 Ground
Scope: <closed evidence set>
Snapshot: <retrieval time, revision, working-tree state, or artifact version>

Authority:
- <source or source family> — <claim-relative role>; <limitation>

Grounded:
- <claim> — <exact locator>

Inferred:
- <claim> — from <exact locator(s)>; bridge: <minimal reasoning>

Unresolved:
- <question or claim> — <specific evidence gap or conflict>

Outside:
- <explicitly permitted out-of-scope claim> — <origin or model prior>
```

6. 对每个 material claim 反查 ledger；确认 status、provenance 与 Authority 没有互相替代，然后停止。

## References

- 无。

## Validation

Before done:

- `Full protocol` 的每条用户可见回复第一行仅为 `💬 Ground`，或带其他已显式且 materially active skill suffix；`Evidence overlay` 的 owning marker 追加 ` + Ground` 且没有第二个 top-level marker；marker 行没有 status 或 payload，active-but-inert skill 未进入 suffix；
- 用户已经显式调用 `ground`，并给出或澄清了 evidence Scope；
- invocation mode 准确；overlay 没有争夺 owning skill 的 shape、workflow 或已授权 effects，full protocol 没有同轮执行 mutation；
- Scope 是闭合且可解析的，Snapshot 足以定位实际读取的版本；
- 每个 material claim 恰好属于 Grounded、Inferred、Unresolved 或允许情况下的 Outside；
- 每个 Grounded claim 都有 Scope 内、精确且足够支持其粒度的 provenance；
- 每个 Inferred claim 都有 supporting evidence 与最短 reasoning bridge；
- Authority 独立于 evidence status，并覆盖每类 material source 的 role 与 limitation；
- source membership、official appearance 或 citation 没有被当成客观真实性或当然 authority；
- conflicts、missing evidence 与 inaccessible material 没有被模型记忆补平；
- “only / 仅 / 严格基于”的回答没有 Outside claims；
- filesystem 与 external evidence discovery 全部只读；overlay 中 owning skill 的其他 effects 没有被 ground 静默扩大或撤销。
