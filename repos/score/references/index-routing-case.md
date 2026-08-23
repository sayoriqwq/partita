---
audience: agent
authors:
  - codex
reviewed_by: []
purpose: 记录 score 在文档职责说明被写入 leaf module 时的复发样例。
status: active
sources: []
updated: 2026-07-01
---

# Index Routing Case

## Case

一次 `effect-harness` 文档维护中，目标文档集已经存在 `harness/index.md`。

agent 修改了 `harness/offcial-guide.md` 和 `harness/offcial-migrate.md`。

agent 把文档职责和边界写进了 leaf modules 正文，例如“本文件只维护官方源口径”和
“本文件承载本仓实践、本机集成、provider 分层、Prelude 接入和 verifier 取舍”。

用户纠正：这些职责说明应该出现在 `harness/index.md`，不应该出现在被描述的文档正文里。

## Failure

`score` 当时只要求维护 module boundary。

`score` 没有明确要求先查找文档集入口。

`score` 没有明确要求把文档职责、阅读路线和模块边界集中写进 index 或 routing module。

## Governance

当文档集存在 index、README、routing table 或模块清单时，agent MUST 先判断当前 assertion
是不是文档职责、阅读路线或模块边界。

如果 assertion 是文档职责、阅读路线或模块边界，agent MUST 把它写入 index/routing module。

leaf module SHOULD 直接承载自身主题内容。

leaf module SHOULD NOT 用正文自述“本文件负责/不负责什么”，除非它本身就是 index、policy
或 boundary 文档。
