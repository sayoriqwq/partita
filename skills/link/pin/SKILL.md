---
name: pin
description: "Use when the user explicitly asks to pin or link external authority or external content into the current project with provenance, version anchor or unlocked marker, update path, verify path, and script-backed materialization. Not for one-off web reading, package version pin only, UI/thread pinning, projection distribution, or copying content without a link script."
---

# Pin

激活时，第一条用户可见行 MUST 以内联 `🔗` 开头。

## Rule

面对用户要把外部 authority 或外部内容 link 进当前项目时，MUST 先建立可溯源、可更新、可验证的 link contract，并且只通过脚本或 CLI materialize、update 和 verify，避免把外部真源降级成一次性 web fetch、临时 clone 或无法维护的 copied material。

## Pattern

Use when:

- 用户显式要求 `pin` 或 link 外部项目、文档、wiki、规范、package、archive、dataset 或 source bundle。
- 外部内容需要作为当前项目可长期引用的 authority。
- 当前项目需要记录 upstream locator、version anchor 或 `unlocked`、local path、update path、verify path 和 ownership。
- 已有临时 clone、下载件、URL 记录或 copied material 需要改造成可维护 link。

Do not use when:

- 用户只是要一次性读取、比较或总结外部内容，不需要接入当前项目。
- 请求只是 pin npm、pnpm、Docker、toolchain version，不涉及外部内容 authority。
- `pin` 指 UI 项、线程、笔记、任务或本地工作状态。
- 用户要做 projection 分发或 runtime copy 管理；这属于外部 projection 机制，不属于 `pin`。
- 用户要求在没有脚本或 CLI 的情况下手工复制外部内容并宣称完成。

## Boundary

Soft:

- MUST 将 external authority 分类为 `repo`、`docs`、`package`、`archive`、`dataset`、`source-bundle` 或 `unknown`。
- MUST 区分 external authority、local link 和 projection/copy。
- SHOULD 优先使用当前项目已有脚本、CLI、manifest schema 或 documented update command。
- SHOULD 只 link 外部真源和必要 metadata，不顺手整理、改写或吸收外部内容语义。
- SHOULD 保留外部项目自己的 ownership，不把外部材料改写成当前项目原创材料。

Hard:

- When: 开始 `pin` 一个 external authority。
  Do: MUST 明确 authority type、upstream locator、version anchor 或 `unlocked`、local path、ownership、materialization path、update path 和 verify path。

- When: 外部 authority 没有稳定 version anchor、release id、content hash 或 pinned ref。
  Do: MUST 标注 `unlocked`，并说明无法锁定带来的更新和复现风险。

- When: 需要 materialize、update 或 verify 外部 authority。
  Do: MUST 使用当前项目已有脚本或 CLI；如果缺失，MUST 报告 `script-missing` blocker，并在内容 mutation 前停止。

- When: 当前 repo 或外部 checkout 存在 dirty state。
  Do: MUST NOT 在未报告并获得批准前修改相关工作树。

- When: 只有一次性 web fetch、临时下载、临时 clone 或复制粘贴内容。
  Do: MUST NOT 称其为 `pin`。

- When: projection/copy 从 local link 派生。
  Do: MUST NOT 让 projection/copy 反向成为真源。

## Effects

- Conversation: MAY 展示 authority type、link contract、`unlocked` 风险、`script-missing` blocker 和验证结果。
- Filesystem: MAY 在批准 scope 内写入 link contract、manifest 或由脚本/CLI materialize 的内容；MUST NOT 手工复制外部内容来绕过脚本要求。
- External: MAY 通过 git、HTTP 或官方 source command 读取外部 authority 的 locator、version anchor 和 metadata；materialize、update 和 verify MUST 走脚本或 CLI。

## Workflow

1. 解析 external authority type、upstream locator、目标 local path、ownership 和用户期望的 link 目的。
2. 解析 version anchor；无法锁定时，MUST 标注 `unlocked`。
3. 检查当前 repo 和相关外部 checkout 的 dirty state。
4. 查找当前项目已有 materialize、update 和 verify 脚本或 CLI。
5. 如果脚本或 CLI 缺失，报告 `script-missing` blocker，给出最小 link contract，并停止在内容 mutation 前。
6. 如果脚本或 CLI 存在，记录 link contract，并通过脚本或 CLI 执行 materialize、update 和 verify。
7. 汇报 changed files、authority type、locator、version anchor 或 `unlocked`、local path、update path、verify path 和 blocker。

## References

- 无 references。

## Validation

Before done:

- 第一条用户可见行包含内联 `🔗`；
- external authority type 已明确，或已报告材料不足；
- upstream locator、local path、ownership、update path 和 verify path 已明确；
- version anchor 已明确，或已标注 `unlocked`；
- external authority、local link 和 projection/copy 没有混淆；
- materialize、update 和 verify 使用了脚本或 CLI，或已报告 `script-missing` blocker；
- 没有把一次性 web fetch、临时 clone、下载件或 copied material 称为 `pin`；
- completion 报告 changed files、update path、verify path、验证结果和准确 blocker。
