# Project Ascension — Blog Post Ideas

A running catalog of post topics sourced from the game's codebase, design docs, and decision history. Each entry is a seed: a working title, the angle, what concrete material already exists to mine, and roughly who would read it.

Tag legend:

- **[design]** game design / mechanics
- **[engine]** Godot-specific, engine-level
- **[arch]** software architecture, patterns
- **[ai]** tactical AI systems
- **[ux]** interaction, UX, affordance
- **[process]** workflow, tooling, how sausage is made
- **[narrative]** personal, reflective, showing progress

Difficulty: **S** short (1–2 hrs), **M** medium (half day), **L** long-form / flagship.

---

## 1. Foundational / Identity Posts

These establish what the game is and frame every later post. Write these early — they become the anchors everyone else links back to.

### 1.1 "Final Fantasy Tactics meets Slay the Spire" — the pitch [narrative, design] · S

The one-paragraph elevator pitch, expanded into a post. Explain the genre fusion, the three design pillars (units matter, strategy pays off, creative plays are rewarding), and the core loop in ~800 words. Source: `docs/GAME_DESIGN.md` top section.

### 1.2 Why a shared deck instead of per-unit decks [design] · M

Defend the core invariant: one deck per side, not per unit. Tension: roster composition vs. deck coherence, evaporation as the corrective mechanism, synergies as the reward. Source: Design Invariant #1, evaporation rules.

### 1.3 The three design pillars and how they constrain features [design] · M

Explain how "units matter," "strategy pays off," and "creative plays are rewarding" act as filters during design. Use 2–3 features that were accepted or rejected under these pillars.

### 1.4 What a "card tier" actually means here [design] · S

The subtle one: tier (General / Race-Class / Signature) is **derived**, not stored. Card category (Attack / Utility) is what's on the resource. This catches people off guard; it's also a case study in modeling for the right question. Source: Design Invariant #2.

---

## 2. Tactical AI — Your Flagship Series

This is the richest vein. The AI has gone through at least three architectural generations and has a tuning vocabulary most hobby projects never develop. Consider turning this into a numbered series ("Building a tactical AI, part N").

### 2.1 Why our first AI passed every turn [ai, process] · M

The `PASS-scored-2.4` bug: a scalar heuristic rewarded doing nothing because banked AP looked valuable. Lead with the concrete number (`3*0.3 + 1*1.5 = 2.4`) and walk the reader through diagnosing it. Source: `docs/superpowers/plans/2026-04-09-ai-tree-search-refactor.md` root-bug summary.

### 2.2 From scalar heuristics to a score vector [ai, arch] · L

The big refactor: replacing a single "estimated value" float with a six-dimensional `ScoreVector` (damage, survival, positioning, synergy, tempo, support) reduced via `WeightProfile.weighted_sum()` at commit time. Includes the dormant-feature rollout pattern (`enable_composite_scoring = false` ships before calibration). Source: `FEATURE_AI_SYSTEM.md` §"Composite scoring path".

### 2.3 Sense–Think–Act, implemented [ai, arch] · L

Walk through the real pipeline: `SurveyPhase → IntentGenerator → TurnCoordinator → InterruptLayer`. Explain why separating survey from intent generation lets you reuse threat scoring bidirectionally (enemies can score the player's threat too).

### 2.4 Intent generators as a plugin registry [ai, arch] · M

The pattern: `IntentGeneratorBase` + `add_generator()`. Drop a file in `intent_generators/`, register once, no coordinator changes. Case study: `HealGenerator` / `ProtectGenerator` shipped as no-op scaffolds before their cards existed.

### 2.5 Team-aware AP floors, or: how one unit stopped hoarding the shared pool [ai, design] · M

The `team_aware_ap_floor` fix: the shared AP floor relaxes to 0 when no other unit demands AP this turn. Before this, a solo survivor would stare at a full pool and pass. Source: `FEATURE_AI_SYSTEM.md` AIConfig table; `TeamContext` doc.

### 2.6 The card-demand penalty: coordinating without talking [ai, design] · M

Problem: two AI units both want to play "Crushing Blow" and the hand only has one. Solution: a per-turn `TeamContext` snapshot of demand, and a penalty subtracted at commit time. Shows how to build coordination without coupling.

### 2.7 Retaliation risk and survival probability as first-class estimators [ai, design] · M

Making the AI _aware_ it's going to die on the counter. `RetaliationRisk.compute(hex, opponents)` sums opponent attack within reach; `SurvivalProbability` gates FLEE (so it doesn't flee when it'll live) and DEFEND (dying units skip block and dump value). Source: `estimators/` folder.

### 2.8 One-ply positional lookahead that isn't tree search [ai] · M

`NextTurnPlayability` weights attack-hex choice by projected damage from that hex on the _next_ turn. You get some lookahead benefit without paying for DFS. Contrast with the tree-search refactor plan that shipped alongside it.

### 2.9 The release-aware commit loop [ai, arch] · M

Three-pass commit: on downgrade, release claimed-but-unused cards, re-evaluate remaining units against the freed pool. Explains `CoordinationState.release_unused_claims()` and why naive greedy picks dead-lock.

### 2.10 FLEE that isn't a run-in-place [ai, design] · S

The small-but-revealing rule: FLEE only fires if the destination puts at least one threatening enemy **out of next-turn reach**. Otherwise the unit is running in place and dying two turns later with fewer options. Great case study in "what does this actually accomplish?"

### 2.11 Why we removed silent RETARGET recovery [ai, process] · S

Short war story: the AI cast cards on enemies it had never planned to target. Removing the recovery path was better than patching it. Lesson: recovery actions must be _conservative_ or they produce ghosts in the data.

### 2.12 A headless AI decision inspector [ai, process] · M

`tools/ai_decision_inspector.gd`: load a fixture, run `_create_plan`, dump the `AITurnLogger` trace. Show how you can iterate on AI without booting the editor. Pitch for offline fixtures + regression tests in gameplay projects.

### 2.13 AI tuning without spreadsheets [ai, design] · M

Walk through `AIConfig` + `WeightProfile` presets (NEUTRAL / HEALTHY_LOW / HEALTHY_DESPERATE / CRITICAL / LAST_UNIT) and how `for_unit(survey, team_context, is_last_unit)` picks one. Tuning-as-data pitch.

### 2.14 When "difficulty" isn't "smarter" [ai, design] · M

Preview: your planned `DifficultyProfile` decouples _how well the AI reasons_ (candidate pruning, coordination depth, score noise) from _what it prioritizes_ (personality weights). Argue the separation.

### 2.15 The tempo analyzer: turning a game's mood into a scalar [ai, design] · S

`TempoAnalyzer.compute()` → `LOW / MED / HIGH / DESPERATE`. One thin input (team HP ratio + enemy burst ratio) that changes weight presets across the board. Great micro-post.

---

## 3. Combat Resolution & Data-Driven Authoring

The step/effect/amount-source pipeline is a gem — it deserves multiple posts.

### 3.1 Cards as timelines, not triggers [design, arch] · L

Every card is an authored `Array[CardStep]`. Steps are data (`PlayCasterAnimation`, `MoveCasterStep`, `DisplaceTargetsStep`, `SpawnProjectileStep`, `ApplyEffectsToTargetsStep`…) executed by `StepResolver`. This is why you can make a new card without touching code. Show a concrete `.tres` example.

### 3.2 AmountSource: scaling as data [design, arch] · M

`FlatAmount`, `ScaleByCasterStat`, `ScaleByTraveledDistance`, `ScaleByTargetMissingHpPercent`, `ScaleByContextValue`, `ScaleByCount`. "Deal damage equal to distance traveled" is a resource composition, not a function.

### 3.3 TargetStrategy: the shape of intent [design, arch] · M

`SelfTarget`, `SingleTarget`, `AoeTarget`, `FreeHexTarget`, `MultiSlotTarget`. Plus `TargetFilter` as an orthogonal has-status / hp-below / on-terrain predicate. Multi-slot cards explained (swap, multi-missile).

### 3.4 EffectContext: the mutable bag every step writes into [arch] · M

Why one shared `EffectContext` across a card's steps is the right trade: readable authoring, traceable data flow, cheaper than immutable chains for this scale.

### 3.5 Displacement done right [design] · M

Push, pull, swap. `BlockedBehavior` (STOP / FALLBACK_FREE_HEX / DAMAGE_BOTH / SWAP_WITH_BLOCKER), `on_collision_steps`, `on_wall_steps`. Small surface, big expressive range. Source: `design/board.md`.

### 3.6 ActionFactory and the cast timeline [arch] · M

`ActionFactory.create_card_plan()` vs `create_movement_plan()` → `ActionRunner.execute()` → `MarkerBus`. The phase boundary where input unlocks matters, because cosmetic tails shouldn't block the next cast.

### 3.7 Why effect resolution stops the moment a target dies [design, arch] · S

Tiny invariant, big consequences for authoring: `resolve_effects()` bails when `target.is_alive()` is false. Explains why effect ordering inside a card matters and how it shapes card design.

---

## 4. Input State Machine

### 4.1 From 380 lines of implicit state to a proper state machine [engine, arch] · L

The refactor story: five nearly-identical bugs traced to a hand-rolled state machine; the rewrite into `InputPhase` states (NEUTRAL, UNIT_SELECTED, CARD_SELECTED, TARGETING, DEPLOYING, DISABLED) using `godot_modules/state_machine`. Before/after, with the crash repro included. Source: `docs/superpowers/specs/2026-03-29-input-state-machine-refactor-design.md`.

### 4.2 The Facade that kept callers untouched [arch] · M

`InputManager` stayed the same from `battle_scene.gd`'s perspective; internally it became a state machine with `InputContext`. Why facades matter when you're refactoring live systems.

### 4.3 Cancel that does the right thing [ux, design] · S

The subtle bug: "cancel" in UNIT*SELECTED of a \_different* unit used to undo movement instead of deselecting. One click, many possible meanings — fix by making "previous state" the state machine's job, not yours.

### 4.4 Board-lock without input-lock [ux, engine] · M

`ActionRunner.input_should_block` / `input_should_unblock` lock the _board_ while cosmetic animation plays, but keep the hand, portraits, and cancel live. Users can read their hand while something lands. Rationale: never make the player wait on aesthetics.

### 4.5 Right-click is "open," not "toggle" [ux] · S

Right-click on an enemy always opens the detail modal — it never closes it. Closing is ESC or the close button. Why: a right-click that could close would also cancel something behind it, producing unwanted double-actions.

### 4.6 Double-click and drag, mutually exclusive [ux, engine] · S

`DRAG_THRESHOLD` + `_DOUBLE_CLICK_INTERVAL` (0.3s). Click-vs-drag arbitration that feels right. Short post, good for the blog's "tiny craftsmanship" bin.

---

## 5. Godot Engineering Patterns

Posts where the audience is "other Godot developers," and the hook is "here's how a real, non-toy project does it." High SEO potential — these capture evergreen search traffic.

### 5.1 Resources as configuration, not state [engine, arch] · M

`.tres` files authored in Inspector, injected via `@export var`, `duplicate()`'d for per-instance runtime copies. Never mutate shared config. Source: `systems-resource-as-config` rule.

### 5.2 Typed signals only [engine] · S

`signal foo(n: int)` then `foo.connect(_on_foo)`. Never string-based `emit_signal` / `connect`. What you lose (a little flexibility), what you gain (refactor safety, find-usages that works).

### 5.3 `@abstract` + predicate classes instead of scattered casts [engine, arch] · M

One `@abstract` Predicates class per type hierarchy, always assign the predicate result to a typed local var, never pair with a redundant `is` check. Source: `gdscript-predicate-class.md`. Pitch: how to stop your code from turning into inline `as Foo` casts.

### 5.4 `is_instance_valid` after every `await` [engine] · S

Coroutines in Godot are landmines the first time you hit one. The rule; an example of what breaks without it; and when the check doesn't apply.

### 5.5 Autoloads are a last resort [engine, arch] · S

Only for wide-scope isolated systems (quests, saves, input bindings). `static func` / `static var` first. Why the discipline matters in a project with many managers.

### 5.6 `@export var` over `@onready` [engine, ux] · S

Wiring by Inspector instead of `$NodeName` / string paths. Fewer refactor hazards, better rename support.

### 5.7 RefCounted vs. Resource vs. Node: picking the lightest type that fits [engine] · M

Three nodes to a decision: transient data → `RefCounted`; Inspector-editable / saveable → `Resource`; needs the scene tree → `Node`. With examples.

### 5.8 A signal contract document that actually stays up to date [process, engine] · M

The doc you don't love writing but you love having: `architecture/signals.md`. Maintenance habit baked into CLAUDE.md so changes ratchet forward.

### 5.9 When the UID file is missing, don't author it — re-scan [engine, process] · S

The "grave fault" rule: `.uid` files are Godot-generated; hand-writing one puts a file on disk without the cache entry, which fails silently at runtime. Short, specific, useful.

---

## 6. UI & UX Craft

### 6.1 Cards that fan along an arc and still feel good to click [ux, engine] · M

`HandLayout.get_slot_transform(index, total, panel_size)` returns a `Transform2D` per card (center pos + tangent rotation). `HandPanel.mouse_filter = IGNORE`, custom slot-math hit testing. Why Godot's Control rect dispatch doesn't cut it here.

### 6.2 Affordance states, not booleans [ux, design] · M

`CardAffordanceState`: PLAYABLE / NO_VALID_CASTER / WRONG_UNIT / NOT_ENOUGH_AP / SILENCED. Each tinted differently, each with its own tooltip. The richer vocabulary makes "greyed out" informative instead of annoying.

### 6.3 Cast preview during hover — but not during drag [ux] · S

The rule: cast preview only fires in NEUTRAL or UNIT_SELECTED; ignored during active targeting or drag. Gives players freedom to explore without painting the board while they're mid-decision.

### 6.4 Tooltips as composable blocks [ux, arch] · M

`TooltipBlock` / `HeaderBlock` / `TextBlock` / `IconTextBlock` / `StatRowBlock` / `ImageBlock` / `SeparatorBlock`. Each card/unit/status builds a block list; `TooltipPanel` renders it. Keyword auto-linking via `KeywordRegistry`.

### 6.5 Multi-panel tooltips for multi-card comparisons [ux] · S

`TooltipGroup` arranges multiple panels horizontally. Useful when you want to compare two cards or see a unit's stats next to its status list.

### 6.6 A shader-driven hex highlight [engine, ux] · M

`HexHighlightPalette` with color_left/color_right gradient pairs per state, pulse speed, base alpha, inset px. Reads as game feel; underneath, it's a tiny shader config resource.

### 6.7 Cropping a sprite to "zoom" into its best frame [engine, ux] · S

The outer-`Control` + `clip_contents` recipe with an oversized inner `TextureRect`. The CLAUDE.md entry in the project is basically a blog post draft already. Source: `CLAUDE.md` UI Recipes section.

### 6.8 Dimming input, not disabling it, during animations [ux] · S

Friendly portrait bar dims to alpha 0.5 while the board is locked; enemy bar stays live so RMB inspect keeps working. Why "dim and disable" beats "disable" every time.

### 6.9 A debug panel that tells you what the AI thought [engine, ai, ux] · M

`DebugPanel` with Events + Stats tabs. Ties into `CombatEventBus` (max 1000 structured events). Pitch: build your own "why did this happen?" tooling, it pays for itself.

---

## 7. Debug, Testing & Dev Tools

### 7.1 CombatAssertions: seven invariants that fire after every phase [engine, process] · M

Runs after each action phase; pauses on violation. Cheap property tests at the system level; they catch regressions the unit tests don't.

### 7.2 A combat event bus for replay and analysis [arch] · M

`CombatEvent` is a structured record reusing `EffectResult` / `ActionContext` / `ActiveStatus` by reference. Ordered, filterable, capped at 1000. Why this pattern beats printf for gameplay debugging.

### 7.3 ActionTimeline and step-by-step debugging [engine, process] · M

Per-action snapshots diffable across steps. Lets you walk a cast in slow motion and see exactly when state changed.

### 7.4 GUT property tests for AI fixtures [ai, process] · M

Fixtures loaded from JSON, planner run headless, output asserted. Red property tests before fixing the bug. Source: commits `abb06f7`, `1374c27`, `a1c666f`.

### 7.5 Folder colors as a navigation aid [engine, process] · S

`project.godot` has a `[file_customization]` section coloring `src/core/` red, `src/scenes/` teal, etc. Tiny trick; surprisingly effective.

---

## 8. Process & Rituals

### 8.1 CLAUDE.md as a living rulebook [process] · M

Walk through what lives in `CLAUDE.md` vs. `.rules/*.md` vs. `docs/features/*.md`. The three-tier documentation contract.

### 8.2 Docs that change when code changes [process] · M

The maintenance covenant in CLAUDE.md: update `FEATURE_*.md` status checkboxes, signal contracts, systems table — as part of the task, not after. How to enforce this with AI assistants.

### 8.3 Writing specs before plans [process] · M

You already separate `docs/superpowers/specs/` (design) from `docs/superpowers/plans/` (implementation checklists). Why spec-then-plan beats one big todo list.

### 8.4 Rule files for an LLM teammate [process, ai] · M

The 18 rule files in `.rules/` — node organization, safe cast, coroutines, tool scripts, data preferences, UI separation, card authoring. Each short, specific, LLM-ingestible. Case study: rules that reduce bad suggestions.

### 8.5 Retrieval-led reasoning vs. training knowledge [process, ai] · S

`AGENTS.md`: "Prefer retrieval-led reasoning over pre-training knowledge for any Godot task." Explain why you had to write that down (Godot 3 vs 4 drift) and how it changes prompt structure.

### 8.6 The "grave fault" list [process] · S

Things I once thought were fine that now live in a loud bulletproof section. Currently: hand-writing `.uid` files. Good format for recurring gotchas — captures context without being naggy.

### 8.7 "Don't silently change an invariant" as a rule [process, design] · S

The design-invariants block exists so an AI assistant doesn't happily remove "shared deck" to fix a symptom. The rule: flag the invariant, don't touch it. Tiny post; big for anyone working with an AI pair.

---

## 9. Design Deep-Dives

### 9.1 Evaporation as a deckbuilding corrective [design] · L

A card is gone when no alive unit satisfies its requirement — not when its tier says so. This makes roster deaths _mean something_ for the deck, which in turn makes positioning matter. Walk through how requirements drive evaporation.

### 9.2 The two-tier AP pool [design] · M

Per-unit AP + shared pool, consumed in that order. Tension: unit AP rewards spreading plays, shared pool rewards concentrating them. Current tuning (`unit=1, shared start=3, cap=3, +1/turn`) and what that produces in play.

### 9.3 Full-hand redraw, every turn [design] · M

No carry-over — every turn is a fresh read. Why: lowers the value of hoarding, raises the value of decisive turns, keeps sessions short without reducing depth.

### 9.4 Consume-on-play is orthogonal to evaporation [design] · S

Two removal mechanics that sound like one. `consume_on_play` is per-card and survives resurrection-injection rules; evaporation is requirement-driven. Two invariants that must stay separate.

### 9.5 One unit per hex, always [design] · S

The strictest invariant on the board. Why strict occupancy enables displacement design (push/pull/swap suddenly matters) and forbids some otherwise-fun designs (stacked wards, phasing units).

### 9.6 Status categories and how they stack [design] · M

DoT, CC, buff, triggered reaction, aura. Stacking rules. `_scale_status_value` making Silence worth more on a mage than a brawler. Source: `design/statuses.md`.

### 9.7 Synergy thresholds and why "X of a race" is more than flavor [design] · S

Race/class synergy counts as a numeric signal the AI reads. Design constraint: every synergy must be observable from survey data so both sides can reason about it.

### 9.8 The meta-loop we _haven't_ built yet [design, narrative] · M

Honest post: what the roguelite meta-loop is going to be (map navigation, packs, persistent XP) and what tensions we already know are coming (pack economy must prevent dead cards). Good for showing forward-thinking design. Source: `design/meta_loop.md`.

### 9.9 Unit packs: buying a unit is buying three cards [design] · M

Design pitch: you acquire units as _packs_ — one unit plus 2–3 attached cards. Forces real trade-offs ("better passive, but a weaker card in the pack"). Anti-pattern: the one-dimensional shop where every pick is strictly better.

### 9.10 Why battle loss shouldn't end a run [design] · S

The tuning decision: loss = injury, not death. Nightmare difficulty flips to permadeath. Short essay on dominant-strategy failure modes when loss is terminal.

---

## 10. "Show Me the Data" / Visual Posts

Posts where the content is a chart, a table, or an animation, not prose. Lowest effort per view, usually.

### 10.1 Distribution of card AP costs across the current pool [design, data] · S

Histogram. Commentary: where are the gaps? What does "everyone costs 2" look like?

### 10.2 Cards by category and tier [design, data] · S

Heatmap of Attack/Utility × General/Race-Class/Signature. What's missing? What's over-represented?

### 10.3 The shape of a cast [engine, data] · S

One cast, broken into markers: `cast_started`, `CAST_ANIM`, `PROJECTILE`, `IMPACT`, `EFFECTS_RESOLVED`, `DEATH_CHECK`, `WIND_DOWN`, `cast_completed`. Show the timeline, annotate where input unlocks.

### 10.4 Before/after: AI win rate across fixture library [ai, data] · M

Per-refactor deltas on your fixture library. Useful internal artifact that makes a compelling post.

### 10.5 Weight profile presets side by side [ai, data] · S

A single table of NEUTRAL / HEALTHY_LOW / HEALTHY_DESPERATE / CRITICAL / LAST_UNIT weights across the six score dimensions. Commentary on each preset's personality.

---

## 11. Personal / Reflective

### 11.1 Why I started Project Ascension [narrative] · S

The origin post. Why this game, why now, why not something easier.

### 11.2 Six months in: what I'd do differently [narrative] · M

Retrospective post, written when you hit the six-month mark. What architecture choices survived, what you'd throw out.

### 11.3 The bug I was most wrong about [narrative, process] · S

Rotating slot: pick one bug per quarter. First candidate: the `PASS-scored-2.4` story — diagnosed as "AI is too passive," actually a scoring overflow incentive.

### 11.4 Working with an AI pair on a hobby project [process, ai, narrative] · M

Honest account. What Claude is great at (structured refactors, spec→plan→test), what it's bad at (silently changing invariants until you wrote them down), what rituals evolved.

### 11.5 Learning to cut features I liked [design, narrative] · S

Something that didn't make the cut. Use `ResurrectEffect` / `MarkTargetEffect` / `GrantTempCardEffect` being currently-unimplemented as a jumping-off point: they're in the codebase as stubs for a reason.

### 11.6 The next thing I need to build [narrative] · S

End-of-month post tying to the next sprint's target. Low-cost recurring slot.

---

## 12. Cross-cutting Short Posts (≤400 words each)

Treat as a pool of "write one per week" material.

- `consume_on_play` is tracked per-side by `resource_path`: why identity, not equality, matters for removal.
- The rule that `ScaleByCasterStat` reads _the caster's current stats_, not a snapshot — and why that was the right call.
- `InterruptLayer.MAX_REPLANS = 1`: one replan, then pass. Why bounded retries matter.
- `KILL_BONUS = 15.0` and why reserving a large number for kill intent changes the whole score distribution.
- `MAX_CARD_PLAYS_PER_INTENT = 3` so DoT stacks self-select via the triangular bonus.
- `FREE_HEX` teleports composing with MP movement in FLEE — not replacing it.
- Cards with no requirement _never evaporate_; this is what makes "general" feel general.
- How we decided two `TooltipLayer` ordering rules: show-delay, hide-delay, and why they're not symmetric.
- A stat-mod status that doesn't update `attack`/`defense` on the sim state is a silent bug. The fix was one line.
- Why we snap 2D vertices and transforms to pixel in `project.godot`.

---

## 13. Series Candidates

Ship as multi-part arcs once you have 3+ drafts in hand.

- **Building a tactical AI** (series 2 above): 5–8 posts.
- **Cards as data** (series 3): 3–4 posts, ending with a "design your own card in 40 lines of `.tres`" walkthrough.
- **Making Godot projects feel nice** (ux posts, 6.x): 4–5 posts.
- **Instrumenting your own game** (debug / events / assertions, series 7): 3 posts.

---

## 14. How to prioritize

A rough ranking for the next 10 posts to write, accounting for uniqueness, completeness of source material, and likely readership:

1. 2.1 — Why our first AI passed every turn _(story-shaped, concrete bug)_
2. 3.1 — Cards as timelines, not triggers _(flagship architecture post)_
3. 4.1 — From 380 lines of implicit state to a state machine _(strong before/after)_
4. 2.3 — Sense–Think–Act, implemented _(sets up the AI series)_
5. 9.1 — Evaporation as a deckbuilding corrective _(design signature)_
6. 1.1 — The pitch _(anchor for everything else)_
7. 2.5 — Team-aware AP floors _(small, specific, reusable insight)_
8. 6.2 — Affordance states, not booleans _(ux, easy to illustrate)_
9. 7.2 — A combat event bus for replay and analysis _(evergreen)_
10. 8.4 — Rule files for an LLM teammate _(process angle + AI angle)_
