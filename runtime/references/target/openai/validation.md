# OpenAI Validation

## Definition

`OpenAI skill validation` 检查 skill folder 是否满足 target runtime shape 和基本 trigger 要求。

## Rules

- 新建或修改 OpenAI skill 后，completion 前 SHOULD 验证。
- 如果 official 或 bundled validator 存在，agent MUST 运行它。
- 如果没有 validator，agent MUST 手动检查 required files、frontmatter、folder name、references、scripts 和 metadata consistency。
- 除非缺少用户输入或环境条件阻塞，validation failure MUST 在 completion 前修复。
- 只有当用户或 target contract 要求某个具体 validator 时，缺少该 validator 才是 blocker。

## Check

- `SKILL.md` exists.
- frontmatter 包含 `name` 和 `description`。
- `description` 包含 trigger context。
- 可选资源目录直接位于 skill folder 下。
- 需要 references 时，`SKILL.md` 链接到 `references/`。
- generated files 或 UI metadata 与 skill 匹配。
