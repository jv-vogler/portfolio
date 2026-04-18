---
adr: 0006
title: "Full hand redraw each turn; no carry-over"
status: accepted
date: 2026-04-18
tags: [design, economy]
supersedes: null
superseded_by: null
---

# ADR 0006 — Full hand redraw each turn; no carry-over

## Context

Slay the Spire redraws the full hand each turn. Other deckbuilders (Monster Train, Inscryption) allow carry-over. A tactical deckbuilder has extra complexity — positioning decisions span multiple turns, and a held card is sometimes the right tool _next_ turn.

The tension:

- **Carry-over** rewards planning across turns and enables "save this card for the right moment" tactics.
- **Full redraw** forces decisive use of the current hand, keeps turns cognitively bounded, and makes the deck legible ("this is what you have _now_").

## Decision

At end-of-turn, the entire hand is discarded; at draw phase, `hand_size` new cards are drawn. No card carries between turns. See `docs/GAME_DESIGN.md §Design Invariants §7` and `docs/design/cards.md`.

## Alternatives considered

- **Carry-over with hand cap** — Rejected. Adds "when do I hold?" as a distinct decision stream that competes with positioning.
- **Optional retain (like Slay the Spire's Retain keyword)** — Deferred. Not rejected forever; may surface as a card-specific keyword if a card's identity requires it.

## Consequences

- **Positive:** Turn cognition is bounded. The player looks at the hand, looks at the board, and decides — no "but I had that one card in reserve."
- **Positive:** Tuning pressure on deck thinning and draw quality is clearer; every card in the deck matters every cycle.
- **Negative:** Cards that want to _set up_ a future turn (e.g. "next turn, your next attack deals +3") become harder to design cleanly.
- **Negative:** Low hand sizes (e.g. 5) plus shared decks (ADR-0001) plus multiple units make bad draws feel punishing. This is real; watched via playtesting.

## Verification

`grep -n "discard_hand\|draw_hand" src/systems/combat/managers/deck_manager.gd` — confirm `end_turn` discards all, `draw_phase` draws `hand_size` from scratch.

## Notes for future content

- Deep-dive candidate: "Full-hand redraw, every turn" (ideas §9.3).
- Reference when discussing deck thinning or hand-size tuning posts.
