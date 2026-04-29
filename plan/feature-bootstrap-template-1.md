# Next.js + Payload CMS Template — Design Plan

## Context

The `jv-portfolio` repo has matured into a solid Next.js 16 + Payload 3 integration with opinionated conventions worth reusing: a strictly layered architecture (`core`/`lib`/`ui`/`app`) enforced by CI, `getPayloadSafe()` graceful-degradation pattern, Vercel Postgres + Blob adapters, a curated toolchain (pnpm + oxlint + oxfmt + tsgo + husky + lint-staged), and a set of agent skills at `.agents/` with `.claude/skills/` symlinks.

Every new site currently starts from scratch — wiring Payload, the admin panel, the Neon integration, the folder layout, CI, and tooling takes a day or more of repeated work. This template extracts the general-purpose substrate so bootstrapping a new content-driven Next.js site is a single command plus a Vercel dashboard checklist.

The template is built and maintained in a separate repo. This session's output is the design spec for that repo.

---

## Goal

Produce a **GitHub template repo** that, combined with a tiny in-repo init script, scaffolds a production-ready Next.js 16 + Payload 3 project with opt-in features. No separate CLI package published to npm.

Usage:

```bash
gh repo create my-app --template jv-vogler/next-payload-template --private --clone
cd my-app
pnpm tsx setup.ts --name=my-app --with-blog --no-i18n --no-contact
```

After `setup.ts` runs, the repo is clean — the script and its manifest delete themselves, leaving only the selected features.

---

## Feature Matrix

### Core (always in)

- Next.js 16 + React 19 + TypeScript strict
- Payload 3 with admin + REST + GraphQL routes (toggleable at runtime, see "Admin Toggle")
- Collections: `Users` (auth, role-based), `Media` (multi-size uploads)
- Global: `settings` (site name, SEO defaults, social links, OG image) — replaces portfolio-specific `About`
- `getPayloadSafe()` pattern in `src/lib/payload.ts` with React `cache()` dedup
- Layered architecture (`core`/`lib`/`ui`/`app`) + CI script enforcing import rules
- Vercel Postgres adapter + Neon connection
- Vercel Blob storage adapter for `media`
- shadcn/ui baseline (button, card, dialog, input, label, badge) + Tailwind v4
- Toolchain: pnpm, oxlint, oxfmt, tsgo (`@typescript/native-preview`), husky, lint-staged
- `.env.example`, `vercel.json` security headers, `tsconfig` path aliases
- Payload patch workflow (`pnpm-workspace.yaml` + `patches/`)
- Agent skills at `.agents/skills/` with `.claude/skills/` symlinks
- GitHub Actions CI (install → oxlint → oxfmt check → tsgo → architecture check)

### Optional (prompt at init; each corresponds to a `--with-*`/`--no-*` flag)

| Feature                                                             | Default    | Notes                                           |
| ------------------------------------------------------------------- | ---------- | ----------------------------------------------- |
| `Posts` collection + `/blog` route + Lexical code-highlight feature | ON         | Drafts, versioning, auto-slug, ISR revalidation |
| RSS feed route                                                      | ON if blog | Coupled to Posts                                |
| i18n (`next-intl`, `[locale]` routing, `messages/`)                 | OFF        | Most apps don't need it                         |
| Contact form + Resend action                                        | OFF        | Resend signup friction                          |
| Seed script scaffold                                                | ON         | Empty template, no portfolio data               |
| Google Analytics                                                    | OFF        |                                                 |

### Dropped

- View transitions, framer-motion
- Docker Compose local Postgres (superseded by Neon branching)
- Projects, Skills collections
- About global's Q&A/profile fields
- Hero / experience / showcase / portfolio UI
- simple-icons
- All personal seed content

---

## Database Workflow — Neon Branching

**Principle: you never connect your laptop to the production database.** One Neon project, many branches.

```
Neon project
├── main              → Vercel production env
├── preview/pr-N      → Vercel preview deploys (auto, via Neon integration)
└── dev-$USER         → your laptop (.env.local)
```

### Setup (one-time, per new project)

1. Create Neon project (dashboard).
2. Install Vercel ↔ Neon integration; link project. Vercel gets `POSTGRES_URL` + friends automatically.
3. In integration settings, enable "preview deployments get their own branch".
4. Run `neonctl branches create --name dev-$USER --parent main` (automated by `setup.ts` if `neonctl` is on PATH).
5. Paste branch connection string into `.env.local`.

### Scripts shipped in template

- `pnpm db:branch` — creates `dev-$USER` branch if missing; writes URL into `.env.local`.
- `pnpm db:reset` — `neonctl branches reset dev-$USER --to main`. Pulls fresh schema + data from prod in seconds. Use when the CMS user added content you want to see locally.
- `pnpm db:migrate:create <name>` — runs `payload migrate:create`; emits SQL files into `src/migrations/`.
- `pnpm db:migrate` — runs `payload migrate` against the branch in `.env.local`.
- `pnpm db:migrate:status` — lists pending migrations.

### Migrations

Switch from Payload's default `push` mode to **migrate mode** (commit SQL files to repo). This gives:

- Auditable schema history in git.
- Deterministic deploys: Vercel `vercel-build` script runs `payload migrate` before `next build`.
- Rollback path: each migration has down SQL; for data-affecting changes, fall back to Neon point-in-time restore.
- CI guard: a workflow step runs `payload migrate:status` against a throwaway Neon branch — fails the PR if there's un-committed schema drift.

---

## Admin Toggle

Single env var: `PAYLOAD_ENABLED` (default `true`).

When `false`:

- `src/app/(payload)/admin/[[...segments]]/page.tsx` and the API routes check the flag at module top and export handlers that call `notFound()`.
- `getPayloadSafe()` short-circuits to `null` without importing the DB adapter.
- All RSC pages and server actions already null-check `getPayloadSafe()` results (existing pattern) and render defaults / empty states.
- DB, Blob, and `PAYLOAD_SECRET` env vars become optional; the app still builds and runs as a static Next.js site.

Enabling later requires no code changes: provision Neon + Blob via Vercel integrations, add `PAYLOAD_SECRET`, set `PAYLOAD_ENABLED=true`, run `pnpm db:migrate` once, redeploy.

---

## Init Script (`setup.ts`)

Shape: **flags + interactive fallback**. Flags make it scriptable; prompts fill gaps.

```
pnpm tsx setup.ts \
  --name=<project-name> \
  [--with-blog | --no-blog] \
  [--with-i18n | --no-i18n] \
  [--with-contact | --no-contact] \
  [--with-seed | --no-seed] \
  [--with-ga | --no-ga] \
  [--skip-install] \
  [--skip-neon] \
  [--skip-git]
```

### Steps

1. Parse flags; prompt (using `@clack/prompts` or similar) for anything missing.
2. Replace project name in `package.json`, `next.config.ts` metadata, `README.md`, `vercel.json` if present.
3. Apply feature manifest: a `.template.json` file maps each optional feature to a list of paths to keep or delete. Script deletes paths for disabled features and strips marked code blocks (`// @template:blog-start` … `// @template:blog-end`) from kept files.
4. Write `.env.local` with placeholders for kept features only (e.g. skip `RESEND_API_KEY` if contact dropped).
5. If `neonctl` available and not `--skip-neon`, run `neonctl branches create --name dev-$USER --parent main` and inject the URL into `.env.local`.
6. Run `pnpm install` unless `--skip-install`.
7. `git init && git add -A && git commit -m "chore: initial commit from template"` unless `--skip-git`.
8. Delete `setup.ts`, `.template.json`, and any `// @template:*` marker comments left behind.
9. Print a checklist: Vercel setup, Neon integration, Resend signup (if contact), Payload admin user creation (`pnpm payload`), etc.

### Manifest format (`.template.json`)

```json
{
  "features": {
    "blog": {
      "paths": [
        "src/collections/Posts.ts",
        "src/app/[locale]/blog/",
        "src/app/feed.xml/",
        "src/features/lexicalCode/",
        "src/ui/components/blog/"
      ],
      "markers": ["blog"],
      "envVars": []
    },
    "i18n": {
      "paths": ["src/i18n/", "src/messages/", "src/proxy.ts"],
      "markers": ["i18n"],
      "deps": ["next-intl"],
      "envVars": []
    },
    "contact": {
      "paths": ["src/app/actions/contact.ts", "src/ui/components/contact/"],
      "markers": ["contact"],
      "deps": ["resend"],
      "envVars": ["RESEND_API_KEY", "CONTACT_EMAIL_TO", "CONTACT_EMAIL_FROM"]
    }
  }
}
```

When a feature is dropped, the script also removes its deps from `package.json` and its env vars from `.env.example`.

---

## Architecture — Layered Code Organization

Copied verbatim from `jv-portfolio` with CI enforcement preserved.

```
src/
├── core/          pure TS domain types + logic. No React, no Next.
├── lib/           shared helpers. May import React. No imports from app/ or ui/.
├── ui/            React components. Consumes core types via lib.
├── app/           Next.js routes + server actions. Composes everything above.
├── collections/   Payload schema definitions.
├── globals/       Payload globals.
├── features/      custom Payload features (lexical plugins, etc.).
├── i18n/          [optional] next-intl config.
├── messages/      [optional] i18n JSON.
├── seed/          [optional] seed scripts.
└── migrations/    Payload-generated SQL files (committed).
```

CI check script (`.github/workflows/ci.yml`) enforces:

- `core/` and `lib/` must not import from `app/` or `ui/`.
- `core/` must not import `react` or `next`.

---

## Agent Skills & Claude Config

Template ships with:

- `.agents/skills/` — symlink targets for the skill definitions:
  - `deploy-to-vercel`
  - `payload`
  - `vercel-composition-patterns`
  - `vercel-react-best-practices`
  - `web-design-guidelines`
- `.claude/skills/` — symlinks to `.agents/skills/*`.
- `.claude/settings.local.json` — minimal allowlist (pnpm, git, grep, ls, node). User extends locally.

Skills are pulled from the author's canonical source at template-build time, not re-edited inside the template — keeps a single source of truth.

---

## Critical Files (to create / adapt from `jv-portfolio`)

| File                                               | Source                   | Notes                                                                     |
| -------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------- |
| `package.json`                                     | adapted                  | strip portfolio deps (simple-icons, framer-motion, next-intl behind flag) |
| `src/payload.config.ts`                            | adapted                  | drop Projects/Skills, keep Users/Media, rename About→settings             |
| `src/collections/Users.ts`                         | as-is                    |                                                                           |
| `src/collections/Media.ts`                         | as-is                    |                                                                           |
| `src/globals/Settings.ts`                          | new (adapted from About) | site name, SEO, socials, OG image                                         |
| `src/lib/payload.ts`                               | as-is                    | `getPayloadSafe()` + Settings helpers                                     |
| `src/features/lexicalCode/*`                       | as-is                    | gated by blog feature                                                     |
| `src/app/(payload)/admin/[[...segments]]/page.tsx` | adapted                  | add `PAYLOAD_ENABLED` guard                                               |
| `src/app/(payload)/api/[...slug]/route.ts`         | adapted                  | add `PAYLOAD_ENABLED` guard                                               |
| `next.config.ts`                                   | adapted                  | `withPayload`; `withNextIntl` only if i18n feature kept                   |
| `tsconfig.json`                                    | as-is                    |                                                                           |
| `oxlint.json`, `.oxfmt.toml`                       | as-is                    |                                                                           |
| `lint-staged.config.cjs`                           | as-is                    |                                                                           |
| `.husky/pre-commit`                                | as-is                    |                                                                           |
| `.github/workflows/ci.yml`                         | adapted                  | add `db:migrate:status` step against throwaway Neon branch                |
| `vercel.json`                                      | as-is                    | security headers                                                          |
| `pnpm-workspace.yaml` + `patches/`                 | as-is                    |                                                                           |
| `.env.example`                                     | adapted                  | feature-gated vars                                                        |
| `setup.ts`                                         | new                      | init script described above                                               |
| `.template.json`                                   | new                      | feature manifest                                                          |
| `README.md`                                        | new                      | install checklist, Vercel + Neon setup steps                              |

---

## Verification Plan

End-to-end test that the template works. Run after every change to the template repo:

1. **Matrix scaffold test** (automatable via GitHub Actions):
   - For each of {minimal, blog-only, i18n-only, full} preset combinations:
     - Clone template into temp dir.
     - Run `pnpm tsx setup.ts --name=test-app <flags> --skip-install --skip-neon --skip-git`.
     - Run `pnpm install`.
     - Run `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm build`.
     - Assert: `setup.ts`, `.template.json`, and `@template:*` markers are gone; `package.json` has no dropped deps; `.env.example` has no dropped vars.

2. **Live deploy smoke test** (manual, once per release):
   - Create a real project from template, deploy to Vercel, provision Neon + Blob via Vercel integrations, run first migration, create admin user via `pnpm payload`, upload media, create a settings entry, hit public routes.

3. **Admin toggle test**:
   - Build + run with `PAYLOAD_ENABLED=false` and no DB env vars. Assert app starts and public routes render; `/admin` returns 404.

4. **DB workflow test**:
   - Run `pnpm db:branch`, `pnpm db:migrate:create foo`, `pnpm db:migrate`, `pnpm db:reset`. Assert each succeeds against a scratch Neon project.

---

## Out of Scope (for v1)

- Publishing as an npm `create-*` CLI (path open if template usage grows).
- Presets as shortcuts (e.g. `--preset=blog`) — easy to add later.
- Docker Compose local Postgres (superseded).
- E-commerce / auth-provider / SaaS-specific features.
- Theme switcher / design-system variants.
