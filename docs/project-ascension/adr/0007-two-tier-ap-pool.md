---
adr: 0007
title: "Two-tier AP pool (per-unit + shared)"
status: accepted
date: 2026-04-18
tags: [design, economy]
supersedes: null
superseded_by: null
---

# ADR 0007 — Two-tier AP pool (per-unit + shared)

## Context

Action Points are the resource spent to play cards. Three topologies were considered:

- **Per-unit AP only** — each unit has its own pool; no shared. Simple but flat: every turn looks the same, no "burst" strategies.
- **Shared pool only** — one pool per side; any unit spends freely. Maximum flexibility but one unit can hoard every turn.
- **Two-tier** — each unit has a small personal AP pool + a shared side-level pool. Unit AP spends first; shared covers overflow.

## Decision

Use a **two-tier pool**. Unit AP is consumed first when a unit plays a card; any remaining cost comes from the shared pool. Shared pool grows by `shared_pool_increment` each turn, capped at `max_shared_pool`. Current tuning: unit_ap=1 per turn, shared starts at 3, cap 3, +1/turn. See `docs/design/economy.md` and `src/systems/combat/managers/ap_manager.gd`.

## Alternatives considered

- **Per-unit only** — Rejected (flat, unrewarding).
- **Shared only** — Rejected (enables one-unit dominance; the AI case for ADR-0019 wouldn't even arise).
- **Per-unit with ability to donate** — Rejected as too fiddly for UI and for AI reasoning.

## Consequences

- **Positive:** Creates real tension between "spread plays" and "burst on one unit." Both strategies are valid.
- **Positive:** The AI coordination layer (ADR-0019) has a meaningful resource to arbitrate. Without shared AP there is nothing to coordinate.
- **Negative:** Explaining the pool to a new player takes a paragraph. UX work (a shared-AP gem row in the `BottomCommandBar`) compensates.
- **Negative:** Tuning space is large — unit_ap, shared_start, shared_cap, shared_increment, card costs — all interact.

## Verification

`grep -n "shared_pool\|unit_ap" src/systems/combat/managers/ap_manager.gd` — confirm the two are separate fields and spending consumes unit first.

## Notes for future content

- Direct anchor for "The two-tier AP pool" post (ideas §9.2).
- Required context for any AI coordination post (cite ADR-0019 alongside).
