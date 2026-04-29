---
title: "Final Fantasy Tactics meets Slay the Spire: building a tactical roguelite deckbuilder"
description: "An introduction to the game I'm building, a tactical hex roguelite deckbuilder. Covering the design, the architecture, and a few key systems."
publishedDate: "2026-04-18"
status: "draft"
tags: [project-ascension, series-intro, design, arch, ai]
featured: true
series: "project-ascension"
series_number: 0
---

Hey, y'all! Happy to be here sharing my first post about the first real game I'm building. My goal is to write about game dev, design, and architecture, because most of what I've found on actual game code is shallow. Tutorials stop at sandbox-level and never reach the real systems. Anyways, I still haven't picked a name for the game, so I've been calling it "Project Ascension" (as of April 19th, 2026).

The game is a tactical hex roguelite deckbuilder. Final Fantasy Tactics meets Slay the Spire: you deploy units on a hex grid, each unit contributes cards to your side's shared deck, and you spend action points (think of it as mana) to cast those cards against the enemy. Units and cards stay coupled. Lose a unit, lose its cards for the rest of combat. The one thing I'm really happy with is the "mana" system. It's feeling really good.

Three design pillars filter every feature decision:

- **Units matter** — dead units stop drawing their cards mid-combat; resurrect them and the cards come back.
- **Strategy pays off** — positioning, card sequencing, and synergy combos beat brute force.
- **Creative plays are rewarding** — conditional effects, multi-target spells, terrain, and displacement open up expressive space.

## Why Godot

I'm using Godot 4. I'm already comfortable with it, and GDScript is simple enough that it stops fighting you after an hour. The editor makes data-driven content fast to iterate on: card effects, unit templates, and status definitions all live as `.tres` resource files, configurable in the Inspector without touching a line of code.

I've also been experimenting with AI-assisted development. The Godot MCP server gives Claude Code a handle on the running editor, and the language server feeds it real type information instead of guesses. That workflow deserves its own post about AI tooling.

## How a match plays

**Units** are the central entity. Each carries HP (die when depleted), MP (movement points per turn), AP (action points, spent to play cards), Block (a damage buffer that persists between turns, capped at ten), plus base Attack and Defense values that feed into scaling effects. Units also have **Passives** (permanent effects applied once at deployment and kept for the whole battle) and accumulate **Statuses** (temporary conditions like damage-over-time, crowd control, buffs, or triggered reactions).

You acquire units as **Packs**: one unit bundled with its attached cards. What a pack brings reflects the unit's identity. Your **Roster** is the pool of units you can deploy but haven't yet placed on the board.

The board is a hex grid with strict one-unit-per-hex occupancy. Units move by spending MP. **Displacement** (push, pull, swap) is a separate mechanic; it ignores MP and stacks on top of movement. Terrain hexes apply effects on entry or tick them over time.

Cards come from a **shared deck**: one per side, not one per unit. Every card has optional requirements: a specific unit, a race, or a class. When a unit dies, any card that required it evaporates from every pile (draw, hand, discard) and stops drawing for the rest of the combat. Resurrection reverses it: if a qualifying unit comes back alive, its cards become draw-eligible again. Cards with no requirements never evaporate. The point is to avoid dead draws: the MTG-style problem of pulling a card nothing on the board can actually play.

AP works on a two-tier pool: each unit has its own AP (consumed first), then a shared pool. Cards never cost MP; movement never costs AP. Every turn, you discard and redraw your full hand; nothing carries over. **Synergies** kick in when multiple deployed units share a race or class, and both sides can observe and reason about them.

## How I carved it up

Now for the architecture. I'll dig into specific systems in follow-up posts because there are a few I'm really proud of, but here's the overview. The codebase splits into layers with distinct responsibilities:

- **Managers** own authoritative state: `DeckManager`, `APManager`, `HexBoardManager`, `StatusManager`, `TurnManager`.
- **Resolvers** handle logic without owning state: `EffectResolver`, `TargetResolver`, `StepResolver`.
- **Orchestrators** sequence operations: `ActionRunner`, `ActionFactory`, `CombatOrchestrator`.
- **Trackers** aggregate derived information: `SynergyTracker`, `StatusTracker`.
- **Entities** are scene nodes: `Unit`, `Projectile`, visual components.
- **Data** lives in Resource subclasses: `.tres` files authored in the Inspector and injected at runtime.

One distinction I care about: **pure modules** versus **glue code**. Some systems are deliberately game-ignorant; they don't know what a unit is, what a card is, or what evaporation means, and they could ship as a standalone library. The glue code wires those modules into game-specific concepts, and that's where all the coupling lives. One place, instead of spread across the codebase.

The three systems below are all on the pure-module side.

## Stats, state machines, and effects

### Stats

`Stat` is a value object: a base value plus a list of applied modifiers. Modifiers come in four types:

```gdscript
# godot_modules/stats/stat_modifier.gd
enum Type { FLAT, PERCENT_ADD, PERCENT_MULT, OVERRIDE }
```

When recalculated, they apply in order: flat additions first, then additive percentage bonuses, then multiplicative percentage bonuses, then any override (highest priority wins).

```gdscript
# godot_modules/stats/stat.gd (abbreviated)
func _calculate_modified_value() -> void:
    var flat_total: int = 0
    var percent_add_total: float = 0.0
    var percent_mult_total: float = 1.0
    var override_value: Variant = null

    for modifier in _modifiers:
        match modifier.type:
            StatModifier.Type.FLAT:
                flat_total += modifier.value
            StatModifier.Type.PERCENT_ADD:
                percent_add_total += modifier.value / 100.0
            StatModifier.Type.PERCENT_MULT:
                percent_mult_total *= (1.0 + modifier.value / 100.0)
            StatModifier.Type.OVERRIDE:
                if modifier.priority > highest_override_priority:
                    override_value = int(modifier.value)
    # ...
```

`ResourceStat` extends `Stat` with a `current_value` that tracks consumption separately from the cap. HP, MP, AP, and Block are all `ResourceStat` instances: each has a maximum and a remaining amount, and emits `depleted` when current hits zero.

Neither class knows what a unit is. `UnitCombatState` owns the stat instances and wires them to game logic. That's the glue layer's job.

### State machine

The contract is simple: a `State` returns a new `State` from `input()`, `process()`, or `physics_process()` to trigger a transition. Return `null` and nothing changes.

```gdscript
# godot_modules/state_machine/state.gd
func enter() -> void: pass
func exit() -> void: pass
func input(_event: InputEvent) -> State: return null
func process(_delta: float) -> State: return null
func physics_process(_delta: float) -> State: return null
```

`StateMediator` handles dependency injection: it holds an `injections` dictionary and pushes references into each child state before they run. States don't reach out for what they need. It arrives.

This powers `InputManager`, which routes all player input to the active phase (neutral, unit selected, card selected, targeting, deploying). The story behind replacing a 380-line hand-rolled input monolith with this is a post on its own.

### Effects

This one is two lines:

```gdscript
# godot_modules/effects/effect.gd
@abstract class_name Effect extends Resource

# godot_modules/effects/effect_handler.gd
@abstract class_name EffectHandler extends Node
```

That's the module. `Effect` is a `Resource` subclass: pure data, authorable in the Inspector, no runtime dependencies. The game defines concrete subtypes: damage, heal, AP changes, displacement, status application, and a few others.

How effects actually get applied is all on the game side: the routing, the shared context that threads through a card's steps, the resolver that dispatches each subtype. That's the glue. The module stays ignorant, the coupling stays in one place.

## What's next

A lot left to cover. There's plenty to say about the cards-as-data system. The AI pipeline has gone through a few generations and has stories to tell. And units and their nuances deserves their own post as well.

Stay tuned!
