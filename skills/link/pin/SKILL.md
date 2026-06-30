---
name: pin
description: "Use when the user explicitly asks to pin an external repository as a source-entry truth source for agents with upstream ref, local prefix, route, editor policy, update path, verify path, and import block. Not for temporary clones, web fetches, node_modules lookup, package-version pins, or UI/thread pinning."
---

# Pin

激活时，第一条用户可见行 MUST 以内联 `🔗` 开头。

## Rule

面对用户要 `pin` 外部 repository 时，MUST 把它收敛为 source-entry pin：外部仓库是当前 repo 中 agent 可读取的真源入口，有可验证 upstream ref、本地 prefix、anchor、agent route、editor policy、update command、verify command、ownership mode 和 read-only/import block。

`pin` 不是临时 clone、一次性 web fetch、`node_modules` 猜测、普通 package version pin，也不是把外部内容复制进当前项目后失去 provenance。

## Pattern

Use when:

- 用户显式要求 `pin`、link 或接入外部 repository 作为长期 agent source。
- 当前项目需要把外部仓库放到本地 prefix，例如 `repos/<name>`，并让 agent 从 anchor/LLM doc 读取它。
- 已有临时 clone、下载件、copied material 或 URL 记录需要升级为可更新、可验证的 source-entry contract。
- 需要约束应用/测试代码不得从 source prefix import。
- 需要把 editor auto-import、watch/search 和隐藏策略明确成 project decision。

Do not use when:

- 用户只是要一次性读取、比较或总结外部内容，不需要接入当前项目。
- 请求只是 pin npm、pnpm、Docker、toolchain 或 package version。
- 用户要求从 `node_modules`、web cache、临时 clone 或粘贴内容推断真源。
- `pin` 指 UI 项、线程、笔记、任务或本地工作状态。
- 用户要做 projection 分发或 runtime copy 管理；这属于 owning projection mechanism。

## Boundary

Soft:

- SHOULD 优先使用 `partita source plan`、`partita source status` 和 `partita source verify` 表达通用 source-entry contract。
- SHOULD 让 target repo 的脚本保持短，只调用 Partita CLI 或 owning domain wrapper。
- SHOULD 将 domain-specific 语义留给 owning harness；Partita 只表达通用 source-entry 字段和 hard blocks。
- SHOULD 检测现有 `.vscode/` 和 `.zed/`，存在什么维护什么；两者 settings shape 分开处理。
- SHOULD 把 watch/search exclude 作为明确 decision；大仓库通常选择启用或保留为推荐状态。
- SHOULD 把 `files.exclude` 或 Zed file-scan 隐藏视为偏好项，不默认写入。

Hard:

- When: 开始 source-entry pin。
  Do: MUST 明确 upstream repository、branch/ref、local prefix、mechanism、anchor/LLM doc、update command、verify command、agent route、editor policy、ownership mode、read-only/import block。

- When: materialization mechanism 未由项目定义。
  Do: MUST 首选 `git-subtree`，并记录可验证 pinned ref 或 `git-subtree-split` trailer。

- When: 只有 web fetch、临时 clone、`node_modules` lookup、下载件或复制粘贴内容。
  Do: MUST NOT 称其为 source-entry pin。

- When: editor policy 未决。
  Do: MUST 默认阻断 auto-import；MUST 把 watch/search exclude 作为明确 decision；MUST NOT 默认隐藏 repo。

- When: 需要 materialize、update 或 verify source entry。
  Do: MUST 使用 Partita CLI、当前项目已有 wrapper 或 owning harness command；MUST NOT 把大段脚本塞进 target repo。

- When: 当前 repo 是 prelude-managed target。
  Do: MUST NOT direct write 绕过 prelude lifecycle；使用 provider/prelude-maintain ownership mode 或停止报告 blocker。

- When: 应用或测试代码从 source prefix import。
  Do: MUST hard block；source entry 是 agent reference，不是 application dependency。

## Effects

- Conversation: MAY 展示 source-entry contract、缺失 decisions、hard block issue codes、editor policy decisions 和验证结果。
- Filesystem: MAY 在批准 scope 内写入 source-entry contract 或由 owning command materialize 的 source prefix；MUST NOT 手工复制外部 source 来绕过 command。
- External: MAY 通过 git 或 official upstream locator 读取 ref/trailer metadata；materialize、update 和 verify MUST 走 Partita CLI 或 owning command。

## Workflow

1. 确认请求是 external repository source-entry pin，而不是 temporary clone、web fetch、`node_modules` lookup 或 package version pin。
2. 收集 upstream repository、branch/ref、local prefix、mechanism、anchor/LLM doc、agent route、ownership mode、update command 和 verify command。
3. 决定 editor policy：auto-import exclude 默认 block；watch/search exclude 明确选择；files/repo hide 只有用户选择时启用；VSCode 和 Zed 分开处理。
4. 运行 `partita source plan` 生成只读 contract 和 editor settings shape。
5. 如果 target 是 prelude-managed，确认 ownership 是 `provider` 或 `prelude-maintain`，不要 direct write managed surfaces。
6. 使用 `partita source status` 检查当前 source prefix、anchor、route、pin 和 editor state。
7. 使用 `partita source verify` hard block source 缺失、gitlink/submodule、缺 pin ref/trailer、错误 import、缺 anchor/route 和 prelude direct write。
8. 汇报 changed files、contract path、CLI commands、hard block 覆盖点和验证结果。

## References

- `partita source plan`
- `partita source status`
- `partita source verify`

## Validation

Before done:

- 第一条用户可见行包含内联 `🔗`；
- source-entry contract 明确 upstream repository、branch/ref、local prefix、mechanism、anchor/LLM doc、update command、verify command、agent route、editor policy、ownership mode 和 read-only/import block；
- 没有把 web fetch、临时 clone、`node_modules` lookup、下载件或 copied material 称为 pin；
- editor policy 默认阻断 auto-import，watch/search exclude 有明确 decision，files/repo hide 没有默认启用；
- VSCode 和 Zed settings shape 已分开处理；
- prelude-managed target 没有被 direct write 绕过；
- 应用和测试代码没有从 source prefix import；
- `partita source status` 或 `partita source verify` 的结果已报告，或已说明具体 blocker。
