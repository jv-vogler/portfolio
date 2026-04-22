---
title: "How to configure Claude Code for any language"
description: "A short guide to giving Claude Code the tooling it needs — LSPs, MCPs, language skills, auto mode — so it can self-correct."
publishedDate: "2026-04-21"
status: "draft"
tags: [claude-code, tooling, ai, lsp, developer-experience]
featured: false
---

I mostly work with TypeScript and GDScript, but lately Claude Code has been pulling towards new horizons with Elixir and Rust projects, which I'd never touched before. This post is about what I had to bolt on to make it work.

## The easy case: TypeScript

If you use Claude Code in a TypeScript project, you've probably had this experience: you ask it to implement something, it writes the code, runs `pnpm typecheck`, sees three red squiggles, fixes them, re-runs the check, and lands on something green. You barely had to watch.

That works because TypeScript ships a compiler that produces fast, structured feedback, and every TS project on earth has a typecheck script. Claude doesn't need to guess whether `foo` is a `string` or a `Promise`; it runs the check, reads the output, and self-corrects.

Take that away and things change.

## Feedback loops, or: what a "harness" actually is

A harness is everything around the model that lets it see whether its own code is right. The typecheck above is one. A linter's another. So is a compiler with a useful error message, or a browser Claude can drive and read the console on.

No harness, no self-correction. Claude writes something that looks plausible, you say "cool", and three hours later you find out it imported a function that doesn't exist. Good harness? Claude catches it in the same turn, fixes it, and keeps going.

The whole game of configuring Claude Code for an unfamiliar language is: give it a feedback loop that's at least as good as `pnpm typecheck`. Preferably better.

If you want the proper writeup on this idea, Martin Fowler's blog has [a great piece on harness engineering](https://martinfowler.com/articles/harness-engineering.html) that goes deeper than I will here.

## What an LSP is, and how to give Claude one

**Boring explanation:** The Language Server Protocol is a spec (originally from VS Code) for how editors talk to a language's "brain" in a standard way. The brain (the language server) is the thing that parses code, resolves types, finds references, and reports errors. The LSP itself is just the protocol they use to talk. Editor asks, server answers.

**Real-life explanation:** those red squigglies in VS Code? Your editor asked the language server "anything wrong with this file?" over LSP, and the server sent back a list of ranges and messages. Hover tooltips, go-to-definition, autocomplete — same shape. The editor shows the result; the server does the work.

**Gamer explanation:** it's Scan in FFIX. You target something specific and the game tells you its HP, weaknesses, and what it's carrying. It doesn't reveal the whole battle (you have to pick who to scan), but when you do, you get a real readout instead of poking at enemies to figure out what works.

Under the hood, the language server is a real program running on your machine: `rust-analyzer`, `elixir-ls`, `gopls`, whatever ships for the language. Your editor spawns it as a subprocess and exchanges JSON-RPC messages with it over stdin/stdout. (The protocol also supports TCP sockets for remote setups, but stdio is the default and what Claude Code uses.) Every hover, every squiggle, every "go to definition" is one JSON request in, one JSON response out.

Point Claude at the same language server and it can get the same underlines and hovers you do. It's not actually "seeing" your screen, but asking the server the same questions your editor does ("what's the type of this argument?", "does this function exist?", "where is this defined?"). That's not the same as getting your editor experience for free: it only helps if the server is accurate, the integration queries it at the right moments, and the model uses the answers it gets back. When all three line up, the guessing drops off sharply.

The plugin handles the subprocess wiring, but you still need the server binary installed on your system (via `rustup`, `mix`, `brew`, or whatever packages it for your language).

Note that to get everything up and running, depending on the LSP tool, you might have to add:

```json
  "env": {
    "ENABLE_LSP_TOOL": true
  },
```

to your `~/.claude/settings.json`.

## Three stacks, same pattern

### Godot

I know Godot and GDScript well but unfortunately as it is a dynamic language, we don't have a `pnpm typecheck` equivalent to hand Claude. GDScript compiles as the game runs — the "does this work" signal mostly lives inside the editor.

The fix was two plugins. A Godot MCP server (so Claude can query the scene tree, inspect node types, run the game, read stdout) plus a GDScript LSP client (real-time errors, hovers, go-to-definition). Here are the plugins that I used:

```bash
claude plugin marketplace add minami110/claude-godot-tools
```

```bash
claude plugin install gdscript-toolkit@claude-godot-tools
claude plugin install gdscript-lsp@claude-godot-tools
claude plugin install vscode-gdscript-tools@claude-godot-tools
claude plugin install gdunit4-toolkit@claude-godot-tools
```

```bash
claude mcp add godot -- npx @coding-solo/godot-mcp
```

References:

- https://github.com/minami110/claude-godot-tools/tree/main
- https://github.com/Coding-Solo/godot-mcp

With both installed (plus extras for VSCode and GDUnit, a testing framework), Claude stopped inventing node names. It reads the scene tree, sees that `Player` has a `HealthBar` child of type `ProgressBar`, and calls it correctly the first time. My prompts went from "here's the scene structure, the player is at `/root/Main/Player`, it has a signal called…" to "add a damage flash when health drops."

### Elixir

I recently joined a _secret_ Elixir codebase at work, my first time touching the language. "This compiles" is a dangerously low bar in Elixir — idiomatic code is a whole separate skill: when to reach for `GenServer` vs `Task.async`, why `:float` is a landmine in money columns, whether your Oban job is idempotent. None of that shows up as a compile error.

Two things helped:

1. **`elixir-ls-lsp@claude-plugins-official`** for the LSP. Same story as Godot: real types, real diagnostics, real "is this function actually defined" answers. No more Claude inventing modules.
2. **`oliver-kriska/claude-elixir-phoenix`**, a set of Elixir/Phoenix skills and specialist agents. It encodes the bugs Elixir devs hit in production: `assign_new` silently skipping on reconnect, N+1 queries in Ecto, non-idempotent Oban jobs. The kind of review I can't give.

```bash
claude plugin marketplace add oliver-kriska/claude-elixir-phoenix
```

```bash
claude plugin install elixir-phoenix
```

```bash
claude plugin install elixir-ls-lsp@claude-plugins-official
```

References:

- https://github.com/oliver-kriska/claude-elixir-phoenix
- https://github.com/anthropics/claude-plugins-official

Put together, the harness now does what I would do if I knew Elixir.

### Rust

Rust is the other language I barely know. I wanted a CLI to switch between my Claude Code accounts that would allow me to resume the same sessions between different accounts without copying JSON files by hand, so I built one: [`claude-account-switcher` or `ccsw`](https://crates.io/crates/ccsw), now on crates.io, go check it out if you're interested in that as well. And here is the [repository](https://github.com/jv-vogler/ccsw).

The harness was the same shape as Elixir:

- **`rust-analyzer-lsp`** for real-time diagnostics, types, and borrow-checker errors. Claude gets the same squigglies I'd get in VS Code, except it actually reads them.
- **`rust-skills@rust-skills`** for idiom checks and the well-worn Rust traps. Same spirit as the Elixir plugin: opinions I don't have yet.

```bash
claude plugin install rust-analyzer-lsp@claude-plugins-official
```

```bash
claude plugin marketplace add actionbook/rust-skills
```

```bash
claude plugin install rust-skills@rust-skills
```

References:

- https://github.com/actionbook/rust-skills

The Rust compiler is already famously good at feedback. The LSP on top tightened the loop from "write → `cargo check` → read errors → fix" into "write → know it's wrong before you finish writing". Fewer round trips, and a published crate I couldn't have reviewed line-by-line.

## The browser counts too

Not all feedback lives in the compiler as some lives in the browser. Whether the button is clickable, whether the console is screaming, whether the layout shifts when real data hits it, `chrome-devtools-mcp@chrome-devtools-plugins` is the one I keep open for any frontend work. Claude can open a page, click around, read the console, inspect elements, run a Lighthouse audit. It's how the harness reaches past the code and into the running app. If you're shipping UI, this one's not optional.

## Auto mode: now you can actually walk away

Once the harness is good, the bottleneck shifts. Claude can self-correct, but you're still clicking "approve" on every file write and every bash command. That pace makes sense when the harness is thin and you want a human in the loop. It's wasted friction when the harness itself is telling Claude "no, that doesn't compile" a hundred times per session.

Auto mode is Claude Code's middle ground between manual approval and `--dangerously-skip-permissions`. A classifier inspects each action before it runs, lets the safe ones through, and blocks or reroutes the risky ones. Run `claude --enable-auto-mode`, cycle to it with Shift+Tab, and go get a coffee.

It's not a silver bullet. The classifier can let risky things through when your environment gives ambiguous signals, and you still shouldn't point it at production boxes. But combined with a proper LSP + MCP + skills setup, it's the first time I've been able to hand Claude a ticket and come back twenty minutes later to review the diff, not the approvals.

## Conclusion

In TypeScript, you never had to build the harness, somebody already did and called it `tsconfig.json` (although, it's also useful to have the `typescript-lsp` connected as well). Everywhere else, that's your job. Do it once per repo, and Claude stops being lazy in the languages you don't speak.

Hopefully this will make your development way smoother with agentic engineering, have a good one!

## References

- https://github.com/anthropics/claude-plugins-official
- https://github.com/minami110/claude-godot-tools/tree/main
- https://github.com/Coding-Solo/godot-mcp
- https://github.com/oliver-kriska/claude-elixir-phoenix
- https://github.com/actionbook/rust-skills
- https://github.com/anthropics/claude-code/issues/18125#issuecomment-3843601648
- https://martinfowler.com/articles/harness-engineering.html
