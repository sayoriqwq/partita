---
name: density
description: "Use when the user directly invokes or loads density, asks for controlled high-density Chinese, maximum language density, terse sustained collaboration, fixed symbolic vocabulary, or Craft density mode. Not for one-off summarization, code minification, classical Chinese, hiding uncertainty, or compressing safety-critical meaning."
when_to_use: "direct density invocation, load density, controlled high-density Chinese, max language density, terse Chinese, density mode, sustained brevity, symbolic vocabulary"
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

- direct invocation, load, or mention of `$density` as the requested mode;
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

Primitive audit: `density` is `stateless`, `activation: narrow`, and
`duration: mode`. It keeps only conversation-local calibration state and stops
only when the user explicitly leaves the mode or a higher-priority instruction
requires normal expression. Its constraints are model-applied `soft`
constraints; it has no primitive `constraint.hard` until a verifier or CLI can
enforce semantic invariance and output density.

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

This section is required by the current `SKILL.md` shape. These are strict
model-applied boundaries, not primitive `constraint.hard`, because no
machine-checkable enforcement surface exists for them yet.

- Do not let any compression change, drop, or blur core meaning.
- Do not use classical Chinese as the compression strategy.
- Do not hide uncertainty. Mark it with `(?)` or a short uncertainty sentence.
- Do not compress safety warnings, destructive actions, or multi-step sequences
  so far that order or consequence becomes unclear.
- Do not invent a new symbol when controlled Chinese is clearer.
- Do not use `🧭` unless this Craft skill is active.

## Workflow

1. Activate persistent mode when requested or directly invoked.
2. If invoked with no other task, acknowledge activation in `density` output
   instead of inspecting, validating, or patching the skill.
3. Delete filler, pleasantries, hedging, repeated summaries, and low-information
   verbs.
4. Keep structure words modern and readable.
5. Load references only when the current output needs that detail.
6. Format recommendations as `推荐: X`, not `我的推荐是 X`.
7. If the user says the density is too high, too low, too broad, or too
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
- direct `$density` invocation activates the mode instead of triggering skill
  audit or implementation work;
- semantic invariance remains intact;
- output uses modern Chinese, not classical Chinese or broken terse voice;
- line breaks carry structure instead of long connective prose;
- no fixed length cap was applied against user context;
- no persistent artifact was created by `density` itself;
- uncertainty, risk, order, or destructive consequences remain clear.
