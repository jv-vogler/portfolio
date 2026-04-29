---
adr: NNNN
title: "<short imperative statement of the decision>"
status: proposed # proposed | accepted | superseded-by-NNNN | reversed
date: YYYY-MM-DD
tags: [] # e.g. [ai, cards, ui]
supersedes: null # adr number this replaces, if any
superseded_by: null # filled in later when a future ADR replaces this one
---

# ADR NNNN — <title>

## Context

What is the force acting on this decision? What problem, constraint, or design tension made a choice necessary? 2–5 sentences. Name the alternatives by name, even briefly.

Cite sources: `docs/GAME_DESIGN.md §Design Invariants`, `src/path/to/file.gd:L42`, `docs/features/FEATURE_X.md`, or a commit hash.

## Decision

State the decision in one paragraph. Present tense. Unambiguous: a reader should be able to infer what code would be written or not written as a result.

## Alternatives considered

- **Alternative A** — 1 line describing it; 1 line why it was rejected.
- **Alternative B** — same.

Do not include straw-man alternatives. Only list the ones that were real candidates.

## Consequences

Positive, negative, and neutral. Be honest about costs.

- **Positive:** ...
- **Negative:** ...
- **Neutral / follow-ups:** ...

## Verification

How does a reader or agent verify this decision is still in force? Give a grep, a file to read, or a doc section. One line is enough.

> Example: `grep -r "consume_on_play" src/data/cards/` — if this turns up no usages, the ADR is stale.

## Notes for future content

(Optional.) One or two specific angles this ADR would support in a blog post. Frame as prompts to the future writer, not as the post itself.

- "This is the decision that makes roster deaths _matter_. Good anchor for a deckbuilding-design post."
- "Pair with ADR-00XY for the two-tier-AP essay."
