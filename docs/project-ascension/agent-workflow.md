# Agent Workflow

How an AI agent uses this docs package to produce quality content about Project Ascension, without you having to explain the game every time.

This is the one-page summary. If someone (or an agent) reads only one file in this directory, this is the one.

---

## The three surfaces an agent touches

1. **Contracts** — what a post must look like. `post-templates.md`, `devlog.md`, `adr/template.md`.
2. **Context** — what's true about the game, with citations. `context-packs/*.md`, `adr/*.md`, `blog-post-ideas.md`.
3. **Commands** — pre-written prompts to invoke. `prompts.md`.

Plus one input that only you produce: **captures** in the game repo (`game/docs/devlog/_captures/`, `_decisions/`). See `capture-habits.md`.

---

## The standard content loop

```
You                                         Agent
──────────────────────────────────────────  ──────────────────────────────────────────
End of coding session: write capture.       (waits)
                                            ─────► On Friday, run P08: summarise week.
Read P08 output (≤500 words). Decide:
  - write a post? which template?
  - none: stop.

If devlog:
  Run P01.                                  Drafts to content/blog/devlog-NNN-slug/en.md
                                            using devlog.md §3.

  Run P06 rewrite pass (optional but        Rewrites in place, removing AI-voice tells.
  recommended).

  Run P10 critique (optional).              Returns structured critique.

Read the draft. Apply critiques. Pass
devlog.md §5 checklist manually.

`pnpm publish:post`.
```

For non-devlog posts, swap P01 for P02 (adr-narrative), P03 (deep-dive), P04 (postmortem), or P05 (mini). Everything else — rewrite pass, critique, review, publish — is the same.

---

## When I want X, I read Y

| I want…                                | Read…                                     |
| -------------------------------------- | ----------------------------------------- |
| Post topics to pick from               | `blog-post-ideas.md`                      |
| How to write a devlog                  | `devlog.md`                               |
| How to write any other post type       | `post-templates.md`                       |
| The exact prompt to use                | `prompts.md`                              |
| A fact about the AI system             | `context-packs/ai-overview.md`            |
| A fact about card authoring            | `context-packs/card-authoring.md`         |
| A fact about the economy               | `context-packs/economy.md`                |
| A fact about input handling            | `context-packs/input-state-machine.md`    |
| A fact about board/displacement        | `context-packs/board-and-displacement.md` |
| The reasoning behind a decision        | `adr/NNNN-slug.md`                        |
| All decisions on record                | `adr/_index.md`                           |
| What I need to do to keep this working | `capture-habits.md`                       |

---

## Agent system prompt (reusable)

If you're spawning a sub-agent that will produce Project Ascension content, include this as its system prompt — it tells the agent about this package so individual prompts stay shorter.

```
You are producing content for the jv-vogler portfolio about a Godot 4 tactical hex
roguelite deckbuilder called Project Ascension.

Repositories:
- Portfolio (where posts are published): /home/jvogler/Projects/personal/jv-portfolio
- Game (source of truth for facts):      /mnt/c/Users/jvogler/Documents/JV/Personal/Projects/godot/project_ascension

Content system lives in portfolio/docs/project-ascension/. Always read the relevant
documents before drafting:

- post-templates.md — structural contracts for every post type
- devlog.md — the dev log contract (frontmatter, sections, voice, review checklist)
- adr/_index.md + adr/NNNN-*.md — recorded decisions; never contradict an accepted ADR
- context-packs/*.md — pre-digested facts with citations; use these before reading raw source
- blog-post-ideas.md — running catalog of topics

Ground rules:
1. Never contradict a Design Invariant in game/docs/GAME_DESIGN.md or an accepted ADR.
   If you notice a contradiction, STOP and report it to the user — do not write around it.
2. Every technical claim must cite a file path, a commit hash, or a doc section.
3. Use the canonical terms from the context packs exactly. Do not substitute synonyms.
4. Voice is first person, singular, past tense for history, present tense for how things work.
   No "let's explore," no "in this post we'll," no em-dash clouds.
5. Do not publish. Final step is always the user running `pnpm publish:post` after manual review.
6. If asked to produce a post type you have no template for, STOP and ask.

Always end with a one-line footer: "Draft ready. Review: [checklist]. Then `pnpm publish:post`."
```

---

## Escalation rules

Cases where the agent should STOP and ask, not guess:

- A capture's `decisions` frontmatter points to a file that doesn't exist.
- A post would contradict an ADR with `status: accepted`.
- A context pack citation fails verification (file moved, content changed).
- The frontmatter of an existing published post would need editing.
- The user's requested post type isn't in `post-templates.md`.

In all five cases, the right behavior is to describe the conflict to the user and wait. Never publish around it.

---

## Maintenance

This doc is the only file that indexes the others; keep it current.

- When you add a new context pack, add a row above.
- When you add a new post template, note it under "How to write any other post type."
- When you add a new prompt, no update needed — prompts.md is authoritative.

Everything else in this package self-describes.
