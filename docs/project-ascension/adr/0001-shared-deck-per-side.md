---
adr: 0001
title: "Use one shared deck per side, not per-unit decks"
status: accepted
date: 2026-04-18
tags: [design, cards]
supersedes: null
superseded_by: null
---

# ADR 0001 — Use one shared deck per side, not per-unit decks

## Context

The game's positioning is "Final Fantasy Tactics meets Slay the Spire." Slay the Spire has one deck; tactical RPGs typically have one skill set per unit. A deckbuilder with a tactical roster has two legitimate topologies:

- **Per-unit decks** — each unit owns its cards; drawing Archer cards can only help the Archer act.
- **Shared deck** — one deck per side, pooling every unit's contributed cards; any card may be played by a unit that meets its requirements.

Roster composition needs to _feel strategic_. Per-unit decks give strategy via unit picks. Shared decks give strategy via unit picks _and_ via the emergent coherence of the combined pool.

## Decision

Use **one shared deck per side**. All units on a side draw from and cast into the same pool. See `src/systems/combat/managers/deck_manager.gd` and `docs/GAME_DESIGN.md §Design Invariants §1`.

## Alternatives considered

- **Per-unit decks** — Rejected. Makes roster composition feel additive (each new unit = a little more deck) rather than multiplicative (each new unit changes what every other unit can combo with). Also makes "draw four cards" a per-unit mechanic that multiplies cognitive load at draw time.
- **Shared deck with unit-locked subpiles** — Rejected as a middle ground that carries the cognitive cost of both designs.

## Consequences

- **Positive:** Synergies between units matter at the _draw_ level, not just on the board. Card hand is a single readable surface. Enables "Any ally can cast GENERAL cards" as a clean invariant.
- **Positive:** Forces evaporation mechanics (ADR-0002) to keep the deck viable as units die, which turns out to be excellent tactical pressure.
- **Negative:** Losing a key unit can leave cards in the deck with no legal caster. Evaporation is the load-bearing fix, but it's a harder rule to teach than "that unit's cards go away."
- **Negative:** Hand size feels small (5 cards shared across ≥3 units). This is counter-intuitive tuning territory; shown to work via playtesting but worth watching.

## Verification

`grep -r "deck_per_unit\|per_unit_deck" src/` — no hits expected. Hand is drawn into `DeckManager._hand_by_side`, keyed by side (not by unit).

## Notes for future content

- Anchor post for "Why a shared deck instead of per-unit decks" (see `blog-post-ideas.md` §1.2).
- Pair with ADR-0002 (evaporation) and ADR-0022 (tier derived) when writing the full card-system deep dive.
