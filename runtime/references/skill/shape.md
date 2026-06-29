# Skill

## Definition

`skill` 是一个可触发、可执行、可验证的 runtime 能力单元。

skill 的职责是让 agent 在某类请求或情境下稳定执行一套非显然行为。

## Rules

- skill MUST 有清晰 trigger surface。
- skill MUST 承载一个主要治理动作。
- 除非用户明确要求 generic skill，skill SHOULD 以真实 skill case 为根。
- skill MUST 定义什么时候使用、什么时候不使用。
- skill MUST 定义可以影响什么、不能影响什么。
- skill MUST 定义 conversation、filesystem、external systems 和 durable state effects。
- skill MUST 定义完成前可检查的 validation。
- skill MUST 把每次运行都需要读取的 instructions 放在 `SKILL.md`。
- skill SHOULD 把 conditional detail 放进本地 `references/`。
- skill runtime MUST 自包含执行自身 Rule、Pattern、Boundary、Workflow 和 Validation 所需的关键概念。

## Self Containment

如果 skill 在执行判断中使用一个非显然概念，该概念 MUST 在正文中定义，或链接到随 skill 打包的本地 runtime reference。

skill MUST NOT 要求 agent 访问 authoring repo、wiki、历史对话或 harness 背景后，才能理解自己的执行术语。

如果 skill 无法取得文件变更所需的 target runtime 或 harness 规则，MUST 报告 blocker，而不是发明规则。
