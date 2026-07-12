# Glossary

## Psychogram
**Is:** 一个生成、维护、测试和投射 concept wiki 的通用 harness。  
**Is not:** 某个具体概念的 wiki、业务 wiki、Obsidian 模板本身。  
**Location / Page type:** 系统整体；见 [[concepts/harness]]。

## concept wiki
**Is:** 围绕一个概念生成的独立 Markdown wiki。  
**Is not:** 多个无关主题混合的大库。  
**Location / Page type:** 生成产物；见 [[concepts/concept-wiki]]。

## harness
**Is:** psychogram 本体，保存通用规则、workflow、page type、agent role 和 fixture lint 标准。  
**Is not:** fixture output 或具体 concept 内容。  
**Location / Page type:** `harness/`；见 [[concepts/harness]]。

## template
**Is:** 生成 concept wiki 的 domain-neutral 空骨架。  
**Is not:** 样例 wiki、fixture output、具体领域页面集合。  
**Location / Page type:** `template/`；见 [[concepts/template]]。

## fixture
**Is:** 用来测试 psychogram 的样例输入、输出和观察。  
**Is not:** harness 内容来源。  
**Location / Page type:** `fixtures/`；见 [[concepts/fixture]]。

## instance
**Is:** 真实生成出来、可以独立存在的 concept wiki。  
**Is not:** fixture，也不应该依赖 psychogram repo 才能阅读。  
**Location / Page type:** 外部生成产物；见 [[concepts/instance]]。

## projection
**Is:** 把 harness 规则适配到具体 runtime 的说明或生成目标。  
**Is not:** harness source of truth。  
**Location / Page type:** `projections/`；见 [[concepts/projection]]。

## page type
**Is:** concept wiki 中稳定承载某类语义的页面类型。  
**Is not:** 任意目录扩张。  
**Location / Page type:** 由 harness 定义，template 提供空位；见 [[concepts/page-type]]。

## lead
**Is:** wiki 或 harness 的入口页，说明中心、边界和读法。  
**Is not:** 全量目录。  
**Location / Page type:** `lead.md`；见 [[concepts/lead]]。

## guide
**Is:** 面向作者的阅读和 re-entry 层。  
**Is not:** agent runtime 配置。  
**Location / Page type:** `guide/`；见 [[concepts/guide]]。

## claim
**Is:** 对 harness 或 concept wiki 结构有治理作用的承重主张。  
**Is not:** 任意一句判断。  
**Location / Page type:** `claims/`；见 [[concepts/claim]]。

## assertion
**Is:** 页面正文中的句子级判断。  
**Is not:** 默认需要建页的一等类型。  
**Location / Page type:** 页面正文；见 [[concepts/assertion]]。

## question
**Is:** 会影响结构、维护或投射的开放问题。  
**Is not:** 普通待办。  
**Location / Page type:** `questions/`；见 [[concepts/question]]。

## tension
**Is:** 两个合理需求之间的持续取舍。  
**Is not:** 普通问题或 bug。  
**Location / Page type:** `tensions/`；见 [[concepts/tension]]。

## workflow
**Is:** agent 可执行的维护流程。  
**Is not:** 概念内容本身，除非某个 generated wiki 的主题正在讨论 workflow。  
**Location / Page type:** harness workflow 在 `harness/workflows/`，generated wiki 的 agent workflow 在 `agents/workflows/`；见 [[concepts/workflow]]。

## agent role
**Is:** agent 在某类维护任务中的职责、读写范围和完成标准。  
**Is not:** 必然等同于 runtime subagent。  
**Location / Page type:** `agents/roles/`；见 [[concepts/agent-role]]。

## staging
**Is:** generated wiki 内部的短期吸收区。  
**Is not:** harness 的知识层或长期 capture 层。  
**Location / Page type:** `template/_staging/current.md`；见 [[concepts/staging]]。

## index
**Is:** 内容导向 catalog。  
**Is not:** 时间线。  
**Location / Page type:** `index.md`；见 [[concepts/index]]。

## log
**Is:** 语义演化时间线。  
**Is not:** git diff。  
**Location / Page type:** `log.md`；见 [[concepts/log]]。
