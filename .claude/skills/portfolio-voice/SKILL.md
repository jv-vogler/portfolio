---
name: portfolio-voice
description: Enforce João's writing voice on any blog post in the jv-portfolio repo. Use whenever the user asks to "draft a post", "write a blog post about X", "polish this post", "rewrite this in my voice", "make this sound like me", or when any draft under content/blog/ is being written or edited. This is the VOICE layer — it composes with the existing `blog-post` skill (which owns file paths + publish command) and with `elements-of-style:writing-clearly-and-concisely` (which owns Strunk rules). Always invoke when producing prose that will ship on the portfolio, even if the user does not say "voice" explicitly.
---

# Portfolio voice

This skill is the voice layer for the jv-portfolio blog. It does not own file paths, front matter schemas, the publish pipeline, or the Strunk rule set — those belong to other skills. It owns one question:

> Does this draft sound like João's existing posts, or does it sound like a generic AI?

## Composition

```
blog-post            → workflow, slug, front matter, publish command
portfolio-voice      → THIS skill: voice on drafting + polishing
elements-of-style    → final Strunk pass (clarity, concision, strong verbs)
```

When the user is drafting from scratch, `blog-post` orchestrates and `portfolio-voice` drafts the prose inside that workflow. When the user is polishing an existing draft, `portfolio-voice` runs directly.

## Voice profile

The cached profile lives at `voice-profile.md` alongside this file. Read it on every invocation. It is the source of truth for:

- Sentence rhythm and length patterns
- Register and vocabulary
- Typical opening and closing moves
- Punctuation habits (real ones, not invented ones)
- Anti-patterns — phrases and tics that read as AI prose
- Verbatim example sentences to calibrate tone

If the profile does not exist yet, see **Deriving the profile** below.

## When to invoke

Trigger on any of:

- "draft a post", "write a blog post about X", "new post about X"
- "polish this post", "clean this up", "revise this draft"
- "rewrite this in my voice", "make this sound like me"
- Any file under `content/blog/*/en.md` or `content/blog/*/pt.md` is being authored or edited
- The `blog-post` skill hands off the drafting step

Do not invoke for: commit messages, error messages, UI copy, or anything outside `content/blog/`. Those belong to `elements-of-style:writing-clearly-and-concisely` directly.

## Drafting behavior (new posts)

Use this flow when producing a fresh draft.

1. **Read `voice-profile.md`.** Do not skip this. The profile has specific openings, closings, and anti-patterns that are not obvious from the codebase.
2. **Read 1–2 existing posts in `content/blog/*/en.md` or the reference set at `tmp/blog-post-references/`** if they exist. Concrete examples beat remembered rules.
3. **Draft at `content/blog/<slug>/en.md`** with full front matter (see the `blog-post` skill for the exact schema — do not invent fields).
4. **Apply the voice profile from the first sentence.** Do not write a generic draft and plan to "voice-ify it later." The opening is the hardest part of the voice; get it right up front. If the profile's example openings do not fit the topic, choose a different analogy or scene — do not fall back to "In this post we'll…".
5. **Use placeholder tags for anything the author will fill in.** All placeholders use `<placeholder>...</placeholder>` tags (HTML-style). Tags are visually distinct in raw markdown, grep-friendly, and survive as-is through the Markdown-to-Lexical pipeline so they stay noisy if an author forgets to resolve them before publishing. Contents must always be specific, never generic.

   **Inline media placeholders** (one short line, sit inside prose):
   - `<placeholder>screenshot of <specific thing></placeholder>`
   - `<placeholder>gif of <specific thing></placeholder>`
   - `<placeholder>diagram of <specific thing></placeholder>`
   - `<placeholder>code snippet of <what></placeholder>`

   Good: `<placeholder>screenshot of battle UI with AP preview active</placeholder>`
   Bad: `<placeholder>screenshot of game</placeholder>`

   **Block placeholders** (multi-line, the author writes real prose inside). Put the opening and closing tags on their own lines so the block visually separates from the surrounding paragraphs:

   ```
   <placeholder>
   Personal opening hook — 2-4 sentences on why you're building this.
   Replace this entire block with your own prose before publishing.
   </placeholder>
   ```

   Block placeholders are mandatory for personal-content sections (see rule 7 below). Authors can't fill what they can't find at a glance.

6. **Never invent facts.** If a claim needs verification (a number, a date, an API surface, a library behavior, a quote), mark it inline as `<verify>the claim</verify>` and list every such claim at the end of the draft under a `## Claims to verify` section. The same HTML-tag notation as `<placeholder>` so the two authoring markers share one grep pattern and one visual signal. Better to surface doubt than to publish a hallucination.
7. **Never fabricate personal content.** Feelings, anecdotes, taste, autobiography, formative moments, opinions about games or books or films or life events — if the voice profile does not evidence it and the repo does not document it, **do not invent it**. Drop in a block `<placeholder>...</placeholder>` describing what belongs there. Fake personal hooks ("X taught me that Y is life", "I've always loved Z", "there's something magical about W") read as instantly artificial, even when surrounded by prose that otherwise passes. The opening and closing are where this trap sits hardest — if in doubt, placeholder it and keep moving.
8. **Close with the Strunk pass.** After the voice draft is ready, invoke `elements-of-style:writing-clearly-and-concisely` on the full prose. This is the handoff — see **Next step** below.
9. **Print the publish command** at the end (the one the `blog-post` skill uses). Do not run it.

## Polishing behavior (existing posts)

Use this flow when the user hands over an existing draft and wants it rewritten in their voice.

1. **Read the target file.** Note the structure, the claims, any placeholder markers, any code samples.
2. **Read `voice-profile.md`.**
3. **Rewrite sentence by sentence toward the profile.** Do not restructure the post. Do not add sections. Do not remove sections. The structure is the author's; the voice is what you are adjusting.
4. **Preserve placeholder tags and code blocks exactly.** Do not paraphrase a `<placeholder>...</placeholder>` tag into prose. Do not reformat code fences or change their language tag. Personal-content placeholders (block form, often multi-line inside the tag pair) are especially load-bearing: they exist precisely because the author wants to fill them in themselves. Never attempt to "draft a candidate" inside one.
5. **Preserve every `<verify>...</verify>` marker.** If you notice a new claim that needs verification, add a fresh marker; do not strip existing ones.
6. **Flag fabricated personal content for replacement.** If the existing draft contains invented autobiography or sentimental hooks ("X taught me Y", "I've always believed…", "there's something about Z"), replace those lines with a `<placeholder>...</placeholder>` block describing what belongs there. Do not swap in a different fabrication.
7. **Close with the Strunk pass** — invoke `elements-of-style:writing-clearly-and-concisely` on the polished draft.

## Deriving the profile (first run only)

If `voice-profile.md` does not exist, stop and ask the user to point at 2–5 reference posts representing their voice. Accept URLs, pasted markdown, or file paths on disk. Then:

1. Read every reference.
2. Distill into `voice-profile.md` (≤300 words) using this structure:
   - Sentence length pattern (short/medium/long mix, how fragments and one-word paragraphs are used)
   - Vocabulary register (casual/technical/dry — with examples)
   - Typical opening move (2–5 verbatim openings from the references)
   - Typical closing move (2–3 verbatim closings)
   - Punctuation quirks (real ones — em-dash use, parentheticals, strikethrough, ellipses, ALL CAPS)
   - Rhetorical moves the author actually uses (fake Q&A, pop culture drops, thematic headings, etc.)
   - Anti-patterns the author does NOT use (phrases to avoid, AI-isms, em-dash clouds, corporate hedging)
   - 3–5 verbatim sentences to calibrate against
3. Do not re-derive on subsequent runs. Only re-derive if the user explicitly asks ("refresh the voice profile", "I've written a few more posts, update the profile").

## Escalation — STOP and ask

Stop and ask the user, rather than guessing, when:

- Drafting is requested but `voice-profile.md` does not exist and no reference posts have been offered.
- A factual claim is material to the post (not a throwaway) and cannot be verified from the repo, the references, or public documentation you can actually fetch. Do not guess library behavior, benchmark numbers, historical dates, or quotes.
- The topic requires a callback to a prior post and it is unclear whether that prior post exists.
- The user asks for a voice shift the profile does not support (e.g. "make this read like a research paper"). The skill is for João's voice; a different voice is a different skill.

## Files this skill may read

- `voice-profile.md` — the cached profile (always)
- `content/blog/*/en.md`, `content/blog/*/pt.md` — existing posts as voice evidence
- `tmp/blog-post-references/*.md` — the reference corpus used to derive the profile
- `docs/project-ascension/devlog.md` — for dev-log-specific voice constraints (§3.3). Use as a sanity floor for game dev log posts, not a ceiling for all posts.

## Hard rules

- **Never invent facts.** `<verify>...</verify>` is the only honest thing to do when unsure.
- **Never fabricate personal content.** No invented feelings, anecdotes, taste, formative moments, or opinions about external media. A `<placeholder>...</placeholder>` tag is the only honest move. The cheesiest failure mode is the "X taught me that Y is life" cold open — avoid it categorically.
- **No setup-undercut pacing.** The pattern "I did X. But there's more to it than X." is AI filler; the second sentence announces its own function instead of just saying the thing. Either state both reasons in one sentence ("I picked X because Y, and because Z"), or drop the announcer line and pivot directly.
- **No "announcer" prose.** Phrases that narrate their own purpose — "Here's the thing:", "But that's only part of it.", "What's interesting is...", "The real question is..." — are filler. Say the thing instead of announcing that you're about to say it.
- **Never use em-dash clouds.** Three or more em-dashes clustered in one paragraph reads as AI prose, regardless of the rest of the voice. Spread tangents across parentheticals, commas, or separate sentences.
- **Never open with "Let's explore", "In this post we'll", "dive in", or similar.** The profile lists what the author actually opens with; use those shapes instead.
- **Never restructure a post when polishing.** Voice work is sentence-level. Restructure is a separate request.
- **Never skip the Strunk pass.** Voice work and Strunk rules are orthogonal — both must run before the draft is considered done.
- **Always invoke `humanizer` after Strunk.** The pipeline is voice → Strunk → humanizer, and the last step catches the AI tells Strunk and voice both miss (-ing tail phrases, rule-of-three lists, "testament to", curly quotes, promotional register).

## Next step

After the voice draft (or polish) is done, hand off to the Strunk rule set:

```
Voice pass complete. Handing off to the final Strunk polish.

Options:
A) Run `elements-of-style:writing-clearly-and-concisely` on this draft now (Recommended)
B) Let me review the voice pass first before the Strunk polish
C) Skip Strunk — this post is short enough that the rules would be noise
```

Default to A. Strunk rules rarely conflict with the voice profile, and the post is not shippable until they run.
