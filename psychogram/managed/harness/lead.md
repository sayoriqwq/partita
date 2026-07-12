# Lead

## One-sentence thesis

Psychogram 是一个通用 concept-wiki harness：它把一个概念输入转化为一个独立、可维护、可阅读、可测试的 Markdown wiki。

## What this system is

Psychogram 定义的是生成和维护 concept wiki 的系统层。它规定 artifact class、template 边界、fixture 运行方式、page type、agent role、workflow 和 runtime projection。

## What this system is not

它不是某个具体概念的 wiki，不是业务知识库，不是 Obsidian 模板集合，也不是 runtime-specific agent 配置本身。

## Core artifact classes

- Harness: [[concepts/harness]]
- Template: [[concepts/template]]
- Fixture: [[concepts/fixture]]
- Instance: [[concepts/instance]]

## Core principle

一个概念应该生成一个独立 wiki。Harness 只保存跨 concept wiki 稳定成立的规则；template 只保存空骨架；fixture 保存测试对象；instance 保存真实生成结果。

## Current structure

- `harness/` — psychogram 本体。
- `template/` — domain-neutral concept wiki skeleton。
- `fixtures/` — 测试输入、输出和观察。
- `projections/` — runtime adaptation notes。

## Read next

- [[glossary]]
- [[guide/start-here]]
- [[guide/system-map]]
- [[guide/problem-map]]
- [[index]]

## Related

- [[claims/one-concept-should-produce-one-independent-wiki]]
- [[claims/fixtures-must-not-leak-into-the-harness]]
- [[questions/what-belongs-in-the-harness]]
- [[tensions/generality-vs-fixture-specificity]]
