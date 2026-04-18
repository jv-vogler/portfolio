# Project Ascension — Dev Log System

Dev logs are recurring, structured posts about what happened on the game this week / sprint. The goal is: **you never sit down to write one from scratch.** An AI agent ingests structured inputs and produces the first draft.

This doc defines:

1. The capture format (what gets logged, where, when)
2. The post-generation pipeline (inputs → agent → draft)
3. The dev log post template (schema + prose structure)
4. Cadence and series rules
5. Review checklist

Read this end-to-end once. After that, the only thing you touch is the weekly capture file (§1) and the final review (§5).

---

## 1. Capture format

### 1.1 Where captures live

In the **game repo**, not the portfolio:

```
project_ascension/
  docs/devlog/
    _captures/             ← raw notes (markdown, one file per session/day)
    _metrics/              ← scripted metric dumps (JSON)
    DEVLOG_INDEX.md        ← running table of captures → published posts
```

Rationale: captures belong next to the code that caused them. They are commit-adjacent. A later agent reading them should have the code available too.

### 1.2 Capture file name

`YYYY-MM-DD.md` (one per working session). If you have multiple sessions in a day, append `-am`, `-pm`, or a short slug.

### 1.3 Capture file schema

Every capture starts with frontmatter:

```yaml
---
date: 2026-04-18
session_hours: 2.5 # rough; used to compute weekly totals
focus: ai-tuning # one of: ai / cards / ui / board / input / meta / tooling / writing
mood: productive # flow / productive / grinding / stuck / exploratory
branch: feat/ai-phase-3 # git branch at end of session
commits: # commits shipped this session (hash only; agent will expand)
  - 46b0175
  - 0c4993a
ships: # what was finished, in 10-word lines
  - "Phase 2+3 AI architecture merged"
  - "Tuning workflow guide published"
pivots: [] # anything reversed/deleted this session
blockers: [] # what's stuck; what you need
surprises: # things that went differently than expected
  - "Composite scoring was 30% faster than the greedy path once cached"
next: # what the next session will start on
  - "First calibration pass with enable_composite_scoring = true"
decisions: # decisions that belong in an ADR — emit the file path, not the rationale
  - docs/devlog/_decisions/2026-04-18-composite-scoring-dormant.md
---
```

Then, below the frontmatter, a freeform "brain dump" section. Use whatever structure feels natural. Agents will extract, reframe, and quote from this.

Tips for the dump:

- Write _why_, not just _what_. The agent can see commits; it can't see your reasons.
- Paste snippets of your own console, logs, error messages. These are gold.
- Quote yourself talking to Claude — transcripts are high-signal source material.
- One line per surprising moment is enough.

### 1.4 Decision captures

When you make an architectural or design call worth remembering, drop a file in `_decisions/` named `YYYY-MM-DD-slug.md`. Use the ADR template (`docs/project-ascension/adr/template.md` in the portfolio — copy it into the game repo). The capture file's frontmatter points to it.

These become ADRs. They also become the "Why we did X" sidebars in dev log posts.

### 1.5 Metrics captures

Optional but valuable. A small script — `tools/dump_devlog_metrics.gd` or similar — emits JSON to `_metrics/YYYY-MM-DD.json`:

```json
{
  "date": "2026-04-18",
  "card_count": 42,
  "unit_count": 11,
  "ai_fixture_count": 18,
  "ai_fixture_pass_rate": 0.89,
  "rules_count": 18,
  "features_docs": 10,
  "loc_total": 24381,
  "loc_tests": 3120,
  "commits_week": 47
}
```

Keys can grow. The agent reads consecutive dumps to compute deltas for "this week in numbers" sections.

---

## 2. Generation pipeline

### 2.1 Inputs the agent consumes

When you ask an agent to draft a weekly dev log, hand it this bundle (or let it fetch on demand):

| Input                                | Where                                                | Why                          |
| ------------------------------------ | ---------------------------------------------------- | ---------------------------- |
| Captures for the window              | `docs/devlog/_captures/*.md` between dates           | Narrative source             |
| Commits for the window               | `git log --since=... --no-merges`                    | Ground truth of what shipped |
| Decision captures                    | `docs/devlog/_decisions/*.md` between dates          | What to surface as sidebars  |
| Metrics deltas                       | `docs/devlog/_metrics/*.json` first + last in window | Numbers section              |
| Feature doc diffs                    | `git diff --stat docs/features/ since...`            | Which features matured       |
| Current invariants                   | `docs/GAME_DESIGN.md` §Design Invariants             | Keep claims consistent       |
| This doc + the template + the prompt | `docs/project-ascension/*` in portfolio              | Output shape                 |

The agent does _not_ guess at what happened from commits alone. Captures are the narrative spine.

### 2.2 Drafting command

Keep one slash-command-shaped prompt you can paste anywhere. See `prompts.md` → "Weekly Dev Log Draft."

### 2.3 Expected turnaround

- Agent drafts in 5–10 minutes.
- You review and correct for 15 minutes (see §5).
- Publish via the portfolio's existing pipeline (`pnpm publish:post`).

If a post is taking more than 30 minutes of your time to ship, something is wrong with the captures or the prompt — not the post. Fix the input, not the output.

---

## 3. Dev log post template

### 3.1 Filename and frontmatter

Write to `content/blog/devlog-NNN-slug/en.md` in the portfolio. `NNN` is the sequential dev log number (001, 002, …), not a date.

```yaml
---
title: "Dev log #007 — Teaching the AI to share"
description: "Team-aware AP floors, card demand penalties, and why one unit stopped hoarding the shared pool."
publishedDate: "2026-04-19"
status: "draft"
tags: [project-ascension, devlog, ai]
featured: false
series: "project-ascension-devlog"
series_number: 7
---
```

Conventions:

- **Title:** `Dev log #N — <hook>`. Hook is a fragment, not a sentence. No period.
- **Description:** 1 sentence, ≤160 chars. State the substance, not the activity. ("Team-aware AP floors" beats "This week I worked on AI.")
- **Tags:** always `project-ascension` + `devlog` + up to 2 topic tags (`ai`, `cards`, `ui`, `board`, `tooling`, `design`).
- **series:** always `project-ascension-devlog`. This lets the portfolio group them.
- **series_number:** monotonic. Never skip.

### 3.2 Prose structure

Every dev log has these sections in this order. **Skip a section if it has nothing to say — do not pad.**

```markdown
## What shipped

3–6 bullet points, each ≤ 20 words, each linking a commit or merged PR.

## The story

1–3 short paragraphs on the most interesting thing that happened this week.
This is where the post earns its place. Pick one thread — do not try to
summarize everything. If two threads are equally strong, write two sections:
"The story: X" and "The story: Y." Never more than two.

## One decision worth recording

If a decision capture exists in the window, surface it here as a boxed
callout (markdown blockquote). 3–5 sentences. Link the ADR by anchor.

## Numbers

Optional. Only when metrics delta reveals something non-trivial.
Table or short list:

|                | Last week | This week | Δ   |
| -------------- | --------- | --------- | --- |
| Cards authored | 38        | 42        | +4  |
| AI fixtures    | 15        | 18        | +3  |

## What's next

3 bullets, each ≤ 15 words. These set up the next post. Do not promise
features — frame as intent ("calibrate weight presets") not ship dates.

## Thanks / shout-outs

Optional. Only when real.
```

### 3.3 Voice and constraints

- **First person, singular.** Not "we" unless someone else contributed.
- **Past tense for what shipped; present tense for how things work.**
- **Show code or a screenshot if it costs nothing.** Never invent either.
- **No apologies** for gaps, quiet weeks, or scope shifts. If a week is quiet, the post is short. That is fine.
- **Link liberally** to earlier dev logs, ADRs, and feature docs. The series compounds over time.
- **One joke max.** Dry understatement beats "hilarious."
- **No em-dash-heavy AI prose.** If a draft reads like every other AI post, push back and ask for a rewrite (see prompts.md → "Rewrite pass").

### 3.4 What a dev log is _not_

- Not a changelog. That's the "What shipped" bullet list, which is one section of five.
- Not a tutorial. If you find yourself explaining a feature in depth, split it out as a separate post (use the `design-deep-dive` template).
- Not a diary. "I felt tired on Tuesday" is not content. "I found a bug that made me reconsider how we score FLEE" is.
- Not a marketing post. No "stay tuned," no "more exciting things coming."

---

## 4. Cadence and series rules

### 4.1 Cadence

- **Weekly** is aspirational. Missing a week is fine.
- **Minimum rhythm:** one dev log per calendar month. Below that, the series loses its compounding value — readers forget the context.
- **Maximum rhythm:** one per week. More than that, each post gets smaller and the series drifts from "dev log" to "stream of updates."

### 4.2 Numbering

- Sequential from 001. Never reset, never skip.
- If you publish a deep-dive ("Cards as timelines, not triggers") during the week, it is _not_ a dev log and does not take a number. It is a separate post series.

### 4.3 Deep dives vs. dev logs

Rule of thumb: if a topic takes more than 2 paragraphs in "The story," it belongs in a deep-dive post. The dev log then becomes: "This week I shipped X. I wrote a post about why, [link]."

This keeps dev logs short and makes deep-dives feel earned.

### 4.4 Quiet weeks

If there is nothing to ship or the week was off-camera (life, holidays, paid work), skip — do not write a "nothing to say" post. The next dev log covers a 2-week window; frontmatter reflects that.

### 4.5 Pausing the series

If you stop for >4 weeks, end the current series with a `Dev log #N — pause` post explaining why, with an expected return window or "indefinite." Resume at `N+1`, not `1`.

---

## 5. Review checklist

Before publish, answer these. If any are no, do not publish.

- [ ] Every claim is backed by a commit, a file path, or a screenshot. No hallucinated features.
- [ ] No invariant from `GAME_DESIGN.md` is contradicted. (E.g. do not write "we're considering per-unit decks" when the invariant says shared deck — flag first.)
- [ ] "What shipped" links resolve. Commits are public-readable or will be by publish time.
- [ ] "The story" has one concrete specific detail a reader can picture. A number, a function name, an error message, a before/after.
- [ ] Frontmatter `series_number` is correct and monotonic.
- [ ] Description is ≤160 chars and stands alone (no "check out my post about…").
- [ ] Voice passes the em-dash test (§3.3).
- [ ] Post renders in preview mode (`pnpm dev`, `/blog/preview/<slug>`).

When all boxes tick, `pnpm publish:post`.

---

## 6. Minimal agent workflow

This is the actual sequence an agent should follow end-to-end. Kept here so you can paste it into a slash command or sub-agent system prompt.

```
1. Identify the window. Default: last 7 days. Override if user says otherwise.
2. Read all captures in docs/devlog/_captures/ within the window. Concatenate into memory.
3. Run `git log --oneline --no-merges --since=<start> --until=<end>` and read each commit subject.
4. Read decision captures in docs/devlog/_decisions/ within the window.
5. Read the first and last metrics dump within (or adjacent to) the window; compute deltas.
6. Pick the single strongest narrative thread from the captures — not the most commits, not the most hours, the one with the strongest "why did this matter" story.
7. Draft using the §3 template. Honor §3.3 voice.
8. Run §5 checklist against your own draft. If any check fails, revise.
9. Produce the final markdown at content/blog/devlog-NNN-slug/en.md + the pt.md translation (same structure, translated by the portfolio's existing tooling or skipped with a note).
10. Emit one sentence at the end: "Draft ready. Next: run §5 manually, then `pnpm publish:post`."
```

The agent should never publish. You always take the final step by hand.
