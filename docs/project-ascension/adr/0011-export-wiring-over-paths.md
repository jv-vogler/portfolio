---
adr: 0011
title: "Wire dependencies via `@export var`, never string paths"
status: accepted
date: 2026-04-18
tags: [engine, arch]
supersedes: null
superseded_by: null
---

# ADR 0011 — Wire dependencies via `@export var`, never string paths

## Context

Godot offers several ways to reference sibling/child nodes: `$NodeName`, `get_node("Sub/Node")`, `@onready var x = $Foo`, or `@export var x: NodeType`. The first three rely on string paths or naming conventions; the fourth wires up in the Inspector.

## Decision

All inter-node references use `@export var <name>: <Type>` and are wired in the Inspector on the scene that owns the dependency. `$NodeName` and string-based `get_node` are reserved for cases where a node is dynamically added and can't be pre-wired. See `.rules/node-export-wiring.md`.

## Alternatives considered

- **`@onready var x = $Foo`** — Rejected as the default. It's fragile to renames and implicit about ownership. Fine for self-contained widgets with tightly bound internal children.
- **Autoload service locator** — Rejected for anything but actually-global systems (ADR-0014).

## Consequences

- **Positive:** Renaming a node in a scene does not silently break a dependent script.
- **Positive:** Scene authoring surface doubles as dependency diagram.
- **Negative:** Slightly more clicks per new wiring. Payoff hits at the first rename.

## Verification

`grep -rn '@onready var.*\$' src/` — expect minimal hits. `grep -rn 'get_node(\"' src/` — expect near-zero in production scripts.

## Notes for future content

- Short post: "`@export var` over `@onready`" (ideas §5.6).
- Worth mentioning whenever a feature post describes scene wiring.
