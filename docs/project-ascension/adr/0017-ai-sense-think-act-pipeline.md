---
adr: 0017
title: "AI follows a Sense–Think–Act pipeline with separate phases"
status: accepted
date: 2026-04-18
tags: [ai, arch]
supersedes: null
superseded_by: null
---

# ADR 0017 — AI follows a Sense–Think–Act pipeline with separate phases

## Context

The first AI (see `docs/superpowers/specs/2026-04-08-enemy-ai-system-design.md`) was imperative: each unit, in order, picked the best card and cast it. This produced shallow behavior and was hard to test because sensing, scoring, and acting were interleaved.

## Decision

Split AI into distinct phases:

1. **Survey (Sense)** — `SurveyPhase.survey_all(side)` produces `Array[UnitSurvey]` (reachable hexes, playable cards, threat scores) _without side effects_. Also surveys opponents for bidirectional threat.
2. **Intent (Think, local)** — `IntentGenerator.generate_intents(survey)` per unit → `Array[Intent]` (ATTACK, DEFEND, FLEE, UTILITY, ALL_IN, PASS, + registered subtypes). Each intent carries estimated value.
3. **Coordination (Think, global)** — `TurnCoordinator.coordinate(surveys, intents)` → `TurnActionPlan` (ordered `Array[ActionStep]`). Resolves AP contention, card contention, dependency ordering.
4. **Interrupt (pre-act validation)** — `InterruptLayer.validate_step(step)` before execution; recovery actions `SKIP`, `ABORT_MOVE`, `REPLAN`.
5. **Act** — `ActionFactory.create_card_plan()` / `create_movement_plan()` → `ActionRunner.execute()`.

See `docs/features/FEATURE_AI_SYSTEM.md §Turn Pipeline`.

## Alternatives considered

- **Single imperative loop** — The original system; rejected (see spec doc).
- **Behavior trees** — Rejected. Poor fit for "evaluate all options then pick best" scoring semantics.
- **Full tree search / DFS** — Considered in `docs/superpowers/plans/2026-04-09-ai-tree-search-refactor.md`. Deferred; the current pipeline with one-ply `NextTurnPlayability` lookahead covers most of the value at lower cost.

## Consequences

- **Positive:** Each phase is individually testable. `SurveyPhase` has no side effects; it can run against a fixture and be asserted.
- **Positive:** New intent kinds are a pluggable extension (ADR-0018), not a system rewrite.
- **Positive:** Bidirectional threat scoring falls out naturally — surveys can be built from either side's perspective.
- **Negative:** More surface area than a monolith. 6+ files where there used to be one. Worth it.

## Verification

`ls src/systems/combat/ai/` — expect `ai_controller.gd`, `survey_phase.gd`, `intent_generator.gd`, `turn_coordinator.gd`, `interrupt_layer.gd`, plus `intent_generators/` and `estimators/`.

## Notes for future content

- Flagship for the AI series: "Sense–Think–Act, implemented" (ideas §2.3).
