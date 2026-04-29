---
adr: 0025
title: "Design spec precedes implementation plan"
status: accepted
date: 2026-04-18
tags: [process]
supersedes: null
superseded_by: null
---

# ADR 0025 — Design spec precedes implementation plan

## Context

Non-trivial work (AI rewrites, input-manager refactor, projectile system) tended to start as a long TODO list, which mixed "what are we building?" with "in what order?" — and the ordering questions crowded out the design ones. Design mistakes got sealed in before discussion.

## Decision

For any feature/refactor spanning more than a day of work, a **design spec** is authored first (at `docs/superpowers/specs/YYYY-MM-DD-<slug>.md`). It answers: context, goals, architecture overview, data model, key invariants, open questions. Only after the spec is stable is an **implementation plan** written (`docs/superpowers/plans/YYYY-MM-DD-<slug>.md`) with checkbox-per-step tasks for an agent or human to execute.

Plans reference the spec; specs do not change to match plan surprises — if the plan reveals a design flaw, write a new spec revision.

## Alternatives considered

- **One combined doc** — The previous approach; rejected.
- **Spec-only (no plan)** — Rejected. Agent-executable plans are too useful to give up.

## Consequences

- **Positive:** Design debates are visible and dated. A future reader can see what was known when.
- **Positive:** Plans can be short and mechanical because design context is elsewhere.
- **Negative:** Two documents for big work. Acceptable.

## Verification

`ls docs/superpowers/specs/ docs/superpowers/plans/` — names align; each plan references a spec.

## Notes for future content

- Process post: "Writing specs before plans" (ideas §8.3).
