---
adr: 0023
title: "Displacement ignores MP and composes with it"
status: accepted
date: 2026-04-18
tags: [design, board]
supersedes: null
superseded_by: null
---

# ADR 0023 — Displacement ignores MP and composes with it

## Context

Cards can push, pull, or swap units. That's movement without being _turn-spent_ movement. Two ways to model it:

- **Count displacement against MP** — symmetric with walking but makes "pushed" feel like "your turn was taken."
- **Displacement is its own resource-free concept** — ignores MP entirely; forced movement in every sense.

## Decision

Displacement is resolved by `DisplaceTargetsStep` via `DisplacementResolver`. It ignores MP for both caster and target. Collisions (walls, other units) are handled by `BlockedBehavior` (`STOP`, `FALLBACK_FREE_HEX`, `DAMAGE_BOTH`, `SWAP_WITH_BLOCKER`) and trigger authored `on_wall_steps` / `on_collision_steps`. Displacement composes with MP movement (a unit can walk 2 hexes via MP then be pulled 1 hex by a card) because they share no resource. See `docs/design/board.md §Displacement`.

## Alternatives considered

- **Count displacement against MP** — Rejected. Breaks "flee" design (ADR doesn't exist, but covered in `FEATURE_AI_SYSTEM.md`): a pulled unit shouldn't lose its own turn's movement.
- **Displacement consumes a separate DP pool** — Rejected as overkill; pure push/pull is a card effect, not a resource.

## Consequences

- **Positive:** Design space opens up — zone control, combo setups (push into a terrain hex), reactive displacement on collision.
- **Positive:** AI FREE_HEX / Tactical-Retreat compose with MP cleanly: walk as far as MP allows, then teleport if it lands somewhere safer.
- **Negative:** Designers must specify `BlockedBehavior` intentionally — wrong default makes displacement feel wrong.

## Verification

`grep -n "BlockedBehavior\|DisplacementResolver" src/systems/combat/resolvers/` — confirms the resolver path and behaviors.

## Notes for future content

- Deep-dive candidate: "Displacement done right" (ideas §3.5).
