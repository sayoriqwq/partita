# Partita Skill Shape V1：理论与实践规范

## 0. 目标

本规范定义一套个人化 skill 系统。

目标不是创建 prompt catalog，也不是创建 task category，而是创建一组可复用的 agent 行为治理 primitive。

核心原则:

```text
Skill ≠ 文件
Skill ≠ 插件
Skill ≠ runtime 配置
Skill ≠ 用户想要的能力

Skill = 面对某类 case pattern 时，先执行某个治理动作，以避免 agent 滑向已知默认失败路径
```

V1 目标:

```text
1. 让每个 skill 都有清晰 primitive identity
2. 让 SKILL.md 只保留 runtime 必读内容
3. 让通用理论和共享模板外置
4. 区分软边界和硬边界
5. 区分模型判断和脚本/CLI/verifier 可硬化约束
6. 显式声明 effects（副作用）
7. 用 marker/handle 显示 skill 激活状态
8. 让 description 由 Pattern 控制生成，减少 drift
```

---

# 1. 核心理论

## 1.1 Case

Case 是真实发生的情境。

不要把 case 定义成证据、训练材料、回归测试。
那些只是 case 的使用方式，不是 case 的本体。

最小 case 结构:

```yaml
case:
  situation: 当时发生了什么
  default_behavior: agent 无治理时实际怎样失败
  governance_reference: 为什么这在当前情境下不符合要求
```

规则:

```text
没有真实 case，不能成立 pressure。
不能 invent case。
结构审计可以没有 case，但不能伪造 case。
```

---

## 1.2 Case Pattern

Case pattern 是从真实 case 中抽出的可匹配情境形状。

```text
case = 一次真实情境
case pattern = 可复用匹配形状
```

Skill activation 以 case pattern match 为核心。

```text
skill activation = case pattern match + invocation policy
```

不要用描述性语言替代 pattern match。

---

## 1.3 Pressure

Pressure 是 case / case pattern 中暴露出的默认 agent 失败压力。

它不是用户想要的能力。

错误:

```text
我想要一个 deep research skill。
我想要一个 writing skill。
我想要一个 issue skill。
```

正确:

```text
agent 在陌生领域 research 时默认罗列资料，不建立问题树，不区分 source tier。
agent 写作时默认 AI 味、废话多、语气不贴用户风格。
agent 拆 issue 时默认横向按技术层拆分，不能形成 vertical slice。
```

规则:

```text
pressure 一旦成立，就内含可复现性。
不建 weak pressure / strong pressure / experimental pressure。
单 case 可以成立 pressure，但必须读出默认行为失败，而非一次性不满意。
```

---

## 1.4 Skill Assertion

Skill 的理论本体是治理断言。

标准公式:

```text
Facing A, first Y, to avoid X.
```

中文:

```text
面对 A 时，先 Y，避免 X。
```

其中:

```text
A = case pattern
Y = governance action
X = default failure path
```

注意:

```text
不是: 当 agent 默认会 X 时，必须先 Y，以避免 X 复现。
而是: 当 agent 面对 A case pattern 时，必须先 Y，以避免执行 X。
```

原因:

```text
skill 不能等失败已发生再治理。
skill 应在识别 A 情境后提前介入，避免 agent 滑向 X。
```

例:

```text
Facing an active aim plus side/adjacent/drift work,
first show the request's relation to the aim,
to avoid silently dropping the active aim.
```

---

## 1.5 Governance Action

Governance action 是最小治理动作。

规则:

```text
one pressure, one intervention
```

一个 primitive skill 只能治理一个默认失败方向。

如果一个 skill 同时防止多个独立失败，应拆分。
如果多个步骤只是同一治理动作的执行步骤，可以保留。

例:

```text
aim:
  Y = 显式回扣 active aim
  X = 静默丢失主目标

land:
  Y = 压出第一个可运行闭环
  X = 落地无限后移

vertical-slice-ticketing:
  Y = 先识别可交付 vertical slice
  X = 横向按技术层拆 issue
```

---

## 1.6 Skill Identity

Skill identity 由 governance action 决定，不由名称、gate、文件名、任务类别决定。

```text
Skill identity = minimal governance action identity
```

规则:

```text
同一 pressure family 可派生多个 skill。
同一 gate 可挂多个 pressure。
一个 pressure 可跨多个 gate。
但一个 skill 只能保持一个治理动作。
```

如果跨 gate 后需要不同动作，应拆 skill。

---

## 1.7 Workflow / Gate

Workflow 是个人交付流。

Gate 是 workflow 中的阶段坐标。

例:

```text
Idea -> Research -> Prototype -> PRD -> Kanban -> Execution -> QA
```

规则:

```text
gate ≠ skill
Research gate ≠ research skill
PRD gate ≠ PRD skill
Kanban gate ≠ issue skill
```

Gate 用来组织 case、pressure、skill。
Skill 负责治理某个 case pattern 中的默认失败。

---

## 1.8 Gate Span

Skill 可以跨 gate 持续，但治理动作必须保持同一性。

```text
gate_span = skill 在 workflow 阶段中的生效范围
```

规则:

```text
skill 跨 gate 持续 ≠ skill 跨 gate 改变职责
```

如果同一主题在不同 gate 需要不同动作，应拆成多个 skill，并用 tag / family 关联。

---

## 1.9 Public / Internal / Orchestrator

Primitive skill 默认 internal。

Internal skill:

```text
默认不隐式触发
允许用户显式调用
允许 orchestrator 调用
```

它不是用户不可见，而是不会自己抢主导权。

Orchestrator skill:

```text
对外暴露
组织 workflow / gate
选择 internal primitive skill
维护当前流程坐标
```

Orchestrator 也必须有 pressure:

```text
agent 在复杂项目推进中，默认无法稳定识别阶段、维护阶段资产、选择合适治理动作并推进下一 gate。
```

---

## 1.10 Handle / Marker

所有 skill 默认都有 handle + marker。

定义:

```text
handle = skill 激活后的用户可见占位
marker = handle 在 V0 中的消息内投影
```

规则:

```text
skill active   -> marker visible
skill inactive -> marker absent
```

关闭不一定需要写关闭说明。
marker 消失本身就是关闭信号。

Handle 生命周期:

```text
ephemeral:
  当前响应有效，回答结束后自然消失。

sustained:
  跨多轮持续出现，直到结束、切换或不再作用。
```

Marker 可按 handle family 设计，不必每个 skill 独立 emoji。

规则:

```text
每个 skill 激活时必须投影到一个 marker。
marker 可对应 skill family / workflow family / gate family。
同一 marker 下的 skill 必须共享用户可感知的治理预期。
```

---

## 1.11 Effects

Effects 表示 skill 允许产生的副作用。

使用 `Effects`，不用 `state`、`external_state`、`surface`。

分类:

```text
Conversation:
  marker / handle / visible note / report

Filesystem:
  read/write files, references, cases, generated metadata

External:
  network, API, calendar, email, issue tracker, deployment
```

规则:

```text
所有 skill 必须声明 Effects。
无副作用也要显式写 none。
```

Effects 解决的问题:

```text
这个 skill 会不会写文件？
会不会调用外部服务？
会不会产生持久材料？
还是只影响当前对话？
```

---

## 1.12 Boundary

Boundary 分 soft / hard。

Soft boundary:

```text
模型判断
语境裁量
分类
风格
是否询问用户
是否继续
```

Hard boundary:

```text
脚本 / CLI / schema / verifier / test 可检查
不依赖模型自觉
失败应 block / fail / report
```

硬规则:

```text
能 machine-check 的边界，不应只写成模型提示。
没有机器 enforcement，不写 Hard。
```

若当前还没有硬化实现:

```text
先写 Soft
或写 TODO
不要伪装成 Hard
```

---

## 1.13 Validation

Validation 是 skill-local 完成检查。

它只验证本 skill 是否正确生效。

```text
Validation ≠ gate exit condition
Validation ≠ workflow success
Validation ≠ 全局质量评估
```

关系:

```text
Boundary = 执行中不能越界的规则
Validation = 执行后确认这次是否完成
```

最小检查:

```text
A 是否命中
marker 是否可见
Y 是否执行
X 是否避免
Effects 是否越界
Hard checks 是否通过
```

---

## 1.14 References

Skill 是渐进加载的。

SKILL.md body 只放 runtime 必读内容。
长 case、长规则、共享理论、复杂协议放 references。

规则:

```text
每次执行必须读 -> SKILL.md body
只在复杂/审计/补丁时读 -> references
机器检查 -> scripts / CLI / verifier
```

---

# 2. SKILL.md Shape V1

V1 section 顺序:

```text
frontmatter
# Skill

## Rule
## Pattern
## Boundary
## Effects
## Workflow
## References
## Validation
```

删除旧 section:

```text
Primitive Audit
Capability
Trigger
Template
Protocol
Surface
External State
Soft Boundary / Hard Boundary 独立大标题
```

替换关系:

```text
Assertion / Pressure -> Rule
Trigger -> Pattern
Template / Protocol -> Workflow
State / Surface / External State -> Effects
Soft + Hard -> Boundary
```

---

# 3. Frontmatter

## 3.1 必需字段

```yaml
---
name: <skill-name>
description: "<generated selector index>"
---
```

`name` 是 skill identity 的文件级标识。
`description` 是 Pattern 的 Codex selector projection。

## 3.2 description 定位

description 不是解释文。
description 是 runtime selector index。

```text
description = Pattern 的压缩投影
Pattern = loaded-time precise matcher
```

description 应由 Pattern 控制生成，不应自由手写。

目标:

```text
高召回
低误触发
覆盖正向词
覆盖负向排除
覆盖邻近 skill disambiguation
```

推荐格式:

```text
Use when <positive keywords / case shapes>. Not for <negative patterns / exclusions>.
```

例:

```yaml
description: "Use when active aim, focus, topic, target, drift, side request, adjacent work, or sustained mode topic needed. Not for formal goals, execution planning, ordinary summaries, or blocking user topic switches."
```

Codex 可将 description 理解为 selector 的关键词/语义匹配面。
因此 description 应生成、校验、同步。

---

# 4. Section 规范

## 4.1 Rule

对应理论:

```text
Skill assertion 的 runtime 投影
```

Rule 承载:

```text
A = case pattern
Y = governance action
X = default failure
```

格式:

```text
Facing <A>, first <Y>, to avoid <X>.
```

中文可写:

```text
面对 <A> 时，先 <Y>，避免 <X>。
```

要求:

```text
1. 必须短
2. 必须可执行
3. 必须包含 A/Y/X
4. 不写理论解释
5. 不写 capability
6. 不写 pressure 独立说明
```

错误:

```text
This skill helps the agent stay focused and improve goal management.
```

正确:

```text
Facing an active aim plus side/adjacent/drift work, first show the request's relation to the aim, to avoid silently dropping the active aim.
```

---

## 4.2 Pattern

对应理论:

```text
case pattern match
```

Pattern 替代 Trigger。

职责:

```text
说明哪些情况算 A
说明哪些情况不算 A
给 loaded skill 做精确匹配
```

结构:

```markdown
## Pattern

Use when:

- <positive case pattern>

Do not use when:

- <negative case pattern>
```

要求:

```text
1. 不写散文
2. 不写泛泛意图
3. 用 case shape
4. 与 description 同源
5. description 可由 Pattern 摘要生成
```

例:

```markdown
## Pattern

Use when:

- an active aim exists and the new request introduces side, adjacent, or drifting work;
- the user asks to check, set, reset, or switch the active aim;
- a sustained mode needs an explicit topic, target, or tentative conclusion.

Do not use when:

- no active aim exists;
- the user clearly starts a new topic and does not ask to preserve the old aim;
- the request only needs ordinary summary, debugging, or review.
```

---

## 4.3 Boundary

对应理论:

```text
soft_boundary + hard_boundary
```

结构:

```markdown
## Boundary

Soft:

- <model-applied boundary>

Hard:

- <machine-enforced boundary>
```

规则:

```text
Soft = 模型判断
Hard = 机器检查
没有机器 enforcement，不写 Hard
```

Soft 可包括:

```text
分类标签
语境判断
是否询问用户
是否短答
是否继续
风格限制
责任边界
```

Hard 可包括:

```text
schema check
section check
metadata sync
link check
test command
verifier command
generated output comparison
```

不要把 prose-only 约束伪装成 Hard。

若暂未实现 hard check:

```text
放 Soft
或在 implementation issue 中记录 TODO
```

不要在 V1 shape 中引入 `projection loss`。

---

## 4.4 Effects

对应理论:

```text
副作用 / 外部影响
```

结构:

```markdown
## Effects

- Conversation: <allowed conversation effect>
- Filesystem: <none | allowed paths/actions>
- External: <none | allowed services/actions>
```

要求:

```text
1. 每个 skill 必须写
2. none 也必须显式写
3. 写清楚读/写范围
4. Effects 不能比 Boundary 更宽
```

例: aim

```markdown
## Effects

- Conversation: may show the 🧭 marker and maintain a visible conversation-local aim handle.
- Filesystem: none.
- External: none.
```

例: skill-patch

```markdown
## Effects

- Conversation: may show the active marker and patch report.
- Filesystem: may update the target skill, one-level references, real case records, generated metadata, and directly stale verifier surfaces.
- External: none.
```

---

## 4.5 Workflow

对应理论:

```text
execution protocol
```

section 名用 `Workflow`。
理论上承载 execution protocol。

职责:

```text
skill 激活后，agent 为执行 Y 必须遵循的最小动作序列
```

要求:

```text
1. 只写 runtime 步骤
2. 不写大 workflow
3. 不写长教程
4. 不写答案模板
5. 每一步服务 Rule 中的 Y
```

例:

```markdown
## Workflow

1. Identify the active aim. If absent, do not invent one.
2. Match the current request against the Pattern.
3. Show the smallest visible aim signal needed for the match.
4. Ask before durable drift.
5. Continue only within the chosen relation.
```

---

## 4.6 References

对应理论:

```text
progressive loading + care
```

职责:

```text
指向非每次必读材料
```

放 references 的内容:

```text
真实 cases
case patterns 长表
复杂边界说明
长 examples
style protocol
symbol table
shared primitive theory
shape rules
care rules
verifier usage
```

不放 SKILL.md body 的内容:

```text
全部历史 case
长解释
实现背景
完整 schema
CLI 代码细节
大段理论
```

示例:

```markdown
## References

- Read `references/cases.md` when checking known recurrence patterns.
- Read `references/protocol.md` when the active request needs extended mode behavior.
```

规则:

```text
每次必须读的放 body
按需读取的放 references
机器规则放 scripts/verifier
```

---

## 4.7 Validation

对应理论:

```text
skill-local correctness
```

职责:

```text
确认本次 skill 是否正确生效
```

结构:

```markdown
## Validation

Before done:

- <A matched>
- <marker visible>
- <Y applied>
- <X avoided>
- <Effects respected>
- <Hard checks passed if applicable>
```

要求:

```text
1. 只验证本 skill
2. 不验证 gate exit
3. 不验证 orchestrator 全局目标
4. 不写泛泛质量标准
5. 和 Rule / Pattern / Boundary / Effects 对齐
```

例: aim

```markdown
## Validation

Before done:

- the first user-facing line includes `🧭` when the aim handle constrains the response;
- the current request's relation to the active aim is visible when drift matters;
- durable drift was not executed without user confirmation;
- no formal goal, planning workflow, or external artifact was created.
```

---

# 5. Body vs References vs Scripts

## 5.1 SKILL.md body

只放 runtime 必读内容:

```text
Rule
核心 Pattern
关键 Boundary
Effects 摘要
Workflow 最小步骤
References 指针
Validation 最小检查
```

## 5.2 references

放按需加载内容:

```text
cases
long patterns
complex boundary
examples
protocol
style rules
symbol system
care guidance
shape rules
```

## 5.3 scripts / CLI / verifier

放 machine enforcement:

```text
frontmatter validity
required sections
section order
description sync
reference link check
metadata sync
case file location
generated dispatcher/resolver check
marker transcript check
hard boundary check
```

---

# 6. Description 生成规则

## 6.1 生成来源

description 从 Pattern 生成。

输入:

```text
Pattern.Use when
Pattern.Do not use when
skill name
neighbor skill names
marker family
```

输出:

```yaml
description: "Use when ... Not for ..."
```

## 6.2 生成原则

```text
1. selector-first，不写说明文
2. 覆盖用户可能说出的词
3. 覆盖任务表面词
4. 覆盖 case shape
5. 覆盖 negative exclusions
6. 避免泛词
7. 与邻近 skill 区分
```

## 6.3 禁止

```text
不要写愿景
不要写 capability marketing
不要写长解释
不要写只有人类懂、selector 不好用的抽象理论词
```

错误:

```yaml
description: "Helps the agent stay aligned with the user's broader intent."
```

正确:

```yaml
description: "Use when active aim, focus, topic, target, drift, side request, adjacent work, or sustained mode topic needed. Not for formal goals, execution planning, ordinary summaries, or blocking user topic switches."
```

## 6.4 校验

实现应提供 verifier:

```text
Pattern changed -> description must regenerate or verify sync
frontmatter changed -> generated metadata must sync
```

---

# 7. Shared Primitive Rules 外置

所有 skill 共用规则不写进每个 SKILL.md。

外置建议:

```text
rules/skills/primitive.md
rules/skills/shape.md
rules/skills/boundary.md
rules/skills/effects.md
rules/skills/description.md
rules/skills/references.md
rules/skills/validation.md
rules/skills/care.md
```

SKILL.md 只保留实例化内容。

外置内容包括:

```text
case-first rule
A/Y/X assertion formula
handle/marker rule
effects taxonomy
soft/hard boundary rule
description generation rule
progressive loading rule
validation locality rule
skill-patch care rule
orchestrator/internal distinction
```

---

# 8. Care / Patch 原则

Skill-patch 是 Care 入口。

合法模式:

```text
case-patch:
  真实行为 case 进入 care loop

structure-audit:
  检查 primitive / shape / effects / boundary / description / validation 是否守住
```

规则:

```text
case-patch 必须来自真实 case。
structure-audit 不得 invent case。
skill-patch 默认保护 skill identity，不重写 skill identity。
```

Patch 的主路径:

```text
real case -> enrich recurrence patterns / references / smallest stale surface
```

不是:

```text
real case -> 改写 assertion -> skill 滑坡
```

若新 case 暴露全新 pressure:

```text
不要 patch 旧 skill
应 split / rename / skill-write
```

---

# 9. Orchestrator 规则

Orchestrator skill 是 public workflow skill。

它可以调用 internal primitive skill。
但不能吞掉 primitive skill 的 Rule / Validation。

规则:

```text
orchestrator 负责 workflow/gate
primitive skill 负责一个 A/Y/X 治理断言
```

Orchestrator 自己也必须有 Rule:

```text
Facing complex project work that may lose stage, assets, and next action,
first organize the request by workflow/gate and call needed primitive skills,
to avoid unstructured agent sprawl.
```

---

# 10. V1 SKILL.md 模板

```markdown
---
name: <skill-name>
description: "Use when <generated selector index>. Not for <generated exclusions>."
---

# <Skill Name>

<Optional one-line role. Keep only if it helps runtime use.>

## Rule

Facing <A case pattern>, first <Y governance action>, to avoid <X default failure>.

## Pattern

Use when:

- <positive case pattern>

Do not use when:

- <negative case pattern>

## Boundary

Soft:

- <model-applied boundary>

Hard:

- <machine-enforced boundary>

## Effects

- Conversation: <marker/handle/report effect>
- Filesystem: <none | allowed paths/actions>
- External: <none | allowed services/actions>

## Workflow

1. <minimal runtime step>
2. <minimal runtime step>
3. <minimal runtime step>

## References

- Read `references/cases.md` when checking recurrence patterns.

## Validation

Before done:

- <A was matched>
- <marker was visible when active>
- <Y was applied>
- <X was avoided>
- <Effects were respected>
- <Hard checks passed if applicable>
```

---

# 11. Example: aim V1 sketch

```markdown
---
name: aim
description: "Use when active aim, focus, topic, target, drift, side request, adjacent work, or sustained mode topic needed. Not for formal goals, execution planning, ordinary summaries, or blocking user topic switches."
---

# Aim

## Rule

Facing an active aim plus side, adjacent, or drifting work, first show the request's relation to the aim, to avoid silently dropping the active aim.

## Pattern

Use when:

- an active aim exists and the new request introduces side, adjacent, or drifting work;
- the user asks to check, set, reset, or switch the active aim;
- a sustained mode needs an explicit topic, target, or tentative conclusion before it can run.

Do not use when:

- no active aim exists;
- the user clearly starts a new topic and does not ask to preserve the old aim;
- the request only needs ordinary planning, review, debugging, or summary;
- the user asks for formal goal management.

## Boundary

Soft:

- Classify the request as aligned, side, adjacent, drift, aim-set, topic-needed, or unknown.
- Warn without judging the user's choice.
- Ask one minimal question when the relation is unknown.
- Do not block a user-initiated topic switch.

Hard:

- The first user-facing line must include `🧭` when the aim handle constrains the response, if transcript verification is enabled.

## Effects

- Conversation: may show the `🧭` marker and maintain a visible conversation-local aim handle.
- Filesystem: none.
- External: none.

## Workflow

1. Identify the active aim from the current conversation. If absent, do not invent one.
2. Match the current request against the Pattern.
3. Show the smallest visible aim signal needed for the match.
4. Ask before durable drift.
5. Continue only within the chosen relation.

## References

- Read `references/cases.md` when checking known aim recurrence patterns.

## Validation

Before done:

- `🧭` is visible when the aim handle constrains the response;
- the relation to the active aim is visible when drift matters;
- durable drift was not executed without user confirmation;
- no formal goal, planning workflow, file, or external artifact was created.
```

---

# 12. Implementation Tasks for Coding Agent

## 12.1 Shape verifier

Implement verifier for:

```text
required sections:
  Rule
  Pattern
  Boundary
  Effects
  Workflow
  References
  Validation

section order
frontmatter name
frontmatter description
no forbidden legacy sections:
  Primitive Audit
  Capability
  Trigger
  Template
  Protocol
  Surface
  External State
```

## 12.2 Description generator

Implement:

```text
Pattern -> description
```

Rules:

```text
include positive keywords
include negative exclusions
format: Use when ... Not for ...
fail if manual description diverges from generated description
```

## 12.3 Effects verifier

Check every skill has:

```text
Conversation
Filesystem
External
```

Check `none` is explicit.

## 12.4 Boundary verifier

Check:

```text
Boundary has Soft
Boundary may have Hard
Hard cannot be empty if present
Hard items should reference command/verifier/test when possible
```

Optional strict rule:

```text
Hard item without enforcement reference emits warning
```

## 12.5 Reference verifier

Check:

```text
references links exist
cases live under references
long case blocks not in SKILL.md body
one-level references rule if required by repo convention
```

## 12.6 Metadata sync

If frontmatter or Pattern changed:

```text
regenerate dispatcher/resolver metadata
run pnpm generate
run pnpm verify
```

## 12.7 Migration script

Provide migration helpers:

```text
Capability -> Rule draft
Trigger -> Pattern draft
Soft Boundary + Hard Boundary -> Boundary
Workflow/Template/Protocol -> Workflow
state/external_state/surface -> Effects
Primitive Audit removed
```

Migration should produce reviewable diffs, not silent semantic rewrites.

---

# 13. Non-goals

V1 does not implement:

```text
sidecar panel
status.json
Codex App Server integration
full schema-first IR
multi-agent permission model
external memory
automatic case invention
```

V1 only standardizes:

```text
theory mapping
SKILL.md runtime shape
description generation
effects declaration
soft/hard boundary split
validation locality
progressive loading
care-compatible references
```

---

# 14. Final V1 Summary

Theory:

```text
Skill = 面对 A case pattern 时，先执行 Y governance action，以避免 X default failure 的治理 primitive。
```

Runtime shape:

```text
Rule       = A/Y/X
Pattern    = 何时命中 A
Boundary   = soft/hard 边界
Effects    = 允许副作用
Workflow   = 如何执行 Y
References = 渐进加载材料
Validation = 本次是否正确完成 A -> Y -> avoid X
```

Operational rule:

```text
SKILL.md 只放 runtime 必读内容。
共享理论外置。
长 case 外置。
硬约束脚本化。
description 由 Pattern 生成。
所有 skill 激活必须有 marker 投影。
```
