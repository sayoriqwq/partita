---
name: pin
description: "Use when the user explicitly invokes pin to add, update, inspect, verify, or publish a GitHub repository as a Source Pin through Partita's approved git-subtree lifecycle. Not for non-GitHub sources, package pins, temporary clones, fetched copies, or UI/thread pinning."
---

# Pin

当 `pin` owns 当前 response 时，每条用户可见回复的第一行 MUST 只包含 `🔗 Pin` 与可选的 ` + <Display Name>` suffix；suffix 只列出实质改变该回复的其他已显式激活/共同调用 skill，不改变 ownership，active-but-inert skill 与 local contract projection MUST 省略，其他内容从第二行开始。多个 co-invoked skill 争夺 ownership 且 precedence 未确定时，MUST 在激活前只问一个不带 skill marker 的最小 owner 问题。

## Rule

Source Pin 是由 Partita 管理的 GitHub `git subtree` 生命周期。`repos/<name>/` 与 sibling `repos/<name>.subtree.json` 共同构成唯一真源；pin owner 选择 repository、tracking branch 和更新时机，并批准 exact plan hash 与 immutable revision。

Partita owns `plan → approved add/update → status → verify → publish`：

1. plan 只读地把 moving branch 解析为 immutable revision；
2. add/update 只执行获批 revision，不重新选择 branch tip；
3. status/verify 检查 schemaVersion 2 contract、materialization 与 hard blocks；
4. publish 使用 Prelude Contract canonical codec 生成确定性 archive、tree digest 与 provenance，且不吸收 Harness-specific Target policy。

Git subtree commit 先发生，contract/editor bytes 后写；失败状态保持可观察，并由 fresh plan 收敛。Pinned prefix 内部的 gitlink 是 opaque upstream reference boundary，不产生第二个 contract 或 lifecycle；pin prefix 本身为 mode `160000` 仍是 hard block。

Pinned Reference Tree 是 Harness-owned、reference-only 的 Target 内容，不是第二个 Source Pin。Owning Harness 消费 Partita publication 并附加 Target locator、route、anchor 与 `referenceOnly` 语义；Prelude 只离线验证和物化 Artifact 已打包的内容。

## Pattern

Use when:

- the user explicitly invokes pin to add, update, inspect, verify, or publish a GitHub repository as a Source Pin through Partita's approved git-subtree lifecycle.

Do not use when:

- non-GitHub sources, package pins, temporary clones, fetched copies, or UI/thread pinning.

## Boundary

Soft:

- SHOULD 默认使用 `repos/<name>/` 与 `repos/<name>.subtree.json`。
- SHOULD 让 tracking branch 表达 owner 的更新选择，让 resolved revision 表达本次 immutable truth。
- SHOULD 默认选择 `autoImport=excluded`、`watch=excluded`、`search=excluded`、`files=visible`；每项保持显式 decision。
- SHOULD 只合并已存在的 VS Code/Zed settings，并保留无关设置。
- SHOULD 在 apply 前展示 current→desired revision、contract bytes、Git operation、editor changes、plan hash 和 immutable revision。
- SHOULD 将 Target delivery 留给 owning Harness，不在 Source Pin publication 中表达 locator、route、anchor 或 `referenceOnly`。

Hard:

- Source MUST 是 GitHub repository，materialization MUST 是 `git-subtree`，ownership MUST 是 `direct`。
- Contract MUST 使用 schemaVersion 2 和 sibling path；MUST NOT 写进 pinned prefix。
- Plan MUST 只读；add/update MUST 同时接收 exact plan file、plan hash 与 immutable revision。
- Apply MUST 拒绝被修改的 plan、stale local baseline、dirty worktree、错误 operation/revision 和已移动的 tracking branch。
- Prefix MUST 保持 read-only agent reference；application/test imports from prefix MUST hard block。
- Prefix 本身的 gitlink/submodule materialization MUST hard block；prefix 内部 gitlinks MUST 保持 opaque，不 follow、fetch、checkout 或 materialize。
- Source Pin Git writes MUST 使用 Partita CLI；MUST NOT 在项目中复制 subtree mutation wrapper。
- Publish MUST hard block contract/revision drift、staged/unstaged/untracked content、missing/unsupported entries、unsafe links、prefix Gitlink、Git/filesystem inspection failure 和 escaping/aliased output paths。
- Prelude-managed Target MUST NOT 运行 Partita pin、fetch/update Git、写 subtree contract/prefix 或建立 Target-local update lifecycle。

## Effects

- Conversation: MAY 展示 plan、approval tuple、status、verification issues、publication result 和 recovery state。
- Filesystem: approved apply MAY materialize/update prefix、写 sibling contract 并合并已存在的 editor settings；publish MAY 写指定的 archive/provenance outputs。
- External: plan MAY 读取 GitHub tracking branch；approved apply MAY 执行真实 `git subtree add/pull`；publish 使用本地 verified tree。内部 gitlinks 不产生额外网络或生命周期。

## Workflow

1. 读取当前 repo instructions 与 Git status，确认当前 repo 是 Source Pin owner；若是 Prelude-managed Target，停止并路由到 owning Harness。
2. 收集 GitHub repository、tracking branch、name/prefix、anchor、agent route 及 workspace decisions。
3. 新增 pin 时生成只读 plan：

   ```bash
   partita pin plan --operation add --name <name> --repository https://github.com/<owner>/<repo>.git --branch <branch> --prefix repos/<name> --anchor repos/<name>/LLMS.md --agent-route AGENTS.md --watch excluded --search excluded --files visible > /tmp/<name>.pin-plan.json
   ```

4. 更新 pin 时从 schemaVersion 2 contract 生成只读 plan：

   ```bash
   partita pin plan --operation update --contract repos/<name>.subtree.json > /tmp/<name>.pin-plan.json
   ```

5. 检查 `currentRevision`、`desiredRevision`、`contractJson`、`git`、`editorChanges`、`recovery` 与 `planHash`；只在 owner 明确批准 exact `planHash + desiredRevision` 后继续。
6. 使用与 plan operation 对应的 approved apply：

   ```bash
   partita pin add --plan /tmp/<name>.pin-plan.json --plan-hash <planHash> --revision <desiredRevision>
   partita pin update --plan /tmp/<name>.pin-plan.json --plan-hash <planHash> --revision <desiredRevision>
   ```

7. 若 Git commit 已发生而 contract/editor delivery 失败，保留状态并生成 fresh plan；`git.action=none` recovery plan 只补齐获批 bytes。
8. 运行 `partita pin status --contract repos/<name>.subtree.json` 与 `partita pin verify --contract repos/<name>.subtree.json`，检查 Git diff/status。
9. 需要 generic publication 时运行：

   ```bash
   partita pin publish --contract repos/<name>.subtree.json --archive out/<name>.pta --provenance out/<name>.json
   ```

10. 若需要 Target delivery，把 publication 交给 owning Harness Artifact；Target 侧只接受 Prelude 离线 convergence。

## References

- `partita pin plan`
- `partita pin add`
- `partita pin update`
- `partita pin status`
- `partita pin verify`
- `partita pin publish`

## Contract

schemaVersion 2 shape：

```json
{
  "schemaVersion": 2,
  "name": "<name>",
  "source": {
    "repository": "https://github.com/<owner>/<repo>.git",
    "trackingBranch": "<branch>",
    "revision": "<immutable-commit>"
  },
  "materialization": {
    "prefix": "repos/<name>",
    "mechanism": "git-subtree",
    "split": "<immutable-commit>",
    "trailer": "git-subtree-split: <immutable-commit>"
  },
  "ownership": { "mode": "direct" },
  "agent": {
    "anchor": "repos/<name>/LLMS.md",
    "route": "AGENTS.md",
    "readOnly": true,
    "importBlock": true
  },
  "workspace": {
    "autoImport": "excluded",
    "watch": "excluded",
    "search": "excluded",
    "files": "visible"
  }
}
```

CLI operations are derived from schemaVersion 2；contract 不存自由文本 command。Publication envelope 版本与 Source Pin contract schema 独立。

## Validation

Before done:

- 每条 `pin`-owned 用户可见回复的第一行仅为 `🔗 Pin`，或在其他已显式且 materially active skill 存在时为 `🔗 Pin + <Display Name>`；marker 行没有 status 或 payload，active-but-inert skill 未进入 suffix；
- plan 只读并记录 exact hash、immutable revision 与 current→desired；
- apply 使用获批 plan file/hash/revision，且没有重新选择 branch tip；
- schemaVersion 2 contract 与 materialized prefix 一致，split/trailer 匹配 immutable revision；
- sibling contract、anchor、route、read-only/import block 和 workspace decisions 通过 verify；
- pin prefix 本身不是 gitlink，内部 gitlinks 没有被 follow 或扩张为第二个 lifecycle；
- application/test 没有 import pinned prefix；
- publication 相同 verified input 产生 byte-identical archive 与 provenance，且未吸收 Harness Target policy；
- status、verify、Git diff/status 与 publication evidence 已报告，或具体 blocker 已说明。
