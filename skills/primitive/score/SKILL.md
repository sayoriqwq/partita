---
name: score
description: "Use when creating or modifying Markdown docs that should follow sayoriqwq-style Markdown writing preferences. Not for non-Markdown prose, product copy, release notes, social posts, translation, localization, code comments, commit messages, skill creation, workflow creation, or skill patching."
---

# Score

激活时，第一条用户可见行 MUST 以内联 `🎼 score` 开头。

## Rule

面对创建或修改 Markdown 时，MUST 按 sayoriqwq-style Markdown preferences 组织 module、section 和 assertion，并维护 metadata、audience、language、pattern、index、path、links 与 normative keywords，避免 agent 写出无边界、不可审查、不可复用或不符合用户文档偏好的 Markdown。

## Pattern

Use when:

- agent 将要创建或修改 `.md` 文件，且当前用户要求没有覆盖该偏好。
- 用户明确要求按 sayoriqwq 的 Markdown 写作偏好、文档规范或 `score` 处理。
- 当前任务需要判断 Markdown 中的 `assertion` 是否清晰、原子或可 review。
- 当前任务需要维护 Markdown metadata、audience、section、path、links、pattern 或 normative keywords。

Do not use when:

- 目标不是 Markdown。
- 用户要普通润色、去 AI 味、产品文案、release notes、社交文案、翻译或本地化文案。
- 用户要写代码注释、commit message、PR 描述或 issue 回复。
- 用户要创建 internal primitive skill；使用 `notate`。
- 用户要创建 public workflow skill；使用 `conduct`。
- 用户要 patch 已有且 identity 成立的 skill；使用 `retune`。

## Boundary

Soft:

- MUST read the relevant local preference references before creating or modifying Markdown.
- MUST treat `assertion` as a single reviewable semantic judgment, not as proof of correctness.
- MUST treat each `.md` file as a `module`.
- MUST preserve module boundary: one module owns the assertions it should carry and rejects assertions outside that responsibility.
- MUST use frontmatter metadata for sayoriqwq-style docs unless a higher-priority rule forbids it.
- MUST choose `audience` before choosing pattern-heavy or description-heavy writing.
- MUST use simplified Chinese as the main content language.
- SHOULD use short English words or phrases for section names.
- SHOULD prefer OFM wiki links when the target documentation system supports them.
- SHOULD keep path and filename short, scoped, and non-redundant.

Hard:

- Run `pnpm generate:check` after changing projected references, dispatcher inputs, generated projection targets, or skill metadata.
- Run `pnpm verify` before finishing repo changes.

## Effects

- Conversation: MAY show `🎼 score`, applied preference blocks, preference conflict, and verification result.
- Filesystem: MAY create or update Markdown docs, wiki documentation nodes, skill-local projected references, and directly required generated projections.
- External: none.

## Workflow

1. Read the local preference references relevant to the Markdown surface being created or modified.
2. Identify the target module and its boundary.
3. Choose or maintain metadata, especially `audience`, before shaping the body.
4. Organize assertions under sections; keep headings as section openers rather than assertions.
5. Apply language、keywords、pattern、path 和 links preferences.
6. Run required checks for the changed surface, or report the exact blocker.

## References

- Read [assertion](references/assertion.md) for reviewable semantic judgments.
- Read [module](references/module.md) for `.md` file scope.
- Read [boundary](references/boundary.md) for single-responsibility module boundaries.
- Read [section](references/section.md) for heading-opened local contexts.
- Read [language](references/language.md) for Chinese body and English section naming.
- Read [keywords](references/keywords.md) for normative keyword strength.
- Read [metadata](references/metadata.md) for frontmatter fields.
- Read [audience](references/audience.md) before choosing pattern-heavy or description-heavy writing.
- Read [pattern](references/pattern.md) for agent-facing structures.
- Read [path](references/path.md) for index and short scoped filenames.
- Read [links](references/links.md) for OFM-first linking.

## Validation

Before done:

- `🎼 score` is visible when this skill is active;
- the target surface is Markdown;
- relevant local preference references were applied;
- metadata, audience, module boundary, sections, assertions, language, keywords, pattern, path, and links were handled when the change touched them;
- no non-Markdown prose polish, product copy, workflow skill, primitive skill, skill patch, code comment, commit message, PR description, or issue reply was performed by `score`;
- Effects stayed within the declared filesystem scope;
- required Hard checks passed, or exact blockers were reported.
