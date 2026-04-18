---
title: "Computed numbers deserve their own type"
description: "Why Project Ascension's cards are authored as Steps, Effects, and AmountSources, and what the last tier teaches about composable scaling."
publishedDate: "2026-04-18"
status: "draft"
tags: [project-ascension, cards, arch]
featured: true
---

There's a moment in every card-driven game where one class starts growing fields. You added one for "conditional." Another for "repeat count." Another for "also scale by how far the caster moved this turn." The class now holds a dozen knobs, and every new card lands as a thirteenth. You're tired of editing it. That's the moment the class has become the bottleneck, and the only honest response is to stop filing new variations against it.

Project Ascension's card system hit that point and kept going for a while. The answer was to split the axes into three tiers of Resources: Steps, Effects, and AmountSources. Steps are the timeline. Effects are the atoms. AmountSources are the numbers. Every card is a composition of those, authored as `.tres` files in the Godot Inspector, with no GDScript needed to ship a new one.

## When one class eats the world

A card in a tactical deckbuilder has a lot to express: animation timing, caster movement, projectile travel, multi-target application, conditional branches, repeat loops, deck manipulation. You author cards by the hundred, and most new cards want to be variations of old ones: same effect, different scaling; same scaling, different target count; same damage, conditional on the target's HP. When that expressivity lives as fields on a handful of effect classes, every new variation adds a field to a class that already has too many. The classes become the bottleneck.

So split the axes. What a card does over time is a Step timeline. What a Step mutates when it fires is an Effect. What an Effect scales against is an AmountSource. Each axis gets its own Resource subclass hierarchy; each hierarchy stays small and composable; nothing accumulates fields for every variation.

## Steps are the timeline

`CardData.steps: Array[CardStep]` is an ordered list. `StepResolver` walks it. Each `CardStep` subclass is one kind of thing that happens in sequence: play an animation, move the caster, spawn a projectile, apply effects to targets, place a terrain tile, wait.

Control flow lives at the same tier:

```gdscript
class_name ForEachTargetStep extends CardStep

@export var target_source: TargetSource
@export var steps: Array[CardStep] = []
```

`src/data/cards/card_steps/for_each_target_step.gd`

A `ForEachTargetStep` resolves its `target_source` to a list of units, then runs its nested `steps` once per unit. `RepeatStep` and `ConditionalStep` work the same way. Control flow is a Step like any other. No outer "interpreter" wraps the timeline; the Step tree _is_ the card.

This is the shape ADR-0004 records: cards are authored as Step timelines, not as trigger tables or GDScript. The constraint is load-bearing. If GDScript were an escape hatch for "this one card needs something weird," the tiers would rot over time and the authoring win would leak away.

## Effects are the atoms

Inside `ApplyEffectsToTargetsStep` and `ApplyEffectsToCasterStep` lives an array of Effects. These are the mutations: `DamageEffect`, `HealEffect`, `ArmorEffect`, `ApplyStatusEffect`, `StatModEffect`, `CleanseEffect`, `DispelEffect`, a handful more. An Effect knows _what_ to change on a unit. It doesn't know when to fire; that's the Step's job.

```gdscript
class_name DamageEffect extends Effect

@export var sources: Array[AmountSource] = []
@export var multiplier: float = 1.0
```

`src/data/effects/damage_effect.gd`

A `DamageEffect` is two fields: a list of sources, and a multiplier. It doesn't compute damage. It sums the sources, applies the multiplier, and hands the result to `DamagePipeline`. The tier below does the math.

## AmountSources are the numbers

Every Effect that consumes a number takes an `Array[AmountSource]`. So what's an `AmountSource`? Any Resource that can answer one question: "what number do I contribute, given the current cast context?" Six subclasses live under `src/data/effects/sources/`:

- `FlatAmount` — a literal integer.
- `ScaleByCasterStat` — the value of one of the caster's stats.
- `ScaleByTraveledDistance` — the number of hexes the caster moved this turn.
- `ScaleByTargetMissingHpPercent` — a fraction of the target's missing HP (0.0–1.0).
- `ScaleByContextValue` — a named scratch key from the cast context.
- `ScaleByCount` — a count of something (units, tiles, statuses).

Each is a short Resource. `ScaleByCasterStat` in full:

```gdscript
class_name ScaleByCasterStat extends AmountSource

@export var stat: UnitEnums.StatName = UnitEnums.StatName.ATTACK
@export var multiplier: float = 1.0
```

`src/data/effects/sources/scale_by_caster_stat.gd`

Two fields. `AmountSourceResolver` runs the list, sums the contributions, and hands the total back to the Effect.

This is the single teachable axis of the whole split: the number an Effect consumes is not a field on the Effect. It's a composition of small typed things that each know how to answer one question. "Computed numbers deserve their own type" is a move you can apply anywhere a class starts to accumulate fields that each mean "here's another way to compute the same thing." In a card-driven game specifically, numbers are where that pressure lands first: every new card wants a new way to scale, and every new way to scale wants a new field.

## Guard, top to bottom

Guard is the most boring card in the game. That's why it's a good one to read. It's a General-tier utility card that grants armor to the caster, added at `resources/cards/general/guard.tres` in the pivot commit `66c5b89`. Stripped to the essentials, the authored shape:

```
[resource]
script = ExtResource("1_guard")          # CardData
display_name = "Guard"
card_type = 1                             # CardCategory.UTILITY
target_strategy = SubResource("SelfTarget_n8xp4")
steps = [
  SubResource("PlayCasterAnim_q1vy5"),
  SubResource("ApplyEffectsCaster_r4kn2"),
]

[sub_resource "PlayCasterAnim_q1vy5"]
animation_name = &"attack_1"

[sub_resource "ApplyEffectsCaster_r4kn2"]
effects = [SubResource("BlockEffect_w6tz9")]

[sub_resource "BlockEffect_w6tz9"]
sources = [
  SubResource("ScaleByCasterStat_j3hm7"),
  SubResource("FlatAmount_q2kz1"),
]

[sub_resource "ScaleByCasterStat_j3hm7"]
stat = 5                                  # DEFENSE
multiplier = 1.0

[sub_resource "FlatAmount_q2kz1"]
amount = 2
```

Read it top-down: play an animation, then apply one Effect to the caster. The Effect is an armor grant. The armor equals the caster's DEFENSE stat plus a flat two. That's the whole card.

[placeholder:screenshot of guard.tres opened in the Godot Inspector with the nested sub-resources expanded]

Here is what variation costs in this shape:

- Want Guard to scale with Attack instead of Defense? Change `stat = 5` to `stat = 0`.
- Want it to grant more when the caster is low HP? Swap in a `ScaleByTargetMissingHpPercent`.
- Want it to scale with how far the caster moved this turn? Drop a `ScaleByTraveledDistance` next to the existing sources. The Effect takes a list; it will sum whatever is in there.
- Want it to apply to every ally instead of self? Change `target_strategy` to an AoE, wrap the body in a `ForEachTargetStep`, and swap `ApplyEffectsToCasterStep` for `ApplyEffectsToTargetsStep`.

None of those touch GDScript. Each variation is a handful of lines in a `.tres`.

## The glue: EffectContext

One piece makes the tiering sing: the shared `EffectContext`. `ScaleByContextValue` reads named scratch keys on it; other Steps write them. `MoveCasterStep` writes `traveled_distance` as the caster walks. `DisplaceTargetsStep` writes `collision_unit` when a pushed unit hits a wall. A later Step's `ScaleByContextValue` reads the same key and feeds it into an Effect's sources.

One mutable instance threads through every Step in a cast. `ActionRunner` allocates a fresh context at cast start and drops it at cast end; two casts never share. ADR-0005 records this shape.

That's what lets an AmountSource pull "just-happened" information the board can't re-derive. Once the caster has moved, the board doesn't remember how far. The context does.

## What it costs

Three composable tiers is more cognitive load than a flat list of effect classes. Reading one card traces Step → Effect → AmountSource across four or five files, plus a parallel trace on the targeting side (source → filter → anchor → direction). The system is easier to author in than to explain.

The win isn't that the post-split shape is smaller. It isn't. The win is that branching moved out of one hot class and into many cold ones. The orchestrator that used to carry most of it, `action_runner.gd`, runs 385 lines today; what replaced it is per-tier and per-subclass, each piece small enough to hold in your head while you author a card. Authors touch the cold classes; the hot one shrank to scaffolding.

So the class isn't a god class anymore. `DamageEffect` is two fields, forever. But the fatigue moved with the complexity: from a single swollen class to a deeply nested panel in the Godot Inspector. The `.tres` on disk reads cleanly; Guard above fits on a screen. The same card viewed through the Inspector, with four levels of nested sub-resources, does not. Three tiers is not a silver bullet. It's a trade: you don't edit one impossible class anymore; instead, you navigate four impossible sub-resources. Worth it here, at the scale of card authoring this game does. Worth staying skeptical of if you borrow the shape for yours. And if I were starting over tomorrow, the piece I'd push harder on is the one the Inspector still can't close for me: reading a card at a glance.

## Further reading

- ADR-0004 — Cards are authored as Step timelines, not trigger tables
- ADR-0005 — One shared mutable `EffectContext` per card cast
