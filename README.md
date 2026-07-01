# Partita

`partita` 是 CLI-backed Codex skill harness，用来维护 sayori 自己创建或 maintain 的 skills workspace、workflow skills 和治理机制。

Partita 当前目标是 personal skill workflow/source harness。

Partita 不 owns user-home dotfile materialization、global runtime skill universe、provider runtime、external skill collections、target-repo runtime copies 或 one-off workflow history。

## State

- `skills/` 是 self-owned skill source input。
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
- `src/partita/pin.ts` 管理 GitHub git-subtree pins。
- `src/partita/skill.ts` 是 skills.sh CLI 的 thin wrapper。
- `src/partita/home.ts` 是 chezmoi CLI 的 thin wrapper。

## Commands

```bash
pnpm verify
pnpm verify-runtime
pnpm verify-source
pnpm skill-sync
pnpm skill-status
pnpm skill-verify
pnpm home:status
pnpm home:diff
```

## Npm CLI

Partita CLI 发布为 `@sayoriqwq/partita`，bin name 是 `partita`。

下游仓库不应该依赖本机 sibling repo 路径；GitHub subtree pin 应通过 package-level CLI 调用：

```bash
npx @sayoriqwq/partita pin status --name effect --prefix repos/effect --contract repos/effect.subtree.json
npx @sayoriqwq/partita pin verify --name effect --prefix repos/effect --contract repos/effect.subtree.json
pnpm dlx @sayoriqwq/partita pin verify --name effect --prefix repos/effect --contract repos/effect.subtree.json
```

`pin plan` 用于生成 GitHub git-subtree pin contract 和 editor settings shape：

```bash
npx @sayoriqwq/partita pin plan --name effect --prefix repos/effect --contract repos/effect.subtree.json --repository https://github.com/Effect-TS/effect --branch main --ref <commit-or-split>
```

默认 contract path 是 `repos/<name>.subtree.json`，和 `repos/<name>/` 并列。

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

`skill-status` 运行 `npx skills list -g -a codex --json`，并比对 Partita source skill names 和 installed runtime names。

`skill-verify` 在 status 之上 hard-check runtime folder contents 是否和 Partita source skill directories 一致。

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

`partita pin` 只支持 GitHub repository + git subtree pin。

默认 contract path 是 subtree prefix 的 sibling 文件。

例如：

```bash
partita pin plan --name effect --prefix repos/effect --repository https://github.com/Effect-TS/effect --branch main
```

默认读取或生成：

```text
repos/effect.subtree.json
```

`repos/<name>/` 是 read-only external source materialization，不是 Partita-owned skill source。

## Verification

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

Partita 从 `SKILL.md` frontmatter 只读取 `name` 和 `description`。

`policy.allow_implicit_invocation` MUST 位于 `agents/openai.yaml` 的 `policy` block 下。

source namespaces 只影响 Partita source organization；frontmatter 和 global installed skills 保持 short skill name。

新增或修改 skill 后运行：

```bash
pnpm verify
```

## Acknowledgement

早期探索参考了 [Waza](https://github.com/tw93/Waza)，其由 Tw93 以 MIT License 发布。

Partita 不 ship Waza 的 skill taxonomy 或 skill contents。
