---
name: setup-research-area
description: "Use when setting up or migrating a repo-local research area after the user provides a research topic and user-owned core frame. Not for ordinary product docs, engineering issue tracker setup, one-off writing, or when the topic/frame is missing."
when_to_use: "research area setup, research harness, source authority, core frame, OFM docs, learning layer, root mainline, long-running research"
dispatch_intent: "Research area harness setup"
---

# Setup Research Area

Prefix your first user-facing line with `🧭` inline, not as its own paragraph,
when this Craft skill is active.

Set up one repo as one long-running research area. This is a prompt-driven setup
skill: explore the repo, validate the user's topic and core frame, present the
migration, then write. Do not silently invent the research frame.

## Capability

Create or migrate a repo-local research harness for long-running learning,
research, or note-taking around a user-owned topic and frame.

Pressure scenario: the agent starts producing folders, reports, or research
notes from a vague topic, then invents the organizing questions, authority
model, or writing rules. The repo becomes a pile of documents instead of a
durable research area with a clear source chain and root mainline.

## Trigger

Use this skill when:

- the user asks to set up or migrate a repo as a research area;
- the user provides a research topic and a core frame, usually 3 to 5 main
  questions or an equivalent structure;
- the desired output includes source authority, synthesis/comparison layers,
  OFM writing rules, `report.md`, `next-step.md`, and harness docs.

Do not use this skill when:

- the user has not supplied both a research topic and core frame;
- the work is ordinary product docs, engineering issue tracker setup, or
  one-off writing;
- the user only wants notes, summaries, source reading, or a report without a
  durable repo harness;
- the frame is agent-invented rather than user-owned.

## Soft Boundary

Validate the core frame before writing:

- it is about the stated topic;
- it is long-running, not a one-off task list;
- items have clear separation;
- docs can be classified as answering or supporting at least one frame item.

Use repo evidence instead of asking when the answer is discoverable. If the
existing repo already has an equivalent research-area form, migrate or update
that form instead of creating parallel contracts.

## Hard Boundary

- If the research topic or core frame is missing, stop. Tell the user setup
  cannot run yet and ask for the missing input. You may recommend a separate
  framing pass before rerunning setup, but do not generate harness files.
- OFM is mandatory. Do not ask whether to use OFM.
- Do not create a `presentation/` directory or extra presentation files by
  default. The root mainline is `report.md` plus `next-step.md`.
- Setup is intended to run once per research area. If the repo already has an
  older harness, migrate fully instead of leaving parallel contracts.
- Do not overwrite unrelated user-authored docs. If removal would delete
  content that is not part of the old harness, stop and ask.
- Do not reuse engineering issue tracker or triage files as research-area
  harness files.

## Workflow

1. Confirm the user supplied both research topic and core frame. If either is
   missing, stop before writing.
2. Read the current repo before writing, including relevant existing files:
   `AGENTS.md`, `CLAUDE.md`, `CONTEXT.md`, root `index.md`, `report.md`,
   `next-step.md`, `docs/index.md`, existing `docs/harness/`, learning-layer
   indexes, `docs/adr/`, `.scratch/`, and old setup files such as
   `docs/agents/`, `docs/agent-memory-structure.md`,
   `docs/document-writing.md`, or `docs/user-context.md`.
3. Present the migration shape when the repo already has docs or an older
   harness. Remove obsolete old-harness authority only when it contains no
   unrelated user-authored content.
4. Set up these facilities unless the existing repo already has an equivalent
   research-area form:
   - a short `## Research area harness` entry in `AGENTS.md` or the repo's
     existing agent instruction file;
   - `CONTEXT.md` for current topic, frame summary, boundaries, root mainline,
     and harness entry;
   - `docs/harness/index.md` as the harness reading path;
   - `docs/harness/research-area.md` for mission, setup invariants, and drift
     boundary;
   - `docs/harness/core-frame.md` for the user-supplied frame;
   - `docs/harness/authority.md` for knowledge authority and repo execution
     authority;
   - `docs/harness/learning-layer.md` for source, synthesis, comparison, maps,
     ADR, and scratch contracts;
   - `docs/harness/root-mainline.md` for `report.md`, `next-step.md`, root
     index, and docs index roles;
   - `docs/harness/writing.md` for OFM and prose rules;
   - `docs/harness/workflow.md` for the per-turn work loop and self-review;
   - `docs/harness/user-context.md` for user profile and feedback updates;
   - root `index.md`, `docs/index.md`, `report.md`, and `next-step.md`;
   - `docs/sources/index.md`, `docs/synthesis/index.md`,
     `docs/comparisons/index.md`, and `docs/maps/index.md`;
   - `docs/adr/README.md` and `.scratch/README.md`.
5. Write the authority model into the harness:
   - knowledge authority: original source material, repo source layer,
     synthesis/comparison, then root mainline;
   - repo execution authority: current user instruction, current repo harness,
     current repo files, durable user context, then older memory or model
     knowledge.
6. Keep the root instruction file short. Put durable detail in `docs/harness/`.
   Each harness doc has one job, and every formal content layer under `docs/`
   has an `index.md` reading path.
7. When migrating from Matt Pocock engineering skill setup, remove
   `docs/agents/` only if it contains issue tracker, triage label, or domain-doc
   configuration that is no longer needed. Remove the `## Agent skills` block
   only if it describes that setup.
8. Before finishing, run the validation checks below and summarize changed
   files.

## Validation

Before treating setup as complete, verify:

- the first user-facing line includes `🧭` inline;
- stale old-harness links were searched;
- `docs/agents`, `Agent skills`, `mattpocock`, old frame paths, and old
  writing-rule paths were searched;
- changed docs contain no em dash or en dash;
- `report.md` and `next-step.md` still exist;
- `docs/harness/index.md` links every harness file;
- each formal learning layer has an `index.md`;
- no `presentation/` directory was created by default;
- `git status --short` was run and changed files were summarized;
- final report names the research topic, core frame location, root mainline,
  and source authority location.
