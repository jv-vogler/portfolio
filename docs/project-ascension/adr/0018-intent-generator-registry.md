---
adr: 0018
title: "Intent kinds are a plugin registry"
status: accepted
date: 2026-04-18
tags: [ai, arch]
supersedes: null
superseded_by: null
---

# ADR 0018 — Intent kinds are a plugin registry

## Context

The AI generates several kinds of intents (ATTACK, DEFEND, FLEE, UTILITY, ALL_IN, PASS). New kinds come up as the game adds features (HEAL, PROTECT; later, maybe SETUP, COMBO, BAIT). Two ways to add them:

- **Hardcoded in `IntentGenerator`** — add a new branch, update `TurnCoordinator` if it needs scheduling, risk touching scoring constants.
- **Registry of pluggable generators** — a `IntentGeneratorBase` abstract class; subclasses register themselves in `AIController._create_plan`; coordinator and survey phase don't change.

## Decision

Use the registry model. `IntentGeneratorBase` is the abstract base. Drop a new file in `intent_generators/`, register via `IntentGenerator.add_generator()` in `AIController._create_plan`, and the coordinator picks it up automatically. Scaffolds for `HealGenerator` and `ProtectGenerator` ship dormant (no-op until their cards exist). See `docs/features/FEATURE_AI_SYSTEM.md §IntentGenerator`.

## Alternatives considered

- **Hardcoded branches** — Rejected. Every new intent touches two systems. Scales poorly.
- **Full plugin system with reflection/discovery** — Rejected as overkill. Explicit `add_generator()` calls in one known place are fine.

## Consequences

- **Positive:** New intent kinds are drop-in. Dormant scaffolds are safe.
- **Positive:** Testing one intent kind in isolation is possible.
- **Negative:** Slightly less grep-friendly than a switch statement; readers have to know to look in `intent_generators/`.

## Verification

`grep -n "IntentGeneratorBase" src/systems/combat/ai/` and `ls src/systems/combat/ai/intent_generators/`.

## Notes for future content

- Anchor for "Intent generators as a plugin registry" (ideas §2.4).
