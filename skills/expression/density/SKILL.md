---
name: density
description: "Use when the user explicitly invokes density or asks for sustained controlled high-density Chinese with stable symbol vocabulary, terse collaboration, semantic invariance, and low filler. Not for one-off summarization, code minification, classical Chinese, ordinary prose editing, hiding uncertainty, or compressing safety-critical meaning."
---

# Density

激活时，第一条用户可见行 MUST 以内联 `💬` 开头。

## Rule

面对用户显式启用受控高密度中文表达协议时，MUST 先保持 semantic invariance，再压缩低信息表达，并应用本地 protocol 和 symbols reference，避免 agent 回到完整、礼貌、解释充分但重点浮现较慢的默认协作风格。

## Pattern

Use when:

- 用户显式调用、加载或提到 `$density`。
- 用户要求持续使用高密度中文、controlled language、稳定符号词表或低 filler 协作。
- 用户要求当前会话进入 `density` 表达协议。
- 已经激活的 `density` 表达协议仍在持续。

Do not use when:

- 用户只要一次性总结、摘要、压缩文章或缩短某段内容。
- 任务是 code minification、代码风格压缩或 token-budget 技术处理。
- 用户要求古文、破碎短语、装饰性符号或纯粹文风润色。
- 压缩会隐藏不确定性、风险、顺序、前提或 destructive consequences。

## Boundary

Soft:

- MUST 持续到用户退出 `density`，或更高优先级指令要求恢复普通表达。
- MUST 应用 [protocol](references/protocol.md) 和 [symbols](references/symbols.md) 中的运行时协议。
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

- When: 用户没有显式启用 `density`。
  Do: MUST NOT 使用 `💬` marker 或持续套用 `density` 协议。

- When: 用户要求的是一次性总结、代码压缩或古文风格。
  Do: MUST NOT 把请求升级为持续 `density`。

## Effects

- Conversation: MAY 使用受控高密度中文、稳定分行、标签、术语和符号回复。
- Filesystem: none.
- External: none.

## Workflow

1. 确认用户显式启用 `density`，或当前 `density` 仍在持续。
2. 激活后，MUST 应用 [protocol](references/protocol.md) 和 [symbols](references/symbols.md)。
3. 删除铺垫、礼貌话、重复总结、低信息连接和不必要解释。
4. 保留判断、行动、风险、问题、顺序、不确定性和必要上下文。
5. 使用现代中文；不要变成古文、破碎短语或符号堆叠。
6. 当符号比中文更准确且已在符号表中定义时，使用符号；当中文更清楚时，使用受控中文。
7. 如果出现复发错误或需要记录回归材料，MUST 按 [examples](references/examples.md) 记录。

## References

- 激活或持续 `density` 时，MUST 应用 [protocol](references/protocol.md)。
- 激活或持续 `density` 时，MUST 应用 [symbols](references/symbols.md)。
- 记录或检查复发错误时，MUST 应用 [examples](references/examples.md)。

## Validation

Before done:

- 第一条用户可见行包含内联 `💬`；
- `density` 只在显式启用后持续；
- `protocol.md` 和 `symbols.md` 已按其职责应用；
- semantic invariance 完整；
- 输出是现代中文，不是古文、破碎短语或符号堆叠；
- 不确定性、风险、顺序、前提和 destructive consequences 仍清楚；
- 没有把一次性总结、代码压缩或文风润色误判为 `density`；
- `density` 没有创建 persistent artifact。
