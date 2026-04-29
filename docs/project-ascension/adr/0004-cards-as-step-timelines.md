---
adr: 0004
title: "Cards are authored as Step timelines, not trigger tables"
status: accepted
date: 2026-04-18
tags: [arch, cards]
supersedes: null
superseded_by: null
---

# ADR 0004 — Cards are authored as Step timelines, not trigger tables

## Context

A card in a tactical deckbuilder needs to express: animation, movement of the caster, projectile travel, collision reactions, multi-target effect application, conditional branches, repeat loops, and deck operations. Common patterns for encoding this:

- **Trigger table / event-based DSL** — each card is a set of (trigger → handler) pairs.
- **Scripted cards** — each card has its own GDScript; maximum expressiveness but no authoring tools.
- **Step timeline** — each card is an ordered `Array[CardStep]` where steps are first-class data (`PlayCasterAnimation`, `MoveCasterStep`, `DisplaceTargetsStep`, `SpawnProjectileStep`, `ApplyEffectsToTargetsStep`…).

Godot's Inspector is a powerful authoring surface _if_ the authored thing is a Resource. A step timeline maps naturally onto that.

## Decision

Cards are authored as `Array[CardStep]` on `CardData.steps`. Each step is a `Resource` subclass; steps are executed in order by `StepResolver`. Control-flow steps (`ForEachTargetStep`, `RepeatStep`, `ConditionalStep`) compose the rest. Effects and AmountSources are further nested Resources within steps. No card is authored in code. See `docs/design/cards.md §Steps` and `.rules/cards-authoring.md`.

## Alternatives considered

- **Trigger table** — Rejected. Harder to express ordering and per-step side effects (e.g. "move caster, _then_ fire projectile from the new position"). Poor fit for the Inspector.
- **Scripted cards** — Rejected. Every new card becomes a code review; no designer-authorable loop.

## Consequences

- **Positive:** New cards without code. A designer can ship a card by composing `.tres` files.
- **Positive:** Rich reuse — `DisplaceTargetsStep.on_collision_steps` can contain another full timeline, making "push and if you hit a wall, deal damage" one authored thing.
- **Positive:** Data-driven AI can inspect steps directly (`CardProfile` in the AI uses this).
- **Negative:** The authoring surface is nested. A card with 3 levels of substeps is hard to read in the Inspector without UX help.
- **Negative:** Control-flow steps (`ForEachTargetStep` in particular) need an accepted interaction with `EffectContext` (see ADR-0005) or subtle bugs appear.

## Verification

`ls resources/cards/` — every card is a `.tres`. `grep "class_name CardStep" src/data/cards/card_steps/` — many subclasses expected, none of them scripts on cards.

## Notes for future content

- Flagship post: "Cards as timelines, not triggers" (ideas §3.1).
- Good companion for tutorials — a concrete `.tres` walkthrough makes this tangible.
