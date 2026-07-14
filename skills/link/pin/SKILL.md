---
name: pin
description: "Use when the user explicitly asks to pin a GitHub repository into the current project as a git-subtree pin with sibling subtree contract, anchor, route, editor policy, update path, verify path, and import block. Not for non-GitHub sources, non-subtree mechanisms, temporary clones, web fetches, node_modules lookup, package-version pins, or UI/thread pinning."
---

# Pin

激活时，第一条用户可见行 MUST 以内联 `🔗` 开头。

## Rule

面对用户要 `pin` repository 时，MUST 先区分两个阶段，并保持一个 Source Pin 真源：

1. **Source Pin**：source-maintaining repo 通过 GitHub `git subtree` 维护 `repos/<name>/`，旁边的 `repos/<name>.subtree.json` 与 materialized prefix 共同构成唯一真源。contract 记录 GitHub repo、branch/ref、subtree split/trailer、anchor、agent route、editor policy、update/verify command、`direct` ownership 和 read-only/import block。
2. **Publication**：Partita 验证 Source Pin 后，使用 Prelude Contract canonical codec 生成确定性 archive、tree digest 与普通 provenance metadata；publication 不含 Harness-specific Target policy。
3. **Target delivery**：owning Harness Artifact 消费 Partita publication，并附加 Target locator、route、anchor 与 `referenceOnly` 语义；Prelude 只离线验证和物化 Artifact 已打包的 Pinned Reference Tree。

Pinned Reference Tree 是 Harness-owned、reference-only 的 Target 内容，不是第二个 pin。Target evidence 写入 owning Harness 的 feedback surface。Partita 维护 Source Pin contract、hard blocks 与 generic publication，并直接消费 Prelude Contract codec；MUST NOT 复制 archive wire contract、Harness build contract 或 domain-specific policy。

`pin` 不是非 GitHub source、任意 external source 抽象、非 subtree mechanism、临时 clone、一次性 web fetch、`node_modules` 猜测、普通 package version pin，也不是把外部内容复制进当前项目后失去 provenance。

Pinned upstream tree 内部的 gitlink 只是该 upstream 选择保留的 opaque reference boundary。它不是新的 Source Pin，也不扩张当前 pin 的 API/guide/reference scope；MUST NOT follow、fetch、checkout、materialize，MUST NOT 为它建立第二个 contract 或 update lifecycle。

## Pattern

Use when:

- the user explicitly asks to pin a GitHub repository into the current project as a git-subtree pin with sibling subtree contract, anchor, route, editor policy, update path, verify path, and import block.

Do not use when:

- non-GitHub sources, non-subtree mechanisms, temporary clones, web fetches, node_modules lookup, package-version pins, or UI/thread pinning.

## Boundary

Soft:

- SHOULD 先从当前项目的 active instructions 和 ownership 语境判断请求属于 Source Pin 还是 Prelude-managed Target delivery。
- SHOULD 只在 Source Pin 阶段使用 `partita pin plan`、`partita pin status`、`partita pin verify` 和 `partita pin publish`。
- SHOULD 让 target repo 的脚本保持短，只调用 Partita CLI 或 owning domain wrapper。
- SHOULD 将 domain-specific 语义留给 owning harness；Partita 只表达 GitHub subtree pin 字段和 hard blocks。
- SHOULD 默认 contract path 为 `repos/<name>.subtree.json`，与 `repos/<name>/` 并列；MAY 只在明确需要时使用 `--contract <path>` 覆盖。
- SHOULD 检测现有 `.vscode/` 和 `.zed/`，存在什么维护什么；两者 settings shape 分开处理。
- SHOULD 把 watch/search exclude 作为明确 decision；大仓库通常选择启用或保留为推荐状态。
- SHOULD 把 `files.exclude` 或 Zed file-scan 隐藏视为偏好项，不默认写入。
- SHOULD 在验证 Git index 时区分 pin prefix 本身与 prefix 内部路径：只有 prefix 本身为 mode `160000` 才表示错误的 submodule materialization；内部 gitlink 保持 opaque。

Hard:

- When: 开始 pin。
  Do: MUST 先判定当前 repo 是 Source Pin owner 还是 Prelude-managed Target；只有 Source Pin owner 才继续收集 GitHub repository、branch/ref、local prefix、subtree split/trailer、anchor/LLM doc、update command、verify command、agent route、editor policy、`direct` ownership 和 read-only/import block。

- When: source 不是 GitHub repository 或 mechanism 不是 `git-subtree`。
  Do: MUST hard block；Partita pin 不接受其他 source/mechanism。

- When: contract path 未显式覆盖。
  Do: MUST 使用 `repos/<name>.subtree.json`；它与 `repos/<name>/` 并列，MUST NOT 放进 subtree prefix 内部。

- When: 只有 web fetch、临时 clone、`node_modules` lookup、下载件或复制粘贴内容。
  Do: MUST NOT 称其为 GitHub subtree pin。

- When: pinned upstream prefix 内部含 gitlink。
  Do: MUST 允许其作为 opaque upstream reference boundary；MAY 验证 Git index entry shape，但 MUST NOT follow/fetch/checkout/materialize、要求 sibling contract、注入 provenance relation 或建立独立 update lifecycle。pin prefix 本身若为 gitlink 仍 MUST hard block。

- When: editor policy 未决。
  Do: MUST 默认阻断 auto-import；MUST 把 watch/search exclude 作为明确 decision；MUST NOT 默认隐藏 repo。

- When: 需要 materialize、update 或 verify pin。
  Do: MUST 使用 Partita CLI、当前项目已有 wrapper 或 owning harness command；MUST NOT 把大段脚本塞进 target repo。

- When: 需要发布 verified Source Pin。
  Do: MUST 使用 `partita pin publish` 生成 canonical archive 与 provenance；MUST hard block untracked/missing entries、unsafe links、invalid modes、prefix gitlink 和 Git/filesystem inspection failure；MUST NOT 把 Target locator、route、anchor 或 `referenceOnly` 写入 generic publication。

- When: 当前 repo 是 Prelude-managed Target。
  Do: MUST 在运行 Partita pin command、fetch/update Git 或写入 contract/prefix 之前 hard block；MUST 路由到 owning Harness Artifact build 与 Prelude Pinned Reference Tree convergence，无法使用 owning mechanism 时停止并报告 blocker。

- When: Target 已收到 Pinned Reference Tree。
  Do: MUST 将它视为 Harness-owned、reference-only；MUST NOT 注入 subtree metadata、运行 pin/update lifecycle 或把 Target edits 当作 source maintenance，Target evidence 写入 feedback。

- When: 应用或测试代码从 pinned prefix import。
  Do: MUST hard block；pin 是 agent reference，不是 application dependency。

## Effects

- Conversation: MAY 展示 GitHub subtree pin contract、缺失 decisions、hard block issue codes、editor policy decisions 和验证结果。
- Filesystem: Source Pin 阶段 MAY 在批准 scope 内写入 `repos/<name>.subtree.json` 或由 owning command materialize 的 pinned prefix；Prelude-managed Target 阶段 MUST 保持无 pin 写入。
- External: Source Pin 阶段 MAY 通过 git/GitHub locator 读取当前 pin 的 ref/trailer metadata，materialize、update 和 verify MUST 走 Partita CLI 或 owning command；MUST NOT follow upstream-internal gitlinks；Target delivery MUST 保持离线且不运行 Git。

## Workflow

1. 判定当前 repo 的角色。若它是 Prelude-managed Target，停止 Source Pin 流程，路由到 owning Harness Artifact 与 Prelude convergence，并确认没有创建 contract、prefix、subtree metadata 或 Target-local update lifecycle。
2. 对 Source Pin owner，确认请求是 GitHub repository git-subtree pin，而不是 temporary clone、web fetch、`node_modules` lookup、package version pin 或非 GitHub source。
3. 收集 GitHub repository、branch/ref、local prefix、subtree split/trailer、anchor/LLM doc、agent route、update command 和 verify command；ownership 固定为 `direct`。
4. 决定 editor policy：auto-import exclude 默认 block；watch/search exclude 明确选择；files/repo hide 只有用户选择时启用；VSCode 和 Zed 分开处理。
5. 运行 `partita pin plan` 生成只读 `repos/<name>.subtree.json` contract 和 editor settings shape。
6. 使用 `partita pin status --name <name> --prefix repos/<name>` 检查当前 pinned prefix、anchor、route、subtree split/trailer 和 editor state。
7. 使用 `partita pin verify --name <name> --prefix repos/<name>` hard block source 缺失、pin prefix 本身为 gitlink/submodule、缺 split/trailer、非 GitHub URL、非 subtree mechanism、错误 import 和缺 anchor/route；prefix 内部 gitlink 只作为 opaque upstream boundary，不 follow。
8. 使用 `partita pin publish --archive <path> --provenance <path>` 从 verified Source Pin 生成确定性 canonical archive 与 provenance。
9. 若 owning Harness 需要 Target delivery，向其 Artifact build 交付 Partita publication；Target 侧只接受 Prelude 离线 convergence 的 Pinned Reference Tree。
10. 汇报 changed files、contract path、CLI commands、hard block 覆盖点和验证结果。

## References

- `partita pin plan`
- `partita pin status`
- `partita pin verify`
- `partita pin publish`

## Validation

Before done:

- 第一条用户可见行包含内联 `🔗`；
- 已明确区分 Source Pin 与 Prelude-managed Target delivery；
- `repos/<name>.subtree.json` contract 明确 GitHub repository、branch/ref、local prefix、`git-subtree` mechanism、subtree split/trailer、anchor/LLM doc、update command、verify command、agent route、editor policy、`direct` ownership 和 read-only/import block；
- 默认 contract path 与 subtree prefix 并列，且未回落到 `.partita`；
- pin prefix 本身不是 gitlink/submodule；upstream-internal gitlinks 没有被 follow/fetch/materialize，也没有产生第二个 contract 或 lifecycle；
- 没有接受非 GitHub source 或非 subtree mechanism；
- 没有把 web fetch、临时 clone、`node_modules` lookup、下载件或 copied material 称为 pin；
- editor policy 默认阻断 auto-import，watch/search exclude 有明确 decision，files/repo hide 没有默认启用；
- VSCode 和 Zed settings shape 已分开处理；
- Prelude-managed Target 没有运行 Partita pin、fetch/update Git、写入 subtree contract/prefix、注入 subtree metadata 或建立独立 lifecycle；
- Target Pinned Reference Tree 由 owning Harness Artifact 与 Prelude convergence 投递，保持 Harness-owned、reference-only，evidence 写入 feedback；
- 应用和测试代码没有从 pinned prefix import；
- `partita pin status` 或 `partita pin verify` 的结果已报告，或已说明具体 blocker。
- 若执行 publication，相同 verified input 产生 byte-identical archive 与 provenance，且 publication 未吸收 Harness Target policy。
