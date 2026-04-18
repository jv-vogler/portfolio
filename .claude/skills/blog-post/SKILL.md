---
name: blog-post
description: Draft a blog post for the portfolio and publish it to Payload. Use when the user says any of "write a blog post", "draft a post", "new post about X", "/new-post", "blog post about X", or anything similar. Orchestrates topic refinement, outlining, drafting in `content/blog/<slug>/en.md`, applying `portfolio-voice` (voice layer), `elements-of-style:writing-clearly-and-concisely` (Strunk rules), and `humanizer` (final AI-tell scrub), then printing the publish command.
---

# Blog Post Authoring

This skill owns the blog-authoring workflow for the jv-portfolio repo. Follow it exactly — the publish pipeline depends on the artifacts produced here.

## What this skill does

Drafts a blog post on disk at `content/blog/<slug>/en.md` (and optionally `pt.md`), with an optional cover image at `content/blog/<slug>/cover.*`. The `content/` directory is **gitignored** — drafts never touch the repo. A separate script (`pnpm publish:post --slug <slug>`) pushes the finished post to Payload CMS.

The author is the repo owner; this skill is an assistant, not an automaton. Confirm decisions with the user at the checkpoints listed below.

## Checklist

You MUST step through these in order. Create a task per item via TaskCreate if the post is non-trivial.

1. **Confirm scope and slug**
2. **Brainstorm 2–3 angles** (skip if the user already has a clear thesis)
3. **Outline** — write front matter + H2 headings only into `en.md`
4. **Draft each section** — flesh out the body **using `portfolio-voice`** (mandatory — see §4)
5. **Apply `elements-of-style:writing-clearly-and-concisely`** to the full prose (mandatory)
6. **Apply `humanizer`** — final scrub for AI tells (mandatory — see §6)
7. **Offer cover image + PT translation** (optional)
8. **Print the publish command** — do not run it for the user

## 1. Confirm scope and slug

Ask the user for the topic if not provided. Derive a kebab-case slug from the topic (e.g. "How I typed my Lexical nodes" → `typed-lexical-nodes`). The slug is the folder name; there is no `slug` field in front matter.

Confirm the slug with the user before creating any file. If a folder already exists at `content/blog/<slug>/`, ask whether to overwrite or pick a different slug.

## 2. Brainstorm angles

If the user has not already committed to an angle, propose 2–3 distinct framings for the topic. Keep each to one sentence. Let the user pick one or redirect. Skip this step if the user's request already states the angle clearly.

## 3. Outline

Create `content/blog/<slug>/en.md` with complete front matter and H2 headings only. Do not write body prose yet. Use this exact schema:

```yaml
---
title: "Concrete, specific title — not a generic noun"
description: "One-sentence summary, ~140 chars. Used as the meta description and the excerpt on the list page."
publishedDate: "YYYY-MM-DD"
status: "draft"
tags: [tag-one, tag-two]
featured: false
coverAlt: "Describe the cover image in one short phrase"
---
## First section heading

## Second section heading
```

**Rules:**

- `title` must be specific and useful out of context. Not "Some thoughts on X".
- `description` must stand alone — the reader on the list page sees this before the body.
- `publishedDate` defaults to today's date. Ask the user if they want to backdate or schedule.
- `status` starts as `draft`. The user flips it to `published` when they're ready, or passes `--draft`/no flag at publish time.
- `tags` is optional; 2–4 tags is the sweet spot.
- `featured` defaults to `false`. Ask before setting `true` — only one post should be featured at a time on the homepage hero.
- `coverAlt` is **required only if** a `cover.*` image is added to the folder. Omit it otherwise.

## 4. Draft each section

**Before writing the first sentence, invoke `portfolio-voice`.** It loads the cached voice profile and owns sentence-level voice decisions — openings, closings, punctuation habits, anti-patterns. Voice must be applied from the first sentence; drafting generically and "voice-ifying later" is explicitly out of policy (see the portfolio-voice skill for the reasoning).

Skill invocation:

```
Skill: portfolio-voice
```

Use its **drafting behavior** (not polishing behavior) since this is a fresh post.

`portfolio-voice` also owns:

- Placeholder markers for media — use `[placeholder:screenshot of <specific thing>]`, `[placeholder:gif of …]`, `[placeholder:diagram of …]`, `[placeholder:code snippet of …]`. Never generic.
- `[verify: <claim>]` markers for facts that need checking, collected under a `## Claims to verify` section at the end of the draft.

With voice loaded, write the body one H2 section at a time. Favor concrete examples and code over abstraction. Code fences must include a language tag — our renderer uses Shiki highlighting and plain fences render as gray blocks:

````markdown
```ts
const x: number = 1;
```
````

Supported Shiki languages (register new ones in `src/ui/blog/lib/highlightCode.ts` if needed): ts, js, tsx, jsx, css, html, json, bash, sh, zsh, python, rust, go, sql, yaml, markdown, mdx, plaintext.

**Markdown features supported** by the publisher (via Payload's `convertMarkdownToLexical`):

- Headings H1–H6 (but use H2/H3 only — H1 is reserved for the post title)
- Bold `**x**`, italic `*x*`, inline code `` `x` ``
- Fenced code blocks with language
- Blockquotes `> …`
- Ordered and unordered lists (nesting may be unreliable — test with `--dry-run` if nesting matters)
- Horizontal rule `---`
- Links `[text](url)`

**Not supported** in the default editor config: tables, task lists, inline images. If the user asks for tables, flag that a follow-up is needed to register the table feature in `src/payload.config.ts` — don't just drop the markdown silently.

## 5. Apply elements-of-style (mandatory)

After the voice pass, invoke `elements-of-style:writing-clearly-and-concisely` and apply its rules to the full prose. Voice and Strunk are orthogonal — voice shapes what the sentences sound like, Strunk trims them. Run them in this order; reversing loses voice to over-editing.

Skill invocation:

```
Skill: elements-of-style:writing-clearly-and-concisely
```

Pass the current markdown body in the args. Apply every suggested revision that preserves the voice profile's habits (em-dashes, fragments, parentheticals, strikethrough jokes are all intentional — Strunk may flag them; keep them). Show the user the before/after of any non-trivial changes and let them override.

## 6. Apply humanizer (mandatory)

After Strunk trims the prose, invoke `humanizer` as the final scrub. Strunk's job is concision; it can bleed the voice out by cutting the tangents, asides, and opinionated fragments `portfolio-voice` deliberately put in. `humanizer` catches the remaining AI tells (em-dash clouds, rule-of-three lists, `-ing` tails, vague attributions, "testament to"-style puffery, curly quotes, emoji-decorated bullets) and restores the personality Strunk may have bled out.

Skill invocation:

```
Skill: humanizer
```

Pass the Strunk-cleaned markdown body in the args. Tell `humanizer` to treat the user's own prior posts in `content/blog/*/en.md` as the voice sample (or point it at `docs/voice-profile.md` if one exists in the package you're drafting for). Apply its rewrites wholesale where they preserve meaning; for any non-trivial rewrite, show the user before/after and let them veto.

Voice → Strunk → Humanizer runs in this order, always. Reversing either hop loses the voice. Skipping humanizer is how the "technically clean but reads AI-generated" posts slip through.

## 7. Cover image + PT translation (optional)

**Cover image:**

- Ask whether the user wants one. Images are stored once (deduped by SHA-256 content hash), so reusing an image across posts is free.
- The user drops any image at `content/blog/<slug>/cover.{jpg,jpeg,png,webp,gif,avif}`. You never download images yourself unless explicitly instructed.
- If added, `coverAlt` in `en.md` becomes required. Write alt text that describes the image, not the post topic.

**PT translation:**

- Offer this as a follow-up. Do not auto-translate without asking.
- If accepted, create `content/blog/<slug>/pt.md` with only `title`, `description`, and optional `coverAlt` in the front matter — tags/date/status/featured live on the document, not per-locale.
- Translate the body idiomatically, not word-for-word.
- If the user declines, Payload's fallback logic serves the EN post on PT routes automatically.

## 8. Publish command

When the draft is complete, tell the user exactly one of:

```bash
pnpm publish:post --slug <slug> --dry-run   # preview the Lexical JSON without writing
pnpm publish:post --slug <slug>             # publish (uses status from front matter)
pnpm publish:post --slug <slug> --draft     # force draft regardless of front matter
```

Do not run the command yourself unless the user explicitly asks.

## Hard rules

- **Never `git add` or `git commit` anything under `content/`** — the directory is gitignored on purpose.
- **Never edit `src/seed/publish.ts` or `src/collections/Posts.ts` from this skill.** Schema changes are a separate task. If a required field is missing or the script fails, stop and surface the error to the user.
- **Never invent new markdown features.** If something doesn't render, write a note in the post and flag the gap rather than hacking around it.
- **Never skip step 4's `portfolio-voice` invocation, step 5's Strunk pass, or step 6's `humanizer` pass.** All three are mandatory for anything shipped on the portfolio — one paragraph or a ten-page essay, the chain runs the same way.
- **Never invent facts.** If you are unsure about a claim (a date, a number, a library behavior, a quote), mark it `[verify: <claim>]` inline and list it under `## Claims to verify` at the end. Handoff belongs to the author, not to confident-sounding guesswork.

## Verification after publish

If the user has the dev server running, point them to `http://localhost:3000/blog/<slug>` after publishing a `published` post. Also link `http://localhost:3000/admin/collections/posts` for the admin view. Drafts will not appear on the public site.
