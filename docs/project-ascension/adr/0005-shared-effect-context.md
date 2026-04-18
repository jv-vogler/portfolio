---
adr: 0005
title: "One shared mutable EffectContext per card cast"
status: accepted
date: 2026-04-18
tags: [arch, cards]
supersedes: null
superseded_by: null
---

# ADR 0005 — One shared mutable EffectContext per card cast

## Context

Steps in a card timeline (ADR-0004) need to communicate. A `DisplaceTargetsStep` may need to tell a later `ApplyEffectsToTargetsStep` how far a target was pushed, or which unit was collided with. The options:

- **Immutable context, pass-forward** — each step returns a new context. Clean but verbose, and GDScript Resource allocation is not free.
- **Shared mutable context** — one `EffectContext` instance threads through all steps in a cast; steps write and read keys on it.
- **No context; re-derive** — each step recomputes from the board state. Loses "just-happened" information (e.g. `traveled_distance` is no longer derivable once the unit has moved).

## Decision

Use **one shared mutable `EffectContext`** per cast. All steps in a card read and write the same instance. Certain keys are conventional (`traveled_distance`, `last_caster_move_direction`, `collision_unit`, etc.); `AmountSource.ScaleByContextValue` reads named keys. The context is created at cast start and discarded at cast end. See `.rules/cards-authoring.md §3`.

## Alternatives considered

- **Immutable chaining** — Rejected. Every step allocation plus a scan of the step list for what fields to carry forward. Overkill for this scale.
- **Re-derivation from board** — Rejected. Would force every step to read the full board to answer "what just happened," and in many cases the information is only available mid-cast.

## Consequences

- **Positive:** Steps compose naturally. `ScaleByContextValue` is a simple lookup.
- **Positive:** Debug-friendly — the context can be dumped at any step boundary.
- **Negative:** Mutability across steps is a correctness pressure. Authoring mistakes (reading a key written by a step that was conditionally skipped) produce silent wrong values.
- **Negative:** Two card casts must never share a context. This is enforced by the `ActionRunner` but is easy to violate if a future refactor pools contexts.

## Verification

`grep -rn "EffectContext" src/systems/combat/` — every cast allocates a fresh instance in `ActionRunner.execute()`. No pooling.

## Notes for future content

- Short, architectural post: "EffectContext: the mutable bag every step writes into" (ideas §3.4).
- Useful sidebar anywhere we discuss step composition.
