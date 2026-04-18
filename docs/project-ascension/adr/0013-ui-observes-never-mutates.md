---
adr: 0013
title: "UI observes game state; never mutates it"
status: accepted
date: 2026-04-18
tags: [engine, ui, arch]
supersedes: null
superseded_by: null
---

# ADR 0013 — UI observes game state; never mutates it

## Context

Button callbacks in Godot can do anything — including reach into game state and mutate it. That's fast to write and a rolling disaster to debug: the same state change can originate from five scripts in three folders.

## Decision

UI (`Control` scripts, anything under `src/ui/`) may:

- Read game state via injected managers or reactive signals.
- Emit signals describing player intent (`card_clicked`, `unit_selected_for_deploy`, `end_turn_pressed`).
- Call injected `Callable`s.

UI may not:

- Mutate `UnitCombatState`, `DeckManager`, or any system-owned state.
- Access resolvers or orchestrators directly to trigger side effects.

Game logic lives in `systems/` and is driven by input flowing through `InputManager` → `PlayerPhase`. See `.rules/ui-separation.md` and `.rules/ui-reactive-binding.md`.

## Alternatives considered

- **MVVM-style viewmodels** — Rejected as overkill for this scale. The signal + @export approach is lighter and gives the same decoupling.
- **Godot's built-in signal editor wiring (scene-level connections)** — Partially used, but typed signal objects (ADR-0010) take precedence for anything cross-scene.

## Consequences

- **Positive:** UI is swappable without touching logic. Two UI variants (e.g. mobile vs desktop) cost a scene, not a rewrite.
- **Positive:** Debugging is traceable — a mutation always has a `systems/` file in its stack.
- **Negative:** Occasionally awkward when a UI-specific piece of state wants to live near the UI. Solve with UI-local `RefCounted` helpers (e.g. `HandLayout`, `CardTweenHelpers`).

## Verification

`grep -rn "unit.hp =\|\.current_hp =\|deck_manager\." src/ui/` — expect near-zero hits. If UI is mutating game state, it will show up here.

## Notes for future content

- Anchor for UI-architecture posts. Cite in any "how our UI works" piece.
