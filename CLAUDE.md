## Commands

```bash
pnpm dev               # dev server (Turbopack)
pnpm lint              # oxlint — not ESLint
pnpm format:write      # oxfmt — not Prettier
pnpm typecheck         # tsgo --noEmit — not tsc
pnpm payload generate:types && pnpm payload generate:importmap  # after any schema change
```

## Local Setup

```bash
vercel env pull .env.local   # pulls Postgres, Blob, and other secrets from Vercel
```

Required: `PAYLOAD_SECRET`, `POSTGRES_URL`, `BLOB_READ_WRITE_TOKEN`, `NEXT_PUBLIC_BASE_URL`
Contact form: `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM`
Optional: `NEXT_PUBLIC_GA_MEASUREMENT_ID` (prod only — auto-skipped in dev)

## Architecture

```
src/
  app/
    (payload)/    # Payload admin panel — not a public route
    [locale]/     # ALL public routes are locale-prefixed (en/pt)
    actions/      # Server actions — fetch from Payload, called by Server Components
  collections/    # Payload CMS collections (Posts, Projects, Skills, Media)
  globals/        # Payload global (About page content)
  features/       # Custom Lexical editor features (register in payload.config.ts)
  i18n/           # next-intl config — request.ts is the server entrypoint
  messages/       # en.json + pt.json — all UI strings live here
  ui/             # shadcn + custom components
  payload.config.ts   # central CMS config — collections, globals, features, plugins
  proxy.ts            # fetch abstraction used by server actions
```

**Data flow:** Payload DB → `src/app/actions/` → Server Components → UI

**Key files:**

- `src/i18n/request.ts` — next-intl server config
- `src/app/[locale]/layout.tsx` — root client provider tree
- `src/payload.config.ts` — register everything Payload-related here

## Workflows

**New page:**

1. Create `src/app/[locale]/<slug>/page.tsx`
2. Add translation keys to `messages/en.json` + `messages/pt.json`

**New shadcn component:**

```bash
pnpm dlx shadcn@latest add <component>   # outputs to src/ui/components/ui/
```

**Payload schema change:**

1. Edit collection/global in `src/collections/` or `src/globals/`
2. `pnpm payload generate:types && pnpm payload generate:importmap`
3. Restart dev server

**New translation string:** Add to both `messages/en.json` and `messages/pt.json` — never inline strings in components.

## Gotchas

- Use `pnpm` — `npm`/`yarn` will break (enforced via `packageManager` field)
- Payload is embedded inside Next.js, not a separate service. `next.config.ts` wraps `withPayload(withNextIntl(...))` — order matters
- Don't use `tsc`, `eslint`, or `prettier` directly — replaced by `tsgo`, `oxlint`, `oxfmt`
- Don't create `"use client"` components unless necessary — mostly-RSC app
- Don't inline strings — all copy goes in `messages/`
- All public pages need a `[locale]` parent — `localeDetection` disabled, default is `en`
- No test infrastructure

## Skills & MCP

| Trigger                                    | Use                                                                           |
| ------------------------------------------ | ----------------------------------------------------------------------------- |
| Any frontend change                        | `/chrome-devtools-mcp:chrome-devtools` — verify in browser after implementing |
| Building UI components, pages, layouts     | `/frontend-design` — distinctive, production-grade UI                         |
| Reviewing existing UI for quality/a11y     | `/web-design-guidelines`                                                      |
| Accessibility audit                        | `/chrome-devtools-mcp:a11y-debugging`                                         |
| LCP / Core Web Vitals                      | `/chrome-devtools-mcp:debug-optimize-lcp`                                     |
| React/Next.js performance patterns         | `/vercel-react-best-practices`                                                |
| Component architecture / composition       | `/vercel-composition-patterns`                                                |
| Payload collections, hooks, access control | `/payload`                                                                    |
| Deploying to Vercel                        | `/deploy-to-vercel`                                                           |
| Writing copy, blog posts, any prose        | `/elements-of-style:writing-clearly-and-concisely`                            |
| Drafting a new blog post for the portfolio | `blog-post` skill — draft → writing-skills review → `pnpm publish:post`       |
| Library/framework docs lookup              | `context7` MCP — use before guessing API surface                              |

## Design Context

Full version: `.impeccable.md` at repo root. The summary below is what every conversation needs in context.

**Audience (primary):** hiring eyes — recruiters, eng leads scanning in 60-90s. The site itself is the proof of craft. **Secondary:** devs reading the blog for tutorials in João's voice.

**Personality:** precise · playful · opinionated. Voice profile is canonical for prose: `.claude/skills/portfolio-voice/voice-profile.md`.

**Aesthetic north star: Engineer's lab notebook.** Archival serif display + functional mono, asymmetric grid, hand-numbered sections, marginalia and footnotes treated as real structure (not decoration), citations that look like real citations. Adjacent to the current terminal-coded vibe but not the same — mono is a tool, not a costume.

**Theme:** dark-only (hard-coded `<html className="dark">` stays). Background tinted ink-black. Foreground paper-cream (warm off-white, never `oklch(0.985 0 0)`). Accent green at `oklch(0.65 0.24 155)` appears at most once per viewport — section numbers, the hero name, a single emphasized link. Not on every CTA/hover/focus.

**Typography:** Poppins is on the impeccable reflex-reject list — replace at the next typography pass with a distinctive archival serif (e.g. Tiempos / Suisse Works / Pangram-Klim picks) and a more characterful mono (e.g. Berkeley Mono / MD IO). Modular ~1.25 scale, fluid `clamp()` on display, body capped 65-72ch.

**Anti-references (must NOT look like):** dev-portfolio templates, Vercel-with-gradients, AI-startup glassmorphism, Medium-descended blog templates, centered-everything landing pages with rounded-rectangle feature cards, terminal-skin-cosplay (mono everywhere, blinking cursors on every label).

**Five principles, in priority order:**

1. **Long-form is the centerpiece.** Body type designed first. Hero serves the blog/projects, not vice versa.
2. **Marginalia is structure, not decoration.** Section numbers, footnotes, side annotations are real semantic content. If they could be removed unnoticed, they don't belong.
3. **Type does the heavy lifting.** Hierarchy from typographic contrast, not from chrome. If a component needs a card to stand out, the type is failing.
4. **Asymmetric over centered.** Default to left-aligned, intentionally unbalanced. Centering must earn itself.
5. **Quiet by default, loud once.** One moment of intensity per screen. The accent at full saturation appears at most once per viewport.

**Accessibility:** WCAG 2.2 AA on contrast, focus, motion. Respect `prefers-reduced-motion` everywhere new motion is added. Color is never the only signal.
