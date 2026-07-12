# Instance

## Definition

Instance 是真实生成出来、可以独立存在的 concept wiki。

## Is not

Instance 不是 fixture，也不应该依赖 psychogram repo 的 fixture 目录才能理解。

## Role in psychogram

Instance 是 psychogram 面向真实使用的产物。它应能被单独打开、阅读、维护和投射。

## Common confusions

- Fixture output 可以像 instance，但用途是测试。
- Instance 的领域内容不应回流到 harness 或 template。

## Related

- [[concept-wiki]]
- [[fixture]]
- [[template]]
- [[../workflows/instantiate-concept-wiki]]
