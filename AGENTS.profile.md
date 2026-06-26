---
audience: agent
authors:
  - codex
reviewed_by:
  - sayori
purpose: 保存当前项目 agent harness 的 repo-local profile 默认行为。
updated: 2026-06-25
---

# Partita Profile

本文件是由 `AGENTS.md` 引入的 repo-local profile context。它不属于 Partita
plugin package，也不是共享 skill rule。

当前用户指令、`AGENTS.md`、`CLAUDE.md` 和仓库文件优先级高于本文件。

## Profile 来源

- `/Users/sayori/Desktop/yume-infra/canon/wiki/profile/` owns 当前用户模型、偏好和协作语义。
- 本文件只保存这些偏好在当前项目 harness 中的 projection，不是 profile source authority。
- 当用户偏好变化时，先确认是否应进入 canon profile，再同步必要 projection 到本文件。

## 协作默认值

- MUST 使用简体中文和用户交流。
- 关键技术术语在比强行翻译更清楚时保留英文。
- 常见英文词、四六级范围内词汇、常见技术词不加中文括注。
- 生僻英文术语第一次出现时，使用 `term(翻译)` 形式解释。
- SHOULD 保持直接、密集、具体，减少填充语、泛泛总结和情绪性安慰。
- 产出 durable content 前先判断边界：服务哪一层、避免什么损失、什么内容应该留在外面。
- Durable text SHOULD 保持单一职责且可 review。区分 evidence、inference 和
  decision。
- 重复 correction 是未来行为信号。不要持续重复已被纠正的问题。

## 文档默认值

- SHOULD 把 Markdown 文件视为 document module：每个文件都应有清晰的
  audience、purpose 和稳定职责。
- 创建或重塑 durable docs 前，先识别 owning layer 和 reader's job-to-be-done。
- 文档 SHOULD 保持单一职责。MUST NOT 把语义背景、操作规则、历史决策、
  索引导航和当前偏好混在同一个文件里。
- 修改文档 SHOULD 以 assertion 为最小审查单位：识别新增、修订、拆分、
  合并、挑战或移除的是哪条 assertion。
- SHOULD 优先修改发生变化的最小 assertion，避免重写未变化的相邻内容。
- 长期维护的文档系统 SHOULD 使用 split files 和 split indexes，
  而不是因为当前内容少就保留巨大 catch-all index。
- 持久文档状态 SHOULD 使用结构化 metadata。优先使用 frontmatter 或其它可解析结构，
  而不是埋在正文段落里。
- 面向 agent 的规则 SHOULD 优先写成可匹配的 input/output patterns，例如固定字段、
  明确 enum、稳定章节顺序和可检查状态格式。
- 使用 `MUST`、`MUST NOT`、`SHOULD`、`SHOULD NOT`、`MAY` 表达规则强度。
- `MUST` 和 `MUST NOT` 只用于违反后会破坏系统、污染 durable context、
  或违背明确用户偏好的边界。

## Partita 默认值

- 优先使用 Waza 的 mechanism：skill source、dispatcher、verifier 和 packaging projection。
- 不继承 Waza 原有 skill taxonomy 或 skill contents。
- 不为了保存 profile、task 或 project-specific context 而新增 repo layer。
- User profile content 的 source authority 在 canon；本文件只保留当前 harness projection。
  只有抽象为可复用 harness wiki node 后才进入 `wiki/`。
- 未来 skill 应从 `wiki/practice/create.md` 或 `wiki/practice/patch.md` 开始，
  再按链接进入 skill、workflow、projection 等节点。
- Partita wiki 是 canonical knowledge。`skills/<name>/SKILL.md` 是
  source-controlled runtime materialization；其它 repo 的 runtime copies 是
  projection；CLI/verifier implementation 属于拥有该 mechanism 的 repo。
- 当前 loaded-skill marker 是 `🧭`。未来 skill families 可以使用 family-specific marker。
