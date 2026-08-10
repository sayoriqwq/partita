---
name: density
description: "Use when the user explicitly invokes density to use sustained controlled high-density Chinese with stable symbol vocabulary, terse collaboration, semantic invariance, and low filler. Not for one-off summarization, code minification, classical Chinese, ordinary prose editing, hiding uncertainty, or compressing safety-critical meaning."
---

# Density

首次激活且 `density` owns 当前 response 时，第一条用户可见行 MUST 以内联 `💬 density` 开头；存在另一个明确 outer owner 时，MUST 保留 owner marker。

## Rule

面对用户显式启用受控高密度中文表达协议时，MUST 先保持 semantic invariance，再压缩低信息表达，并应用本地 protocol 和 symbols reference，避免 agent 回到完整、礼貌、解释充分但重点浮现较慢的默认协作风格。

## Pattern

Use when:

- the user explicitly invokes density to use sustained controlled high-density Chinese with stable symbol vocabulary, terse collaboration, semantic invariance, and low filler.

Do not use when:

- one-off summarization, code minification, classical Chinese, ordinary prose editing, hiding uncertainty, or compressing safety-critical meaning.

## Boundary

Soft:

- MUST 持续到用户显式调用 `density` 退出，或更高优先级指令强制取消该 state。
- 只有显式调用 `density` 才能创建、更新或退出 active Density state；后续应用属于已建立 state 的 continuation，不是 implicit invocation。更高优先级取消属于 forced cancellation，不是 user-controlled exit。
- 与另一个显式调用且 owns 当前 response envelope 的 expression skill 组合时，owning skill 保留 marker 与 shape；`density` 只在 semantic invariance 允许时转换其 prose，不竞争 top-level output ownership。
- `Activate | Continue` MUST 应用 [protocol](references/protocol.md) 和 [symbols](references/symbols.md) 中的运行时协议；`Exit | Cancelled` MUST NOT 继续应用。
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
  Do: MUST NOT 使用 `💬 density` marker 或创建 Density state；其他 expression skill 仍可使用 family marker `💬`。

- When: 用户要求的是一次性总结、代码压缩或古文风格。
  Do: MUST NOT 把请求升级为持续 `density`。

## Effects

- Conversation: MAY 使用受控高密度中文、稳定分行、标签、术语和符号回复。
- Filesystem: none.
- External: none.

## Workflow

1. 将当前 transition 分类为 `Activate | Continue | Exit | Cancelled`：显式调用可 Activate/更新/Exit；已有 state 且未显式退出时 Continue；更高优先级要求恢复普通表达时 Cancelled。
2. `Exit` 时先关闭 state；没有其他 outer owner 时只输出 `💬 density: off` 并停止。存在 co-invoked outer owner 时，在 owner shape 中显示 `Density: off`，随后以普通表达继续 owner workflow。`Cancelled` 立即停止应用 protocol，并只在准确性需要时报告取消。
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

- 首次激活且 density owns response 时，第一条用户可见行包含内联 `💬 density`；与 outer owner 组合时只保留 owner marker；
- `density` 只在显式启用后持续；
- `Exit` 已关闭 state 并使用准确 off receipt；`Cancelled` 已停止应用 protocol，二者都没有继续用高密度表达；
- `Activate | Continue` 已按职责应用 `protocol.md` 和 `symbols.md`；`Exit | Cancelled` 没有继续应用；
- semantic invariance 完整；
- 输出是现代中文，不是古文、破碎短语或符号堆叠；
- 不确定性、风险、顺序、前提和 destructive consequences 仍清楚；
- 没有把一次性总结、代码压缩或文风润色误判为 `density`；
- `density` 没有创建或修改 persistent artifact、reference 或 skill source。
