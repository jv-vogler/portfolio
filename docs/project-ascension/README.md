# Project Ascension — Content Docs

Structured documentation for producing blog content about **Project Ascension**, a Godot 4 tactical hex roguelite deckbuilder living at `/mnt/c/Users/jvogler/Documents/JV/Personal/Projects/godot/project_ascension`.

**Primary audience:** AI agents drafting posts. **Secondary audience:** future-you trying to remember why the game is the way it is.

---

## What's here

```
docs/project-ascension/
├── README.md                    ← this file
├── agent-workflow.md            ← one-page agent onboarding; start here when spawning an agent
├── blog-post-ideas.md           ← running catalog of ~100 post topics, tagged + prioritized
├── capture-habits.md            ← what you (human) must do to keep material flowing
├── devlog.md                    ← dev log contract: capture format, cadence, template, review
├── post-templates.md            ← structural templates for devlog / adr-narrative / deep-dive / postmortem / mini / tutorial / series-intro
├── prompts.md                   ← copy-paste prompts P01–P10 for agents
├── adr/                         ← Architecture Decision Records
│   ├── README.md
│   ├── template.md
│   ├── _index.md
│   └── 0001–0025-*.md           ← 25 seeded decisions with citations
└── context-packs/               ← pre-digested fact bundles for recurring topics
    ├── README.md
    ├── ai-overview.md
    ├── card-authoring.md
    ├── input-state-machine.md
    ├── economy.md
    └── board-and-displacement.md
```

---

## How to use this package

**To write a post:** `agent-workflow.md` → pick a template → run the right prompt from `prompts.md`.

**To capture material:** `capture-habits.md`. Two minutes per coding session.

**To record a decision:** use `adr/template.md`, give it the next number from `adr/_index.md`, add it to the table.

**To extend the system:** add a context pack for a new topic, add a new post template, add a new prompt. All self-contained.

---

## First-run setup

The game-repo side is seeded. What exists in `project_ascension/`:

- `docs/devlog/README.md` — explains the folder locally
- `docs/devlog/DEVLOG_INDEX.md` — empty starter table
- `docs/devlog/_captures/_TEMPLATE.md` — session capture template
- `docs/devlog/_decisions/_TEMPLATE.md` — decision capture template (ADR shape)
- A `## Devlog Captures` section appended to `CLAUDE.md` (and mirrored via symlink to `AGENTS.md`) telling agents when to write a capture

**Still optional, when you want it:**

1. **Metrics dumper** — `tools/dump_devlog_metrics.gd` emitting `_metrics/YYYY-MM-DD.json`. See `devlog.md §1.5` for schema. Skip until you want "numbers" sections in dev logs.
2. **First capture.** Write one when a session meets the bar in `capture-habits.md`. No pressure to prove the loop works on an off-day — forcing one degrades the signal.

---

## Principles, in case you want the quick version

- **Captures are the input.** Everything downstream depends on them.
- **Templates are contracts.** Every post matches exactly one template.
- **ADRs are immutable.** You supersede, you don't edit.
- **Context packs are cached truth.** They save the agent from re-reading the game repo each post.
- **The human publishes.** Agents draft; you review and ship.

---

## Expansion ideas (future)

Not needed to start, but worth knowing are possible:

- A fourth category of post-template: **video companion** — scripts for devlog videos.
- A second batch of context packs: `ui-affordance`, `debug-tooling`, `tests-and-fixtures`.
- A "published posts" index under `docs/project-ascension/_published.md` tracking what shipped with links — currently implicit in `content/blog/`.
- Automation: a small script that runs P08 weekly on a schedule and drops the output into an inbox file.

None are urgent. The current package is usable as-is.

---

## Changelog

- **2026-04-18** — Initial version. 8 top-level docs, 25 seeded ADRs, 5 context packs, 10 prompts, 7 post templates.
