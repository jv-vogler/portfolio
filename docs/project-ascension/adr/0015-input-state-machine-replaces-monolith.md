---
adr: 0015
title: "Replace monolithic InputManager with a state machine"
status: accepted
date: 2026-04-18
tags: [engine, arch, input]
supersedes: null
superseded_by: null
---

# ADR 0015 — Replace monolithic InputManager with a state machine

## Context

The first `InputManager` was a ~380-line hand-rolled state machine with implicit transitions. Symptoms:

- Crash: `_selected_card` was null when `_handle_card_selected_hex_click` called `card_resolver.can_play()`, surfacing as `"Nonexistent function 'can_be_cast_by' in base 'Nil'"`.
- Cancel in UNIT*SELECTED of a \_different* unit undid movement instead of deselecting.
- Clicking empty space did nothing with a unit selected.
- `_flow_origin` enum hack to track where TARGETING was entered from.

All of the above trace back to one root cause: implicit state, not explicit. See `docs/superpowers/specs/2026-03-29-input-state-machine-refactor-design.md` for the full spec.

## Decision

Replace the monolith with a state machine built on the existing `godot_modules/state_machine/` module. States: `DisabledState`, `NeutralState` (a.k.a. `IdleState`), `UnitSelectedState`, `CardSelectedState`, `TargetingState`, `DeployingState`, `MultiTargetingState`. All shared mutable state lives on a single `InputContext` injected into every state. `InputManager` becomes a thin facade so `battle_scene.gd`'s public API is unchanged.

## Alternatives considered

- **Patch the monolith** — Rejected. Each bug fix pushed new implicit state elsewhere.
- **Godot's `StateChart` addon** — Considered. Rejected for this project because the existing `state_machine` module already matched `TurnManager`/`TurnPhase` patterns we use elsewhere. Consistency won.

## Consequences

- **Positive:** Transitions are explicit. Cancel means "exit this state." State-specific data is scoped to that state's fields.
- **Positive:** New states (MultiTargetingState) are drop-in rather than a cross-cutting rewrite.
- **Negative:** State-machine boilerplate for the simplest transitions. Worth it; the simple cases are rare.

## Verification

`ls src/systems/combat/input_states/` — each state is a file. `grep -n "class_name InputPhase" src/systems/combat/input_states/_input_phase.gd` — the abstract base.

## Notes for future content

- Flagship post: "From 380 lines of implicit state to a proper state machine" (ideas §4.1).
- Use the concrete crash ("Nonexistent function 'can_be_cast_by' in base 'Nil'") as the hook.
