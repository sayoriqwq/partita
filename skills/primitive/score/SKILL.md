---
name: score
description: "Use when the user explicitly invokes score or asks to apply sayoriqwq-style Markdown writing preferences to Markdown docs. Not for implicit Markdown editing, non-Markdown prose, product copy, release notes, social posts, translation, localization, code comments, commit messages, skill creation, workflow creation, or skill patching."
---

# Score

激活时，第一条用户可见行 MUST 以内联 `🎼 score` 开头。

## Rule

面对用户显式调用 `score` 处理 Markdown 时，MUST 按 sayoriqwq-style Markdown preferences 组织 module、section 和 assertion，并维护 metadata、audience、language、pattern、index、path、links 与 normative keywords，避免 agent 写出无边界、不可审查、不可复用或不符合用户文档偏好的 Markdown。

## Pattern

Use when:

- the user explicitly invokes score or asks to apply sayoriqwq-style Markdown writing preferences to Markdown docs.

Do not use when:

- implicit Markdown editing, non-Markdown prose, product copy, release notes, social posts, translation, localization, code comments, commit messages, skill creation, workflow creation, or skill patching.

## Boundary

Soft:

- MUST 在创建或修改 Markdown 前读取相关本地 preference references。
- MUST 把 `assertion` 当作一条可单独审查的语义判断，而不是正确性证明。
- MUST 把每个 `.md` 文件当作一个 `module`。
- MUST 维护 module boundary：一个 module 负责承载其职责内 assertions，并拒绝职责外 assertions。
- When: 文档集已有 index、README、routing table 或模块清单，且变更内容是在说明各文档职责、阅读顺序或模块边界。
  Do: MUST 把这些职责/路由 assertions 写入 index/routing module，而不是写进被描述的 leaf module 正文。
- Leaf module SHOULD 直接承载自身主题内容，不应该用正文自述“本文件负责/不负责什么”，除非该 module 本身就是 index、policy 或 boundary 文档。
- 除非更高优先级规则禁止，sayoriqwq-style docs MUST 使用 frontmatter metadata。
- MUST 先选择 `audience`，再决定偏 pattern 还是偏 description。
- MUST 使用简体中文作为主内容语言。
- section 名称 SHOULD 使用简短英文词或短语。
- 目标文档系统支持 OFM wiki link 时，SHOULD 优先使用 OFM。
- path 和 filename SHOULD 短、符合 scope、且不重复父级语义。

Hard:

- When: 用户没有显式调用 `score`。
  Do: MUST NOT 使用 `🎼 score` marker 或套用 `score` protocol。

- When: 当前 repo 明确声明了覆盖本次 Markdown 变更 surface 的本地 verifier。
  Do: MUST 运行该 repo-local verifier；`pnpm verify` 只在当前 repo 存在 `package.json` 且声明 `scripts.verify`，或本地指令明确要求它时使用。

- When: 完成 repo 变更前。
  Do: MUST 运行已发现的 repo-local verifier；如果没有可发现 verifier，MUST 报告未发现本地 verifier，并且 MUST NOT 反复运行硬编码的全局命令。

- When: 在 Partita landing 中修改 `score` source、local references、generated files、frontmatter 或 `agents/openai.yaml`。
  Do: MUST 从 Partita repo root 运行 `pnpm verify`。

## Effects

- Conversation: MAY 展示已应用的 preference blocks、preference conflict 和验证结果。
- Filesystem: MAY 创建或更新 Markdown docs、wiki documentation nodes、skill-local references 和直接需要的 generated files。
- External: none.

## Workflow

1. 确认用户显式调用了 `score`；否则不激活。
2. 读取与当前 Markdown surface 相关的本地 preference references。
3. 识别 target module 及其 boundary。
4. 查找同一文档集是否已有 index、README、routing table 或模块清单；需要描述文档职责或阅读路线时，先更新该入口。
5. 在组织正文前，选择或维护 metadata，尤其是 `audience`。
6. 用 sections 组织 assertions；heading 只打开 section，不当作 assertion。
7. 应用 language、keywords、pattern、path 和 links preferences。
8. 根据 AGENTS、README、package scripts 或同级项目指令发现当前变更 surface 需要的 repo-local verifier；只在当前 repo 明确支持时运行 `pnpm verify`，否则运行本地已有验证命令，或报告未发现 verifier。

## References

- 需要可单独审查的语义判断时，读取 [assertion](references/assertion.md)。
- 需要 `.md` 文件作用域时，读取 [module](references/module.md)。
- 需要单一职责 module boundary 时，读取 [boundary](references/boundary.md)。
- 需要由 heading 打开的局部上下文时，读取 [section](references/section.md)。
- 需要中文正文和英文 section naming 时，读取 [language](references/language.md)。
- 需要 normative keyword 强度时，读取 [keywords](references/keywords.md)。
- 需要 frontmatter fields 时，读取 [metadata](references/metadata.md)。
- 在选择偏 pattern 还是偏 description 前，读取 [audience](references/audience.md)。
- 需要判断文档职责、阅读路线或模块边界是否应进入 index/routing module 时，读取
  [index routing case](references/index-routing-case.md)。
- 需要 agent-facing structures 或 template 定义时，读取 [pattern](references/pattern.md)。
- 需要 index 和短 scope filename 时，读取 [path](references/path.md)。
- 需要 OFM-first linking 时，读取 [links](references/links.md)。

## Validation

Before done:

- `score` 只在用户显式调用后使用；
- target surface 是 Markdown；
- 相关本地 preference references 已应用；
- 当变更触及 metadata、audience、module boundary、sections、assertions、language、keywords、pattern、path 或 links 时，这些面已被处理；
- 当变更触及文档职责、阅读路线或模块边界，且文档集存在 index/routing module 时，这些 assertions 已集中到 index/routing module；
- `score` 没有执行非 Markdown prose polish、product copy、workflow skill、primitive skill、skill patch、code comment、commit message、PR description 或 issue reply；
- Effects 保持在声明的 filesystem scope 内；
- 要求的 Hard checks 已通过，或准确 blocker 已报告。
