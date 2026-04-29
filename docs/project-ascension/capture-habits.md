# Capture Habits

What you need to do — and only this — for the agent to produce good content.

The content system has one input: **captures**. Every other document in this directory is downstream of what you write in `game/docs/devlog/_captures/` and `game/docs/devlog/_decisions/`. If those are empty or vague, posts are empty or vague — no prompt tuning fixes that.

This doc is the minimum viable behavior for keeping that input rich. It is short on purpose.

---

## The bar: capture only what's post-worthy

The game is early. Most sessions are tuning, scaffolding, or incremental work that will not produce a blog post. Forcing a capture on those days produces padding, and padding trains the agent to pad. Skip them.

**Capture when one of these is true:**

- A real bug came back with a non-obvious root cause — and you fixed it. ("Finally fixed that AI hang" counts. "Nudged a weight" does not.)
- You shipped a system end-to-end (e.g. a new effect type, a new phase in the turn loop, a new UI surface).
- You pivoted or rolled something back. Reversals are gold — they are the richest source material.
- You hit a surprise: perf, emergent behavior, a test that failed in a way that changed your mental model.
- You made a decision worth recording. (See "Decision captures" below — write that file _instead of_ a session capture, or both if the session also had other material.)

**Do not capture:**

- Knob tuning (AI weights, card costs, animation timings) — unless the tuning produced a named change worth explaining.
- Cosmetic passes (spacing, colors, copy). Commits are enough.
- Exploratory work that didn't land. Come back when it does.
- Daily incremental progress on a known feature. Capture when it ships, not each day along the way.

If you can't name a specific reader who would find the capture interesting, don't write it.

---

## Session capture (when triggered)

**Time cost:** 5–10 minutes.
**When:** at the end of a session that met the bar above.
**What:** create `game/docs/devlog/_captures/YYYY-MM-DD.md`. Use the template at `_captures/_TEMPLATE.md`.

The frontmatter matters less than the prose below it. Aim for 3–10 lines answering:

- **The _why_ of the surprise.** If something went faster or slower than expected, one line on why.
- **Quotes that made you think.** If a Claude/assistant session said something useful or wrong, paste the passage.
- **A specific artifact.** An error message, a log line, a tiny code snippet. These are gold.
- **Any decision you almost made and didn't.** "I almost added a `card_tier` field; didn't because it duplicates requirements." Lines like this become ADRs and then posts.

Do not write:

- Commit messages. `git log` already has those; the agent will pull them.
- Time tracking. `session_hours` in frontmatter is enough.
- Task lists. Use TaskCreate inside Claude; captures are for durable material.

---

## Decision capture (immediately after the call)

**Time cost:** 5–10 minutes.
**When:** right after you make a non-obvious call. Do not defer.
**What:** create `game/docs/devlog/_decisions/YYYY-MM-DD-slug.md` using `_decisions/_TEMPLATE.md`.

Signal that you should capture:

- You considered at least one real alternative and rejected it.
- A decision came out of a bug or playtest, not a greenfield choice.
- You changed a rule or invariant.
- You almost added a field/flag/system and decided not to.
- You wrote "this is the right place for this" and had reasons.

Write:

- `Context` — 2–5 sentences. What forced the decision.
- `Decision` — 1 paragraph. What you chose.
- `Alternatives considered` — 2–3, each one line.
- `Consequences` — at least one positive and one negative. Be honest.
- `Verification` — grep or file pointer.

Prose need not be polished. The agent can shape it into an ADR or a narrative post later. What matters is that the reasoning is on disk while it's fresh.

---

## Weekly: the summariser (cheap; do it)

**Time cost:** 5 minutes of your time; agent does the work.
**When:** Friday afternoon, or whenever your week ends. Skip weeks with zero captures.
**What:** run prompt **P08** (captures summariser) from `prompts.md`. Read the output. Decide if there's a post worth writing.

If yes: run **P01** (weekly dev log) or **P02**–**P05** depending on what the summary surfaces.

If no: do nothing. No-post weeks are expected. See `devlog.md §4.4`.

---

## Monthly: the hygiene pass

**Time cost:** 15 minutes.
**When:** first of each month.
**What:**

1. Run **P09** (context-pack updater) on each pack in `portfolio/docs/project-ascension/context-packs/`. Agent re-verifies citations and adds new material.
2. Skim `portfolio/docs/project-ascension/adr/_index.md`. For any ADR older than 3 months, run its Verification line. If any fail, write a new ADR that supersedes or reverses.
3. Skim `portfolio/docs/project-ascension/blog-post-ideas.md`. Cross out anything that feels stale; mark anything now-unblocked.

---

## What the agent needs from you, minimum

If you strip everything above to a floor:

- **A capture per post-worthy moment**, not per session. Empty weeks are fine.
- **A decision file per non-obvious call.** Template is pre-filled; you just type.
- **A weekly summariser run**, skipped when the week had no captures.

Everything else is optimization. If you do only these three things, an agent can produce dev logs, ADRs, and deep-dives without your further involvement, except for the final review pass.

---

## Anti-patterns to avoid

- **Writing captures "later."** Later is never. Captures are session-ending or they're nothing.
- **Padding captures to feel productive.** An uneventful week gets no capture. "Focus: tuning; shipped: nothing memorable" does not need a file.
- **Capturing daily progress on a feature that hasn't landed.** Wait until it ships; capture the whole arc then. Partial captures read as padding.
- **Rewriting history.** Captures are append-only. If you were wrong, the next capture corrects. Never edit a past capture.
- **Committing captures without the code they reference.** Frontmatter lists `commits` — those commits must exist in the branch the capture is on. Otherwise the agent reads a ghost.
- **Skipping decision captures because "I'll remember."** You won't. And the agent definitely won't.
- **Using captures for task tracking.** Use `TaskCreate` inside Claude for that; captures are for durable material.

---

## Why this matters

An LLM cannot invent a reason. It can invent prose. The difference between a good post and an AI-slop post is almost entirely the density of _real reasons_ in the source material.

You are the only source of those reasons. The capture file is the only durable storage for them. Five to ten minutes on a post-worthy session is the whole cost.
