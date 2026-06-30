---
audience: [agent, human]
authors:
  - codex
reviewed_by: []
purpose: 定义 Partita 内部 generic projection 的职责边界。
status: active
sources: []
updated: 2026-06-30
---

# Generic Projection

## Definition

`generic projection` 是 Partita 内部的通用投影机制。

## Responsibility

- `generic projection` 负责描述 source content 如何投影到 target runtime surface。
- `generic projection` 负责通用 marker parsing、file copy rendering、block marker 和 drift comparison。
- `generic projection` 不负责 Partita-specific routing、skill family handle、Codex plugin metadata 或 install policy。
- `generic projection` 的 executable helper 位于 `packages/generic-projection/`。

## Boundary

`packages/wiki/` 是 canonical semantic content。

`skills/` 当前仍是 skill source input。

`src/partita/` 负责把 generic projection helper 组合进 Partita generation、verification、dispatcher 和 install workflows。

root `wiki/` 目录不再是合法 source surface。
