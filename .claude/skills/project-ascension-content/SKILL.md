---
name: project-ascension-content
description: Draft blog posts about Project Ascension — João's Godot 4 tactical hex roguelite deckbuilder. Use whenever the user says "draft a devlog", "weekly dev log", "this week's devlog", "write an ADR narrative for NNNN", "turn ADR NNNN into a post", "deep dive on [a system]", "write about how [a system] works", "postmortem for [a bug]", "series intro for project ascension", or mentions "Project Ascension" alongside any drafting verb ("write", "draft", "post about"). This is the knowledge layer — it reads the content package at docs/project-ascension/ plus the game repo, enforces invariants, drafts to content/blog/[slug]/en.md, then hands off to portfolio-voice for the voice + Strunk pass and humanizer for the final AI-tell scrub. Sits on top of blog-post (paths, front matter, publish command), portfolio-voice (voice + Strunk), and humanizer (final pass) — does not replace any of them.
---

# Project Ascension — Content

Knowledge layer for drafting blog posts about **Project Ascension**: a Godot 4 tactical hex roguelite deckbuilder. The content package at `docs/project-ascension/` already encodes the templates, prompts, ADRs, and context packs. This skill's job is to read those documents in the right order, enforce the invariants, and hand off cleanly to the voice + publish chain.

## Composition

```
project-ascension-content   ← THIS skill: PA-specific knowledge, templates, invariants
  ↓ drafts content/blog/<slug>/en.md, then invokes:
portfolio-voice             → voice pass (voice-profile.md)
  ↓ portfolio-voice internally hands off to:
elements-of-style           → Strunk pass
  ↓ then THIS skill invokes:
humanizer                   → final AI-tell scrub (em-dash clouds, rule-of-three, -ing tails)
  ↓ then THIS skill prints the publish command owned by:
blog-post                   → front matter schema, paths, `pnpm publish:post`
```

This skill **does not replace** `blog-post`, `portfolio-voice`, or `humanizer`. It sits on top. It relies on `blog-post` for the file-path conventions, front-matter schema, and publish command; on `portfolio-voice` for sentence-level voice and the Strunk handoff; and on `humanizer` for the final AI-tell scrub before publish.

If the user asks for a _generic_ post (not about Project Ascension), stop and let `blog-post` own the workflow. This skill only runs when the post is about Project Ascension.

## Repo paths

- **Portfolio** (where posts are published): `/home/jvogler/Projects/personal/jv-portfolio`
- **Game** (source of truth for code and captures): `/mnt/c/Users/jvogler/Documents/JV/Personal/Projects/godot/project_ascension`

## Inputs you MUST read

The content package is the authoritative source. Do not reason about Project Ascension from memory — always read these files at the start of every invocation.

### From the portfolio (`docs/project-ascension/`)

| File                 | When to read                                             | Why                                                                       |
| -------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------- |
| `post-templates.md`  | Every run                                                | Pick the matching template; structure + frontmatter; word-count targets   |
| `prompts.md`         | Every run                                                | Follow the matching pipeline (P01–P08) verbatim — these are the contracts |
| `devlog.md`          | Every devlog                                             | Full dev-log spec: capture format, pipeline, §3 template, §5 checklist    |
| `adr/_index.md`      | Every run                                                | List of accepted decisions — never contradict one                         |
| `adr/NNNN-*.md`      | When a post touches a recorded decision                  | Cite by number; never invent alternatives the ADR did not consider        |
| `context-packs/*.md` | When a post covers a subsystem with a pack               | Canonical terms, key claims, citations — use exactly as written           |
| `blog-post-ideas.md` | When the user asks "what should I write about?"          | Running topic catalog                                                     |
| `agent-workflow.md`  | When in doubt about which doc to read for which question | Index of the package                                                      |

### From the game repo

| File / command                                      | When to read                                                               | Why                                                                     |
| --------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `docs/GAME_DESIGN.md`                               | Every run — §"Design Invariants" and §"Core Concepts Glossary"             | Hard rules and terminology; never contradict; never substitute synonyms |
| `docs/ARCHITECTURE.md`                              | Deep-dives and postmortems                                                 | Systems map, signal contracts                                           |
| `docs/features/FEATURE_*.md`                        | Deep-dives on a named system                                               | Per-feature status, shipped behavior                                    |
| `docs/devlog/_captures/*.md`                        | Devlogs, ADR narratives, postmortems                                       | Narrative source — the "why" behind what shipped                        |
| `docs/devlog/_decisions/*.md`                       | Devlogs and ADR-proposal posts                                             | Decision captures that may become ADRs                                  |
| `docs/devlog/_metrics/*.json`                       | Devlogs with a "Numbers" section                                           | Compute deltas across the window                                        |
| `git log --no-merges --since=<start> --until=<end>` | Every devlog; every postmortem; any time the post claims something shipped | Ground truth of what actually landed                                    |
| `git show <hash>`                                   | Every postmortem, ADR narrative, or deep-dive that names a specific change | Verify the claim against the diff                                       |

Default window for devlogs is **the last 7 days**. Accept overrides (`"last two weeks"`, explicit date range, `"since devlog #N"`).

## Pick the right prompt

Match the user's ask to the pipeline in `prompts.md`. Follow the matched prompt **verbatim** — these are contracts, not suggestions.

| User says…                                                           | Template (`post-templates.md` §) | Prompt (`prompts.md`)                           |
| -------------------------------------------------------------------- | -------------------------------- | ----------------------------------------------- |
| "draft devlog", "weekly dev log", "this week's devlog"               | §1 `devlog`                      | **P01**                                         |
| "write an ADR narrative for NNNN", "turn ADR NNNN into a post"       | §2 `adr-narrative`               | **P02**                                         |
| "deep dive on X", "write about how X works", "design deep-dive on X" | §3 `design-deep-dive`            | **P03**                                         |
| "postmortem for X", "write up the X bug"                             | §4 `bug-postmortem`              | **P04**                                         |
| "mini-post about X", "quick post on X"                               | §5 `mini-post`                   | **P05**                                         |
| "summarise this week", "captures summary", "what did I ship"         | — (summary, not a post)          | **P08**                                         |
| "propose an ADR from this capture"                                   | — (ADR, not a post)              | **P07**                                         |
| "series intro for project ascension"                                 | §7 `series-intro`                | (no matching prompt — follow template directly) |
| "tutorial: how to X"                                                 | §6 `tutorial`                    | (no matching prompt — follow template directly) |

If the user asks for a post type **not** in `post-templates.md`, **STOP and ask** — don't guess a new template into existence (see §Escalation).

## Workflow

Follow these steps in order. Track them with TaskCreate for any non-trivial post (devlog, deep-dive, ADR narrative, postmortem).

### 1. Classify and confirm

Read the user's request. Identify:

- **Post type** (devlog / adr-narrative / deep-dive / postmortem / mini / series-intro / tutorial)
- **Window** (for devlogs — default 7 days)
- **Anchor artifact** (ADR number, feature name, capture file, commit hash, bug description)
- **Slug** — kebab-case, derived from the hook. For devlogs: `devlog-NNN-<hook>`. Confirm the slug with the user before creating a file.

### 2. Read the contract

Read `post-templates.md` (the matching §) and `prompts.md` (the matching P0N) before touching any source material. The template is the structural contract; the prompt is the execution pipeline.

For devlogs, also read `devlog.md` end to end — §3 is the template, §5 is the review checklist, §3.3 is the voice floor.

### 3. Load facts with citations

Read the sources the matched prompt names. In practice:

- Start with the relevant `context-packs/*.md` if one matches the subsystem. Packs are pre-digested — cheaper than re-reading raw source and less error-prone than paraphrasing.
- Then read the cited ADRs by number. If the post is load-bearing on an ADR, quote it.
- Then read the relevant `FEATURE_*.md` and — only if needed — the actual `.gd` source under `game/src/`. Quote short excerpts with `file:line` citations.
- For devlogs and postmortems, read `_captures/*.md` in the window plus the git log. Captures are the narrative spine; commits are the ground truth.

**Every technical claim the draft makes must be backed by one of:** a file path with a line range, a commit hash, a `docs/project-ascension/` doc section, or an ADR number. Unverifiable claims get a `<verify>the claim</verify>` inline marker and a `## Claims to verify` section at the end of the draft (inherited behavior from `portfolio-voice`). The tag matches `<placeholder>` on purpose — one grep pattern, one visual signal, one pre-publish guard blocks both.

**Never fabricate personal content.** Technical claims need file/commit citations; personal claims need the author. Do not invent the author's history with games ("FFT taught me X"), their formative experiences, their opinions about external media, their emotional journey with a bug, or any autobiographical hook the content package does not record. Use block `<placeholder>...</placeholder>` tags for openings, closings, and any sentence that requires the author's actual voice. This rule is especially important for series intros and narrative posts, where the opening hook is where AI-fabricated voice is most obvious. See `portfolio-voice` Hard Rules for full treatment.

### 4. Check invariants before writing

Before the first sentence of body prose:

- Scan `GAME_DESIGN.md` §"Design Invariants" — does the angle contradict any of the ten hard rules?
- Scan `adr/_index.md` — does the angle contradict any `status: accepted` ADR?
- Scan the matching context pack's "Canonical terms" list — does the angle use a synonym for something that has a canonical name?

If any answer is **yes**, **STOP and ask** the user (see §Escalation). Do not write around a conflict. Do not rename a concept to fit the post.

### 5. Draft to `content/blog/<slug>/en.md`

Use the front-matter schema and folder convention owned by `blog-post`. Do not invent new fields; do not edit posts published.

The draft goes in `content/blog/<slug>/en.md` (the `content/` directory is gitignored; drafts never touch the repo). Follow the matched template for frontmatter and section order. Pad nothing — if a section has nothing to say, drop it (this is explicit in `devlog.md §3.2`).

Use placeholder tags for anything the author will fill in, as `portfolio-voice` expects. All placeholders use `<placeholder>...</placeholder>` tags (HTML-style — visually distinct in raw markdown, easy to grep, survives the Markdown-to-Lexical pipeline).

**Inline media placeholders:**

- `<placeholder>screenshot of <specific thing></placeholder>`
- `<placeholder>gif of <specific thing></placeholder>`
- `<placeholder>diagram of <specific thing></placeholder>`
- `<placeholder>code snippet of <what></placeholder>`

Specific, not generic. `<placeholder>screenshot of battle UI with AP preview active</placeholder>` is right; `<placeholder>screenshot of game</placeholder>` is wrong.

**Block placeholders** for author-fill-in prose (personal openings, closings, reflective passages). Put opening and closing tags on their own lines:

```
<placeholder>
Personal opening — 2-4 sentences on why this decision mattered to you.
Do not let Claude draft inside this block.
</placeholder>
```

See `portfolio-voice` SKILL drafting behavior §5 for the full placeholder contract.

### 6. Self-check against the matched prompt's constraints

Each prompt in `prompts.md` ends with a constraints block. Re-read it against your draft before handing off. For devlogs, also run the `devlog.md §5` checklist — every box must tick (citations resolve, no contradicted invariants, monotonic `series_number`, description ≤160 chars, voice passes the em-dash test, etc.).

If a check fails, revise once and try again. Don't emit a draft that fails a checkbox.

### 7. Hand off to `portfolio-voice`

Invoke `portfolio-voice` with its **drafting behavior** (for a fresh draft) or **polishing behavior** (if the user handed over an existing draft). `portfolio-voice` reads `voice-profile.md`, rewrites sentence-by-sentence toward João's voice, preserves your `<placeholder>` and `<verify>` tags, and then internally hands off to `elements-of-style:writing-clearly-and-concisely` for the Strunk pass.

Do not attempt the voice pass yourself. Do not skip it. Do not reverse the order — facts and structure first, voice second, Strunk third. Reversing loses the voice to over-editing.

### 8. Hand off to `humanizer`

After `portfolio-voice` returns (with the Strunk pass already applied), invoke `humanizer` on the result. Strunk is concision-focused; it can shave away the asides, fragments, and opinionated tangents that `portfolio-voice` put in. `humanizer` catches the remaining AI tells — em-dash clouds (hard cap: 2 per 500 words), rule-of-three lists pretending to be insight, `-ing` tails, vague attributions, curly quotes, emoji-decorated bullets — and restores any personality Strunk bled out.

Skill invocation:

```
Skill: humanizer
```

Pass the Strunk-cleaned markdown in the args. Point `humanizer` at the portfolio's existing devlogs in `content/blog/devlog-*/en.md` (and `docs/project-ascension/devlog.md §3.3` for the voice floor) as the voice sample. Apply rewrites that preserve meaning wholesale; for non-trivial rewrites, show the user before/after and let them veto.

Order is **voice → Strunk → humanizer**, always. Skipping humanizer is how a technically clean devlog still ships reading like a product update.

### 9. Emit the publish command + review checklist

After `humanizer` returns, print the publish command from `blog-post`:

```bash
pnpm publish:post --slug <slug> --dry-run   # preview the Lexical JSON
pnpm publish:post --slug <slug>             # publish (uses status from frontmatter)
pnpm publish:post --slug <slug> --draft     # force draft regardless of frontmatter
```

Do **not** run the command. The publish step is always the author's.

End with a one-line footer, exactly:

> Draft ready. Review: <checklist>. Then `pnpm publish:post`.

For devlogs, `<checklist>` is `docs/project-ascension/devlog.md §5`. For other post types, it is the matching `post-templates.md §N "Voice checks"` block.

## Ground rules

These are non-negotiable. Most are inherited from the content package and `portfolio-voice`; they are restated here so the skill fails loudly when one is at risk.

1. **Never contradict an accepted ADR.** If the draft would say something that an ADR already ruled out, **STOP and surface the conflict**. The whole value of ADRs is that they are immutable — don't write around one.
2. **Never contradict a Design Invariant in `GAME_DESIGN.md`.** Same rule. The ten hard rules in §"Design Invariants" govern the game's shape; a post that fudges one is wrong, not clever.
3. **Every technical claim cites a file path, a commit hash, or a doc section.** If the citation cannot be produced, mark the claim `<verify>the claim</verify>` and collect it under `## Claims to verify`. Publishing a hallucination is worse than shipping a flagged uncertainty. The pre-publish guard in `src/seed/publish.ts` refuses to ship any file containing `<placeholder>` or `<verify>` — both tags are load-bearing.
4. **Use canonical terms from the context pack exactly.** Do not substitute synonyms. "Intent" not "strategy." "Composite scoring path" not "heuristic." The packs list their anti-terms explicitly.
5. **First person, singular.** Past tense for what happened; present tense for how the code works. No "we" unless someone else actually contributed.
6. **No AI tells.** No em-dash clouds (cap: 2 per 500 words), no "let's explore", no "in this post we'll", no "in conclusion", no "stay tuned", no "exciting things ahead", no tricolons pretending to be insight.
7. **Never publish.** The final step is always `pnpm publish:post`, run by the author. This skill drafts, hands off, and stops.
8. **Never edit a published post's frontmatter from this skill.** If the frontmatter of a post already on the site needs changing, **STOP and ask**.
9. **Never `git add` or `git commit` anything under `content/`** — the directory is gitignored on purpose. `pnpm publish:post` is how drafts make it to production.

## Escalation — STOP and ask

When any of these are true, stop and surface the problem to the user. Do not attempt to write around them.

- **Missing decision file.** A capture's `decisions` frontmatter points to a file that doesn't exist in `_decisions/` or in `adr/`. Without the decision record, the post has no source for its "why."
- **Contradicted ADR.** The post would contradict an ADR with `status: accepted`. Ask the user whether they want to write a superseding ADR first, or whether you've misread the angle.
- **Contradicted invariant.** The post would contradict an entry in `GAME_DESIGN.md` §"Design Invariants."
- **Context-pack citation fails verification.** A snippet cited in a pack no longer matches the source (file moved, content changed, line numbers off). Stop; the pack needs an update (P09) before the draft is trustworthy.
- **Unknown post type.** The user asks for a post shape not in `post-templates.md` (e.g. "a marketing post," "a Twitter thread"). The skill's scope is bounded by the template set.
- **No captures in the window (for a devlog).** If `_captures/` is empty for the requested window and git log is thin too, the week is a "quiet week" — `devlog.md §4.4` says to skip the post rather than pad one. Confirm with the user; don't invent a narrative out of nothing.
- **Fresh topic with no context pack and no feature doc.** If you're being asked to deep-dive a subsystem that has neither a `context-packs/*.md` nor a `docs/features/FEATURE_*.md`, say so. The draft would be built on paraphrase. Ask whether to create a pack first (P09 doesn't apply; this would be a new pack from scratch).

In every case: describe the conflict in plain terms, quote the relevant file/line, and wait. Never publish around it.

## Examples

### Example 1 — "draft this week's devlog"

1. Window = last 7 days (default).
2. Read `devlog.md` end to end, `post-templates.md §1`, `prompts.md` P01, `adr/_index.md`, `GAME_DESIGN.md §"Design Invariants"`.
3. List captures in `docs/devlog/_captures/*.md` within the window. Read each.
4. Run `git log --oneline --no-merges --since=<start> --until=<end>` in the game repo. Read commit subjects; open `git show <hash>` for the 2–3 that look narrative-worthy.
5. Check `_decisions/*.md` in the window. If one exists, it becomes "One decision worth recording."
6. Pick the strongest single narrative thread — not the most commits, the one with the strongest "why this mattered."
7. Slug = `devlog-NNN-<hook>` (next sequential number). Confirm with the user.
8. Draft to `content/blog/devlog-NNN-<hook>/en.md` following the §3 prose structure. Cite commits by hash or PR number.
9. Run the `devlog.md §5` checklist against the draft. Fix anything that fails.
10. Invoke `portfolio-voice` (drafting behavior). Let it hand off to Strunk.
11. Invoke `humanizer` on the Strunk-cleaned result for the final AI-tell pass.
12. Print the publish command; end with the footer.

### Example 2 — "turn ADR 0020 into a post"

1. Read `adr/0020-composite-score-vector-dormant-ship.md`, `post-templates.md §2`, `prompts.md` P02.
2. Read `context-packs/ai-overview.md` — composite scoring is on the canonical-terms list; use "composite scoring path," not "heuristic alternative."
3. Verify the ADR is still in force: run its Verification line against current code. If it fails, STOP — the ADR is stale before the post is even drafted.
4. Find a concrete opening scene. The ADR's captures / the related commit message usually have one ("the day I realized the greedy path was dominating"). If none exists, ask the user.
5. Draft 600–1200 words in adr-narrative shape: opening scene → the choice → why not the obvious thing → what it bought us → what it cost → link to the ADR.
6. Invoke `portfolio-voice`, then `humanizer`. Print the publish command. Footer.

### Example 3 — "write a marketing post about Project Ascension"

STOP. `marketing post` is not a template in `post-templates.md`. Ask the user which template applies — most likely `mini-post` or `design-deep-dive`, depending on the angle.

## Files this skill may read

From the portfolio:

- `docs/project-ascension/post-templates.md`
- `docs/project-ascension/prompts.md`
- `docs/project-ascension/devlog.md`
- `docs/project-ascension/agent-workflow.md`
- `docs/project-ascension/blog-post-ideas.md`
- `docs/project-ascension/adr/_index.md`
- `docs/project-ascension/adr/NNNN-*.md`
- `docs/project-ascension/context-packs/*.md`
- `content/blog/*/en.md` — for voice calibration and series continuity (existing devlogs)

From the game repo:

- `docs/GAME_DESIGN.md`
- `docs/ARCHITECTURE.md`
- `docs/features/FEATURE_*.md`
- `docs/devlog/_captures/*.md`
- `docs/devlog/_decisions/*.md`
- `docs/devlog/_metrics/*.json`
- `src/**/*.gd` — only for short verbatim excerpts with `file:line` citations
- Git log / git show output

## Next step

After drafting, always hand off to the voice + Strunk + humanizer chain:

```
Body draft ready with citations and invariants checked. Handing off to portfolio-voice for the voice + Strunk pass, then humanizer for the final AI-tell scrub.

Options:
A) Run `portfolio-voice` on the draft now, then `humanizer` on the result (Recommended — mandatory per composition contract)
B) Let me review the raw body first before the voice pass
```

Default to A. The post is not shippable until `portfolio-voice` (with its Strunk handoff) **and** `humanizer` have both run.

After `humanizer` returns, print the publish command and the review footer — do not run `pnpm publish:post`. That is always the author's step.
