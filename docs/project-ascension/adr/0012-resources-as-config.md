---
adr: 0012
title: "Resource subclasses as injected config"
status: accepted
date: 2026-04-18
tags: [engine, arch]
supersedes: null
superseded_by: null
---

# ADR 0012 — Resource subclasses as injected config

## Context

Config and tuning data can live in (a) code constants, (b) JSON files, (c) `.tres` Resource files authored in the Inspector and injected via `@export`. Each has trade-offs.

## Decision

Tuning and config is modeled as typed `Resource` subclasses (`GameConfig`, `AIConfig`, `HexHighlightPalette`, `HandLayoutConfig`, `UIColorPalette`, `CardVisualLayout`, …) with `.tres` instances under `resources/`. Instances are injected into consumers via `@export var`; consumers never load by path. Per-instance runtime copies use `duplicate()` so shared config is never mutated. See `.rules/systems-resource-as-config.md`.

## Alternatives considered

- **Code constants** — Rejected. Editing tuning requires a code change and a restart; not designer-friendly.
- **JSON config files** — Rejected. No schema validation, no Inspector UX, no type safety.
- **Singleton config autoload** — Rejected for most config; a few genuinely-global configs use a static accessor (`GameConfig.hand_layout`) as a compromise.

## Consequences

- **Positive:** Designers edit tuning in the Inspector. Changes are diff-friendly.
- **Positive:** Testing is easy — pass a different config Resource to swap behavior.
- **Negative:** Initial setup for each config type is more work than a constant. Pays off quickly.
- **Negative:** Must remember to `duplicate()` before mutating; shared mutation is a silent global-state bug.

## Verification

`grep -rn "class_name.*extends Resource" src/data/` — many config Resources expected. `grep -rn "\.duplicate()" src/systems/` — mutation sites duplicate first.

## Notes for future content

- Anchor for the "Resources as configuration, not state" post (ideas §5.1).
