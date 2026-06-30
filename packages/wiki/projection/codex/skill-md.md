# Skill Md

`skills/` 下的 `SKILL.md` files 是 source skill runtime projection。

它不是 installed copy，也不是完整 wiki。

它 MUST 包含 every-run instructions，并链接或路由到 conditional detail。

V1 body section order 是：

```text
## Rule
## Pattern
## Boundary
## Effects
## Workflow
## References
## Validation
```

source namespaces 来自 path structure，不来自 frontmatter。

例如，`skills/expression/density/SKILL.md` 保持 `name: density`，并投影为 `ex:density`。

`skills/link/pin/SKILL.md` 保持 `name: pin`，并投影为 `lk:pin`。

`skills/orientation/argue/SKILL.md` 保持 `name: argue`，并投影为 `og:argue`。

`skills/maintenance/reconcile/SKILL.md` 保持 `name: reconcile`，并投影为 `mt:reconcile`。

`skills/primitive/notate/SKILL.md` 保持 `name: notate`，并投影为 `pm:notate`。

Codex global skill installation 是 flat 的。

同一个 source skill 安装为 `density`、`pin`、`argue`、`reconcile` 或 `notate`。

`expression`、`link`、`orientation`、`maintenance` 和 `primitive` 仍是 Partita source families，不是 global install directories。
