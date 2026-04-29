# Project Ascension — ADRs

Architecture Decision Records. One decision per file, immutable once merged, superseded by new ADRs rather than edited.

## Why ADRs exist here

This directory has two audiences:

1. **Future-you**, trying to remember why something is the way it is.
2. **AI agents** producing content about the game — deep-dive posts, devlogs, tutorials. An ADR is a self-contained "why we did X over Y" with citations. Drop the ADR into the agent's context, ask for a post, and the reasoning is already there.

## File layout

```
adr/
  README.md           ← this file
  template.md         ← copy this when writing a new ADR
  _index.md           ← generated / hand-maintained table of all ADRs
  NNNN-short-slug.md  ← one ADR per file, zero-padded to 4 digits
```

ADRs live in **this portfolio repo** (not the game repo). Reason: the agent that writes blog posts lives here; keeping ADRs nearby reduces friction. Capture decisions _first_ in `docs/devlog/_decisions/` on the game side (see `../devlog.md` §1.4), then ratify them into a numbered ADR in this directory when the decision is confirmed.

## Rules

- **Immutable.** Once an ADR is numbered and merged, its body does not change. If the decision changes, write a new ADR that supersedes it and update the old one's `status` line only.
- **Numbered monotonically.** Never skip, never reuse.
- **Slug is stable** — it may appear in external links (post bodies, conference talks, etc).
- **Dates** on every ADR. Captured on first authoring; not updated.
- **Status values:** `proposed` · `accepted` · `superseded-by-NNNN` · `reversed`. No other states.
- **Short.** An ADR is not the full explanation of the system; it is the record of the _choice_. Prose lives in blog posts and feature docs; the ADR is the receipt.
- **One decision per file.** If you're tempted to write "and we also decided…" — that's a second ADR.

## When to write one

Write an ADR when:

- A choice has a real alternative you considered and rejected.
- The decision is hard to reverse, or reversal would cost real work.
- A future-you or future-agent might look at the code and wonder "why not the obvious thing?"
- A design invariant in `GAME_DESIGN.md` needs an origin story.

Do not write one when:

- The choice is obvious and has no alternative (e.g., "we use Godot" — that's the premise, not a decision).
- It's a bug fix, not a decision. Bug fixes have commit messages; that's enough.
- The decision is internal to one function and will never leak into conversation.

## Seeded ADRs

The seeded ADRs in `0001`…`00NN` are a backfill: decisions that were already made and deserve to be on record. They were extracted from `GAME_DESIGN.md`, `.rules/*.md`, feature docs, and the architecture spec archive. Each cites its source so an agent can verify claims.

See `_index.md` for the running table.
