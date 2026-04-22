# ADR Index

Running table of all Architecture Decision Records for Project Ascension. Sorted by number. Newest at the bottom.

| #                                                     | Title                                                    | Status   | Date       | Tags                |
| ----------------------------------------------------- | -------------------------------------------------------- | -------- | ---------- | ------------------- |
| [0001](0001-shared-deck-per-side.md)                  | Use one shared deck per side, not per-unit decks         | accepted | 2026-04-18 | design, cards       |
| [0002](0002-evaporation-by-requirement.md)            | Card evaporation is driven by requirements, not tier     | accepted | 2026-04-18 | design, cards       |
| [0003](0003-consume-on-play-orthogonal.md)            | `consume_on_play` is orthogonal to evaporation           | accepted | 2026-04-18 | design, cards       |
| [0004](0004-cards-as-step-timelines.md)               | Cards are authored as Step timelines, not trigger tables | accepted | 2026-04-18 | arch, cards         |
| [0005](0005-shared-effect-context.md)                 | One shared mutable EffectContext per card cast           | accepted | 2026-04-18 | arch, cards         |
| [0006](0006-full-hand-redraw-each-turn.md)            | Full hand redraw each turn; no carry-over                | accepted | 2026-04-18 | design, economy     |
| [0007](0007-two-tier-ap-pool.md)                      | Two-tier AP pool (per-unit + shared)                     | accepted | 2026-04-18 | design, economy     |
| [0008](0008-mp-and-ap-independent.md)                 | MP and AP are independent resources                      | accepted | 2026-04-18 | design, economy     |
| [0009](0009-one-unit-per-hex.md)                      | Strict one-unit-per-hex occupancy                        | accepted | 2026-04-18 | design, board       |
| [0010](0010-typed-signals-only.md)                    | Typed signals only; no string-based connect              | accepted | 2026-04-18 | engine, arch        |
| [0011](0011-export-wiring-over-paths.md)              | Wire dependencies via `@export var`, never string paths  | accepted | 2026-04-18 | engine, arch        |
| [0012](0012-resources-as-config.md)                   | Resource subclasses as injected config                   | accepted | 2026-04-18 | engine, arch        |
| [0013](0013-ui-observes-never-mutates.md)             | UI observes game state; never mutates it                 | accepted | 2026-04-18 | engine, ui          |
| [0014](0014-autoload-last-resort.md)                  | Autoloads are a last resort                              | accepted | 2026-04-18 | engine, arch        |
| [0015](0015-input-state-machine-replaces-monolith.md) | Replace monolithic InputManager with state machine       | accepted | 2026-04-18 | engine, arch, input |
| [0016](0016-board-lock-not-input-lock.md)             | Lock the board during animations, not the hand           | accepted | 2026-04-18 | ux, input           |
| [0017](0017-ai-sense-think-act-pipeline.md)           | AI follows Sense–Think–Act with separate phases          | accepted | 2026-04-18 | ai, arch            |
| [0018](0018-intent-generator-registry.md)             | Intent kinds are a plugin registry                       | accepted | 2026-04-18 | ai, arch            |
| [0019](0019-team-context-per-turn-snapshot.md)        | Team coordination via a per-turn TeamContext snapshot    | accepted | 2026-04-18 | ai                  |
| [0020](0020-composite-score-vector-dormant-ship.md)   | Ship composite scoring dormant until calibrated          | accepted | 2026-04-18 | ai, process         |
| [0021](0021-remove-silent-retarget-recovery.md)       | Remove silent RETARGET recovery from the InterruptLayer  | accepted | 2026-04-18 | ai                  |
| [0022](0022-card-tier-derived-not-stored.md)          | Card tier is derived at runtime, not stored              | accepted | 2026-04-18 | design, cards       |
| [0023](0023-displacement-orthogonal-to-movement.md)   | Displacement ignores MP and composes with it             | accepted | 2026-04-18 | design, board       |
| [0024](0024-rule-files-for-llm-teammate.md)           | Keep rule files in `.rules/` for LLM teammates           | accepted | 2026-04-18 | process, ai         |
| [0025](0025-spec-before-plan.md)                      | Design spec precedes implementation plan                 | accepted | 2026-04-18 | process             |

## Adding a new ADR

1. Copy `template.md` to `NNNN-slug.md` where `NNNN` is one higher than the last number in this table.
2. Fill in frontmatter and body.
3. Add a row to this table.
4. Commit with message `docs(adr): add NNNN <slug>`.

## Staleness

Periodically (quarterly) audit this table. For each ADR, run the `Verification` line; if it fails, either:

- Fix the code to honor the decision (preferred), or
- Write a new ADR reversing or superseding it and update the status here.

Never edit a past ADR to "update" it. The whole value proposition is immutability.
