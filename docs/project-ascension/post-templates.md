# Post-Type Templates

Each template below is a contract between you and the AI agent drafting the post. The agent picks the template before drafting; you review against the template when reviewing.

Templates are deliberately terse. They constrain structure (so every post is recognizable) without constraining voice.

Global rules across all templates:

- **Frontmatter** follows the same shape as existing `content/blog/<slug>/en.md` posts (see `test-post/en.md` for the canonical fields: `title`, `description`, `publishedDate`, `status`, `tags`, `featured`).
- **Language:** always publish `en.md`; produce `pt.md` translation via the standard tooling or mark it TODO.
- **First person, singular.** Past tense for history, present tense for how things work.
- **Concrete over abstract.** A function name, a number, a before/after snippet always beats "things improved."
- **No AI tells.** No em-dashes stacked three deep, no "in conclusion," no "in this post we'll explore."

---

## 1. `devlog` — recurring dev log

Full definition lives in `devlog.md`. Summary:

- **Title pattern:** `Dev log #N — <hook>`
- **Description:** substance in one sentence, ≤160 chars.
- **Tags:** `[project-ascension, devlog, <topic>]`
- **Series fields:** `series: 'project-ascension-devlog'`, `series_number: N`
- **Sections:** What shipped · The story · One decision worth recording (optional) · Numbers (optional) · What's next · Thanks (optional).
- **Word count:** 400–900 words typical. Quiet weeks can run shorter.

Trigger: weekly/fortnightly/monthly cadence. See `devlog.md` for the full generation pipeline.

---

## 2. `adr-narrative` — the story behind an ADR

A blog post that expands a single ADR into a human-readable narrative. The ADR provides the claims; the post provides the _feel_ of the decision.

**Frontmatter:**

```yaml
---
title: "<ADR title, rephrased as a statement a human would speak>"
description: "<1 sentence stating the decision and the most important consequence>"
publishedDate: "YYYY-MM-DD"
status: "draft"
tags: [project-ascension, <primary-topic>, decision]
featured: false
adr_ref: "0001"
---
```

**Sections (in order):**

1. **Opening scene** — 2–3 sentences that drop the reader into the moment the decision mattered. A bug, a playtest, a conversation with yourself.
2. **The choice** — state the decision in plain language. 1 paragraph. This is the ADR's `Decision` section, reworded to breathe.
3. **Why not the obvious thing** — 1–2 paragraphs. This is `Alternatives considered`, but framed as the reader's likely question ("wait, why didn't you just…"). Answer it without condescending.
4. **What it bought us** — 1–2 paragraphs. Positive consequences. Include at least one _concrete_ example — a card, a bug that stopped happening, a number.
5. **What it cost** — 1 paragraph. Negative consequences. Honest. If nothing real got paid for this decision, drop the section — but double-check; there's usually something.
6. **Link to the ADR** — one line: "The full record is in [ADR-NNNN](../adr-link)."

**Word count:** 600–1200 words.

**Voice checks:**

- No "dear reader" / "let me tell you about."
- The opening scene is concrete (a specific day, file, or bug). Not "recently I was thinking about…"

---

## 3. `design-deep-dive` — how one system actually works

For when a topic is too substantive for a dev log. Examples: "Cards as timelines, not triggers" · "The AI's Sense–Think–Act pipeline" · "Evaporation as a deckbuilding corrective."

**Frontmatter:**

```yaml
---
title: "<topic, as a statement — not a question>"
description: "<1 sentence: the thing and why it matters>"
publishedDate: "YYYY-MM-DD"
status: "draft"
tags: [project-ascension, <primary-topic>, design | arch]
featured: true # deep-dives earn featured status more often than devlogs
---
```

**Sections (in order):**

1. **The thing in one paragraph** — what system we're talking about, in plain English. A reader who stopped here should understand what it is.
2. **Why it exists** — the tension or problem that demanded this shape. 1–2 paragraphs.
3. **How it works** — 2–5 sections, each focused. Code excerpts with file:line citations. Diagrams as ASCII or linked images. Avoid the urge to list every public method; pick the 2–3 concepts that carry the system.
4. **A concrete example** — walk through one realistic case end to end. For cards: one card's full cast timeline. For AI: one turn's survey → intent → commit → execute.
5. **Edge cases and rules** — the invariants that make this system not collapse. Cite ADRs, link to rule files.
6. **What I'd do differently** (optional) — honest short reflection. Earns trust with technical readers.
7. **Further reading** — links to related ADRs, feature docs, past posts.

**Word count:** 1200–2500 words. Can go longer if warranted; prefer splitting into a 2-part series over stretching past 3000.

**Voice checks:**

- Every abstract claim has a concrete example nearby.
- No "this shows the power of X." Let the example be the argument.
- Terminology consistent with `GAME_DESIGN.md` (don't introduce new terms).

---

## 4. `bug-postmortem` — how a bug happened and what it taught

**Frontmatter:**

```yaml
---
title: '<bug, as a phrase — e.g. "The AI that passed every turn">'
description: "<1 sentence: what was wrong + what we learned>"
publishedDate: "YYYY-MM-DD"
status: "draft"
tags: [project-ascension, bug, <topic>]
featured: false
---
```

**Sections (in order):**

1. **The symptom** — what a player or developer would have observed. 2–3 sentences. No backstory yet.
2. **The diagnosis** — how you found the root cause. Include the specific commit/log/snapshot that cracked it. 2–4 paragraphs.
3. **The fix** — the actual change. Code diff or description. 1 paragraph.
4. **The lesson** — what pattern does this bug belong to? Does it change a rule, an ADR, a capture habit? 2–3 sentences. Keep it specific to the project; avoid "always check your assumptions."
5. **(Optional) Receipts** — the commit hash, the test that now guards against regression.

**Word count:** 500–900 words.

**Voice checks:**

- Do not perform disaster. Understate.
- Do not blame tooling for a design issue. ("Godot let me do X" — no. _You_ did X.)

---

## 5. `mini-post` — under 400 words

For single specific observations: "`MAX_REPLANS = 1`: why bounded retries matter." Quick to write, quick to read, great for cross-linking.

**Frontmatter:**

```yaml
---
title: "<specific observation or claim>"
description: "<a sentence that states the whole takeaway — if the reader only read this, they got it>"
publishedDate: "YYYY-MM-DD"
status: "draft"
tags: [project-ascension, mini, <topic>]
featured: false
---
```

**Structure:**

1. One paragraph of setup (what's the thing).
2. One paragraph of the surprising or specific point.
3. One sentence of "and so."

**Word count:** 150–400 words. If it wants to be longer, it's a deep-dive — use that template.

**Voice checks:**

- The description should be a one-liner that stands alone on a listings page.
- No ceremony. Straight into the thing.

---

## 6. `tutorial` — walk through doing a specific thing

For "how to author a card in Project Ascension's data model" or "how to add a new intent generator."

**Frontmatter:**

```yaml
---
title: "How to <do specific thing>"
description: "<1 sentence describing what the reader will be able to do>"
publishedDate: "YYYY-MM-DD"
status: "draft"
tags: [project-ascension, tutorial, <topic>]
featured: false
---
```

**Sections (in order):**

1. **What we're building** — the concrete output. Screenshot if possible.
2. **Prerequisites** — what the reader needs to know / have.
3. **Step N** — short section per step. Each step ends in a _verifiable_ result (a file that now exists, a Godot inspector screenshot, a passing test).
4. **Putting it together** — one short paragraph showing the result running.
5. **Going further** — 2–3 variations the reader can try.

**Word count:** 800–2000 words. Depends on depth.

**Voice checks:**

- Every code block is copy-pasteable.
- Steps are ordered by dependency, not by author narrative.
- If a step depends on unspecified state, say so explicitly.

---

## 7. `series-intro` — the opening post of a numbered series

Rare; for things like "Building a tactical AI" across 5+ posts.

**Frontmatter:**

```yaml
---
title: "<series name>: An introduction"
description: "<1 sentence: what the series will cover, across how many posts>"
publishedDate: "YYYY-MM-DD"
status: "draft"
tags: [project-ascension, series-intro, <topic>]
featured: true
series: "<series-slug>"
series_number: 0
---
```

**Sections:**

1. **What the series is about** — 1 paragraph.
2. **Who it's for** — 2–3 bullet points.
3. **The arc** — a numbered list of posts-to-come. Titles only; posts will link back here when they land.
4. **How I'll ship it** — cadence promise, honest. "Roughly weekly" or "as I finish the work."

**Word count:** 400–700 words.

---

## Template selection cheat sheet

| You have…                                     | Use                                                 |
| --------------------------------------------- | --------------------------------------------------- |
| 1 week of captures                            | `devlog`                                            |
| 1 capture file in `_decisions/`               | `adr-narrative`                                     |
| Enough material for >1200 words on one system | `design-deep-dive`                                  |
| A bug with a clean fix and a lesson           | `bug-postmortem`                                    |
| One specific observation                      | `mini-post`                                         |
| A task someone else should be able to do      | `tutorial`                                          |
| Four or more planned posts on one topic       | `series-intro` (then write the first numbered post) |
