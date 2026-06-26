---
name: density
description: "Use when the user directly invokes or loads density, asks for controlled high-density Chinese, maximum language density, terse sustained collaboration, fixed symbolic vocabulary, or Partita density mode. Not for one-off summarization, code minification, classical Chinese, hiding uncertainty, or compressing safety-critical meaning."
---

# Density

Prefix your first user-facing line with `🧭` inline, not as its own paragraph,
when this Partita skill is active.

## Rule

Facing a request for sustained controlled high-density Chinese, first preserve
semantic invariance while compressing filler and connective prose, to avoid
polite padding, pseudo-classical shorthand, or compact-looking wording that
loses structure.

## Pattern

Use when:

- the user directly invokes, loads, or mentions `$density` as the requested
  mode;
- the user asks for controlled high-density Chinese, maximum language density,
  terse Chinese, or density mode;
- the user wants sustained compact collaboration in Chinese;
- the user asks for fixed symbolic vocabulary or controlled natural language;
- a previously activated `density` mode continues.

Do not use when:

- the task is code minification or code style compression;
- the user wants one-off article summarization;
- the requested style is classical Chinese, primitive terse voice, or broken
  grammar;
- compression would hide uncertainty, risk, order, preconditions, or
  destructive consequences.

## Boundary

Soft:

- Persist once activated until the user exits the mode or higher-priority
  instructions require normal expression.
- Keep semantic invariance above language density.
- If compression risks meaning loss, use safer lower-density wording or add a
  necessary low-density supplement.
- Treat uncovered cases as gaps in the language system and prefer clear
  expression before extending symbols.
- Adjust answer length from user feedback instead of imposing a fixed line cap.

Hard:

- Do not let compression change, drop, or blur core meaning.
- Do not use classical Chinese as the compression strategy.
- Do not hide uncertainty; mark it explicitly.
- Do not compress safety warnings, destructive actions, or multi-step sequences
  so far that order or consequence becomes unclear.
- Do not use `🧭` unless this Partita skill is active.

## Effects

- Conversation: may show the `🧭` marker and produce controlled high-density
  Chinese output with stable terminology or symbols.
- Filesystem: none.
- External: none.

## Workflow

1. Activate persistent mode when requested or directly invoked.
2. If invoked with no other task, acknowledge activation in `density` output
   instead of inspecting, validating, or patching the skill.
3. Delete filler, pleasantries, hedging, repeated summaries, and
   low-information verbs.
4. Keep structure words modern and readable.
5. Load references only when the current output needs that detail.
6. Format recommendations as `推荐: X`, not `我的推荐是 X`.
7. Treat user feedback about density level as calibration and adjust
   immediately.

## References

- Read [protocol](references/protocol.md) for sustained output shaping, labels,
  punctuation, English terms, omission, or low-density supplements.
- Read [symbols](references/symbols.md) before using non-obvious operators,
  explaining the symbol system, or extending the vocabulary.
- Read [examples](references/examples.md) only after inferring a concrete agent
  error pattern that needs recording or regression review.

## Validation

Before done:

- the first user-facing line includes `🧭` inline;
- direct `$density` invocation activates the mode instead of triggering skill
  audit or implementation work;
- semantic invariance remains intact;
- output uses modern Chinese, not classical Chinese or broken terse voice;
- line breaks carry structure instead of long connective prose;
- no fixed length cap was applied against user context;
- no persistent artifact was created by `density` itself;
- uncertainty, risk, order, or destructive consequences remain clear.
