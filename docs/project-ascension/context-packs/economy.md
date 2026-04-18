# Context Pack — Economy

## Subject

Resource economy in Project Ascension: Action Points (two-tier), Movement Points (independent), deck / hand / discard flow, and the evaporation + consume-on-play mechanics.

## Canonical terms

- **HP** — Health Points. Unit dies at 0.
- **AP** — Action Points. Resource for card plays. **Two-tier**: per-unit AP + shared side-level pool.
- **MP** — Movement Points. Independent of AP. Never costs AP to move.
- **Armor** — damage absorption pool. Persists between turns. Cap 10. NOT auto-reset.
- **Attack** / **Defense** — base stats that scale effects (e.g. `ScaleByCasterStat`).
- **Shared pool** — side-level AP pool that grows by `shared_pool_increment` per turn, capped at `max_shared_pool`.
- **Unit AP** — per-unit AP. Refreshes to max each upkeep. Consumed **first** before shared pool.
- **`can_afford(unit, cost)`** — `unit.AP.current + shared_pool >= cost`.
- **Hand** — currently playable cards (default 5). Fully redrawn each turn.
- **Draw pile / Discard pile** — shuffled draw, played cards go to discard, reshuffled when empty.
- **Evaporation** — requirement-driven permanent deck removal (ADR-0002).
- **consume_on_play** — per-card one-shot flag; tracked per-side in `DeckManager` (ADR-0003).

## Key claims

1. Unit AP is consumed before shared pool. Source: `game/docs/design/economy.md §Two-Tier AP Pool`.
2. `can_afford(unit, cost) = unit.AP.current + shared_pool >= cost`. Source: `economy.md`.
3. MP and AP are completely independent. Moving never costs AP. Playing cards never costs MP. Source: `GAME_DESIGN.md §Design Invariants §4`, ADR-0008.
4. **Current tuning**: per-unit AP = 1, shared pool starts at 3 / caps at 3 / grows +1 per turn. Hand size = 5. Flagged mutable. Source: `economy.md §Current Tuning`.
5. Full-hand redraw each turn: entire hand discarded at end-of-turn, drawn fresh at upkeep. No carry-over. Source: `GAME_DESIGN.md §Design Invariants §7`, ADR-0006.
6. Armor persists across turns; never auto-resets. Cap 10. Source: `GAME_DESIGN.md §Design Invariants §6`.
7. MP refreshes at upkeep; fully clears at end of turn (no banking). Source: `game/docs/design/board.md`.
8. Stunned units skip MP and AP refresh at upkeep. Source: `game/docs/design/combat_flow.md §UPKEEP`.
9. Turn order: UPKEEP → DRAW → PLAYER PHASE / ENEMY PHASE → END. Source: `combat_flow.md`.
10. Win condition: a side is eliminated when all its units are dead AND its roster is empty. Source: `combat_flow.md §Win Condition`.
11. Unit death cascade: corpse → removed from board → synergy recalc → signature cards evaporate → race cards (if no other shared-race unit) → class cards (if no other shared-class unit). Source: `combat_flow.md §Unit Death Cascade`.

## Invariants

- Moving never costs AP. Playing cards never costs MP. (ADR-0008)
- Shared AP pool is the only resource arbitrated across units. Unit AP is strictly per-unit.
- Hand does not carry between turns. (ADR-0006)
- Cards with no requirement never evaporate. (ADR-0002)
- `consume_on_play` cards cannot return via reshuffle or resurrection re-injection. (ADR-0003)

## Citations

### Turn phases, in order

Source: `game/docs/design/combat_flow.md`:

```
UPKEEP
  ├─ Tick status triggers (ON_TURN_START, ON_UPKEEP)
  ├─ Tick DoT/terrain upkeep effects
  ├─ Refresh MP (restore to max; skipped for stunned units)
  ├─ Refresh AP (restore unit AP; increment shared pool; skipped for stunned units)
  └─ Check side elimination (units may die from DoT/terrain)

DRAW
  └─ Draw hand_size new cards (reshuffle discard into draw pile if needed)

PLAYER PHASE  (or ENEMY PHASE if enemy's turn)
  ├─ Move units (costs MP)
  ├─ Play cards (costs AP)
  ├─ Any order, any number of times, until pass
  └─ Input blocked during action animation

END
  ├─ Clear remaining MP and AP
  ├─ Tick ON_TURN_END triggers
  ├─ Tick end-of-turn status durations and stat modifier durations
  ├─ Decay threat trackers
  ├─ Discard entire hand
  └─ Advance turn (turn number increments after ENEMY finishes a full round)
```

### Two-tier AP table

Source: `game/docs/design/economy.md`:

| Pool            | Scope    | Refresh                                                  | Notes               |
| --------------- | -------- | -------------------------------------------------------- | ------------------- |
| **Unit AP**     | Per-unit | Restored to max each upkeep                              | Spent first         |
| **Shared Pool** | Per-side | +`shared_pool_increment` per turn; cap `max_shared_pool` | Spent after unit AP |

### Unit death cascade

Source: `combat_flow.md §Unit Death Cascade`:

1. Unit becomes corpse (`is_corpse = true`)
2. Removed from board → synergy counts recalculated
3. **Signature cards** for that unit evaporated immediately
4. If no other unit shares the dead unit's race → **race RACE_CLASS cards** evaporated
5. For each of the dead unit's classes: if no other unit shares that class → **class RACE_CLASS cards** evaporated
6. Check side elimination

## Related ADRs

- [ADR-0001](../adr/0001-shared-deck-per-side.md)
- [ADR-0002](../adr/0002-evaporation-by-requirement.md)
- [ADR-0003](../adr/0003-consume-on-play-orthogonal.md)
- [ADR-0006](../adr/0006-full-hand-redraw-each-turn.md)
- [ADR-0007](../adr/0007-two-tier-ap-pool.md)
- [ADR-0008](../adr/0008-mp-and-ap-independent.md)

## Related posts

None yet.

## Last updated

2026-04-18
