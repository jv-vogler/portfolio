---
adr: 0009
title: "Strict one-unit-per-hex occupancy"
status: accepted
date: 2026-04-18
tags: [design, board]
supersedes: null
superseded_by: null
---

# ADR 0009 — Strict one-unit-per-hex occupancy

## Context

Some tactical games allow stacking (ghosts/phased units, summoned wards, trap tokens). Strict occupancy is easier to reason about but closes some design space.

## Decision

Every hex holds at most one unit at any time. This is enforced as a board invariant by `HexBoardManager`; movement is blocked into occupied hexes; displacement (push/pull/swap) is the only way two units interact spatially at close range. Trap/aura/ward mechanics, if added, are modeled as `HexState` terrain, not as stacked entities. See `docs/GAME_DESIGN.md §Design Invariants §5`.

## Alternatives considered

- **Stacked phase/ghost units** — Rejected. Requires a z-axis in every targeting calculation; AI reasoning becomes harder.
- **One unit + one terrain marker** — Accepted; this is already the model (see `HexState` on `docs/design/board.md`).

## Consequences

- **Positive:** Displacement mechanics (ADR-0023) become powerful because position is scarce.
- **Positive:** AI `hex_reservations` in `CoordinationState` are simple and correct.
- **Negative:** Closes off "ghost" or "ethereal" unit archetypes. Acceptable; those don't fit the tactical identity.

## Verification

`HexBoardManager.is_hex_free(coord)` is the single gate. `grep -rn "is_hex_free\|occupied" src/systems/combat/managers/hex_board_manager.gd` confirms.

## Notes for future content

- Short post candidate: "One unit per hex, always" (ideas §9.5).
- Foundational context when discussing displacement or trap mechanics.
