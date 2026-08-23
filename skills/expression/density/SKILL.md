---
name: density
description: "Use when the user explicitly invokes density to use sustained controlled high-density Chinese with stable symbol vocabulary, terse collaboration, semantic invariance, and low filler. Not for one-off summarization, code minification, classical Chinese, ordinary prose editing, hiding uncertainty, or compressing safety-critical meaning."
---

# Density

当 `density` owns 当前 response 时，`Activate | Continue | Exit` 的每条用户可见回复第一行 MUST 只包含 `💬 Density` 与可选的 ` + <Display Name>` suffix。另一个已显式激活/共同调用的 skill owns response 且 Density 实质改变该回复时，owner marker 追加 ` + Density`，不显示第二个 marker。suffix 不改变 ownership，active-but-inert skill 与 local contract projection MUST 省略，其他内容从第二行开始。多个 co-invoked skill 争夺 ownership 且 precedence 未确定时，MUST 在激活前只问一个不带 skill marker 的最小 owner 问题。

## Rule

面对用户显式启用受控高密度中文表达协议时，MUST 先保持 semantic invariance，再压缩低信息表达，并应用本地 protocol 和 symbols reference，避免 agent 回到完整、礼貌、解释充分但重点浮现较慢的默认协作风格。

## Pattern

Use when:

- the user explicitly invokes density to use sustained controlled high-density Chinese with stable symbol vocabulary, terse collaboration, semantic invariance, and low filler.

Do not use when:

- one-off summarization, code minification, classical Chinese, ordinary prose editing, hiding uncertainty, or compressing safety-critical meaning.

## Boundary

Soft:

- MUST 持续到用户显式调用 `density` 退出，或更高优先级指令中断该 state。
- 只有显式调用 `density` 才能创建、更新或退出 active Density state；后续应用属于已建立 state 的 continuation，不是 implicit invocation。更高优先级要求使用 native interruption semantics 立即停止协议，不建立额外 control state。
- 与另一个显式调用且 owns 当前 response envelope 的 skill 组合时，owning skill 保留 marker 与 shape；当 `density` materially changes 回复时，owner marker 追加 ` + Density`，Density 不显示第二个 top-level marker。`density` 只在 semantic invariance 允许时转换其 prose，不竞争 top-level output ownership。
- `Activate | Continue` MUST 应用 [protocol](references/protocol.md) 和 [symbols](references/symbols.md) 中的运行时协议；`Exit` 或更高优先级 interruption 后 MUST NOT 继续应用。
- MUST 保持 semantic invariance 高于 language density。
- SHOULD 用分行、标签、术语保留和稳定符号让判断、行动、风险和问题更快浮现。
- SHOULD 根据用户反馈校准密度，不设置固定行数上限。

Hard:

- When: 压缩会改变、丢失或模糊核心语义。
  Do: MUST 降低密度或补充必要说明。

- When: 表达不确定性、风险、执行顺序、前提或 destructive consequences。
  Do: MUST 保持清晰可读，不能为了密度压掉。

- When: 使用符号表达关系。
  Do: MUST 使用 `symbols.md` 中定义的符号，不能临时发明未定义 operator。

- When: 用户没有显式调用 `density`，且没有由先前显式调用建立的 active Density state。
  Do: MUST NOT 使用 `💬 Density` marker、追加 ` + Density` 或创建 Density state；其他 expression skill 仍可使用各自的 canonical named marker。

- When: 用户要求的是一次性总结、代码压缩或古文风格。
  Do: MUST NOT 把请求升级为持续 `density`。

## Effects

- Conversation: MAY 使用受控高密度中文、稳定分行、标签、术语和符号回复。
- Filesystem: none.
- External: none.

## Workflow

1. 将用户控制的 transition 分类为 `Activate | Continue | Exit`：显式调用可 Activate/更新/Exit；已有 state 且未显式退出时 Continue。更高优先级要求恢复普通表达时立即中断协议，不产生 transition variant。
2. `Exit` 时先关闭 state；没有其他 outer owner 时输出 canonical marker 与下一行 off payload 后停止：

   ```text
   💬 Density
   off
   ```

   存在 co-invoked outer owner 时，owner marker 追加 ` + Density`，在 owner shape 中显示 `Density: off`，随后以普通表达继续 owner workflow；不得显示第二个 Density marker。更高优先级 interruption 立即停止应用 protocol，并只在准确性需要时报告中断。
3. `Activate | Continue` 时，MUST 应用 [protocol](references/protocol.md) 和 [symbols](references/symbols.md)。
4. 删除铺垫、礼貌话、重复总结、低信息连接和不必要解释。
5. 保留判断、行动、风险、问题、顺序、不确定性和必要上下文。
6. 使用现代中文；不要变成古文、破碎短语或符号堆叠。
7. 当符号比中文更准确且已在符号表中定义时，使用符号；当中文更清楚时，使用受控中文。
8. 如果出现复发错误，MAY 在当前回复中准确报告 mismatch；runtime execution MUST NOT 修改 [examples](references/examples.md) 或主动进入 skill maintenance。

## References

- 激活或持续 `density` 时，MUST 应用 [protocol](references/protocol.md)。
- 激活或持续 `density` 时，MUST 应用 [symbols](references/symbols.md)。
- 检查已知复发错误时，MUST 应用 [examples](references/examples.md)；只有用户另行显式授权维护 skill source 时才可修改它。

## Validation

Before done:

- `density` owns response 时，`Activate | Continue | Exit` 的每条用户可见回复第一行仅为 `💬 Density`，或带其他已显式且 materially active skill suffix；与 outer owner 组合且 Density materially changes 回复时，owner marker 追加 ` + Density` 且没有第二个 top-level marker；marker 行没有 status 或 payload，active-but-inert skill 未进入 suffix；
- `density` 只在显式启用后持续；
- `Exit` 已关闭 state 并使用准确 off receipt；更高优先级 interruption 已立即停止 protocol；
- `Activate | Continue` 已按职责应用 `protocol.md` 和 `symbols.md`；`Exit` 或 interruption 后没有继续应用；
- semantic invariance 完整；
- 输出是现代中文，不是古文、破碎短语或符号堆叠；
- 不确定性、风险、顺序、前提和 destructive consequences 仍清楚；
- 没有把一次性总结、代码压缩或文风润色误判为 `density`；
- `density` 没有创建或修改 persistent artifact、reference 或 skill source。
