---
adr: 0008
title: "MP and AP are independent resources"
status: accepted
date: 2026-04-18
tags: [design, economy, board]
supersedes: null
superseded_by: null
---

# ADR 0008 — MP and AP are independent resources

## Context

Many tactical RPGs blend movement and action into one resource — move costs "action points," spells cost them too, the player trades one for the other. It's familiar but it also makes every turn a zero-sum optimization: move _or_ act.

Project Ascension is a deckbuilder. Cards are already the expressive axis; movement needs to _enable_ cards, not compete with them.

## Decision

Movement Points (MP) and Action Points (AP) are completely independent. Moving never costs AP; playing a card never costs MP. A unit can move _and_ play cards in the same turn. MP refreshes at upkeep, fully clears at end of turn (no banking). See `docs/GAME_DESIGN.md §Design Invariants §4` and `docs/design/economy.md`.

## Alternatives considered

- **Blended pool** — Rejected. Makes the deckbuilder identity weaker; turns every turn into a budget puzzle rather than a tactics + cards decision.
- **Movement costs AP but at a discount** — Rejected. The discount is an arbitrary tuning knob with no design intent behind it.

## Consequences

- **Positive:** Clean mental model: "move, then cast." Turns play faster.
- **Positive:** Cards that scale with movement (`ScaleByTraveledDistance`) become a distinct design axis rather than a cost trade-off.
- **Positive:** AI reasoning separates cleanly — positioning considers MP; intent scoring considers AP. The two layers don't interfere.
- **Negative:** Loses "last-ditch sprint" design space ("burn all my AP to flee farther").
- **Negative:** Balance pressure on MP is entirely about map reach, not card cost offset.

## Verification

`grep -rn "mp.*ap\|ap.*mp" src/systems/combat/` — no function should read both and trade them. Movement code reads `unit.mp`; card cost code reads `unit.own_ap + shared_pool`. The two never meet.

## Notes for future content

- Pairs with ADR-0007 as the "economy is two resources, not one" argument.
- Mention in any Final Fantasy Tactics comparison post (it's where players will expect blended costs).
