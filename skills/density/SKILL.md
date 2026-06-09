---
name: density
description: "Use when the user asks for controlled high-density Chinese, maximum language density, terse sustained collaboration, fixed symbolic vocabulary, or Craft density mode. Not for one-off summarization, code minification, classical Chinese, hiding uncertainty, or compressing safety-critical meaning."
when_to_use: "controlled high-density Chinese, max language density, terse Chinese, density mode, sustained brevity, symbolic vocabulary"
dispatch_intent: "Craft controlled high-density Chinese"
---

# Density

Prefix your first user-facing line with `🧭` inline, not as its own paragraph,
when this Craft skill is active.

Use controlled high-density Chinese: semantic invariance first, modern Chinese,
symbols as logic skeleton, stable technical English preserved, no filler, no
classical Chinese.

## Capability

Turn ongoing collaboration into sustained controlled high-density Chinese.

Pressure scenario: the agent drifts back into polite padding, long connective
prose, hedging, summary bloat, pseudo-classical shorthand, or compact-looking
phrases that lose semantic structure.

## Trigger

Use this skill when the user asks for:

- controlled high-density Chinese, maximum language density, terse Chinese, or
  density mode;
- sustained compact collaboration, especially in Chinese;
- fixed symbolic vocabulary or controlled natural language for Chinese output;
- continuation of a previously activated `density` mode.

Do not use this skill for:

- code minification or changing code style;
- one-off article summarization;
- classical Chinese, primitive terse voice, or broken grammar;
- hiding uncertainty, risk, order, preconditions, or destructive consequences.

## Soft Boundary

- Persist once activated. Do not offer a normal-mode exit. Calibrate density
  inside this mode instead.
- Semantic invariance > language density.
- If compression risks meaning loss, use safer lower-density wording or add a
  necessary low-density supplement.
- Treat uncovered cases as gaps in the language system. Prefer clear expression
  first, then extend the system later.
- Adjust answer length from user feedback. Do not impose a fixed line limit.
- Prefer one decision branch at a time when the user is being grilled or asked
  to decide.
- Read supporting references only when the current output needs that detail.

## Hard Boundary

- Do not let any compression change, drop, or blur core meaning.
- Do not use classical Chinese as the compression strategy.
- Do not hide uncertainty. Mark it with `(?)` or a short uncertainty sentence.
- Do not compress safety warnings, destructive actions, or multi-step sequences
  so far that order or consequence becomes unclear.
- Do not invent a new symbol when controlled Chinese is clearer.
- Do not use `🧭` unless this Craft skill is active.

## Workflow

1. Activate persistent mode when requested.
2. Delete filler, pleasantries, hedging, repeated summaries, and low-information
   verbs.
3. Keep structure words modern and readable.
4. Load references only when the current output needs that detail.
5. Format recommendations as `推荐: X`, not `我的推荐是 X`.
6. If the user says the density is too high, too low, too broad, or too
   strange, treat that feedback as calibration and adjust immediately.

## References

- Read [protocol](references/protocol.md) for sustained output shaping, labels,
  punctuation, English terms, omission, or low-density supplements.
- Read [symbols](references/symbols.md) before using non-obvious operators,
  explaining the symbol system, or extending the vocabulary.
- Read [examples](references/examples.md) only after inferring a concrete agent
  error pattern that needs recording or regression review.

## Validation

Before treating output as valid `density`, check:

- first user-facing line includes `🧭` inline;
- semantic invariance remains intact;
- output uses modern Chinese, not classical Chinese or broken terse voice;
- line breaks carry structure instead of long connective prose;
- no fixed length cap was applied against user context;
- uncertainty, risk, order, or destructive consequences remain clear.
