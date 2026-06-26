# Aim 复发 Case

这些 case 用于识别 `aim` 的复发模式。它们不是新流程，也不是普通示例；只有在检查 `aim` 行为是否覆盖复发失败时才读取。

## Agent 方向偏移

Case:

用户和 agent 正在推进同一个主题，但 agent 开始从不服务当前 aim 的层级、方向或细节作答。

Pattern:

active aim 仍约束 conversation，但 agent 的回复开始进入不服务该 aim 的层级、方向或细节。

Pressure:

agent 会顺着旁支继续展开，静默丢失当前 aim，并让后续回复偏离主线。

Rule:

Facing an active aim with agent-side direction drift, first show `Aim check`
and return to the active aim, to avoid silently carrying the conversation into
a side branch.

## User baseline 偏移

Case:

用户仍在推进同一个主题，但开始从一个违背 accepted baseline 的 assertion 继续推理。

Pattern:

active aim 仍约束 conversation，但 user 的新推进正在丢失、覆盖或重开 accepted baseline。

Pressure:

agent 会顺着新 assertion 继续推进，把已接受共识静默洗掉，或把已解决判断重新变成开放问题。

Rule:

Facing an active aim with accepted-baseline drift, first show `Aim check` with
the drift point and current aim or relevant baseline, to avoid silently losing
accepted consensus while still allowing the user to switch topics.
