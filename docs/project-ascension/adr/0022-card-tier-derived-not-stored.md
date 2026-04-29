---
adr: 0022
title: "Card tier is derived at runtime, not stored"
status: accepted
date: 2026-04-18
tags: [design, cards]
supersedes: null
superseded_by: null
---

# ADR 0022 — Card tier is derived at runtime, not stored

## Context

Player-facing UI distinguishes three card tiers — GENERAL, RACE_CLASS, SIGNATURE — by border and glyph. The question is whether that tier is stored on `CardData` or derived from other fields (requirement gating). `CardData` already has `required_unit_id`, `required_class`, `required_race`; tier is a function of which are set.

Storing tier explicitly creates two places to edit when authoring and invites desync ("tier says GENERAL but it has a required_class").

## Decision

`CardData` does **not** store tier. `CardData.derive_tier()` computes it from the set requirement field(s) at runtime. The `card_type` field on `CardData` stores the **category** (ATTACK / UTILITY) — not the tier — so "attack" / "utility" is authored explicitly. See `docs/design/cards.md §Card Properties`.

## Alternatives considered

- **Store tier as a field** — Rejected (desync risk, double-source-of-truth).
- **Compute both category and tier** — Rejected. Category is author intent for Silence gating; it's not inferable from anything else.

## Consequences

- **Positive:** Single source of truth. Changing a card's requirement changes its tier automatically.
- **Positive:** Evaporation (ADR-0002) and tier share the same source — reinforces conceptual clarity.
- **Negative:** The field name `card_type` confuses readers who expect tier; counter-intuitive that `card_type` is really "category." Documented prominently in `GAME_DESIGN.md`.

## Verification

`grep -n "derive_tier\|tier" src/data/cards/card_data.gd` — tier is a function, not a stored property.

## Notes for future content

- Short post: "What a 'card tier' actually means here" (ideas §1.4).
