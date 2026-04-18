---
adr: 0003
title: "`consume_on_play` is orthogonal to evaporation"
status: accepted
date: 2026-04-18
tags: [design, cards]
supersedes: null
superseded_by: null
---

# ADR 0003 — `consume_on_play` is orthogonal to evaporation

## Context

ADR-0002 defined evaporation (requirement-driven permanent removal). A separate question emerged: some cards should be **one-shot per combat** — playable exactly once even if their requirement is still satisfied. The temptation is to model "one-shot" as a special tier (e.g. Signature = one-shot). This couples two unrelated mechanics.

## Decision

`consume_on_play: bool` is a field on `CardData` independent of tier and requirements. A card with `consume_on_play = true` is removed permanently when played (not sent to the discard pile) and tracked per-side via `resource_path` in `DeckManager`. Signature cards are authored as one-shot today, but any tier can be one-shot by flipping the flag. Evaporation and consume-on-play are separate invariants. See `docs/GAME_DESIGN.md §Design Invariants §3`.

## Alternatives considered

- **Bundle with tier** — Rejected. Couples "this card is unit-specific" with "this card is one-shot," which are different axes.
- **Consume-by-requirement** — Rejected. Would make requirement mutation suddenly affect whether a card is consumed; fragile.

## Consequences

- **Positive:** Two removal mechanisms (evaporation, consume) compose cleanly. A signature card that gets consumed is still evaporation-free before its unit dies; it just can't be replayed.
- **Positive:** Enables future design space (one-shot general cards, non-signature class finishers).
- **Negative:** Any card-re-injection mechanism (resurrection, copy effects) must call `DeckManager.filter_spent()` or it will re-introduce spent one-shots. The invariant is load-bearing.

## Verification

`grep -rn "consume_on_play" src/` — expect usages in `DeckManager`, `CardData`, and the card `.tres` resources themselves.

## Notes for future content

- Small, specific post: "consume_on_play is orthogonal to evaporation" (ideas §9.4).
- Cite this ADR whenever resurrection mechanics are discussed.
