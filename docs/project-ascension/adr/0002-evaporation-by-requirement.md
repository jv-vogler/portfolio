---
adr: 0002
title: "Card evaporation is driven by requirements, not tier"
status: accepted
date: 2026-04-18
tags: [design, cards]
supersedes: null
superseded_by: null
---

# ADR 0002 — Card evaporation is driven by requirements, not tier

## Context

With a shared deck (ADR-0001), the deck needs a rule for what happens when a unit dies. Two models were considered:

- **Tier-based evaporation** — cards have an explicit tier (General / Race-Class / Signature); the engine matches tier against surviving roster and removes the obvious mismatches.
- **Requirement-based evaporation** — cards have requirement fields (`required_unit_id`, `required_class`, `required_race`); a card evaporates when no alive unit on its side satisfies its requirement. Tier, if needed for UI, is _derived_ from which requirement is set.

The first is simpler to explain; the second is strictly more expressive because requirements compose (a card requiring `class=Mage AND race=Elf` is a single authoring choice, not a new tier).

## Decision

Evaporation is driven by a card's **requirements**, not by any tier field. A card with `required_unit_id` evaporates when that unit dies; with `required_class`, when no alive unit of that class remains; with `required_race`, when no alive unit of that race remains. Cards with no requirements never evaporate. See `docs/GAME_DESIGN.md §Design Invariants §2`.

## Alternatives considered

- **Tier as storage** — Rejected. Tier becomes a cached duplicate of the real source of truth (the requirement fields), creating two places to edit when the authoring model changes.
- **Tier as override** — Rejected. Lets authors mismatch tier and requirements, which is a silent footgun.

## Consequences

- **Positive:** The card resource has one authoritative cause per removal. `CardData.derive_tier()` computes the tier for presentation (border glyph) without ever being load-bearing.
- **Positive:** Composing requirements (e.g. class + race) is free; the removal logic is one rule, not a matrix.
- **Negative:** Tooltips and UI have to handle "why is this card gone" cases carefully; "unit died" and "no matching class left" produce the same outcome but deserve different messaging.

## Verification

`grep -r "tier" src/data/cards/` — ensure `tier` is never a stored field on `CardData`; only derived via `derive_tier()`.

## Notes for future content

- Anchor for the "Evaporation as a deckbuilding corrective" post (ideas §9.1).
- Good sidebar when explaining why the game has no `CardTier` enum stored on resources.
