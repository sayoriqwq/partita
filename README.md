# Partita

`partita` 是 CLI-backed Codex skill harness，用来维护 sayori 自己创建或 maintain 的 skills workspace、workflow skills 和治理机制。

zero-skill 仍然是合法 framework state。

当前定制定义 sayori 拥有的 Partita skill domain。`sayoriqwq/sayoriqwq` 不再承担 personal skills monorepo 职责。

## State

- Codex plugin metadata 由 `.codex-plugin/plugin.json` 承载。
- user-defined skills 从 `skills/` 下的 direct 或 namespaced `SKILL.md` frontmatter 读取。
- dispatcher 是 harness-owned routing index，不是 skill content。
- `packages/wiki/` 是当前 semantic content，但不是长期稳定 runtime boundary。
- `packages/generic-projection/` 是 repo 内部通用 projection helper。
- generation、verification 和 local install 由 TypeScript/Effect `partita` CLI 执行。

## Map

- `.codex-plugin/plugin.json` 是生成的 Codex plugin manifest。
- `CONTEXT.md` 把 repository context 映射到 wiki nodes。
- `HARNESS.md` 把 harness operations 映射到 wiki nodes。
- `harness/skills/dispatcher.md` 是生成的 harness dispatcher reference。
- `bin/partita.ts` 是 TypeScript/Effect CLI entrypoint。
- `src/partita/` 负责 Partita-specific generation、verification、routing 和 install。
- `packages/generic-projection/` 负责通用 projection marker、file copy 和 block marker helper。
- `packages/wiki/` 当前负责 harness、skill、workflow、projection、practice、collaboration、documentation 和 vocabulary nodes；后续拆除 wiki 时，executable verifier、skill source 和 generated runtime surface 应继续成立。

## Commands

```bash
pnpm generate
pnpm generate:check
pnpm verify
pnpm link:global
```

## Projection

`generic projection` 是内部机制，不是独立产品名。

`generic projection` 只处理通用 projection shape：marker parsing、file copy、block marker 和 drift comparison。

Partita-specific routing、skill family handle、Codex plugin metadata 和 install policy 仍由 `src/partita/` 负责。

`wiki/` 根目录不再存在；wiki source 当前位于 `packages/wiki/`。新 workflow 不应新增对具体 wiki path 的长期依赖。

## Install

Partita 的 local install 只把 `./skills` 同步到 flat global skills。用户目录里的唯一 global runtime copy 是 `~/.agents/skills/<name>`：

```bash
pnpm install:codex-skill
```

安装后需要打开新的 Codex thread，让 global skills 重新加载。

不要同时把 Partita 安装进 personal Codex plugin marketplace；plugin cache 会生成 `partita:<skill>` 副本，和 flat global skill 形成双入口。

Codex global skill installation 是 flat 的：`npx skills add ./skills --full-depth` 会发现 nested source skills，但会按 `name` frontmatter 安装。

例如，`skills/primitive/notate/SKILL.md` 安装为 global skill `notate`。source family 仍是 `primitive`，Partita dispatcher handle 仍是 `pm:notate`。

`skills/orientation/argue/SKILL.md` 安装为 `argue`，投影为 `og:argue`。

`skills/maintenance/reconcile/SKILL.md` 安装为 `reconcile`，投影为 `mt:reconcile`。

`skills/expression/density/SKILL.md` 安装为 `density`，投影为 `ex:density`。

`skills/link/pin/SKILL.md` 安装为 `pin`，投影为 `lk:pin`。

`skills/` 是 sayori 自维护 skill 的 source input。外部 skills 通过 pin 保留 upstream provenance；只有经过 privateize/customize workflow 后才成为 Partita-owned skill。dispatcher 仍由 Partita harness 生成在 `harness/skills/dispatcher.md`。

## Skill

只有在用户明确 skill behavior 后，才能新增 skill。

写新 skill 前读取 `packages/wiki/practice/create.md`。

创建 internal primitive skill 使用 `pm:notate`。

创建 public workflow skill 使用 `pm:conduct`。

从真实 case patch 已存在且 identity 成立的 skill 时，才使用 `pm:retune`。

当前 `SKILL.md` body shape 以现有 Partita source skills、verifier 和 tests 为准；不要重新引入已拆除的 `packages/wiki/projection/codex/*` 依赖。

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

每个 Partita skill MUST 有 `agents/openai.yaml`，因为它会把 skill 的 invocation policy 投影到 runtime metadata。

`scripts/`、`references/` 和 `assets/` 是 optional official bundled resource directories。

required frontmatter：

```yaml
---
name: <name>
description: "Use when ... Not for ..."
---
```

`description` 是 Codex selector surface：保持 40-500 characters，以 `Use when` 或 `Use for` 开头，并包含 `Not for`。

Partita 从 `SKILL.md` frontmatter 只读取 `name` 和 `description`。

official optional frontmatter keys 是 `license`、`allowed-tools` 和 `metadata`。

Codex-specific UI、`policy.allow_implicit_invocation` 和 tool dependencies 放在 `agents/openai.yaml`。

`policy.allow_implicit_invocation` MUST 位于 `policy` block 下。

`partita` 是 product 和 plugin name，不是 skill prefix。

source namespaces 只投影 dispatcher handles；frontmatter 和 global installed skills 保持 short skill name。

`expression` 投影为 `ex:<name>`。

`link` 投影为 `lk:<name>`。

`orientation` 投影为 `og:<name>`。

`maintenance` 投影为 `mt:<name>`。

`primitive` 投影为 `pm:<name>`。

`harness/skills/dispatcher.md` 从 `skills/` source `SKILL.md` frontmatter 和 `agents/openai.yaml` 生成。

routing table 投影 `Handle`、`Name`、`Invocation`、`Description` 和 `File`。

新增或修改 skill 后运行：

```bash
pnpm generate
pnpm verify
```

## Acknowledgement

早期探索参考了 [Waza](https://github.com/tw93/Waza)，其由 Tw93 以 MIT License 发布。

Partita 不 ship Waza 的 skill taxonomy 或 skill contents。
