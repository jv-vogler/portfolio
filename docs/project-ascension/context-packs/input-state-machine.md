# Context Pack — Input State Machine

## Subject

The input state machine that routes all player input in combat: from hex click to card cast, including cancellation, multi-target selection, and board locking.

## Canonical terms

- **InputManager** — facade exposing the public API to `battle_scene.gd`. Internally delegates to a state machine.
- **InputPhase** — the abstract base (`_input_phase.gd`) extending `State`. All concrete states extend this.
- **InputContext** — shared mutable bag injected into every state: `selected_unit`, `selected_card`, `selected_caster`, `target_hex`, `deploy_unit_data`, etc.
- **States** — `DisabledState`, `NeutralState` (aka `IdleState`), `UnitSelectedState`, `CardSelectedState`, `TargetingState`, `MultiTargetingState`, `DeployingState`.
- **Board lock** — narrower than input disable. Blocks hex clicks / hovers / `play_card_on_caster` but leaves hand, cancel, pass-turn live.
- **CastPreviewController** — highlights valid casters + range when hovering a card.

Avoid:

- "input manager class" as a synonym for the state machine. `InputManager` is the facade; the state machine lives inside.
- "disabled" and "locked" as synonyms. They are different invariants.

## Key claims

1. `InputManager` is a facade (like `TurnManager`) over a state machine in `godot_modules/state_machine/`. Public API is unchanged from the pre-refactor era. Source: `game/docs/superpowers/specs/2026-03-29-input-state-machine-refactor-design.md`.
2. The state machine is built exactly once; subsequent `enable()` calls reset `InputContext` and return to NEUTRAL. Source: `game/docs/features/FEATURE_INPUT.md §Invariants`.
3. `disable()` sets `state_machine.paused = true`; all `_current_phase()` calls return null while paused. Used for enemy turn and combat end. Source: `FEATURE_INPUT.md`.
4. `lock_board()` sets `_board_locked = true`; hex clicks, hex hovers, and `play_card_on_caster` no-op. Card clicks, cancel, and pass-turn remain live. Source: ADR-0016, `FEATURE_INPUT.md`.
5. Portrait right-click **opens** the detail modal; it never toggles closed. ESC and the close button are the only closers. Source: `FEATURE_INPUT.md §Invariants`.
6. `DRAG_THRESHOLD` arbitrates click vs. drag; `_DOUBLE_CLICK_INTERVAL = 0.3s` arbitrates click vs. double-click (quick-cast). Source: `FEATURE_CARD_UI.md`.
7. Cast preview fires only in NEUTRAL / UNIT_SELECTED; ignored during active targeting or drag. Source: `FEATURE_CARD_UI.md §Invariants`.
8. The refactor replaced a ~380-line monolithic `InputManager` that had five related bugs traced to implicit state. ADR-0015.

## Invariants

- Only one `InputPhase` handles events at a time; all others are inert.
- `InputContext.reset()` clears every field. No state-specific cleanup inside individual states.
- Right-click never simultaneously closes the detail modal and fires `on_cancel()`.
- Board-lock dims the friendly portrait bar to alpha 0.5; the enemy bar stays interactive so RMB inspection works on enemies during animations.

## Citations

### Abstract base

`game/src/systems/combat/input_states/_input_phase.gd:1-23`:

```gdscript
@tool
@abstract
class_name InputPhase extends State

var board_manager: HexBoardManager
var ap_manager: APManager
var deck_manager: DeckManager
var card_resolver: CardResolver
var target_resolver: TargetResolver
var player_phase: PlayerPhase
var ctx: InputContext

var disabled_state: InputPhase
var idle_state: InputPhase
var unit_selected_state: InputPhase
var card_selected_state: InputPhase
var committed_state: InputPhase
var multi_targeting_state: InputPhase
var deploying_state: InputPhase

func on_hex_clicked(_coord: Vector2i) -> void:
    pass
```

### Concrete state handler

`game/src/systems/combat/input_states/idle_state.gd:9-18`:

```gdscript
func on_hex_clicked(coord: Vector2i) -> void:
    var unit := board_manager.get_unit_at(coord)
    if not unit:
        return
    if unit.side != BoardEnums.Side.PLAYER:
        return
    if not unit.is_alive():
        return
    ctx.selected_unit = unit
    transition_to.emit(unit_selected_state)
```

### The original bugs (from the spec)

Source: `game/docs/superpowers/specs/2026-03-29-input-state-machine-refactor-design.md §Context`:

- Crash: `_selected_card` was null when `_handle_card_selected_hex_click` called `card_resolver.can_play()`, surfacing as `"Nonexistent function 'can_be_cast_by' in base 'Nil'"`.
- Cancel in UNIT*SELECTED of a \_different* unit undid movement instead of deselecting.
- Clicking empty space did nothing when a unit was selected.
- `_flow_origin` enum hack to track where TARGETING was entered from.

### State list

| State           | Purpose                                 |
| --------------- | --------------------------------------- |
| DISABLED        | all methods no-op                       |
| NEUTRAL / IDLE  | click to select unit or start deploy    |
| UNIT_SELECTED   | move or select card                     |
| CARD_SELECTED   | click caster to enter TARGETING         |
| TARGETING       | hover for AOE preview, click to resolve |
| MULTI_TARGETING | slot-by-slot multi-target selection     |
| DEPLOYING       | place unit on valid deploy hex          |

### Board lock wiring

From `FEATURE_INPUT.md`:

- `ActionRunner.input_should_block` → `InputManager.lock_board()`
- `ActionRunner.input_should_unblock` → `InputManager.unlock_board()`
- `InputManager.board_lock_changed(is_locked)` → `BattleScene._paint_board_for_state()`
- `InputManager.board_lock_changed` → `PortraitBar.set_input_blocked` → `PortraitBase.set_input_blocked`

## Related ADRs

- [ADR-0015](../adr/0015-input-state-machine-replaces-monolith.md)
- [ADR-0016](../adr/0016-board-lock-not-input-lock.md)

## Related posts

None yet.

## Last updated

2026-04-18
