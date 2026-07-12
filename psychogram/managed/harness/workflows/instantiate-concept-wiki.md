# Workflow: Instantiate Concept Wiki

## Purpose

从 `template/` 复制并填充一个新的独立 concept wiki。

## Read first

1. [[../glossary]]
2. [[../lead]]
3. [[design-concept-wiki]]
4. [[../agents/roles/template-architect]]
5. `template/AGENTS.md`

## Steps

1. 创建目标 wiki 目录，通常在 psychogram repo 之外；fixture output 除外。
2. 复制 `template/` 的结构。
3. 用目标概念替换 placeholder 文案。
4. 填写 README、AGENTS、glossary、index、log、guide 和 `wiki/lead.md`。
5. 按概念需要创建初始 concepts、claims、questions、tensions。
6. 确认 agent workflows 位于 `agents/workflows/`。
7. 确认内容区 `wiki/` 只保存概念内容。

## Done when

- 新 wiki 可独立打开和阅读。
- 不依赖 psychogram harness 才能理解。
- 没有继承 fixture-specific 内容。

## Related

- [[design-concept-wiki]]
- [[update-template]]
- [[../concepts/instance]]
