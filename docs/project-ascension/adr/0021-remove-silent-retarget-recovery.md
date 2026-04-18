---
adr: 0021
title: "Remove silent RETARGET recovery from the InterruptLayer"
status: accepted
date: 2026-04-18
tags: [ai]
supersedes: null
superseded_by: null
---

# ADR 0021 — Remove silent RETARGET recovery from the InterruptLayer

## Context

The AI's `InterruptLayer` validates each step just before execution. Originally, if the planned target had died or become invalid, the layer performed a silent `RETARGET` — picking a new live enemy and continuing the cast. This produced ghosts in the data: the AI cast cards on targets it had never planned for. Combined with other coordination bugs, it manifested as "phantom extra attacks."

## Decision

Remove `RETARGET`. On invalid-target, the recovery is `SKIP`: skip the step, continue the plan, log `[STEP SKIPPED]`. Remaining recovery actions: `SKIP`, `ABORT_MOVE`, `REPLAN` (bounded at `MAX_REPLANS = 1`).

## Alternatives considered

- **Keep RETARGET but restrict to "similar" targets** — Rejected. "Similar" is a fuzzy spec; any rule that makes the silent mutation safe is better implemented at plan time (PlanValidator).
- **Keep RETARGET but log loudly** — Rejected. The problem is the silent intent mutation, not the logging.

## Consequences

- **Positive:** AI output matches AI plan. Debug traces tell you the truth.
- **Positive:** `PlanValidator` (plan-time legality gate) became the right place to prevent invalid targets ever reaching execution.
- **Negative:** More `[STEP SKIPPED]` events in debug; acceptable.

## Verification

`grep -n "RETARGET\|retarget" src/systems/combat/ai/interrupt_layer.gd` — expect no usages.

## Notes for future content

- Short post: "Why we removed silent RETARGET recovery" (ideas §2.11). Great "recovery actions must be conservative" sidebar.
