---
adr: 0024
title: "Keep rule files in `.rules/` for LLM teammates"
status: accepted
date: 2026-04-18
tags: [process, ai]
supersedes: null
superseded_by: null
---

# ADR 0024 — Keep rule files in `.rules/` for LLM teammates

## Context

Working with AI assistants (Claude, Copilot, Cursor) on a project with specific conventions (Godot 4 typed signals, @export wiring, coroutine safety) produces poor suggestions by default — the model's prior is "generic Godot." Telling the assistant the rule in every prompt is a tax; not telling it is a correctness problem.

## Decision

Keep per-topic rule files in `.rules/` at the repo root, indexed from `CLAUDE.md` and `AGENTS.md`. Each file is one narrow subject (typed signals, safe casts, autoloads, coroutines, card authoring, UI separation…), written in a format agents ingest cleanly: front-loaded severity, "do / don't" columns, small code examples, _why_ the rule exists. Rules live with the code they govern; agents read them before writing.

Currently 18 rule files. See `.rules/` directory.

## Alternatives considered

- **One giant AGENTS.md** — Rejected. Single file, no per-topic retrieval, agents skim and miss sections.
- **Inline comments on every function** — Rejected. High noise-to-signal for readers; also doesn't address agents that haven't read the file yet.
- **No written rules** — Rejected. Assistant suggestions regress to the Godot 3 era without them.

## Consequences

- **Positive:** Agent suggestions conform to project style without per-prompt reminders.
- **Positive:** Rules double as onboarding documentation for human contributors.
- **Negative:** Maintenance — rules drift from practice if nobody updates them. `CLAUDE.md`'s "Documentation Maintenance" section codifies the discipline.

## Verification

`ls .rules/*.md` and check that every referenced rule in `CLAUDE.md` / `AGENTS.md` resolves.

## Notes for future content

- Process post: "Rule files for an LLM teammate" (ideas §8.4).
- Pairs with the "CLAUDE.md as a living rulebook" post (ideas §8.1).
