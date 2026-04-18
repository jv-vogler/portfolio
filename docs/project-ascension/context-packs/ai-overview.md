# Context Pack — AI Overview

## Subject

The enemy AI system in Project Ascension: how it senses, thinks, coordinates, and acts each turn.

## Canonical terms

Use these exactly. Do not substitute synonyms.

- **AIController** — turn entry point. Owns `_create_plan` and `_execute_plan`.
- **SurveyPhase** — sensing phase; produces `UnitSurvey` per unit, bidirectional (surveys allies and opponents).
- **UnitSurvey** — snapshot of one unit's combat state (hp, armor, range, reachable hexes, playable cards, threat score).
- **IntentGenerator** — generates candidate `Intent` objects per unit.
- **Intent** — one unit's proposed action (type, move path, card plays, AP cost, estimated value).
- **IntentType** — `ATTACK | DEFEND | FLEE | UTILITY | ALL_IN | PASS | HEAL (registry) | PROTECT (registry)`.
- **TurnCoordinator** — commit loop; arbitrates AP and card claims across units.
- **InterruptLayer** — pre-execution validator; recovery actions `SKIP | ABORT_MOVE | REPLAN`.
- **PlanValidator** — plan-time legality gate inside `TurnCoordinator`.
- **CoordinationState** — mutable commit-phase bookkeeping (hp deltas, claimed cards, hex reservations, predicted kills).
- **TeamContext** — per-turn snapshot of card demand, shared-AP demand, `TurnPressure`.
- **TurnPressure** — `LOW | MED | HIGH | DESPERATE` band from `TempoAnalyzer`.
- **WeightProfile** — per-unit dynamic weight vector; presets `NEUTRAL | HEALTHY_LOW | HEALTHY_DESPERATE | CRITICAL | LAST_UNIT`.
- **ScoreVector** — composite-score record across 6 dimensions: damage, survival, positioning, synergy, tempo, support.
- **CardProfile** — heuristic analysis of one card played by one caster (damage estimate, armor gain, status list, DoT metadata).

Avoid these anti-terms:

- "heuristic" alone — say "legacy scalar scoring path" or "composite scoring path."
- "strategy" — the code uses "intent."
- "behavior tree" — we don't have one; never imply we do.

## Key claims

1. The turn pipeline is **Survey → Intent → Coordinate → Interrupt → Execute**. Not a single loop. Source: `game/docs/features/FEATURE_AI_SYSTEM.md §Turn Pipeline`.
2. Survey is **bidirectional**: threat scoring is computed for both the AI side's units and the opponents. Source: `FEATURE_AI_SYSTEM.md §Files`.
3. Intent kinds are pluggable via `IntentGeneratorBase` + `add_generator()`. HEAL and PROTECT ship as dormant scaffolds. Source: ADR-0018.
4. Team-aware coordination uses a per-turn `TeamContext` snapshot built once after intents are generated. Source: ADR-0019.
5. `TurnCoordinator` runs a **release-aware commit loop** (max 3 iterations): commit pass → release claimed-but-unused cards on downgrade → re-evaluate. Source: `FEATURE_AI_SYSTEM.md §TurnCoordinator`.
6. `MAX_REPLANS = 1`: the AI replans at most once per turn when validation failures cascade. Source: `FEATURE_AI_SYSTEM.md §InterruptLayer`.
7. `KILL_BONUS = 15.0` is the large constant reserved for kill intent — deliberately large to dominate scoring when relevant. Source: `FEATURE_AI_SYSTEM.md §IntentGenerator Scoring Constants`.
8. `MAX_CARD_PLAYS_PER_INTENT = 3` with triangular DoT-stacking bonus — lets 3× Poison Sting self-select without a hard enumeration rule.
9. `FLEE` is suppressed unless the destination puts at least one threatening enemy out of next-turn reach. Running in place is explicitly not a flee. Source: `FEATURE_AI_SYSTEM.md §IntentGenerator`.
10. Composite scoring (`ScoreVector` + `WeightProfile`) ships dormant behind `AIConfig.enable_composite_scoring = false`. ADR-0020.
11. `RETARGET` recovery was removed from `InterruptLayer`. Invalid targets now produce `SKIP`. ADR-0021.
12. `RetaliationRisk.compute(hex, opponents)` sums opponent attack within `max_range + mp` of a hex; subtracted from attack-hex scores via `retaliation_weight`.
13. `SurvivalProbability.compute(survey, incoming)` returns 0–1. Gates both FLEE (suppressed above `flee_survival_floor`) and DEFEND (skipped below `dying_unit_threshold`).
14. `NextTurnPlayability.compute(survey, hex, cards, opponents)` adds one-ply positional lookahead to attack-hex selection. Weighted by `next_turn_playability_weight`.
15. The card-demand penalty: `team_card_starve_penalty × max(0, K + others_demand[card] − hand_count[card])` summed across intent cards. Source: `FEATURE_AI_SYSTEM.md §TurnCoordinator`.

## Invariants

- The AI must never cast a card on a target it didn't plan for. Enforced by removal of RETARGET (ADR-0021).
- `CoordinationState.claimed_cards` prevents two units from using the same hand copy. Source: ADR-0019, `FEATURE_AI_SYSTEM.md §Key Design Invariants`.
- `is_instance_valid(self)` guards every `await` in `_execute_plan`. Source: `.rules/gdscript-coroutines.md`.
- `CardProfile` is a pure heuristic snapshot — it does not execute effects.

## Citations

### The pipeline, ASCII

```
AIController.take_turn(side, turn_number)
  └─ _execute_turn()
       ├─ _create_plan()
       │    ├─ SurveyPhase.survey_all(side)          → Array[UnitSurvey]   (allies)
       │    ├─ SurveyPhase.survey_opponents(side)    → Array[UnitSurvey]   (enemies, snapshot only)
       │    ├─ for each ally survey:
       │    │    IntentGenerator.generate_intents()  → Array[Intent]
       │    └─ TurnCoordinator.coordinate()          → TurnActionPlan
       │
       └─ _execute_plan(plan)
            └─ for each ActionStep:
                 ├─ InterruptLayer.validate_step()
                 │    recovery: SKIP / ABORT_MOVE / REPLAN
                 ├─ resolve live actor + targets
                 ├─ [optional] ActionFactory.create_movement_plan() → ActionRunner.execute()
                 └─ [optional] ActionFactory.create_card_plan()     → ActionRunner.execute()
```

Source: `game/docs/features/FEATURE_AI_SYSTEM.md`.

### Release-aware commit loop (GDScript)

`game/src/systems/combat/ai/turn_coordinator.gd:69-99`:

```gdscript
var pending: Array[UnitSurvey] = order.duplicate()
for _iteration in MAX_COMMIT_ITERATIONS:
    var made_progress := false
    var still_pending: Array[UnitSurvey] = []
    for survey: UnitSurvey in pending:
        var pre_value: float = pre_commit_values.get(survey.unit_id, 0.0)
        var committed := _try_commit_unit(
            survey, intents_by_unit, opponent_lookup, kill_candidates,
            state, shared_ap, config, pre_value, logger,
        )
        if committed == null:
            still_pending.append(survey)
        else:
            committed_intents.append(committed)
            made_progress = true
    pending = still_pending
    if not made_progress or pending.is_empty():
        break
```

### UTILITY intent scoring (GDScript)

`game/src/systems/combat/ai/intent_generator.gd:571-608`:

```gdscript
for profile: CardProfile in survey.playable_cards:
    if profile.applies_statuses.is_empty():
        continue
    if profile.card.card_type != CardEnums.CardCategory.UTILITY:
        continue
    var target := _find_status_target(survey, profile, opponent_surveys)
    if not target:
        continue
    var status_value := _get_status_value(profile.applies_statuses, target)
    if status_value <= best_status_value:
        continue
    best_profile = profile
    best_status_value = status_value
    best_target = target
```

### AIConfig knobs (table)

Source: `game/docs/features/FEATURE_AI_SYSTEM.md §AIConfig Knobs`.

| Field                      | Default | Purpose                                                |
| -------------------------- | ------- | ------------------------------------------------------ |
| `action_delay`             | 0.8     | Seconds between AI actions                             |
| `retreat_ehp_threshold`    | 15      | hp + armor below which flee intent is considered       |
| `shared_ap_floor`          | 2       | Minimum AP preserved in shared pool                    |
| `break_floor_for_kills`    | true    | Override floor when intent secures a kill              |
| `team_aware_ap_floor`      | true    | Relax AP floor to 0 when no other unit needs shared AP |
| `team_card_starve_penalty` | 4.0     | Per excess card claim that would starve a teammate     |
| `retaliation_weight`       | 0.5     | Multiplier on `RetaliationRisk.compute(hex)`           |
| `flee_survival_floor`      | 0.5     | Above this `survival_probability`, FLEE is suppressed  |
| `dying_unit_threshold`     | 0.2     | Units below this skip DEFEND and dump value            |
| `enable_composite_scoring` | false   | Toggle composite `ScoreVector × WeightProfile` path    |

Note: concrete defaults may drift. Always cross-check with `game/src/data/combat/config/ai_config.gd` before publishing specific numbers.

## Related ADRs

- [ADR-0017](../adr/0017-ai-sense-think-act-pipeline.md) — the pipeline shape.
- [ADR-0018](../adr/0018-intent-generator-registry.md) — plugin registry for intents.
- [ADR-0019](../adr/0019-team-context-per-turn-snapshot.md) — team coordination.
- [ADR-0020](../adr/0020-composite-score-vector-dormant-ship.md) — composite scoring dormant.
- [ADR-0021](../adr/0021-remove-silent-retarget-recovery.md) — removal of RETARGET.

## Related posts

None yet. Keep this list current as posts publish.

## Last updated

2026-04-18
