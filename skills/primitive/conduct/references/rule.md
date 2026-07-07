# Rule

## Definition

`rule` 是 skill 激活后，agent 必须优先服从的单一运行时治理约束。

在 Partita 中，rule 把 case 中的治理介入点投影成 runtime imperative：当 skill 已经被触发，agent 应先改变什么行为，以防止 case 中的默认失败复发。

rule 不是用来证明 skill 为什么存在；这属于 case。

rule 不是用来决定 skill 何时触发；这属于 invocation selector / pattern。

rule 不是完整步骤编排；这属于 workflow。

rule 不是完成前检查；这属于 validation。

rule 不是适用边界；这属于 boundary。

## Core Shape

最小 rule：

```md
## Rule

Facing <active skill situation>, MUST first <governance action>, to avoid <default failure>.
```

其中：

- `<active skill situation>` SHOULD 来自 skill 的触发语境，不重新扩张触发范围。
- `<governance action>` MUST 来自 `case.governance_action`，并改写成运行时命令。
- `<default failure>` SHOULD 来自 `case.default_failure`、`stale_behavior` 或 `feedback recurrence`。
- rule MUST 只包含一个 primary action。

## Rules

- rule MUST 是运行时行为约束，不是设计理由。
- rule MUST 在 skill 激活后生效，不负责触发 skill。
- rule MUST 优先约束 agent 的第一行为倾向。
- rule MUST 从 case 的治理介入点投影而来。
- rule MUST NOT 编造新的 case、失败、触发范围或实现目标。
- rule MUST NOT 展开多步骤流程；多步骤属于 workflow。
- rule MUST NOT 写验证清单；验证属于 validation。
- rule MUST NOT 写适用/不适用边界；边界属于 pattern 或 boundary。
- rule MUST NOT 写文件清单、生成目标或副作用；这些属于 effects、brief 或 workflow。
- rule SHOULD 保持短句，可直接放入 runtime skill。
- rule SHOULD 用一个强动作动词表达治理动作。

## Non-Rules

以下不是 rule：

- “这个 skill 用于创建 Partita skill。”
- “agent 应该更严谨。”
- “先分析需求，再生成文件，再验证结果。”
- “适用于创建 skill，不适用于普通写作。”
- “检查是否包含 case、rule、pattern、validation。”
- “需要生成 SKILL.md、README.md 和 examples。”
- “因为之前 agent 经常创建泛化 prompt，所以需要治理。”
- “用户希望有一个更稳定的 skill authoring 流程。”

## Minimal Validation

接受 rule 前，检查：

- 它是否只约束 skill 激活后的运行时行为？
- 它是否来自 `case.governance_action`？
- 它是否只有一个 primary action？
- 它是否没有重新定义触发范围？
- 它是否没有展开 workflow / validation / boundary / effects？

任一问题回答为否，就还不是有效 rule。
