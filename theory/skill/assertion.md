---
audience: agent
authors:
  - codex
reviewed_by: []
purpose: 定义 skill assertion、case pattern 和 minimal governance action 的关系。
updated: 2026-06-26
---

# Skill Assertion

## Assertion Formula

Skill 的理论断言是：

```text
Facing A, first Y, to avoid X.
```

中文写法是：

```text
面对 A 时，先 Y，避免 X。
```

其中：

```text
A = case pattern
Y = minimal governance action
X = default failure path
```

这个断言必须在 agent 进入默认失败路径之前触发。不要写成“当 agent 已经
X 时，再执行 Y”，因为 skill 的职责是提前治理默认滑坡，而不是失败后的
补救说明。

## Case Pattern

Case pattern 是从真实 case 中抽出的可匹配情境形状。

它不是用户意图类别、任务类型、关键词列表、gate 名称或 runtime selector。
关键词可以帮助 projection 匹配，但不能替代 pattern 本身。

关系是：

```text
case -> case pattern -> assertion A
```

Case pattern 必须保留真实情境中的失败压力。如果抽象后只剩“用户想做某类
事”，它就已经退化成 task category，不足以成立 skill。

## Governance Action

`Y` 是最小治理动作。

一个 primitive skill 只能有一个 `Y`。它可以包含多个执行步骤，但这些步骤
必须服务同一个治理动作。如果不同 gate、不同产物或不同任务阶段需要不同
治理动作，就应该拆成多个 skill，并用 `pressure_family` 或 tag 说明它们
的 lineage。

不要把 `Y` 写成正向能力愿望：

```text
wrong:
  improve research
  write better docs
  manage issues

right:
  first build a source-tiered question tree
  first preserve the accepted constraint before changing code
  first identify a deliverable vertical slice
```

## Failure Path

`X` 是 agent 在没有治理层时会自然滑向的默认失败。

`X` 不是用户不喜欢的结果描述，也不是一次性输出错误。它必须能从 case 中
读出某类默认行为失败，例如：

```text
agent 默认罗列资料，却不建立问题树
agent 默认按技术层拆 issue，却没有形成 vertical slice
agent 默认推进局部代码，却丢掉已接受的架构约束
```

## Validation Locality

Skill validation 只验证这条 assertion 是否在本次正确生效：

```text
A 是否命中
Y 是否执行
X 是否避免
boundary 是否守住
effects 是否越界
hard checks 是否通过
```

它不验证整个 workflow 是否成功，也不定义 gate exit condition。Gate 可以
依赖多个 skill 的 validation 作为证据，但 gate exit condition 属于
workflow theory。
