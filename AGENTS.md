@/Users/sayori/.codex/RTK.md

# Agent Instructions

## Project

`partita` 是 CLI-backed Codex skill harness，用来维护 sayori 自己创建或 maintain 的 skills workspace、workflow skills 和治理机制。

framework 支持 zero-skill baseline。

当前 customization 在 direct skill paths 和 supported namespace paths 下定义 user-owned Partita skills，例如 `skills/expression/<name>/SKILL.md`、`skills/link/<name>/SKILL.md`、`skills/orientation/<name>/SKILL.md`、`skills/maintenance/<name>/SKILL.md` 和 `skills/primitive/<name>/SKILL.md`。

本 repo 当前是 pnpm/Turbo workspace。

canonical wiki modules 当前位于 `packages/wiki/`，但 wiki 不是长期稳定 runtime boundary；新代码和新 workflow 应避免新增对 wiki path 的硬依赖。

generic projection helpers 位于 `packages/generic-projection/`。

## Boundaries

本 repo owns：

- `.codex-plugin/plugin.json` 下的 Codex plugin metadata；
- skill framework shape；
- `harness/skills/dispatcher.md` 下的 generated dispatcher metadata；
- `packages/wiki/` 下的 canonical wiki nodes；
- `packages/generic-projection/` 下的 generic projection helpers；
- verifier skeleton；
- direct skill paths 和 supported namespace paths 下的 user-defined skills，例如 `skills/expression/<name>/SKILL.md`、`skills/link/<name>/SKILL.md`,
  `skills/orientation/<name>/SKILL.md`, `skills/maintenance/<name>/SKILL.md`,
  和 `skills/primitive/<name>/SKILL.md`。

本 repo 不 owns：

- external skill collections 或其 taxonomies；
- external plugin marketplace metadata；
- project-specific commands、private local paths 或 one-off workflow history。
- `sayoriqwq/sayoriqwq` personal skills monorepo 路径。

## Current Rule

- 除非用户显式定义 skill，否则 MUST NOT 新增 skill。
- `CONTEXT.md` 和 `HARNESS.md` 是指向 `packages/wiki/` 的 root maps，不是独立 durable knowledge layers。
- 新增或修改 skill 前，先从 `packages/wiki/practice/create.md` 或 `packages/wiki/practice/patch.md` 开始，并维护当前 V1 `SKILL.md` section shape；不要依赖已拆除的 `packages/wiki/projection/codex/*` 节点。
- Partita canonical knowledge 位于 `packages/wiki/`。
- `skills/` 下的 Partita `SKILL.md` files 是 source skill runtime projections。
- wiki nodes 承载 canonical behavior language；安装到 external harnesses 或 target repos 的 copies 是 managed projections，MUST NOT 重新定义 skill。
- `skills/` 是 skill source input。
- dispatcher output 属于 `harness/skills/dispatcher.md`，不属于 `skills/`。
- `packages/generic-projection/` owns generic marker parsing、file-copy rendering、block marker constants 和 projection helper functions。
- `packages/generic-projection/` 不 owns Partita-specific routing、skill family handles、Codex plugin metadata 或 install behavior。
- root `wiki/` MUST NOT 存在；使用 `packages/wiki/`。
- `partita` 是 product 和 plugin name，不是 skill prefix。
- source namespaces 投影 dispatcher handles；frontmatter 和 global Codex installation 保持 flat：`expression` 投影为 `ex:<name>`，`link` 投影为 `lk:<name>`，`orientation` 投影为 `og:<name>`，`maintenance` 投影为 `mt:<name>`，`primitive` 投影为 `pm:<name>`。
- executable setup、sync 和 verification mechanisms 属于 owning harness 或 CLI repo。
- Partita skills 可以调用这些 mechanisms，但 SHOULD NOT 用 prose 重新实现它们。
- zero skills MUST 保持为合法 framework state。
- wiki nodes SHOULD 保持短且可复用。
- 修改 skill names、trigger policy、harness install behavior、global skill state 或 marker conventions 前，如果用户指令有多种解读，MUST 使用 interpretation gate。
- 新增 request-orientation skill 时，创建 `skills/orientation/<name>/SKILL.md` 和 `skills/orientation/<name>/agents/openai.yaml`，运行 `pnpm generate`，再运行 `pnpm verify`。
- 新增 expression protocol skill 时，创建 `skills/expression/<name>/SKILL.md` 和 `skills/expression/<name>/agents/openai.yaml`，运行 `pnpm generate`，再运行 `pnpm verify`。
- 新增 external authority link skill 时，创建 `skills/link/<name>/SKILL.md` 和 `skills/link/<name>/agents/openai.yaml`，运行 `pnpm generate`，再运行 `pnpm verify`。
- 新增 maintenance skill 时，创建 `skills/maintenance/<name>/SKILL.md` 和 `skills/maintenance/<name>/agents/openai.yaml`，运行 `pnpm generate`，再运行 `pnpm verify`。
- 新增 Partita-managed base skill 时，创建 `skills/primitive/<name>/SKILL.md` 和 `skills/primitive/<name>/agents/openai.yaml`，运行 `pnpm generate`，再运行 `pnpm verify`。
- 当前 repo 不再直接安装旧 effect-harness runtime；后续 Effect guidance 和 verification 只能通过 prelude/provider 形式重新接入。

## Commands

```bash
pnpm generate
pnpm generate:check
pnpm verify
```
