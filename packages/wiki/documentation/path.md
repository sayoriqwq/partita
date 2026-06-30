---
audience: [agent, human]
authors:
  - codex
reviewed_by:
  - sayori
purpose: 定义 index 和 path 如何表达 module 集合导航与 scope。
status: active
sources: []
updated: 2026-06-27
---

# Path

## Index

`index` 是 module 集合的导航 module。

`index.md` SHOULD 只负责导航和最小上下文。

index SHOULD 链接同层或下层 modules。

index SHOULD NOT 吞并被链接 module 的正文职责。

如果 index 开始承载规则、历史、流程或偏好正文，应该拆出独立 module。

大目录 SHOULD 拆分 index，而不是把所有内容压进一个巨型 index。

## Path

`path` 是 module 所处 scope 和职责命名的载体。

文件夹组织形态代表 scope。

文件名 SHOULD 在当前目录 scope 内命名，不重复父级 scope。

SHOULD 避免 `name/name.md`、`name/name-concept.md` 这类重复命名。

module boundary 清楚时，文件名通常 SHOULD 能用一个短词或短连词表达。

文件名 SHOULD 短，不用句子式标题。

文件名 SHOULD 表达职责，不表达临时状态或作者习惯。
