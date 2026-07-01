# Partita Harness

这个文件把 harness operations 映射到 wiki。

它不是 rules layer。

## Route Matrix

| Intent | Read first | Action surface | Verify |
| --- | --- | --- | --- |
| 理解 harness | `packages/wiki/harness/index.md` | `CONTEXT.md`, `HARNESS.md`, `AGENTS.md` | `pnpm verify` |
| 创建 internal primitive skill | `skills/primitive/notate/SKILL.md` | `skills/primitive/<name>/SKILL.md`, `skills/primitive/<name>/agents/openai.yaml` | `pnpm generate`, `pnpm verify` |
| 创建 public workflow skill | `skills/primitive/conduct/SKILL.md` | `skills/<name>/SKILL.md`, `skills/<name>/agents/openai.yaml` | `pnpm generate`, `pnpm verify` |
| 从 case patch 已有 skill | `skills/primitive/retune/SKILL.md` | target skill files and direct references | `pnpm generate`, `pnpm verify` |
| 维护 generic projection | `packages/wiki/projection/generic.md` | `packages/generic-projection/`, projection markers, projected references | `pnpm generate:check`, `pnpm verify` |
| 检查 runtime projection | `packages/wiki/projection/index.md` | `.codex-plugin/`, `harness/skills/dispatcher.md`, projected references | `pnpm generate:check`, `pnpm verify` |
| 维护 docs | `packages/wiki/documentation/index.md` | `packages/wiki/`, root mapping files | `pnpm verify` |

## Boundaries

- MUST NOT 在 root files 中创建第二个 durable knowledge layer。
- MUST NOT 在 root mapping files 中重复 wiki definitions。
- MUST keep executable rules in CLI、verifier、tests、skill source 和 generated runtime surfaces so future wiki removal does not erase behavior.
- MUST NOT 让 generated runtime metadata 重新定义 skill semantics。
- MUST NOT 把 dispatcher output 放在 `skills/` 下；它属于
  `harness/skills/dispatcher.md`。
- MUST NOT 把 root wiki content 放在 `wiki/` 下；wiki modules 位于 `packages/wiki/`。
- MUST NOT 让 `packages/generic-projection/` own Partita-specific routing 或 install policy。
- 除非用户定义 behavior，否则 MUST NOT 新增 skill。
- profile canon 和 `sayoriqwq/sayoriqwq` personal skills monorepo 路径保留在本 repo 外；这里只有 Partita-owned skill workspace 和 Partita-specific projections。

## Commands

```bash
pnpm generate
pnpm generate:check
pnpm verify
```
