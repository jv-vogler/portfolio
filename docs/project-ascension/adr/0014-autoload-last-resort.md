---
adr: 0014
title: "Autoloads are a last resort"
status: accepted
date: 2026-04-18
tags: [engine, arch]
supersedes: null
superseded_by: null
---

# ADR 0014 — Autoloads are a last resort

## Context

Godot autoloads are globally accessible singleton nodes registered in `project.godot`. They are the easiest way to add a service that any scene can reach. They are also the easiest way to create hidden global state that makes every bug a whodunnit.

## Decision

Autoloads are used only for systems that are (a) genuinely global in scope, (b) isolated from per-scene state, and (c) need to outlive scene transitions. For everything else, prefer `static func` / `static var` utilities on named classes, or inject via `@export`. Current autoloads:

- `InputBindingManager` (input rebinding persists across scenes).
- `KeywordSeeder` (tooltip keyword registry populated at startup).

Any new autoload requires an ADR. See `.rules/node-autoloads.md`.

## Alternatives considered

- **Autoload-friendly** — Rejected. Too much hidden coupling for a game this size.
- **Pure DI through scene trees** — Rejected for the two cases above; they really do need to be process-wide.

## Consequences

- **Positive:** Dependency graph is mostly explicit. Most systems are reachable only via injection.
- **Negative:** Slightly more plumbing for systems that _feel_ global but aren't.

## Verification

`project.godot` `[autoload]` section must match the list above. Any additions should correspond to an ADR.

## Notes for future content

- Short post: "Autoloads are a last resort" (ideas §5.5).
