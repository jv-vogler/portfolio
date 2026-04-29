---
adr: 0019
title: "Team coordination via a per-turn TeamContext snapshot"
status: accepted
date: 2026-04-18
tags: [ai]
supersedes: null
superseded_by: null
---

# ADR 0019 — Team coordination via a per-turn TeamContext snapshot

## Context

Two AI units with the same best move against the same target both claim "Crushing Blow" from a shared hand — but the hand has one copy. Similarly: three units all want to dip into the shared AP pool, leaving nothing for the late-turn heal. Both are coordination problems. The AI needs to know, at scoring time, what other units are _about to do_ — without letting one unit's scoring observer-effect another's.

## Decision

Introduce `TeamContext` — a per-turn snapshot computed once in `AIController._create_plan` after intents are generated. It captures:

- Per-unit card demand (boolean per `(unit, card)`), sourced from each unit's _top non-PASS intent only_.
- Per-unit shared-AP demand.
- Team-level `TurnPressure` band (LOW/MED/HIGH/DESPERATE) from `TempoAnalyzer`.

`TurnCoordinator` reads `TeamContext` for:

- The **team-aware AP floor**: `_effective_ap_floor` relaxes to 0 when no other unit demands shared AP.
- The **card-demand penalty**: `team_card_starve_penalty × max(0, K + others_demand[card] − hand_count[card])` subtracted per intent that would starve a teammate.

See `docs/features/FEATURE_AI_SYSTEM.md §TeamContext`.

## Alternatives considered

- **Full multi-unit simulation** — Considered. Rejected as cost-prohibitive for this pipeline; reserved for the tree-search refactor plan.
- **Mutex-style locks on cards** — Rejected. Order-dependent, produces whichever-fires-first artifacts.
- **No coordination; first-come first-served** — The original; produced starvation and hoarding.

## Consequences

- **Positive:** Two concrete bugs disappeared: (a) solo-survivor hoarding, (b) duplicate-card claims. Both were user-visible.
- **Positive:** `TurnPressure` is observable team-wide, so weight profiles (`CRITICAL`, `LAST_UNIT`) have a coherent input.
- **Negative:** The snapshot is a single point of truth that can drift from reality as commit-time re-evaluation changes intents. Mitigated by re-evaluating demand inside the release-aware commit loop.

## Verification

`grep -n "TeamContext" src/systems/combat/ai/` and `grep -n "team_aware_ap_floor\|team_card_starve_penalty" src/data/combat/config/ai_config.gd`.

## Notes for future content

- Two posts directly supported: "Team-aware AP floors" (ideas §2.5) and "The card-demand penalty" (ideas §2.6).
