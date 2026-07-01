# Agent Instructions

## Project

`partita` 是 CLI-backed Codex skill harness，用来维护 sayori 自己创建或 maintain 的 skills workspace、workflow skills 和治理机制。

Partita 的核心边界是 personal skill workflow/source harness。

Partita 不拥有 user-home dotfile materialization、global runtime skill universe、provider runtime、external skill collections、target-repo runtime copies 或 one-off workflow history。

## Core

本 repo owns：

- `skills/` 下的 self-owned skill source；
- `src/partita/` 下的 TypeScript/Effect CLI、verifier、skills.sh skill runtime wrapper、chezmoi home adapter 和 pin code；
- `tests/` 下的 executable behavior checks；
- root operating docs：`README.md` 和 `AGENTS.md`；
- pnpm/Turbo workspace scaffold。

本 repo 不 owns：

- `docs/skills/` docs baseline；
- `harness/skills/dispatcher.md` dispatcher baseline；
- `partita.materialize.json` repo-internal materialization config；
- `MIGRATION.md` one-off migration baseline；
- `.codex-plugin/` plugin runtime metadata；
- `packages/wiki/` wiki layer；
- `runtime/references/` shared runtime reference layer；
- `harness/skills/{checks,family,policy,routing,shape}.md` old harness reference docs；
- `CONTEXT.md` 和 `HARNESS.md` wiki root maps；
- `CLAUDE.md` tool-specific instruction file；
- external skill collections 或其 taxonomies；
- external plugin marketplace metadata；
- project-specific commands、private local paths 或 one-off workflow history；
- `sayoriqwq/sayoriqwq` personal skills monorepo 路径。

## Rules

- 除非用户显式定义 skill，否则 MUST NOT 新增 skill。
- `skills/` 是 self-owned skill source input。
- `skills/` 下的 Partita `SKILL.md` files 是 runtime-installable skill source。
- runtime skill MUST 自包含执行所需 references；MUST NOT 依赖另一个 skill 的 `references/`。
- `docs/skills/`、`harness/skills/dispatcher.md`、`partita.materialize.json` 和 `MIGRATION.md` MUST NOT 恢复，除非用户显式要求从第一性原理重建设计。
- verifier MUST hard-block removed surfaces 回流，但 MUST NOT 继续维护 dispatcher routing 或 materialization drift 规则。
- 外部 repos MUST 通过 `partita pin` 的 GitHub git-subtree pin 进入 Partita。
- GitHub subtree pin contract MUST 使用 sibling path，例如 `repos/<name>.subtree.json`。
- `repos/<name>/` 是 read-only external source materialization，不是 Partita-owned skill source。
- generic helper package 已废弃；MUST NOT 恢复 marker DSL 或 repo-internal materialization abstraction。
- `openai-skill-validation` 只 owns OpenAI/Codex runtime skill folder 基础可用性。
- `partita-skill-validation` owns Partita source skill contract，并依赖 runtime validation。
- `partita verify --level project` owns repo-level invariants，不应把所有规则塞回单一 validator。
- root `wiki/` 和 `packages/wiki/` MUST NOT exist in this repo。
- `.codex-plugin/` MUST NOT exist in this repo。
- `runtime/references/` MUST NOT exist in this repo。
- executable setup、sync 和 verification mechanisms 属于 owning harness 或 CLI repo。
- Partita skills 可以调用这些 mechanisms，但 SHOULD NOT 用 prose 重新实现它们。
- global runtime skill mutation MUST 通过 skills.sh CLI；Partita 只能提供 thin wrapper，例如 `partita skill sync`。
- global runtime skill status 和 verification SHOULD 通过 `partita skill status` 与 `partita skill verify` 比对 Partita source 和 skills.sh runtime list。
- user-home materialization MUST 通过 chezmoi；Partita 只能提供 thin wrapper，例如 `partita home status`、`partita home diff` 和显式写入的 `partita home apply --write`。
- agent MUST NOT 直接编辑 `~/.agents/skills` 里的 installed runtime copy。
- zero skills MUST 保持为合法 framework state。
- 修改 skill names、trigger policy、harness install behavior、global skill state 或 marker conventions 前，如果用户指令有多种解读，MUST 使用 interpretation gate。

## Skills

新增 request-orientation skill 时，创建 `skills/orientation/<name>/SKILL.md` 和 `skills/orientation/<name>/agents/openai.yaml`，运行 `pnpm verify`。

新增 expression protocol skill 时，创建 `skills/expression/<name>/SKILL.md` 和 `skills/expression/<name>/agents/openai.yaml`，运行 `pnpm verify`。

新增 external authority link skill 时，创建 `skills/link/<name>/SKILL.md` 和 `skills/link/<name>/agents/openai.yaml`，运行 `pnpm verify`。

新增 maintenance skill 时，创建 `skills/maintenance/<name>/SKILL.md` 和 `skills/maintenance/<name>/agents/openai.yaml`，运行 `pnpm verify`。

新增 Partita-managed base skill 时，创建 `skills/primitive/<name>/SKILL.md` 和 `skills/primitive/<name>/agents/openai.yaml`，运行 `pnpm verify`。

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
