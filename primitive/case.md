# Case

## Definition

`case` 是 evidence-anchored governance sample。

在 Partita 中，case 记录一次真实发生、或能被材料直接证明的 agent 失控情境：在没有目标治理时，agent 会以某种可复发方式失败或漂移。

case 的目的不是证明作者想要某功能，而是让 governance grounded、retrievable、reviewable 和 recurrence-resistant。

case 不是假设场景、抽象愿望、功能分类、普通示例、implementation plan 或完整 design rationale。

合法 case MUST 说明：

- 观察到或由材料直接证明的情境；
- agent 在没有目标治理时的 default failure；
- 为什么该 failure 形成足够的治理压力；
- 未来相似情境应该靠什么 surface 被识别和召回；
- 目标治理应该在何处改变 agent 行为。

## Kinds

`skill case` 用于创建单一 case-rooted skill。

`workflow case` 用于创建 public workflow skill。

`patch case` 用于修补已有且 identity 成立、但局部 stale surface 已暴露的 skill。

`case feedback` 用于把真实 recurrence 写回 target skill references，加强召回和防复发；如果 recurrence 暴露治理规则缺口，应升级为 patch case。

## Fields

### Skill Case

最小 `skill case`：

```yaml
case:
  kind: skill
  evidence:
    source: repo-relative path / skill-relative path / stable handle / conversation turn / issue link
    note: 可选的最小摘录或材料说明
  situation: 真实发生或由材料直接证明的情境
  default_failure: agent 无 skill 治理时会怎样失败
  pressure: 为什么该失败值得被治理固化
  recognition:
    triggers:
      - 未来应该召回该 case 的信号
    non_triggers:
      - 可选；看起来相似但不应召回的边界
  governance_action: skill 应该在何处改变 agent 行为
```

### Workflow Case

最小 `workflow case`：

```yaml
case:
  kind: workflow
  evidence:
    source: repo-relative path / skill-relative path / stable handle / conversation turn / issue link
    note: 可选的最小摘录或材料说明
  situation: 真实发生或由材料直接证明的情境
  default_failure: agent 无 workflow 治理时会怎样失败或漂移
  workflow_pressure:
    gate: 哪些阶段判断会失败或缺失
    routing: 哪些内部 skill、步骤或子流程会误用、漏用或乱序
    disclosure: 哪些过程、状态或结果会错误展示或隐藏
  recognition:
    triggers:
      - 未来应该召回该 case 的信号
    non_triggers:
      - 可选；看起来相似但不应召回的边界
  orchestration_action: workflow 应该怎样改变 agent 行为
```

`workflow_pressure.gate`、`workflow_pressure.routing` 和 `workflow_pressure.disclosure` 至少一个 MUST 成立；agent MUST NOT 为了填字段编造不存在的 pressure。

### Patch Case

最小 `patch case`：

```yaml
case:
  kind: patch
  target_skill: 要修补的已有 skill
  evidence:
    source: repo-relative path / skill-relative path / stable handle / conversation turn / issue link
    note: 可选的最小摘录或材料说明
  situation: 真实发生或由材料直接证明的情境
  stale_behavior: target skill 现在怎样失败
  pressure: 为什么该 stale behavior 值得修补
  recognition:
    triggers:
      - 未来应该召回该 patch case 的信号
    non_triggers:
      - 可选；看起来相似但不应召回的边界
  expected_governance: 应该怎样防止复发
```

### Case Feedback

最小 `case feedback`：

```yaml
case:
  kind: feedback
  target_skill: 要写回 recurrence 的 skill
  evidence:
    source: repo-relative path / skill-relative path / stable handle / conversation turn / issue link
    note: 可选的最小摘录或材料说明
  recurrence: 哪个失败再次发生
  matched_surface: 复发对应的已有 case、rule 或 stale surface
  feedback_action: 写回 references、examples、anti-examples、trigger notes，还是升级为 patch case
  patch_required: true | false
```

## Use

`kind` 决定 case 被路由到 skill creation、workflow creation、skill patch 或 feedback writeback。

case core 决定材料是否足以称为有效 case。

case use 决定它如何改变 skill system：create、patch、reference、recurrence record 或 reject。

## Non-Cases

以下不是 case：

- feature request：用户希望 agent 支持某能力；
- abstract goal：agent should be more rigorous；
- category label：skill authoring、code review、writing；
- generic example：for example, when users ask for a skill；
- 没有 evidence anchor 的 hypothetical scenario；
- implementation plan；
- complete design rationale；
- isolated bad output，且上下文不足以识别 default failure。

Hypothetical scenario MAY 成为 test fixture，但 MUST NOT 被提升为 case，除非有 observed material 支撑，或被明确标记为 synthetic。

## Rules

- agent MUST NOT 编造 case。
- case MUST 有 evidence anchor；不能审计来源的材料不能伪装成经验样本。
- 材料不能读出目标 case kind 的最小字段时，agent MUST 打回、请求更多 evidence，或改判到正确 case kind。
- case SHOULD 只承载一个 primary pressure 或 stale surface。
- pressure SHOULD 指向 recurrence、cost、boundary、trust、safety 或 semantic drift；MUST NOT 只写“影响质量”这类空泛愿望。
- recognition SHOULD 给出 retrieval surface，帮助未来相似情境召回该 case。
- governance action SHOULD 描述治理介入点，MUST NOT 承载完整 skill spec 或完整执行流程。
- case SHOULD 使用 repo-relative path、skill-relative path、stable handle、conversation turn 或 issue link 描述 evidence。
- case MAY 引用本机绝对路径，仅当该路径本身是 evidence 的关键事实。
