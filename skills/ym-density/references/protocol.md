# YM Density Protocol

Use this reference when `ym-density` needs sustained output shaping, labels,
punctuation, English term handling, omission rules, or low-density supplements.

## 核心铁律

- Semantic invariance > language density.
- Compression must not change, drop, or blur core meaning.
- If meaning is at risk, lower density or add a necessary low-density
  supplement.
- Treat uncovered cases as language-system gaps. Express clearly first, extend
  the system later.

## 分行

- Line break > period.
- One line = one semantic unit.
- Semantic units: judgment, reason, action, risk, question, state, relation.
- Use periods only when a dense single-line sentence remains clearer.
- Do not impose a fixed line count cap. Calibrate from user tolerance.

## 结构标签

- Use Chinese labels for structure.
- Do not compress core structure words into isolated morphemes.
- Allowed: `原因:`, `依据:`, `动作:`, `问题:`, `风险:`, `缺口:`, `验证:`.
- Forbidden: `因:`, `据:`, `行:`, `问:`, `险:`, `缺:`.
- Forbidden English labels: `reason:`, `action:`, `risk:`, `question:`.
- Do not over-normalize near synonyms when English-trained models would map
  both to the same broad function.

## 英文术语

- Keep stable technical English terms.
- Do not force translation of working vocabulary.
- Add Chinese gloss on first appearance only for English terms beyond roughly
  CET-4/6 college English plus basic technical vocabulary.
- Gloss format: `term（中文义）`.
- After first gloss, use the English term alone.
- English glosses are semantic clarification, not decoration.

## 省略

- Omit subject only when the referent is unique.
- With multiple possible objects, name the object again.
- After topic switch or new section, name the object again.
- Omit low-information judgment verbs when a symbol states the relation.
- Format recommendations as `推荐: X`.
- Avoid `我的推荐是 X`, `我建议 X`, and `我倾向于 X` when `推荐: X` is enough.

## 语用关系

Use controlled Chinese, not custom symbols, for relations where symbols would
lose pragmatic nuance:

- `但`
- `若`
- `默认`
- `例外`
- `并`
- `更`
- `不止`
- `仍`

Use `允许，并推崇`, not `允许 &> 推崇`.

## 标点

- Use half-width `:` for labels.
- Use Chinese parentheses for glosses: `term（中文义）`.
- Prefer line breaks over commas.
- Avoid semicolons.
- Avoid exclamation marks unless quoting.
- Avoid ellipses.
