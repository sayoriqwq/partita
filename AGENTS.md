# Agent Instructions

## Project

`partita` 是 CLI-backed Codex skill harness，用来维护 sayori 自己创建或 maintain 的 skills workspace、workflow skills 和治理机制。

Partita 的核心边界是 personal skill workflow/source harness。

Partita 不拥有 user-home dotfile materialization、global runtime skill universe、provider runtime、external skill collections、target-repo runtime copies 或 one-off workflow history。

## Core

本 repo owns：

- `skills/` 下的 self-owned skill source；
- `primitive/` 下的 skill-local reference copy source；
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
- `primitive/` 是 Partita primitive reference body source，用来复制到 skill-local `references/`。
- `primitive/` copy MUST 通过 `partita primitive sync` 或 `pnpm primitive-sync` 更新。
- `primitive/` MUST NOT 被 runtime skill 当作共享 dependency；runtime skill 仍 MUST 自包含执行所需 references。
- runtime skill MUST 自包含执行所需 references；MUST NOT 依赖另一个 skill 的 `references/`。
- `docs/skills/`、`harness/skills/dispatcher.md`、`partita.materialize.json` 和 `MIGRATION.md` MUST NOT 恢复，除非用户显式要求从第一性原理重建设计。
- verifier MUST hard-block removed surfaces 回流，但 MUST NOT 继续维护 dispatcher routing 或 materialization drift 规则。
- 外部 repos MUST 通过 `partita pin` 的 GitHub git-subtree pin 进入 Partita。
- GitHub subtree pin contract MUST 使用 sibling path，例如 `repos/<name>.subtree.json`。
- `repos/<name>/` 是 read-only external source materialization，不是 Partita-owned skill source。
- 修改 Arrange source projection 或核对 Score provenance 时，MUST 先读取 `repos/score/SKILL.md`；runtime target 保持自包含，且不得从 `repos/score/` import。
- Partita owns generic Source Pin verification and deterministic publication through the Prelude Contract canonical archive codec.
- Source Pin publication MUST remain free of Harness-specific Target locators, routes, anchors, and `referenceOnly` delivery policy.
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
- global runtime skill status 和 verification SHOULD 通过 `partita skill status` 与 `partita skill verify` 只比对 Partita source catalog 同名 skills；其他 global skills 是预期状态，不属于 Partita audit scope。
- user-home materialization MUST 通过 chezmoi；Partita 只能提供 thin wrapper，例如 `partita home status`、`partita home diff` 和显式写入的 `partita home apply --write`。
- agent MUST NOT 直接编辑 `~/.agents/skills` 里的 installed runtime copy。
- current Partita-owned public runtime skill catalog MUST 保持 explicit-only；每个现有 `agents/openai.yaml` MUST 使用 `policy.allow_implicit_invocation: false`。
- explicit invocation 创建的 conversation-local state 可在其声明的 lifecycle 内继续生效；这属于 state continuation，不是 implicit skill invocation。
- top-level skill invocation MUST 保持 explicit-only。显式调用 Workflow 后，Workflow MAY 调用其 closed、finite、predeclared component Skills；这属于 Workflow composition，不是 component 的 top-level implicit invocation。component calls MUST 使用 typed input/output 或 Effect Requirements，且不得 ad hoc discovery。
- Primitive 与 Workflow 的唯一 classifier 是 Skill composition：Primitive 的 implementation 不调用 Skill；Workflow 的 implementation 调用一个或多个 predeclared Skills。步骤数、阶段、分支、本地 state/protocol、router/controller shape 与 source family 都不决定分类。
- namespaced Partita skill 激活期间，每条用户可见回复的第一行 MUST 是 `<family emoji> <Markdown title/display name>[ + <Display Name>...]`；outer owner 保持第一位且独占 overall outcome、envelope、effect policy、termination 与 next-step ownership，只追加实质参与的其他已显式激活/共同调用 skill，active-but-inert skill MUST 省略。多个 co-invoked top-level skill 争夺 ownership 且 precedence 未确定时，MUST 在激活前只问最小 owner 问题，不显示 skill marker。
- future internal/model-invoked role 或 invocation policy 变化 MUST 先明确 role、composition ownership、effects 和 disclosure，并通过 interpretation gate。
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
pnpm primitive-sync
pnpm skill-sync
pnpm skill-status
pnpm skill-verify
pnpm home:status
pnpm home:diff
```

<!-- prelude:effect-harness-routing:start -->
## Effect Harness

For Effect application, test, package, TypeScript, editor, or lint changes, read the current Effect integration's `.prelude/**/managed/docs/index.md` first. Use `.prelude/**/managed/skills/adapt-effect-target/SKILL.md` when package selection or target-owned TypeScript topology needs adaptation. Keep `.prelude/**/feedback/**` target-owned. Treat `.prelude/**/repos/**` as read-only source diagnostics: consult it when installed declarations and managed guidance are insufficient, but never import or edit it.
<!-- prelude:effect-harness-routing:end -->
