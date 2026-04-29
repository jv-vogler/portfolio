---
adr: 0010
title: "Typed signals only; no string-based connect"
status: accepted
date: 2026-04-18
tags: [engine, arch]
supersedes: null
superseded_by: null
---

# ADR 0010 — Typed signals only; no string-based connect

## Context

Godot 4 supports both legacy string-based signal APIs (`connect("my_signal", self, "_on_my_signal")`) and typed signal objects (`my_signal.connect(_on_my_signal)`). The legacy API is convenient until a refactor silently breaks a connection because a typo isn't caught.

## Decision

All signals:

- Declared with typed parameters: `signal card_played(card: CardData, caster: UnitCombatState, targets: Array[UnitCombatState])`.
- Emitted via the signal object: `card_played.emit(card, caster, targets)`.
- Connected via the signal object: `card_played.connect(_on_card_played)`.

String-based `emit_signal("foo")` and `connect("foo", ...)` are banned. See `.rules/gdscript-typed-signals.md`.

## Alternatives considered

- **Mixed — string for some, object for others** — Rejected. Inconsistency is worse than either extreme.
- **String-only (legacy Godot 3 style)** — Rejected. Refactor-unsafe; typos silent until runtime.

## Consequences

- **Positive:** Rename-safe signals. IDE find-usages works. Static analysis catches typos.
- **Positive:** Signal contracts in `docs/architecture/signals.md` are easy to keep current because the source is the typed declaration.
- **Negative:** Slightly more ceremony for one-off connections. `CONNECT_ONE_SHOT` and lambda adapters cover most cases.

## Verification

`grep -rn 'emit_signal(\|\.connect(\"' src/ godot_modules/` — expect zero hits in production code. Test and debug scaffolding may use strings in GUT fixtures; those don't count.

## Notes for future content

- Short post: "Typed signals only" (ideas §5.2).
- Often worth citing when describing any signal-wiring feature post.
