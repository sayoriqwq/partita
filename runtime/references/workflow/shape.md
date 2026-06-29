# Workflow

## Definition

`workflow skill` 是把多个内部判断、技能或步骤按固定 gate logic 组合起来，并向用户暴露一个稳定入口的 skill。

## Terms

- `workflow A/Y/X` 是 workflow rule 的压缩形态：面对 A，先做 Y，避免 X。
- `gate logic` 是 workflow 在每个阶段判断是否进入、继续、停止、转交或打回的规则。
- `internal skill routing` 是 workflow 选择内部 skill、步骤或子流程的规则。
- `disclosure boundary` 是 workflow 对用户展示多少内部过程、判断、状态和结果的边界。
- `public workflow skill` 是用户可直接调用的 workflow runtime skill。

## Rules

- workflow skill MUST 有自己的 governance rule。
- workflow skill MUST NOT 变成松散的 internal skills bundle。
- workflow skill MUST 先定义 gate logic，再定义 internal routing。
- workflow skill MUST 定义什么展示给用户，什么保持 internal。
- workflow skill MUST 定义完成前可检查的 validation。
- 无法识别 workflow default failure、gate logic、routing 和 disclosure boundary 的材料 MUST 被打回。
