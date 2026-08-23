# Partita

`partita` 是 CLI-backed Codex skill harness，用来维护 sayori 自己创建或 maintain 的 skills workspace、workflow skills 和治理机制。

Partita 当前目标是 personal skill workflow/source harness。

Partita 不 owns user-home dotfile materialization、global runtime skill universe、provider runtime、external skill collections、target-repo runtime copies 或 one-off workflow history。

## State

- `skills/` 是 self-owned skill source input。
- `primitive/` 存放可复制到 skill-local references 的 primitive reference body source。
- `src/partita/` 负责 Partita-specific verification、pin、skills.sh skill runtime wrapper 和 chezmoi home adapter。
- `tests/` 承载 executable behavior checks。
- root operating docs 是 `README.md` 和 `AGENTS.md`。
- Turbo/pnpm workspace 保留，即使 `packages/` 暂时没有 active package。

当前没有 dispatcher、docs baseline 或 repo-internal materialization layer。

以下 surfaces 已废弃，MUST NOT 恢复，除非用户显式要求从第一性原理重新设计：

- `docs/skills/`
- `harness/skills/dispatcher.md`
- `partita.materialize.json`
- `MIGRATION.md`
- `packages/wiki/`
- `runtime/references/`
- `.codex-plugin/`

## Map

- `bin/partita.ts` 是 TypeScript/Effect CLI entrypoint。
- `src/cli/Main.ts` 定义 CLI command surface。
- `src/partita/verifier.ts` 校验 Partita source shape，并阻止迁出 surfaces 回流。
- `src/partita/openai-skill-validation.ts` 校验 OpenAI/Codex runtime skill folder 的基础可用性。
- `src/partita/partita-skill-validation.ts` 在 runtime 层之上校验 Partita source skill contract。
- `src/partita/projection.ts` 定义 identity、invocation、metadata 和 selector 的 deterministic projections。
- `src/partita/pin.ts` 管理 GitHub git-subtree pins。
- `src/partita/skill.ts` 是 skills.sh CLI 的 thin wrapper。
- `src/partita/home.ts` 是 chezmoi CLI 的 thin wrapper。

## Commands

```bash
pnpm verify
pnpm verify-runtime
pnpm verify-source
pnpm primitive-sync
pnpm skill-sync
pnpm skill-status
pnpm skill-verify
pnpm home:status
pnpm home:diff
```

## Npm CLI

Partita CLI 发布为 `@sayoriqwq/partita`，bin name 是 `partita`。

Source Pin owner 不应依赖本机 sibling repo 路径；GitHub subtree lifecycle 通过 package-level CLI 调用：

```bash
npx @sayoriqwq/partita pin plan --operation add --name effect --prefix repos/effect --repository https://github.com/Effect-TS/effect.git --branch main > /tmp/effect.pin-plan.json
npx @sayoriqwq/partita pin add --plan /tmp/effect.pin-plan.json --plan-hash <planHash> --revision <desiredRevision>
npx @sayoriqwq/partita pin plan --operation update --contract repos/effect.subtree.json > /tmp/effect.pin-plan.json
npx @sayoriqwq/partita pin update --plan /tmp/effect.pin-plan.json --plan-hash <planHash> --revision <desiredRevision>
npx @sayoriqwq/partita pin status --name effect --prefix repos/effect --contract repos/effect.subtree.json
npx @sayoriqwq/partita pin verify --name effect --prefix repos/effect --contract repos/effect.subtree.json
npx @sayoriqwq/partita pin publish --name effect --prefix repos/effect --contract repos/effect.subtree.json --archive out/effect.pta --provenance out/effect.json
pnpm dlx @sayoriqwq/partita pin verify --name effect --prefix repos/effect --contract repos/effect.subtree.json
```

`pin plan` 只读地解析 tracking branch，输出 immutable revision、current→desired、预期 contract/editor bytes、Git operation 和 SHA-256 `planHash`。Approved apply 校验 exact plan hash/revision、local baseline、clean worktree 和 tracking branch 未移动，然后执行真实 `git subtree add/pull`。

默认 contract path 是 `repos/<name>.subtree.json`，与 `repos/<name>/` 并列。

## Loop

Partita 不直接写 global runtime skill universe。

Codex global skill installation 由 skills.sh CLI 负责。Partita 的 skill wrapper 只调用 skills.sh CLI，把 `./skills` 同步到 flat global skills：

```bash
pnpm skill-sync
pnpm skill-status
pnpm skill-verify
```

用户目录里的唯一 global runtime copy 是 `~/.agents/skills/<name>`。

`skill-sync` 运行 `npx skills add ./skills -a codex -g --skill '*' -y --full-depth`。

`skill-status` 运行 `npx skills list -g -a codex --json`，只从 global list 中选择 Partita source catalog 同名 skills 进行比对；其他 global skills 是预期状态，不属于 Partita audit scope。

`skill-verify` 在 status 之上 hard-check Partita-owned runtime folder contents 是否和 Partita source skill directories 一致。

不要同时把 Partita 安装进 personal Codex plugin marketplace；plugin cache 会生成 `partita:<skill>` 副本，和 flat global skill 形成双入口。

chezmoi 负责 user-home mapping 和 dotfile materialization。

Partita 的 home adapter 只调用 chezmoi，不直接编辑用户目录：

```bash
pnpm home:status
pnpm home:diff
partita home apply --write
```

`partita home diff` 运行非写入的 `chezmoi diff`。只有显式传入 `--write` 时，`partita home apply` 才运行 `chezmoi apply`。

## Pins

`partita pin` 是 GitHub Source Pin lifecycle owner：plan、approved add/update、status、verify、publish 与 schemaVersion 2 contract。

Contract 使用 sibling path，记录 GitHub repository、tracking branch、resolved immutable revision、git-subtree split/trailer、direct ownership、agent anchor/route/read-only/import block 和显式 workspace decisions；CLI operation 不以自由文本写入 contract。

Apply 不伪装成跨 Git/filesystem transaction：subtree commit 先发生，contract/editor bytes 后写。若 delivery 失败，repository state 保持可观察；fresh plan 会在已 materialize approved revision 时生成 `git.action=none` recovery plan。

Partita is the generic **producer** for Source Pin publications. The [Prelude
Contract canonical tree archive
protocol](https://github.com/yume-infra/prelude/blob/main/packages/harness-contract/README.md#canonical-tree-archive-protocol)
is normative for wire framing, entry meaning, the logical tree digest, decoder
limits, and compatibility. Partita consumes that codec; it does not define a
second Partita-private archive format.

`pin publish` has these observable boundaries:

- inputs: the repository root, a GitHub subtree contract, its bounded Source
  Pin prefix, and separate repository-relative archive/provenance output paths;
- verification: contract identity, immutable subtree revision, committed Git
  index and working-tree equality, tracked filesystem kind/mode/bytes, safe
  relative symbolic links, opaque internal Gitlinks, and output confinement;
- outputs: one deterministic `prelude-canonical-tree-archive-v1` ordinary file
  and path-independent provenance JSON containing archive format plus the
  outer source URL, immutable revision, and complete logical tree digest;
- failures: contract or revision drift, staged/unstaged/untracked content,
  missing or unsupported entries, unsafe links, prefix Gitlinks, Git/filesystem
  inspection errors, invalid or aliased output paths, and Contract encoder or
  provenance validation failures all stop publication.

The provenance `treeDigest` is the digest recomputed by the Contract encoder
from the same verified logical entries carried by the archive; it is not a hash
of the archive container bytes. Repeating publication from identical inputs
must produce byte-identical archive and provenance files.

Partita does not choose Harness Target locators, routes, anchors, or
`referenceOnly` delivery policy. [Effect
Harness](https://github.com/sayoriqwq/effect-harness/blob/main/HARNESS.md) is a
concrete **composer** of Partita publications; [Prelude](https://github.com/yume-infra/prelude/blob/main/docs/v2-harness-convergence-contract.md#pinned-reference-trees)
is the **consumer** and only materialization host for active Harness-owned
Outputs. Explicitly authorized Harness-delivered skills adapt Target-owned
surfaces after those stable Outputs are delivered.

例如：

```bash
partita pin plan --operation add --name effect --prefix repos/effect --repository https://github.com/Effect-TS/effect.git --branch main > /tmp/effect.pin-plan.json
partita pin add --plan /tmp/effect.pin-plan.json --plan-hash <planHash> --revision <desiredRevision>
partita pin status --contract repos/effect.subtree.json
partita pin verify --contract repos/effect.subtree.json
partita pin publish --contract repos/effect.subtree.json --archive out/effect.pta --provenance out/effect.json
```

默认读取或生成：

```text
repos/effect.subtree.json
```

`repos/<name>/` 是 read-only external source materialization，不是 Partita-owned skill source。

Pinned upstream 内部的 gitlinks 是 opaque reference boundaries。`partita pin verify` 只 hard-block pin prefix 本身被 materialize 为 mode `160000` 的 gitlink；不会 follow、fetch、checkout、materialize 内部 gitlink，也不要求为它们创建额外 subtree contract。

## Verification

`pnpm verify` 是 Target-owned 根聚合校验：它先运行 Integration gate（权威接口为
`prelude check`），再运行 code gate，并在第一层失败时仍继续运行第二层。两层结果
分别报告；任一层失败都会返回非零。验证不会自动 apply、安装、修复或 materialize。

需要只检查源代码时可直接运行 `pnpm verify:code`；需要只检查 Prelude Integration
收敛时可直接运行 `pnpm verify:integration`。code gate 保留 Partita 原有的 build、
project verifier、Effect toolchain、typecheck、test、lint 和 knip 覆盖。

`node tooling/verify-fresh-checkout-fixture.mjs` 会在完整 copied checkout 中运行三条真实 gate；仅该临时 fixture 使用有界的 30s Vitest test timeout，以覆盖冷依赖启动成本。

`partita verify` 默认运行完整 project 层。

需要只看某一层时：

```bash
partita verify --level runtime
partita verify --level source
partita verify --level project
```

`runtime` 只校验 OpenAI/Codex skill folder 可用性。

`source` 在 runtime 层之上校验 Partita V1 section、marker、description policy、`agents/openai.yaml` 和 source path。

`project` 在 source 层之上校验 links、迁出 surface 和 root shape。

## Skill

只有在用户明确 skill behavior 后，才能新增 skill。

创建或修改 skill 时，直接维护 skill-local source 和 references。

`primitive/` 是 authoring-time copy source。它保存可复制到 skill-local `references/` 的概念正文，例如 `primitive/case.md`。

`primitive/` 不是 runtime shared reference layer。installed runtime skills MUST NOT 依赖 `primitive/`，需要的材料必须复制到自己的 `references/` 中。

更新 primitive reference copies 时运行：

```bash
pnpm primitive-sync
```

`partita primitive sync` 会按内置 copy registry 把 `primitive/<name>.md` 的正文复制到对应 skill-local `references/`；如果 source 带 frontmatter，copy 时会剥离 frontmatter。`partita verify` 会检查这些 copies 没有 drift。

runtime skill MUST 自包含执行所需 references；MUST NOT 依赖另一个 skill 的 `references/`。

minimum shape：

```text
skills/<name>/SKILL.md
skills/<name>/agents/openai.yaml
skills/<name>/{scripts,references,assets}/...
skills/expression/<name>/SKILL.md
skills/expression/<name>/agents/openai.yaml
skills/expression/<name>/{scripts,references,assets}/...
skills/link/<name>/SKILL.md
skills/link/<name>/agents/openai.yaml
skills/link/<name>/{scripts,references,assets}/...
skills/orientation/<name>/SKILL.md
skills/orientation/<name>/agents/openai.yaml
skills/orientation/<name>/{scripts,references,assets}/...
skills/maintenance/<name>/SKILL.md
skills/maintenance/<name>/agents/openai.yaml
skills/maintenance/<name>/{scripts,references,assets}/...
skills/primitive/<name>/SKILL.md
skills/primitive/<name>/agents/openai.yaml
skills/primitive/<name>/{scripts,references,assets}/...
```

每个 Partita skill MUST 有 `agents/openai.yaml`，因为它承载 skill 的 invocation policy runtime metadata。

`description` 是 Codex selector surface：保持 40-500 characters，以 `Use when` 或 `Use for` 开头，并包含 `Not for`。

Partita skill creation form 使用 projection 生成 runtime surfaces：

- `identity.slug` 投影为 `SKILL.md` frontmatter `name`。
- `identity.title` 投影为 `agents/openai.yaml` 的 `interface.display_name`。
- `identity.family + identity.slug` 投影为 handle 和 source path；`identity.family` 的 emoji 与 `identity.title` 投影为 primary marker。
- `invocation.selector.use_when` / `do_not_use_when` 投影为 frontmatter `description` 和 `## Pattern`。
- `invocation.policy.allow_implicit_invocation` 投影为 `agents/openai.yaml` 的 `policy.allow_implicit_invocation`。

Partita 从 `SKILL.md` frontmatter 只读取 `name` 和 `description`。

`policy.allow_implicit_invocation` MUST 位于 `agents/openai.yaml` 的 `policy` block 下。

当前 Partita-owned public runtime catalog 是 explicit-only：所有现有 skill 的 `policy.allow_implicit_invocation` 都是 `false`。显式调用可以创建 skill 声明的 conversation-local state；该 state 在 lifecycle 内继续生效属于 continuation，不是新的 implicit invocation。

namespaced Partita skill 激活期间，每条用户可见回复的第一行是 `<family emoji> <Markdown title/display name>[ + <Display Name>...]`。owner 保持第一位；只追加实质改变本次回复的其他已显式激活或共同调用 skill。primitive catalog 对应 `🎼 Conduct`、`🎼 Notate`、`🎼 Retune` 和 `🎼 Score`。

top-level skill invocation 保持 explicit-only。显式调用 Workflow 后，Workflow 可以调用 closed、finite、predeclared component Skills；component call 是 typed composition，不是 component 的 top-level implicit invocation。Primitive 的 implementation 不调用 Skill；Workflow 的 implementation 调用一个或多个 predeclared Skills，这是唯一 classifier，和步骤数、阶段、分支、本地 state/protocol、router/controller shape 或 source namespace 无关。Workflow 保持 outer owner：owns overall outcome、primary marker、response envelope、effect policy、termination 与 next-step decision，并保持在 marker 第一位；component 在声明 scope 内执行自己的 Effect，通过 typed input/output 或 Effect Requirements 返回。只有实质改变本次回复的已显式激活/共同调用 skill 才列为 contributor；active 但未实质参与的 skill 必须省略。多个 co-invoked top-level skill 争夺 ownership 且 precedence 未确定时，先用一个不带 skill marker 的最小问题决定 owner。未来若引入 internal/model-invoked top-level role，必须先明确 composition ownership、effects、disclosure 与 invocation policy。

source namespaces 只影响 Partita source organization；frontmatter 和 global installed skills 保持 short skill name。

新增或修改 skill 后运行：

```bash
pnpm verify
```

## Acknowledgement

早期探索参考了 [Waza](https://github.com/tw93/Waza)，其由 Tw93 以 MIT License 发布。

Partita 不 ship Waza 的 skill taxonomy 或 skill contents。
