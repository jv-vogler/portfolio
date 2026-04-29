---
adr: 0020
title: "Ship composite scoring dormant until calibrated"
status: accepted
date: 2026-04-18
tags: [ai, process]
supersedes: null
superseded_by: null
---

# ADR 0020 — Ship composite scoring dormant until calibrated

## Context

The old AI scored each intent with a single `estimated_value: float`. This scalar worked for simple heuristics but collapses multiple signals (damage, survival, positioning) into one number, which is hard to tune. A richer model was designed: `ScoreVector` with six dimensions (damage, survival, positioning, synergy, tempo, support), reduced via `WeightProfile.weighted_sum(vector)` at commit time, with per-unit dynamic preset selection (`NEUTRAL`, `HEALTHY_LOW`, `HEALTHY_DESPERATE`, `CRITICAL`, `LAST_UNIT`).

The risk: turning this on before it's calibrated would regress existing AI quality. The fixture library isn't large enough to calibrate weights yet.

## Decision

Ship `ScoreVector` + `WeightProfile` as fully-wired infrastructure but **dormant** behind `AIConfig.enable_composite_scoring = false`. Legacy scalar scoring remains the default. Generators can opt into populating a vector incrementally; when a vector is null the coordinator falls back to the legacy scalar. Turn the flag on only after a first calibration pass against an expanded fixture library.

## Alternatives considered

- **Ship disabled in code** — Rejected. The infrastructure needs to exist in the main path so generators can be updated against it; a feature branch would bit-rot.
- **Ship enabled immediately** — Rejected. Would regress until calibrated.
- **Ship only the scaffolding, no vectors on generators** — Rejected. Means no generator can be updated without re-opening the branch.

## Consequences

- **Positive:** Generators can be incrementally updated. The dormant path exercises the code path in dev builds (log-only) without affecting decisions.
- **Positive:** Calibration is a discrete enable-flag flip with a clean rollback.
- **Negative:** Two scoring paths live in the codebase simultaneously. Discipline required to keep the dormant one in sync.

## Verification

`grep -n "enable_composite_scoring" src/data/combat/config/ai_config.gd` and `src/systems/combat/ai/turn_coordinator.gd`. Flag must default false until the follow-up ADR flips it.

## Notes for future content

- Process post: "From scalar heuristics to a score vector" (ideas §2.2) — include the dormant-feature-flag pattern as a sidebar.
