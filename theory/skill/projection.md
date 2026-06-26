---
audience: agent
authors:
  - codex
reviewed_by: []
purpose: 定义 skill primitive 投影到 runtime 文件、selector、marker、effects 和 verifier 时的语义边界。
updated: 2026-06-26
---

# Runtime Projection

## Projection

Skill 的本体是 agent 行为治理 primitive。Runtime 文件只是 projection。

在当前 Partita 阶段，常见 projection 包括：

```text
SKILL.md
agents/openai.yaml
skills/RESOLVER.md
skills/DISPATCHER.md
plugin manifest
references
CLI / verifier / tests
```

这些文件可以承载 primitive，但不能重新定义 primitive。若 projection 文件
之间出现语义不一致，先回到 [Skill Assertion](assertion.md) 和
[Governance Identity](governance-identity.md) 判断本体，再修正具体投影。

## Selector Projection

Runtime selector 的职责是让 agent 在正确情境中加载 skill。

Codex frontmatter 的 `description` 是 selector projection，不是理论解释。
它应该从 case pattern 和排除项压缩生成：

```text
description = Pattern 的 runtime selector index
```

推荐形态仍然是：

```text
Use when <positive case shapes>. Not for <negative exclusions>.
```

Description 不能决定 skill identity。它只帮助 runtime 识别何时加载已经定义
好的 primitive。

## Handle And Marker

Handle 是 skill 激活后的用户可见占位。Marker 是 handle 在当前 runtime
中的轻量投影。

当前 Partita 约定使用 `🧭` 作为 loaded-skill marker。更一般的规则是：

```text
skill active   -> marker visible
skill inactive -> marker absent
```

Marker 不必每个 skill 独立。一个 marker 可以对应 skill family、workflow
family 或 gate family，但共享 marker 的 skills 必须给用户相近的治理预期。

Handle 生命周期可以是：

```text
ephemeral:
  当前响应有效，回答结束后自然消失。

sustained:
  跨多轮持续出现，直到 close condition、topic change、mode exit 或
  workflow exit。
```

Marker 消失本身可以是关闭信号。不要为了关闭而强行增加说明，除非用户需要
确认当前治理状态。

## Effects

Effects 描述 skill 允许产生的副作用。

它回答：

```text
这个 skill 是否只影响当前对话？
是否允许读写文件？
是否允许调用外部服务？
是否会产生持久材料？
```

推荐分类：

```text
Conversation:
  marker, handle, visible note, report

Filesystem:
  read/write files, references, cases, generated metadata

External:
  network, API, calendar, email, issue tracker, deployment
```

`none` 也必须显式写清。Effects 不能比 boundary 更宽。Primitive 的 `state`
描述是否留下持久信息；projection 的 Effects 描述哪些副作用被允许发生。

## Boundary Projection

Boundary 分 soft 和 hard。

```text
soft:
  model-applied judgment, context classification, asking policy, style,
  scope choice, collaboration behavior

hard:
  script, CLI, verifier, schema, test, package check, generated output check
```

没有 machine-checkable enforcement surface 的约束不能伪装成 hard boundary。
如果当前还没有硬化实现，就把它保留为 soft boundary，或把硬化工作放进
后续 implementation issue。

## Progressive Loading

Projection 必须保持渐进加载：

```text
every run:
  SKILL.md body

conditional:
  references, cases, examples, long protocols, style rules

machine enforcement:
  scripts, CLI, verifier, schemas, tests
```

长 case、复杂协议和共享理论不应该塞进每次必读 body。Body 只保留当前
runtime 使用这个 skill 时必须知道的内容。

## Projection Loss

Projection loss 是 primitive 进入 runtime 文件后发生的语义损失。

常见 loss 包括：

```text
assertion A/Y/X 被 description 稀释成泛泛能力
explicit invocation 被 metadata 投影成 allow_implicit_invocation: true
hard boundary 只有 prose，没有 verifier 或 CLI
cross-gate duration 让 skill 承担多个治理动作
references 吞掉了每次必须执行的 runtime step
```

Care loop 的职责不是维护文件整洁，而是发现并修复这些 projection loss。
