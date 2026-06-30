# Orchestrator

`orchestrator skill` 组织 workflow context，并调用 primitive skills。

它可以识别 current gate、检查 gate assets、选择 matching pressures，并管理 gate spans。

它 MUST NOT 把 primitive pressure、boundary 或 validation 吸收到一个大 body 中。

orchestrator 或 public workflow skill 仍然需要自己的 rule。

它的 governance action 是 orchestration，不是它 route 到的 primitive actions。

参见 [[workflow/orchestration]] 和 [[skill/primitive]]。
