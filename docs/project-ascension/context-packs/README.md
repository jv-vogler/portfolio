# Context Packs

Reusable bundles of facts, citations, and verbatim snippets about a single subject in Project Ascension. An agent drafting a blog post loads the relevant pack and inherits the right vocabulary, numbers, and quotes — no guessing.

## Anatomy of a pack

Every pack has these sections in this order:

1. **Subject** — 1 sentence. What this pack covers.
2. **Canonical terms** — the glossary for this subject. Agents must use these exact terms; no synonyms.
3. **Key claims** — the non-obvious truths, each with a verifiable source citation.
4. **Invariants** — rules this subject must never violate (pointers to GAME_DESIGN.md or ADRs).
5. **Citations** — verbatim code / doc excerpts with `path:line-range`. Ready to paste.
6. **Related ADRs** — links to ADRs that record decisions in this space.
7. **Related posts** — links to already-published posts, to avoid duplication.
8. **Last updated** — ISO date; used by P09 (context-pack updater).

## How agents use them

Prompts P03 (design deep-dive), P02 (ADR narrative), and P05 (mini-post) check for a matching pack before drafting. If one exists, it's pre-digested context — cheaper than re-reading the source.

## How you use them

You update a pack when a claim in it becomes wrong. Run P09 monthly per pack to catch drift automatically.

## Current packs

| Pack                                                | Subject                          | Last updated |
| --------------------------------------------------- | -------------------------------- | ------------ |
| [ai-overview](ai-overview.md)                       | The AI system as a whole         | 2026-04-18   |
| [card-authoring](card-authoring.md)                 | How cards are authored as data   | 2026-04-18   |
| [input-state-machine](input-state-machine.md)       | The input state machine refactor | 2026-04-18   |
| [economy](economy.md)                               | AP / MP / deck / hand economy    | 2026-04-18   |
| [board-and-displacement](board-and-displacement.md) | Hex grid, movement, push/pull    | 2026-04-18   |

## Writing a new pack

1. Name it after the subject, kebab-case. Keep scope _narrow_ — "ai-overview" is near the upper bound; "ai-team-context" is better scoped than "ai-coordination-and-scoring."
2. Copy an existing pack's structure.
3. Fill every snippet with a real verifiable citation. If you find yourself paraphrasing, stop — grab the actual excerpt.
4. Add a row to the table above.
