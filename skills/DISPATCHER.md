---
name: partita
description: "Dispatcher for user-defined Partita workflow skills. Use when a Partita skill exists for the user's request. Not for generic work when no matching skill has been defined."
---

# Partita Dispatcher

Partita is a CLI-backed Codex skill harness for user-defined workflow skills. Match only
against skills that exist in the routing table.

## Routing Table

<!-- partita:projection:start id="routing-table" source="skills" mode="block-table" -->
| Handle | Name | Invocation | Description | File |
|--------|------|------------|-------------|------|
| density | density | false | Use when the user directly invokes or loads density, asks for controlled high-density Chinese, maximum language density, terse sustained collaboration, fixed symbolic vocabulary, or Partita density mode. Not for one-off summarization, code minification, classical Chinese, hiding uncertainty, or compressing safety-critical meaning. | `skills/density/SKILL.md` |
| land | land | true | Use when the user wants to keep a first version or current topic from expanding before it is landed, especially after they name a v1 landing topic. Blocks scope expansion and asks whether the new point is necessary for v1 or off-topic. Not for open brainstorming, later-version planning, ordinary aim drift warnings, or when no landing topic exists yet. | `skills/land/SKILL.md` |
| og:aim | aim | false | Use when the user explicitly asks to set, reset, sustain, or check the current conversation aim or asks for visible alignment against a current direction. Not for formal goals, task planning, decision making, baseline snapshots, ordinary summaries, or implicit drift policing. | `skills/orientation/aim/SKILL.md` |
| og:argue | argue | false | Use when the user explicitly asks to argue, challenge, or pressure-test an unstable assertion under the current aim before treating it as a premise. Not for ordinary implementation, code review, blank-page brainstorming, expanding a vague seed, recording consensus, settled decisions, harmless preferences, or adversarial debate. | `skills/orientation/argue/SKILL.md` |
| og:baseline | baseline | false | Use when the user explicitly asks to record, capture, or summarize the accepted consensus since the current conversation aim began. Not for setting aims, maintaining direction, unresolved questions, decision making, meeting notes, durable documentation, or ordinary summaries. | `skills/orientation/baseline/SKILL.md` |
| pin | pin | true | Use when the user asks to pin an external repository or source repo into the current repository as a durable tracked source with locator, manifest, update path, and verification. Not for Effect-specific harness setup, package-version pinning only, UI/thread pinning, or copying source without provenance. | `skills/pin/SKILL.md` |
| pm:conduct | conduct | false | Use when creating a public workflow skill from a real workflow case with gate logic, internal skill routing, disclosure boundary, and target runtime shape. Defaults to OpenAI/Codex skill target; in Partita landing creates a public workflow source skill. Not for case-rooted non-workflow skill creation, patching existing skills, running workflows, abstract workflow wishes, or verifier implementation. | `skills/primitive/conduct/SKILL.md` |
| pm:notate | notate | false | Use when creating a case-rooted OpenAI/Codex skill from a real case with enough material for default failure, pressure, governance action, and target runtime shape. In Partita landing, creates a Partita primitive source skill. Not for public workflow skill creation, patching existing skills, abstract capability requests, hypothetical scenarios, or verifier implementation. | `skills/primitive/notate/SKILL.md` |
| pm:retune | retune | false | Use when patching an existing identity-valid OpenAI/Codex skill from a real recurrence case that exposes a stale local surface. In Partita landing, patches an existing valid Partita source skill. Not for creating new skills, structure audits without a patch case, identity-invalid skills, external skill migration, ordinary code review, or prose cleanup. | `skills/primitive/retune/SKILL.md` |
| pm:score | score | true | Use when creating or modifying Markdown docs that should follow sayoriqwq-style Markdown writing preferences. Not for non-Markdown prose, product copy, release notes, social posts, translation, localization, code comments, commit messages, skill creation, workflow creation, or skill patching. | `skills/primitive/score/SKILL.md` |
| reconcile | reconcile | true | Use when the user has finished a task phase and wants a semantic residue audit against the current topic, source document, or accepted framing. Lists suspicious stale or migration-era code/docs before repair. Not for general cleanup, formatting, ordinary code review, bug finding, or unapproved deletion. | `skills/reconcile/SKILL.md` |
| setup-effect-area | setup-effect-area | true | Use when the user asks to set up, update, verify, or repair a TypeScript/Effect target repository against effect-harness runtime and CLI contracts. Not for updating effect-harness itself, generic repo pinning, writing Effect business features, or defining Partita skill semantics. | `skills/setup-effect-area/SKILL.md` |
| update-effect-harness | update-effect-harness | true | Use when the user asks to update effect-harness itself to the latest official Effect source pin, package baseline, or self-update workflow. Not for setting up an Effect target repo, generic repo pinning, writing Effect application code, or one-off dependency bumps outside effect-harness. | `skills/update-effect-harness/SKILL.md` |
<!-- partita:projection:end id="routing-table" -->

## How This Works

1. Read the user's message.
2. If the routing table has a matching skill, read that skill file.
3. If no skill matches, do normal agent work and do not invent a skill.

Skills chain manually, not automatically.
