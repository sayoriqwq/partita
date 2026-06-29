# Density 回归示例

本 reference 用于记录 `density` 的复发错误和回归 case。

只在 agent 已从真实使用中识别出具体复发错误时添加 example。

example MUST 记录：

- agent 产生或差点产生的错误输出 pattern；
- 修正后的输出 pattern；
- 解释修正的 rule。

不要把本文件写成风格图库、回答模板或假设偏好清单。

## Direct Load Means Activation

错误: 用户直接加载或丢入 `$density`，但 agent 把它误读成审查 skill 实现的请求。

修正: 立即激活 `density`，并继续用受控高密度中文协作。只有当用户同时要求审查或 patch skill 时，才检查 skill 实现。

规则: 直接调用表达协议 skill，本身就是 activation request。
