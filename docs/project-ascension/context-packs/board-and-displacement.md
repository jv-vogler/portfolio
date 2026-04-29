# Context Pack — Board and Displacement

## Subject

Hex grid, movement, deployment zones, terrain, and the displacement system (push / pull / swap).

## Canonical terms

- **Hex / Coord** — a single cell on the hex grid, identified by `Vector2i` offset coordinates.
- **HexBoardManager** — authoritative board state: positions, moves, adjacency.
- **HexCoord.NO_HEX** — sentinel for "no hex selected / target hex."
- **Deployment zone** — rows where units may be deployed. Player: `y >= radius - 1`. Enemy: `y <= -(radius - 1)`.
- **MP** — Movement Points; pays for A\*-pathfinded walks; does not pay for displacement.
- **Displacement** — forced movement by a card. Push / Pull / Swap. Ignores MP.
- **DisplaceTargetsStep** — the `CardStep` that resolves displacement.
- **DirectionSource** — resolves a hex direction (caster-facing, toward-target, fixed, away-from-caster, etc.).
- **DisplacementResolver** — static utility computing displacement path + collision.
- **DisplacementPath** — transient result: steps, landing coord, collision info (NONE / WALL / UNIT).
- **BlockedBehavior** — `STOP | FALLBACK_FREE_HEX | DAMAGE_BOTH | SWAP_WITH_BLOCKER`.
- **HexState** — per-hex terrain Resource: `on_enter_effects`, `on_upkeep_effects`, `remaining_turns`.
- **TerrainId** — enum: `FIRE | ICE | POISON_CLOUD | SACRED_GROUND`.

## Key claims

1. Default board radius is 4 (total ~49 hexes in a hexagonal shape). Source: `game/docs/design/board.md`.
2. One unit per hex — strict occupancy invariant. ADR-0009.
3. Movement: `HexBoardManager.move_unit(unit, path)`; cost = `path.size() - 1`. Occupied hexes block pathing. Source: `board.md`.
4. MP refreshes at upkeep and fully clears at end of turn (no banking). Source: `board.md`.
5. Displacement ignores MP for both caster and target. ADR-0023.
6. Collision during displacement: `BlockedBehavior` branches the outcome. Can trigger `on_wall_steps` or `on_collision_steps` — each is a full nested CardStep list. Source: `board.md`.
7. Terrain is modeled as `HexState` on a hex, not as a stacked entity. Source: `board.md`.
8. Terrain durations: `remaining_turns = -1` → permanent; otherwise ticks down and removes at 0.
9. Units confined to their deployment zone during deploy; free to move anywhere once combat begins.
10. `HexBoardManager.step_unit()` is called per step in a movement `ActionPlan`, not `move_unit` directly.

## Invariants

- Occupancy is strict: never two units on one hex. Enforced centrally in `HexBoardManager`.
- Displacement and movement share no resource; composing them is valid and intended (ADR-0023).
- A pulled unit does not consume its own MP for that turn.
- Terrain effects on entry fire once per entry; upkeep fires once per upkeep tick for each unit standing on it.

## Citations

### Displacement outcomes table

Source: `game/docs/design/board.md §Displacement`:

| `BlockedBehavior`   | Meaning                                                                      |
| ------------------- | ---------------------------------------------------------------------------- |
| `STOP`              | Unit stops at the last free hex before the blocker                           |
| `FALLBACK_FREE_HEX` | Unit routes to an adjacent free hex if the direct path is blocked            |
| `DAMAGE_BOTH`       | Both blocker and moving unit take damage (per authored `on_collision_steps`) |
| `SWAP_WITH_BLOCKER` | Moving unit swaps positions with the blocking unit                           |

### Terrain schema

Source: `board.md §Terrain`:

```
HexState:
  terrain_id: TerrainId enum        (FIRE | ICE | POISON_CLOUD | SACRED_GROUND)
  on_enter_effects: Array[Effect]   (fired when a unit enters the hex)
  on_upkeep_effects: Array[Effect]  (fired each upkeep to any unit standing on it)
  remaining_turns: int              (-1 = permanent; 0 = remove this turn)
```

### Hex highlight palette

Source: `game/src/data/ui/hex_highlight_palette.gd:10-38` — the visual-affordance table. 11 hex states (`NONE`, `MOVEMENT_RANGE`, `ATTACK_RANGE`, `SPELL_RANGE`, `DEPLOY_ZONE`, `SELECTED`, `VALID_CASTER`, `OCCUPIED`, `AOE_PREVIEW`, `CAST_PREVIEW`, `ALLY_TARGET`). Each maps to a left/right gradient pair + pulse speed + base alpha.

### Board layer config

`project.godot §[layer_names]`:

```
2d_physics/layer_1="World"
2d_physics/layer_2="unit_hurtbox"
2d_physics/layer_3="Enemy"
```

## Related ADRs

- [ADR-0009](../adr/0009-one-unit-per-hex.md)
- [ADR-0023](../adr/0023-displacement-orthogonal-to-movement.md)

## Related posts

None yet.

## Last updated

2026-04-18
