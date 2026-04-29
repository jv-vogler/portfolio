---
adr: 0016
title: "Lock the board during animations; keep the hand live"
status: accepted
date: 2026-04-18
tags: [ux, input, engine]
supersedes: null
superseded_by: null
---

# ADR 0016 — Lock the board during animations; keep the hand live

## Context

During a cast animation, the game must prevent the player from starting a second cast on the board — effects would race. The naive approach is to disable all input.

But disabling all input also hides the hand, cancels hover tooltips, and makes the cancel button unresponsive. Players feel frozen.

## Decision

Introduce **board lock** as a narrower concept than **input disable**. `ActionRunner` emits `input_should_block` / `input_should_unblock` around data-resolving phases. `InputManager.lock_board()` sets `_board_locked = true`; hex clicks, hex hovers, and `play_card_on_caster` become no-ops. Card clicks, cancel, and pass-turn remain live. The friendly portrait bar dims to alpha 0.5; the enemy bar stays fully interactive so right-click inspect still works.

`InputManager.disable()` is separate — used only for full enemy turn / combat end.

## Alternatives considered

- **Disable all input during animation** — Rejected. Makes the UX feel unresponsive; players click, nothing happens, no feedback.
- **Buffer inputs and replay post-animation** — Rejected. Sequence ambiguity + bugs from resolving intent against a different board state.

## Consequences

- **Positive:** Animations feel smooth because the player stays oriented. They can cancel, read tooltips, inspect.
- **Positive:** Reading a damage number during a cast is possible without fighting the UI.
- **Negative:** Two lock concepts (board vs. full disable). Worth the cost; their semantics differ meaningfully.

## Verification

`grep -n "input_should_block\|input_should_unblock" src/systems/combat/orchestrators/action_runner.gd` — confirms the lifecycle.

## Notes for future content

- Anchor for "Board-lock without input-lock" (ideas §4.4).
- Great micro-essay on UX-is-not-binary.
