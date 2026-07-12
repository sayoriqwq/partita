# Index

## Core

- [[lead]] — psychogram harness 的入口页。
- [[glossary]] — harness 术语契约。
- [[index]] — harness 内容目录。
- [[log]] — harness 演化记录。

## Guide

- [[guide/start-here]] — 作者重新进入 psychogram harness 的首页。
- [[guide/system-map]] — harness、template、fixture、instance、projection 的关系地图。
- [[guide/problem-map]] — 当前核心问题和张力地图。

## Concepts

- [[concepts/concept-wiki]] — 一个概念生成一个独立 wiki。
- [[concepts/harness]] — psychogram 本体层。
- [[concepts/template]] — domain-neutral generated-wiki skeleton。
- [[concepts/fixture]] — 测试用样例输入、输出和观察。
- [[concepts/instance]] — 真实生成的独立 concept wiki。
- [[concepts/projection]] — runtime 适配层。
- [[concepts/page-type]] — 通用页面类型机制。
- [[concepts/agent-role]] — agent 语义角色机制。
- [[concepts/lead]] — 入口页类型。
- [[concepts/guide]] — 作者导航层。
- [[concepts/claim]] — 承重主张。
- [[concepts/assertion]] — 正文中的句子级判断。
- [[concepts/question]] — 开放问题。
- [[concepts/tension]] — 持续取舍。
- [[concepts/workflow]] — agent 可执行流程。
- [[concepts/staging]] — generated wiki 的短期吸收区。
- [[concepts/index]] — 内容 catalog。
- [[concepts/log]] — 语义时间线。

## Claims

- [[claims/one-concept-should-produce-one-independent-wiki]] — 一个概念应生成一个独立 wiki。
- [[claims/fixtures-must-not-leak-into-the-harness]] — fixture 内容不得泄漏进 harness。
- [[claims/templates-should-be-domain-neutral]] — template 必须保持领域中立。
- [[claims/agent-operations-should-not-pollute-content-space]] — agent 操作流程不应污染概念内容区。

## Questions

- [[questions/what-belongs-in-the-harness]] — 什么属于 harness。
- [[questions/what-is-the-minimum-universal-wiki-shape]] — 最小通用 wiki 形状是什么。
- [[questions/when-should-a-page-type-be-universal]] — 页面类型何时应成为通用类型。
- [[questions/when-should-a-runtime-feature-become-a-projection]] — runtime 功能何时应进入 projection。

## Tensions

- [[tensions/generality-vs-fixture-specificity]] — 通用性与 fixture 具体性之间的取舍。
- [[tensions/generality-vs-usefulness]] — 通用性与可用性之间的取舍。
- [[tensions/template-neutrality-vs-opinionated-structure]] — template 中立性与结构主张之间的取舍。
- [[tensions/system-docs-vs-generated-wiki-docs]] — 系统文档与生成 wiki 文档之间的边界。

## Workflows

- [[workflows/design-concept-wiki]] — 设计一个 concept wiki。
- [[workflows/instantiate-concept-wiki]] — 从 template 实例化 concept wiki。
- [[workflows/run-fixture]] — 运行 fixture 并记录观察。
- [[workflows/lint-harness]] — 检查 harness/template 的 fixture leakage。
- [[workflows/update-template]] — 更新 domain-neutral template。
- [[workflows/project-runtime-config]] — 设计 runtime projection。

## Agents

- [[agents/router]] — harness agent intent router。
- [[agents/roles/template-architect]] — template 架构角色。
- [[agents/roles/fixture-runner]] — fixture 运行角色。
- [[agents/roles/harness-linter]] — harness lint 角色。
- [[agents/roles/projection-builder]] — projection 构建角色。
