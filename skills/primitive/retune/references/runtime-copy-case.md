---
audience: agent
authors:
  - codex
reviewed_by: []
purpose: 记录 retune 直接修改 installed runtime copy 且未写 case feedback 的复发样例。
status: active
sources: []
updated: 2026-07-01
---

# Runtime Copy Case

## Case

一次 Partita skill patch 中，用户要求把 `effect-harness` 文档职责失败样例反馈到 `score`。

agent 触发 `retune` 后，先直接修改了 installed runtime skill copy。

用户纠正：skills 真源在 Partita 的 `skills/primitive/score/` 下，必须改真源并运行 Partita 指令。

agent 随后修改了 Partita 真源并运行生成、验证和安装命令。

用户再次纠正：具体失败样例也需要补充到 target skill 的 `references/` 里。

## Failure

`retune` 当时没有明确区分 source skill 和 installed runtime copy。

`retune` 允许 agent 直接 patch 运行时 copy。

`retune` 当时只说 case detail 可以保留在 references，没有要求用稳定格式写入 target skill references。

## Governance

retune MUST 先定位 target skill source truth。

installed/global/runtime skill copies MUST 被视为 installed runtime copies，不能作为 patch target。

如果用户给的是 runtime copy path，retune MUST 找到 owning source skill 并 patch source。

如果找不到 source truth，retune MUST 停止并报告 blocker。

retune patch target skill 时，MUST 添加或更新 case feedback reference。

retune 完成 Partita source patch 后，MUST 运行 Partita 生成和验证指令。

需要同步 installed runtime 时，retune MUST 运行 owning install/sync command，MUST NOT 手动改 runtime copy。
