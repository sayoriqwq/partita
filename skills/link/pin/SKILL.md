---
name: pin
description: "Use when the user explicitly asks to add, update, inspect, or verify a GitHub repository as a Source Pin through Partita's approved git-subtree lifecycle. Not for non-GitHub sources, package pins, temporary clones, fetched copies, or UI/thread pinning."
---

# Pin

激活时，第一条用户可见行 MUST 以内联 `🔗` 开头。

## Rule

Source Pin 是一个由 Partita 管理的 GitHub `git subtree` 生命周期。`repos/<name>/` 与 sibling `repos/<name>.subtree.json` 共同构成唯一真源；具体 pin owner 选择 repository、tracking branch 和更新时机，并批准 exact plan hash 与 immutable revision。

Partita owns `plan → approved add/update → status → verify`。plan 只读并把 moving branch 解析为 immutable revision；apply 只执行获批 revision，不重新选择 branch tip。Git subtree commit 先发生，contract/editor bytes 后写；失败状态保持可观察，并由 fresh plan 收敛。

Pinned prefix 内部的 gitlink 是 opaque upstream reference boundary。保留其 index entry，但不 follow、fetch、checkout 或 materialize，也不为它创建第二个 contract。pin prefix 本身为 mode `160000` 仍是 hard block。

## Pattern

Use when:

- the user explicitly asks to add, update, inspect, or verify a GitHub repository as a Source Pin through Partita's approved git-subtree lifecycle.

Do not use when:

- non-GitHub sources, package pins, temporary clones, fetched copies, or UI/thread pinning.

## Boundary

Soft:

- SHOULD 默认使用 `repos/<name>/` 与 `repos/<name>.subtree.json`。
- SHOULD 让 tracking branch 表达 owner 的更新选择，让 resolved revision 表达本次 immutable truth。
- SHOULD 默认选择 `autoImport=excluded`、`watch=excluded`、`search=excluded`、`files=visible`；每项都保持显式 decision。
- SHOULD 只合并已存在的 VS Code/Zed settings，保留无关 editor settings。
- SHOULD 在 apply 前展示 current→desired revision、contract bytes、Git operation、editor changes、plan hash 和 immutable revision，等待 exact approval。

Hard:

- Source MUST 是 GitHub repository，materialization MUST 是 `git-subtree`，ownership MUST 是 `direct`。
- Contract MUST 使用 schemaVersion 2 和 sibling path；MUST NOT 写进 pinned prefix。
- Plan MUST 只读；add/update MUST 同时接收 exact plan file、plan hash 与 immutable revision。
- Apply MUST 拒绝被修改的 plan、stale local baseline、dirty worktree、错误 operation/revision 和已移动的 tracking branch。
- Prefix MUST 保持 read-only agent reference；application/test imports from prefix MUST hard block。
- Prefix 本身的 gitlink/submodule materialization MUST hard block；prefix 内部 gitlinks MUST 保持 opaque。
- MUST 使用 Partita CLI 执行 Source Pin Git writes；MUST NOT 在项目里复制 subtree mutation wrapper。

## Effects

- Conversation: MAY 展示 plan、approval tuple、status、verification issues 和 recovery state。
- Filesystem: approved apply MAY materialize/update prefix、写 sibling contract，并合并已存在的 editor settings。
- External: plan MAY 读取 GitHub tracking branch；approved apply MAY 执行真实 `git subtree add/pull`。内部 gitlinks 不产生额外网络或生命周期。

## Workflow

1. 读取当前 repo instructions 与 Git status；收集 GitHub repository、tracking branch、name/prefix、anchor、agent route 及 workspace decisions。
2. 新增 pin 时生成只读 plan：

   ```bash
   partita pin plan --operation add --name <name> --repository https://github.com/<owner>/<repo>.git --branch <branch> --prefix repos/<name> --anchor repos/<name>/LLMS.md --agent-route AGENTS.md --watch excluded --search excluded --files visible > /tmp/<name>.pin-plan.json
   ```

3. 更新 pin 时从 schemaVersion 2 contract 生成只读 plan：

   ```bash
   partita pin plan --operation update --contract repos/<name>.subtree.json > /tmp/<name>.pin-plan.json
   ```

4. 检查 plan 的 `currentRevision`、`desiredRevision`、`contractJson`、`git`、`editorChanges`、`recovery` 与 `planHash`；只在 owner 明确批准 exact `planHash + desiredRevision` 后继续。
5. 使用与 plan operation 对应的 approved apply：

   ```bash
   partita pin add --plan /tmp/<name>.pin-plan.json --plan-hash <planHash> --revision <desiredRevision>
   partita pin update --plan /tmp/<name>.pin-plan.json --plan-hash <planHash> --revision <desiredRevision>
   ```

6. 若 Git commit 已发生而 contract/editor delivery 失败，保留状态并生成 fresh plan；`git.action=none` 的 recovery plan 只补齐获批 bytes。
7. 运行 `partita pin status --contract repos/<name>.subtree.json` 与 `partita pin verify --contract repos/<name>.subtree.json`，再检查 Git diff/status 并提交 lifecycle output。

## References

- `partita pin plan`
- `partita pin add`
- `partita pin update`
- `partita pin status`
- `partita pin verify`

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

CLI operations are derived from schemaVersion 2；contract 不存自由文本 command。

## Validation

Before done:

- 第一条用户可见行包含内联 `🔗`；
- plan 是只读的，并记录 exact hash、immutable revision 与 current→desired；
- apply 使用获批 plan file/hash/revision，且没有重新选择 branch tip；
- schemaVersion 2 contract 与 materialized prefix 一致，split/trailer 匹配 immutable revision；
- sibling contract、anchor、route、read-only/import block 和 workspace decisions 通过 verify；
- pin prefix 本身不是 gitlink，内部 gitlinks 没有被 follow 或扩张为第二个 lifecycle；
- application/test 没有 import pinned prefix；
- status、verify、Git diff/status 与提交证据已报告，或具体 blocker 已说明。
