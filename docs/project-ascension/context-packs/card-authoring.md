# Context Pack — Card Authoring

## Subject

How cards are authored as data in Project Ascension: `CardData` Resources, `CardStep` timelines, `Effect` composition, and `AmountSource` scaling.

## Canonical terms

- **CardData** — the top-level Resource describing a card. Stored as `.tres`.
- **card_type** — the **category** (`ATTACK | UTILITY`). NOT the tier. Tier is derived.
- **Card tier** — `GENERAL | RACE_CLASS | SIGNATURE`. Derived from requirement fields via `CardData.derive_tier()`. Not stored.
- **CardStep** — one step in a card's timeline. `@abstract` base with many subclasses.
- **Effect** — an Apply\*-step's payload: `DamageEffect`, `HealEffect`, `ArmorEffect`, `ShatterEffect`, `ApplyStatusEffect`, `StatModEffect`, `APEffect`, `CleanseEffect`, `DispelEffect`, `ConsumeStatusEffect`, `ResurrectEffect`, `MarkTargetEffect`, `GrantTempCardEffect`.
- **AmountSource** — composable scalar input: `FlatAmount`, `ScaleByCasterStat`, `ScaleByTraveledDistance`, `ScaleByTargetMissingHpPercent`, `ScaleByContextValue`, `ScaleByCount`.
- **TargetStrategy** — `SelfTarget | SingleTarget | AoeTarget | FreeHexTarget | MultiSlotTarget`. On a card's `target_strategy` field.
- **TargetFilter** — orthogonal predicate on strategies (has-status, has-mark, hp-below, hp-above, on-terrain, race, class).
- **EffectContext** — one shared mutable bag threaded through all steps in a cast.
- **consume_on_play** — boolean on `CardData` that permanently removes a played card (not discarded). Orthogonal to evaporation.
- **Evaporation** — permanent deck removal driven by requirement mismatch (NOT tier).

Avoid these anti-terms:

- "trigger" — we don't have trigger tables; we have step timelines.
- "tier field" — tier is derived, not a field.
- "card script" — cards are Resources, not scripts.

## Key claims

1. A card is authored as an ordered `Array[CardStep]` on `CardData.steps`. Execution runs through `StepResolver`. Source: `game/docs/design/cards.md §Steps`, ADR-0004.
2. Effects and AmountSources are nested Resources _within_ steps — no code needed to ship a new card. Source: `.rules/cards-authoring.md`.
3. One shared `EffectContext` threads through all steps in a single cast. Source: `.rules/cards-authoring.md §3`, ADR-0005.
4. Tier is derived, not stored. `card_type` stores the category. Source: `game/docs/design/cards.md`, ADR-0022.
5. Evaporation is driven by _requirements_, not tier. A card with `required_unit_id` evaporates when that unit dies; `required_class` when no alive unit of that class; `required_race` when no alive unit of that race. Requirement-less cards never evaporate. Source: `GAME_DESIGN.md §Design Invariants §2`, ADR-0002.
6. `consume_on_play` is orthogonal to evaporation, tracked per-side via `resource_path` in `DeckManager`. Any resurrection-style re-injection must call `DeckManager.filter_spent()`. Source: ADR-0003.
7. `ResurrectEffect`, `MarkTargetEffect`, `GrantTempCardEffect` are currently **unimplemented stubs**. Source: `.rules/cards-authoring.md`.
8. `target_source = null` defaults to `FromCardSelection`. Must be set explicitly inside `on_collision_steps` / `on_impact_steps` / `ForEachTargetStep`. Source: `.rules/cards-authoring.md`.
9. Only one requirement field may be set on a card (`required_unit_id` OR `required_class` OR `required_race`, not combinations). Source: `.rules/cards-authoring.md`.
10. Effect resolution stops once `target.is_alive() == false`. Order matters. Source: `game/docs/features/FEATURE_COMBAT_RESOLUTION.md §Invariants`.

## Invariants

- Never mutate shared `CardData` at runtime. Deck state that varies per-instance lives in `DeckManager`, not on the resource.
- Never hand-author tier — it's computed.
- Every `.tres` card must pass a Godot cache refresh (`godot --headless --editor --path . --quit`) so its `.uid` is registered. Hand-writing `.uid` is a grave fault.

## Citations

### A complete card: Guard

`game/resources/cards/general/guard.tres` (excerpt):

```
[sub_resource type="Resource" id="PlayCasterAnim_q1vy5"]
script = ExtResource("3_guard")
animation_name = &"attack_1"

[sub_resource type="Resource" id="ScaleByCasterStat_j3hm7"]
script = ExtResource("6_guard")
stat = 5

[sub_resource type="Resource" id="BlockEffect_w6tz9"]
script = ExtResource("5_guard")
sources = Array[ExtResource("6_famkr")]([SubResource("ScaleByCasterStat_j3hm7"), SubResource("Resource_jromb")])

[sub_resource type="Resource" id="ApplyEffectsCaster_r4kn2"]
script = ExtResource("4_guard")
effects = Array[ExtResource("4_jromb")]([SubResource("BlockEffect_w6tz9")])

[resource]
script = ExtResource("1_guard")
display_name = "Guard"
card_type = 1
target_strategy = SubResource("SelfTarget_n8xp4")
steps = Array[ExtResource("2_5yxjo")]([SubResource("PlayCasterAnim_q1vy5"), SubResource("ApplyEffectsCaster_r4kn2")])
```

Two-step timeline: play caster animation, then apply a block effect whose amount is `FlatAmount + ScaleByCasterStat(stat=DEFENSE)`.

### AmountSource subclass

`game/src/data/effects/sources/scale_by_caster_stat.gd:1-6`:

```gdscript
class_name ScaleByCasterStat extends AmountSource

## The caster's stat whose current value is used as the scaling base.
@export var stat: UnitEnums.StatName = UnitEnums.StatName.ATTACK
## Coefficient applied to the stat value before adding to the total.
@export var multiplier: float = 1.0
```

### Effect subclass

`game/src/data/effects/damage_effect.gd:1-6`:

```gdscript
class_name DamageEffect extends Effect

## Summed to produce the base amount; each source can be flat, stat-scaled, distance-scaled, etc.
@export var sources: Array[AmountSource] = []
## Multiplier applied to the summed amount (use for crit/vulnerable tuning).
@export var multiplier: float = 1.0
```

### CardStep list

Source: `game/docs/design/cards.md §Steps`.

Control flow: `ForEachTargetStep`, `RepeatStep`, `ConditionalStep`
Animation / movement: `PlayCasterAnimation`, `MoveCasterStep`, `TeleportCasterStep`, `FaceTargetStep`, `DisplaceTargetsStep`, `SpawnProjectileStep`, `SpawnVfxStep`
Effect application: `ApplyEffectsToTargetsStep`, `ApplyEffectsToCasterStep`
Other: `DeckOperationStep`, `PlaceTerrainStep`, `WaitStep`

### Targeting strategies

| Strategy          | Selection                                            |
| ----------------- | ---------------------------------------------------- |
| `SelfTarget`      | Caster only; resolves immediately                    |
| `SingleTarget`    | Pick one unit filtered by affinity                   |
| `AoeTarget`       | Pick a hex or direction → resolve area shape         |
| `FreeHexTarget`   | Pick any hex within range                            |
| `MultiSlotTarget` | Multiple sub-strategies for swap/multi-missile cards |

AOE shapes: Radius, Line, Cone, Ring, FullField. Line targeting modes: TARGET_HEX or DIRECTION.

## Related ADRs

- [ADR-0004](../adr/0004-cards-as-step-timelines.md)
- [ADR-0005](../adr/0005-shared-effect-context.md)
- [ADR-0002](../adr/0002-evaporation-by-requirement.md)
- [ADR-0003](../adr/0003-consume-on-play-orthogonal.md)
- [ADR-0022](../adr/0022-card-tier-derived-not-stored.md)

## Related posts

None yet.

## Last updated

2026-04-18
