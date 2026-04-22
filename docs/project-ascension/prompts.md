# Prompt Library

Copy-pasteable prompts for AI agents producing Project Ascension content. Every prompt is self-contained — the agent needs nothing except access to this repo and the game repo.

Prompts use `{{placeholders}}` for values you fill in at call time.

---

## How to invoke

Two patterns work:

1. **Paste-and-go:** paste the whole prompt into a Claude Code session that has both repos available, replacing placeholders.
2. **Sub-agent:** dispatch a sub-agent with the prompt as its task description.

Always run an agent in isolation (no prior conversation context) for these prompts. They are written to stand alone.

Paths:

- **Portfolio repo:** `/home/jvogler/Projects/personal/jv-portfolio`
- **Game repo:** `/mnt/c/Users/jvogler/Documents/JV/Personal/Projects/godot/project_ascension`

---

## P01 — Weekly dev log draft

```
You are drafting a Project Ascension dev log post.

Portfolio repo: /home/jvogler/Projects/personal/jv-portfolio
Game repo: /mnt/c/Users/jvogler/Documents/JV/Personal/Projects/godot/project_ascension

First read these, in order:
1. portfolio/docs/project-ascension/devlog.md — full contract for devlog posts.
2. portfolio/docs/project-ascension/post-templates.md §1 — frontmatter + structure.
3. portfolio/docs/project-ascension/adr/_index.md — current ADRs; don't contradict any.
4. game/docs/GAME_DESIGN.md §"Design Invariants" — never contradict these.

Then gather window inputs ({{start_date}} to {{end_date}}):
- game/docs/devlog/_captures/*.md within the window
- `git log --oneline --no-merges --since={{start_date}} --until={{end_date}}` from the game repo
- game/docs/devlog/_decisions/*.md within the window (if any)
- First and last JSON in game/docs/devlog/_metrics/ within or adjacent to the window

Task:
- Produce a draft at portfolio/content/blog/devlog-{{number}}-{{slug}}/en.md.
- Follow devlog.md §3 structure exactly. Skip empty sections; do not pad.
- Cite commits by hash or PR number.
- Pick ONE strong narrative thread for "The story." Do not attempt a weekly summary.
- Run the devlog.md §5 checklist against your own draft before emitting. If any check fails, iterate once and fix it; then emit.

Constraints:
- No em-dash-heavy prose.
- No "in conclusion" / "stay tuned" / "exciting things ahead."
- Every claim about shipped behavior must be backed by a commit or a file citation.
- Do not publish. End with: "Draft ready. Review checklist: [link to devlog.md §5]. Then run `pnpm publish:post`."

Emit the final markdown only. No preamble.
```

---

## P02 — Turn an ADR into a blog post

```
You are writing an ADR-narrative blog post from an existing Architecture Decision Record.

Portfolio repo: /home/jvogler/Projects/personal/jv-portfolio
Game repo: /mnt/c/Users/jvogler/Documents/JV/Personal/Projects/godot/project_ascension

Source ADR: portfolio/docs/project-ascension/adr/{{adr_file}}

First read, in order:
1. The ADR at the path above.
2. portfolio/docs/project-ascension/post-templates.md §2 — adr-narrative structure.
3. Any files cited in the ADR's `Context` or `Verification` sections — verify the ADR is still in force. If the verification check fails, STOP and report the drift instead of writing the post.
4. portfolio/docs/project-ascension/context-packs.md — check for a context pack matching the ADR's topic. If one exists, use it for concrete snippets.

Task:
- Write portfolio/content/blog/{{slug}}/en.md following the adr-narrative template.
- Opening scene should be concrete: a specific day, bug, or playtest moment. If the ADR's captures file or the related commit message contains one, use it. If not, ask the user before guessing.
- Every technical claim cites a file path or commit.
- End with a link back to the source ADR.

Constraints:
- 600–1200 words.
- Do not invent alternatives not listed in the ADR. Stay true to the record.
- Do not publish. Emit the draft and a one-line "Ready for review" footer.
```

---

## P03 — Design deep-dive from a feature doc

```
You are writing a design deep-dive post about one subsystem of Project Ascension.

Portfolio repo: /home/jvogler/Projects/personal/jv-portfolio
Game repo: /mnt/c/Users/jvogler/Documents/JV/Personal/Projects/godot/project_ascension

Subsystem: {{subsystem}}   (e.g., "AI intent generation", "card step resolver", "input state machine")

First read, in order:
1. portfolio/docs/project-ascension/post-templates.md §3 — deep-dive structure.
2. portfolio/docs/project-ascension/context-packs.md — find a pack matching this subsystem. If one exists, use its snippets as anchors.
3. The relevant game/docs/features/FEATURE_*.md file.
4. The relevant ADRs in portfolio/docs/project-ascension/adr/ — cite them when they're load-bearing.
5. The actual source files under game/src/ referenced by the feature doc. Quote 1–3 short excerpts with file:line citations.

Task:
- Write portfolio/content/blog/{{slug}}/en.md following the deep-dive template.
- Walk the reader through ONE concrete example end-to-end (a specific card cast, a specific AI turn, a specific input flow).
- 1200–2500 words. Prefer splitting over stretching.

Constraints:
- Use terminology exactly as defined in game/docs/GAME_DESIGN.md "Core Concepts Glossary."
- Cite ADRs by number ("see ADR-0004") when the post touches on a recorded decision.
- No tutorial-flavored "now add the code." A deep-dive explains; it does not instruct.
- Do not publish. Emit the draft and a "Ready for review" footer.
```

---

## P04 — Bug postmortem from a capture

```
You are writing a bug postmortem post.

Portfolio repo: /home/jvogler/Projects/personal/jv-portfolio
Game repo: /mnt/c/Users/jvogler/Documents/JV/Personal/Projects/godot/project_ascension

Source capture(s): {{capture_paths}}   (e.g. "game/docs/devlog/_captures/2026-04-15.md")
Related commit(s): {{commit_hashes}}

First read, in order:
1. The capture(s).
2. `git show {{commit_hash}}` for each commit — the diff is your primary source of truth.
3. portfolio/docs/project-ascension/post-templates.md §4 — postmortem structure.

Task:
- Write portfolio/content/blog/{{slug}}/en.md following the postmortem template.
- Symptom first, diagnosis second, fix third, lesson fourth. Do not reorder.
- Quote the actual error message / log line / failing assert if one exists. Real artifacts beat paraphrase.
- End with a pattern-level lesson specific to this codebase. Avoid generic programming wisdom.

Constraints:
- 500–900 words.
- Do not blame tooling. "Godot let me do X" is a red flag — rephrase to "I did X."
- Do not performatively apologize or self-flagellate.
- Do not publish.
```

---

## P05 — Mini-post from a single observation

```
You are writing a mini-post (150–400 words) about one specific observation in the Project Ascension codebase.

Portfolio repo: /home/jvogler/Projects/personal/jv-portfolio
Game repo: /mnt/c/Users/jvogler/Documents/JV/Personal/Projects/godot/project_ascension

Observation: {{one_sentence_claim}}
Pointer: {{file_path_or_commit_hash}}   (where to verify it)

First read portfolio/docs/project-ascension/post-templates.md §5.
Verify the pointer: read the file or `git show` the commit; confirm the claim still holds. If it doesn't, STOP and report.

Task:
- Draft at portfolio/content/blog/{{slug}}/en.md.
- Three paragraphs max: setup, point, so-what.
- Description frontmatter must state the entire takeaway in one sentence — someone who only reads the description should have the point.

Constraints:
- 150–400 words. Shorter is better.
- No ceremony.
- Emit only the draft.
```

---

## P06 — Rewrite pass (remove AI voice)

Use this when a draft (from any prompt above) came back with AI tells: em-dash clouds, tricolons, "let's explore," "in this post we'll," weirdly hedged claims.

```
You are doing a rewrite pass on a Project Ascension draft.

Draft path: {{draft_path}}
Original voice reference: read any THREE of my existing posts at portfolio/content/blog/*/en.md to calibrate tone.

Task:
- Rewrite the draft in my voice.
- Remove all "let's", "let's explore", "dive into", "in this post we'll", "join me as we."
- Cap em-dashes at most 2 per 500 words. Prefer periods and commas.
- Cut any sentence that could appear in any other AI-written blog post. Replace with something specific to this codebase or a concrete number.
- Do not change factual claims. If a claim is vague, flag it instead of tightening it.
- Preserve frontmatter exactly.

Output: the full rewritten markdown, emitted in place (overwrite the draft file).
```

---

## P07 — ADR proposer (from a capture)

```
You are drafting a new ADR from a decision capture.

Portfolio repo: /home/jvogler/Projects/personal/jv-portfolio
Game repo: /mnt/c/Users/jvogler/Documents/JV/Personal/Projects/godot/project_ascension

Source: {{capture_path}}

First read:
1. portfolio/docs/project-ascension/adr/template.md
2. portfolio/docs/project-ascension/adr/_index.md — to pick the next number and check for duplicates.
3. The source capture.

Task:
- Create portfolio/docs/project-ascension/adr/{{next_number}}-{{slug}}.md filled from the template.
- Update the index table in _index.md with the new row.
- Status: `proposed` (the user will promote to `accepted` after review).

Constraints:
- One decision per ADR. If the capture covers two, split into two files.
- The Verification line must be a runnable grep or a readable file path. Not "check the code."
- Do not edit existing ADRs.
```

---

## P08 — Captures summariser (weekly)

Run this at the end of each week even if you're not publishing. It produces a condensed summary you can skim to decide whether there's a post worth writing.

```
You are summarising a week of Project Ascension work.

Window: {{start_date}} to {{end_date}}

Sources (read all):
- game/docs/devlog/_captures/*.md within the window
- `git log --oneline --no-merges --since={{start_date}} --until={{end_date}}`
- game/docs/devlog/_decisions/*.md within the window

Emit a markdown summary with these sections:
1. Headline ships — bullet list, ≤5 items, each 10 words or fewer
2. Single most interesting moment — 2 sentences
3. Open blockers — bullet list; empty is fine
4. Post candidates — for each, a template name from post-templates.md + a 1-sentence hook
5. ADR-worthy decisions — list of any decisions that should become ADRs; one line each

Constraints:
- Total response ≤500 words.
- If nothing notable happened, say so in one sentence and stop. Do not pad.
```

---

## P09 — Context pack updater

```
You are updating a context pack with fresh material.

Pack path: portfolio/docs/project-ascension/context-packs/{{pack_slug}}.md

Task:
- Read the pack.
- For each snippet in "Citations," re-verify the file:line points still exist and the content is still accurate. If it moved, update the citation. If it was removed, mark the snippet DEPRECATED with a note.
- Scan the game repo for new additions related to this pack's subject (files newer than the pack's last updated date). Add up to 3 new snippets.
- Update the pack's "Last updated" date at the bottom.

Constraints:
- Do not delete history — DEPRECATED snippets stay in the file, flagged.
- Do not add speculative material. Every snippet must be a verbatim quote with a verifiable citation.
```

---

## P10 — First draft reviewer (you review, agent critiques)

When you _have_ written something and want an agent to stress-test it.

```
You are reviewing a Project Ascension blog draft written by the user.

Draft path: {{draft_path}}

Read:
1. The draft.
2. portfolio/docs/project-ascension/post-templates.md — the template matching the draft's tags/shape.
3. portfolio/docs/project-ascension/devlog.md §5 checklist (even for non-devlogs, the spirit applies).
4. portfolio/docs/project-ascension/adr/_index.md — check whether the draft contradicts any accepted ADR.

Produce a review with these sections:
- **Factual issues** — anything that's wrong or unverifiable. For each: location in draft + evidence against.
- **Structural issues** — template mismatches, missing or extraneous sections.
- **Voice issues** — flat, AI-toned, or inconsistent-with-existing-posts sentences. Quote them; suggest alternatives.
- **Strong parts** — what's working; don't let a revision ruin them.
- **Go / no-go** — ready to publish with minor edits · needs revision · scrap.

Constraints:
- Be specific. "Paragraph 3, sentence 2" beats "the middle section."
- Do not rewrite — call out. The user rewrites.
- ≤800 words total.
```

---

## Chaining prompts

Common chains:

- **Fresh devlog:** P08 (summarise) → skim → P01 (draft) → P06 (rewrite) → review → publish.
- **New ADR-led post:** P07 (propose ADR) → user accepts → P02 (narrative) → P06 → review → publish.
- **Deep dive:** P03 → P10 (agent critique) → your edits → P06 → publish.
- **Weekly hygiene:** P08 every Friday; P09 monthly per pack.
