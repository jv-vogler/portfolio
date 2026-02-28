---
goal: Full Modernization — Next.js + Tailwind v4 + Layered Architecture Rewrite
version: 1.0
date_created: 2026-02-28
last_updated: 2026-02-28
owner: jvogler
status: 'In Progress'
supersedes: refactor-layered-architecture-1.md
tags: [rewrite, nextjs, tailwindcss, architecture, modernization, shadcn, blog, seo, i18n]
---

# Introduction

![Status: In Progress](https://img.shields.io/badge/status-In%20Progress-yellow)

This plan describes a **ground-up rewrite** of the portfolio site using a modern 2026 stack. The current codebase (React 18 + Vite 3 + styled-components 5) is archived to a `legacy` branch; the `main` branch receives a fresh **Next.js 15** project following the **Layered Frontend Architecture** from day one.

### Why Rewrite Instead of Refactor?

The v1 plan attempted to restructure the existing codebase in-place. Given that we now want to swap **every** major tool (build system, styling, i18n, forms, validation, icons, formatting, linting), an in-place migration would be more complex and error-prone than a clean start. A rewrite also unlocks:

- **SSR/ISR** via Next.js App Router (impossible with client-side Vite SPA)
- **Blog/MDX** as a first-class feature
- **SEO** with Next.js Metadata API, sitemaps, OG images
- **Server Actions** for the contact form (no client-side HTTP posting)
- **Image optimization** via `next/image`
- Freedom to **redesign the layout** without being constrained by the old component tree

---

## Tech Stack Summary

| Category               | Old (Legacy)                   | New                                                 |
| ---------------------- | ------------------------------ | --------------------------------------------------- |
| **Framework**          | React 18 + Vite 3 (SPA)        | Next.js 15 (App Router, RSC)                        |
| **Language**           | TypeScript 4.6                 | TypeScript 5.x via **tsgo** (experimental Go build) |
| **Package Manager**    | npm                            | **pnpm**                                            |
| **Styling**            | styled-components 5            | **Tailwind CSS v4** + **shadcn/ui**                 |
| **i18n**               | i18next + react-i18next        | **next-intl**                                       |
| **Forms**              | Formik + Yup                   | **React Hook Form** + **Zod**                       |
| **Icons**              | react-icons (pre-rendered JSX) | **lucide-react** (UI) + **simple-icons** (brands)   |
| **Animations**         | _(none)_                       | **Framer Motion**                                   |
| **Contact Form**       | Axios → getform.io             | **Resend** SDK via Next.js Server Actions           |
| **Blog**               | _(none)_                       | Local MDX files + **next-mdx-remote** + gray-matter |
| **SEO**                | _(none)_                       | Next.js Metadata API, sitemap, robots, JSON-LD      |
| **Analytics**          | _(none)_                       | **Vercel Analytics** + **Vercel Speed Insights**    |
| **Linting**            | _(none configured)_            | **Oxlint**                                          |
| **Formatting**         | _(none configured)_            | **Oxfmt**                                           |
| **Deployment**         | GitHub Pages (static)          | **Vercel** (SSR/ISR/Edge)                           |
| **Image Optimization** | Manual jpg/webp pairs          | **next/image** (automatic WebP/AVIF, lazy loading)  |

---

## 1. Requirements & Constraints

### Requirements

- **REQ-001**: Archive current code to a `legacy` branch; rewrite on `main` (or `next` then merge).
- **REQ-002**: Use the Layered Frontend Architecture (`core/`, `lib/`, `app/`, `ui/`) adapted for Next.js App Router conventions.
- **REQ-003**: Inner layers (`core/`, `lib/`) must never import from outer layers (`app/`, `ui/`). Core must be framework-free.
- **REQ-004**: All I/O (email sending, external API calls) must live in `app/` layer as Server Actions or route handlers.
- **REQ-005**: All React components, hooks, context, and pages live in `ui/` (which maps to Next.js `app/` directory for routing).
- **REQ-006**: Use pnpm as the sole package manager.
- **REQ-007**: Use tsgo with experimental flag for type-checking where possible; fall back to standard `tsc` if tsgo has blockers.
- **REQ-008**: Implement full i18n with `next-intl` supporting EN and PT-BR, with locale-based routing (`/en/...`, `/pt/...`).
- **REQ-009**: Implement a blog section using local MDX files with frontmatter, supporting ISR.
- **REQ-010**: Contact form must use Resend for email delivery via a Next.js Server Action.
- **REQ-011**: Full SEO: metadata per page, OpenGraph images, sitemap.xml, robots.txt, JSON-LD structured data.
- **REQ-012**: Deploy to Vercel with automatic preview deployments and ISR for blog posts.
- **REQ-013**: Integrate Vercel Analytics and Speed Insights for performance monitoring.
- **REQ-014**: All images served via `next/image` with automatic format/size optimization.
- **REQ-015**: Animations via Framer Motion for page transitions, section reveals, and micro-interactions.
- **REQ-016**: Dark/light theme via `next-themes` + Tailwind CSS dark mode (class strategy).
- **REQ-017**: Code quality enforced by Oxlint (linting) + Oxfmt (formatting) in CI and pre-commit.

### Constraints

- **CON-001**: The `core/` layer must contain zero framework imports — only pure TypeScript and Zod.
- **CON-002**: Existing content (portfolio projects, tech skills, social links, translations) must be preserved.
- **CON-003**: The legacy branch must remain deployable for reference.
- **CON-004**: tsgo is experimental — maintain a standard `tsc` fallback in CI for reliability.
- **CON-005**: Resend requires a verified domain for production email sending; use Resend sandbox for development.

### Guidelines

- **GUD-001**: Namespace-based entity modeling in `core/` (e.g., `Portfolio.Type`, `Contact.FormValues`).
- **GUD-002**: Thin components — rendering and event delegation only; logic in hooks or server actions.
- **GUD-003**: Feature-scoped UI modules under `src/ui/<feature>/`.
- **GUD-004**: Use `@/` path alias mapping to `src/` for all imports.
- **GUD-005**: Store data (portfolio items, tech skills) as plain typed objects in `core/` — no JSX, no icon components.
- **GUD-006**: Use shadcn/ui as the component foundation; customize with Tailwind.
- **GUD-007**: All forms use React Hook Form + Zod resolver; validation schemas live in `core/`.
- **GUD-008**: Prefer Server Components by default; opt into `"use client"` only when hooks/interactivity is needed.

---

## 2. Implementation Steps

### Phase 0: Legacy Preservation

- **GOAL-000**: Preserve the current codebase as-is in a dedicated branch so it can be referenced or deployed at any time.

| Task      | Description                                                                                                                                                                                                                                                                                              | Completed | Date       |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-0001 | Ensure all current changes are committed. Create and push a `legacy/vite-styled-components` branch from the current `main` HEAD. Tag as `v1.0-legacy`.                                                                                                                                                   | ✅        | 2026-02-28 |
| TASK-0002 | Update the legacy branch's README with a note: "This branch contains the original Vite + styled-components portfolio. The active version has been rewritten — see `main`."                                                                                                                               | ✅        | 2026-02-28 |
| TASK-0003 | Return to `main` branch. Delete all source files (`src/`, `index.html`, `vite.config.ts`, `tsconfig.node.json`, `package.json`, `package-lock.json`, `node_modules/`, `skills-lock.json`). Keep `.gitignore`, `README.md`, `README.en.md`, `plan/` directory. Commit as "chore: clear main for rewrite". | ✅        | 2026-02-28 |

---

### Phase 1: Project Bootstrap — Next.js + Tooling

- **GOAL-001**: Initialize a fresh Next.js 15 project with the full modern toolchain configured and passing a "hello world" build.

| Task      | Description                                                                                                                                                                                                                                                                                                                                                                                                                           | Completed | Date       |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-0101 | Initialize Next.js 15 with App Router using `pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`. Choose **pnpm** as the package manager. This generates the baseline `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts` (or CSS-based v4 config), and `src/app/` directory.                                                                                    | ✅        | 2026-02-28 |
| TASK-0102 | Configure **Tailwind CSS v4** — ensure the project uses Tailwind v4's CSS-based configuration (`@import "tailwindcss"` in the main CSS file). Define the design tokens: color palette (background, foreground, primary/accent, muted, border, etc. for both light and dark modes) as CSS custom properties in `src/app/globals.css`. Set up the `dark` variant using the `class` strategy (for `next-themes` compatibility).          | ✅        | 2026-02-28 |
| TASK-0103 | Initialize **shadcn/ui** — run `pnpm dlx shadcn@latest init`. Configure with: TypeScript, `src/ui/components` as the component directory, `@/ui/components` as the import alias, default style (New York or Default), and the CSS variables from TASK-0102. This creates `components.json` and installs `class-variance-authority`, `clsx`, `tailwind-merge`, and a `cn()` utility.                                                   | ✅        | 2026-02-28 |
| TASK-0104 | Install **tsgo** (TypeScript Go rewrite) — `pnpm add -D @anthropic-ai/tsgo` or via the official channel (adjust package name per actual npm release). Add a script to `package.json`: `"typecheck:go": "tsgo --noEmit"` alongside the standard `"typecheck": "tsc --noEmit"`. Test both commands pass on the scaffold. If tsgo is not yet published to npm, install from the official GitHub releases and document the install steps. | ✅        | 2026-02-28 |
| TASK-0105 | Install and configure **Oxlint** — `pnpm add -D oxlint`. Create `oxlint.json` (or `.oxlintrc.json`) with recommended rules enabled. Add script: `"lint": "oxlint src/"`. Remove or disable the default ESLint config generated by `create-next-app` (delete `.eslintrc.json` if present).                                                                                                                                             | ✅        | 2026-02-28 |
| TASK-0106 | Install and configure **Oxfmt** — `pnpm add -D oxfmt` (or install the binary via the oxc toolchain). Create `.oxfmt.toml` with formatting preferences (indent: 2 spaces, single quotes, trailing commas, print width 100). Add script: `"format": "oxfmt --write src/"`, `"format:check": "oxfmt --check src/"`.                                                                                                                      | ✅        | 2026-02-28 |
| TASK-0107 | Install core dependencies: `pnpm add next-intl next-themes framer-motion react-hook-form @hookform/resolvers zod lucide-react simple-icons resend next-mdx-remote gray-matter @vercel/analytics @vercel/speed-insights`.                                                                                                                                                                                                              | ✅        | 2026-02-28 |
| TASK-0108 | Update `tsconfig.json` — ensure `"paths": { "@/*": ["./src/*"] }` is set (Next.js init should handle this). Set `"strict": true`, `"target": "ES2022"`, `"moduleResolution": "bundler"`.                                                                                                                                                                                                                                              | ✅        | 2026-02-28 |
| TASK-0109 | Create the layered directory structure. Under `src/`: `core/`, `lib/`, `app/` (already exists from Next.js — this IS the routing layer + server actions), and `ui/` with subdirectories: `ui/components/`, `ui/lib/`, `ui/header/`, `ui/hero/`, `ui/experience/`, `ui/portfolio/`, `ui/contact/`, `ui/blog/`, `ui/theme/`. Create `content/blog/` at the project root for MDX files.                                                  | ✅        | 2026-02-28 |
| TASK-0110 | Configure `next.config.ts` — enable: `images` with Vercel-optimized loader (default), `experimental.mdxRs` if available, set `output` to default (not static export — we need SSR/ISR). Add `next-intl` plugin wrapper if required by `next-intl` docs.                                                                                                                                                                               | ✅        | 2026-02-28 |
| TASK-0111 | Verify scaffold builds: run `pnpm build` and `pnpm dev`. Confirm the default Next.js page renders at `localhost:3000`. Run `pnpm lint` (Oxlint) and `pnpm format:check` (Oxfmt). All should pass.                                                                                                                                                                                                                                     | ✅        | 2026-02-28 |

---

### Phase 2: Core Layer — Domain Types & Pure Logic

- **GOAL-002**: Define all domain entities, types, and pure business logic in `src/core/` with zero framework imports. Only Zod is allowed (pure validation library).

| Task      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Completed | Date       |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ---------- |
| TASK-0201 | Create `src/core/theme.ts` — Define `Theme` namespace with: `Variant` enum (`Dark = 'dark'`, `Light = 'light'`), `toggle(current: Variant): Variant` pure function that returns the opposite variant. No color tokens here — colors are managed by Tailwind CSS variables in the UI layer. The core layer only knows about the concept of a variant.                                                                                                                                                                                                               | ✅        | 2026-02-28 |
| TASK-0202 | Create `src/core/navigation.ts` — Define `Navigation` namespace with: `Link` type (`{ label: string; href: string }`), export `Navigation.links` array with entries for Home (`#home`), Experience (`#experience`), Portfolio (`#portfolio`), Blog (`/blog`), Contact (`#contact`). Note: Blog is a route, not a scroll target.                                                                                                                                                                                                                                    | ✅        | 2026-02-28 |
| TASK-0203 | Create `src/core/tech.ts` — Define `Tech` namespace with: `Type` (`{ id: string; slug: string; title: string; color: string }`). Export `Tech.items` array with the 14 tech skills. No icon references — the UI layer maps `slug` to the appropriate `simple-icons` SVG or lucide icon. Data: `{ id: '1', slug: 'html5', title: 'HTML5', color: '#f05c2a' }`, etc.                                                                                                                                                                                                 | ✅        | 2026-02-28 |
| TASK-0204 | Create `src/core/portfolio.ts` — Define `Portfolio` namespace with: `Type` (`{ id: number; slug: string; title: string; descriptionKey: string; thumbnail: string; techs: string[]; demoUrl: string; codeUrl: string; isPassionProject?: boolean }`). Export `Portfolio.items` sorted by `id` desc. `thumbnail` stores a filename like `'thumb-fetchhire.jpg'` (resolved to `/images/portfolio/...` by the UI layer). `descriptionKey` maps to an i18n key (e.g., `'portfolio.fetchhire.description'`). Port all 8 projects from the legacy `PORTFOLIOS` constant. | ✅        | 2026-02-28 |
| TASK-0205 | Create `src/core/social.ts` — Define `Social` namespace with: `Type` (`{ id: string; label: string; url: string; iconSlug: string }`). Export `Social.items` with the 4 links: LinkedIn (`'linkedin'`), Email (`'mail'`), Instagram (`'instagram'`), Github (`'github'`). The `iconSlug` maps to a `lucide-react` icon name in the UI layer.                                                                                                                                                                                                                       | ✅        | 2026-02-28 |
| TASK-0206 | Create `src/core/contact.ts` — Define `Contact` namespace with: `FormValues` type (`{ name: string; email: string; message: string }`), `formSchema` as a `Zod` schema (`z.object({ name: z.string().min(2), email: z.string().email(), message: z.string().min(20) })`). Also export `Contact.Errors.SubmissionError` class extending `Error`. The Zod schema replaces the old Yup schema and integrates directly with React Hook Form via `@hookform/resolvers/zod`.                                                                                             | ✅        | 2026-02-28 |
| TASK-0207 | Create `src/core/blog.ts` — Define `Blog` namespace with: `Post` type (`{ slug: string; title: string; description: string; date: string; tags: string[]; published: boolean; locale: string }`), `Frontmatter` type (matching the MDX frontmatter shape), pure function `sortByDate(posts: Post[]): Post[]` that sorts newest first, and `filterPublished(posts: Post[]): Post[]`.                                                                                                                                                                                | ✅        | 2026-02-28 |
| TASK-0208 | Create `src/core/index.ts` — Barrel export re-exporting all namespaces: `export { Theme } from './theme'`, `export { Navigation } from './navigation'`, etc.                                                                                                                                                                                                                                                                                                                                                                                                       | ✅        | 2026-02-28 |

---

### Phase 3: Lib Layer — Shared Utilities

- **GOAL-003**: Create generic, domain-agnostic utilities in `src/lib/`. Zero imports from `core/`, `app/`, or `ui/`.

| Task      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Completed | Date       |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-0301 | Create `src/lib/storage.ts` — Export a `storage` object with `get<T>(key: string): T \| null` and `set<T>(key: string, value: T): void` wrapping `localStorage` with JSON parse/stringify and try/catch. Guard against SSR with `typeof window !== 'undefined'` checks.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | ✅        | 2026-02-28 |
| TASK-0302 | Create `src/lib/cn.ts` — If shadcn/ui doesn't already provide this in `src/ui/lib/utils.ts`, create a `cn(...inputs: ClassValue[]): string` utility combining `clsx` and `tailwind-merge`. This is the standard shadcn/ui utility — place it in `lib/` since it has no domain knowledge. (Alternatively, keep it where shadcn/ui puts it — follow the shadcn convention.)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | ✅        | 2026-02-28 |
| TASK-0303 | Create `src/lib/mdx.ts` — Export utility functions for reading MDX files: `getPostSlugs(locale: string): string[]` (reads filenames from `content/blog/<locale>/`), `getPostBySlug(slug: string, locale: string): Promise<{ frontmatter: Blog.Frontmatter; content: string }>` (reads and parses MDX with `gray-matter`). These are pure file-system utilities that return raw data — they import `fs` and `path` from Node.js but have no domain logic. Note: this uses `Blog.Frontmatter` type from core — this is an acceptable dependency since lib CAN import from core per the relaxed rule (core types are just types). Actually, keep it pure: accept/return generic `Record<string, unknown>` and let the caller cast. **UPDATE**: Per strict layered rules, `lib/` should NOT import `core/`. Return raw frontmatter as `Record<string, unknown>` and let the `app/` layer map it to `Blog.Post`. | ✅        | 2026-02-28 |
| TASK-0304 | Create `src/lib/date.ts` — Export `formatDate(dateString: string, locale: string): string` using `Intl.DateTimeFormat` for locale-aware date display on blog posts.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | ✅        | 2026-02-28 |
| TASK-0305 | Create `src/lib/index.ts` — Barrel export for the lib layer.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | ✅        | 2026-02-28 |

---

### Phase 4: App Layer — Server Actions, Data Access & I/O

- **GOAL-004**: Build the application/infrastructure layer that bridges `core/` with the outside world. In Next.js, this includes Server Actions, route handlers, and data-fetching functions. These live in `src/app/` (Next.js routing directory) for Server Actions, and in dedicated files for data-access.

| Task      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Completed | Date       |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-0401 | Create `src/app/actions/contact.ts` — A Next.js Server Action (`"use server"`) that: (1) parses input with `Contact.formSchema` from `@/core/contact`, (2) on validation failure returns `{ success: false, errors: ... }`, (3) on success calls `resend.emails.send()` with the Resend SDK to send an email to a configured recipient address, (4) returns `{ success: true }` on success or `{ success: false, error: 'Failed to send' }` on failure. Environment variables: `RESEND_API_KEY`, `CONTACT_EMAIL_TO` (your email), `CONTACT_EMAIL_FROM` (e.g., `onboarding@resend.dev` for development or `contact@yourdomain.com` for production). | ✅        | 2026-02-28 |
| TASK-0402 | Create `src/app/actions/blog.ts` — Server-side data access functions (not Server Actions, just async functions used in RSC): `getAllPosts(locale: string): Promise<Blog.Post[]>` (uses `lib/mdx.ts` to read all MDX files, maps raw frontmatter to `Blog.Post` via `core/blog.ts`, filters published, sorts by date), `getPost(slug: string, locale: string): Promise<{ post: Blog.Post; content: string }>` (reads single post). These are imported by page-level Server Components.                                                                                                                                                              | ✅        | 2026-02-28 |
| TASK-0403 | Create environment variable files: `.env.local` with `RESEND_API_KEY=re_xxxxxxxxxxxx` (placeholder), `CONTACT_EMAIL_TO=jvsvogler@gmail.com`, `CONTACT_EMAIL_FROM=onboarding@resend.dev`. Create `.env.example` documenting all variables with descriptions. Add `.env.local` and `.env` to `.gitignore`.                                                                                                                                                                                                                                                                                                                                           | ✅        | 2026-02-28 |

---

### Phase 5: Internationalization with next-intl

- **GOAL-005**: Set up `next-intl` with locale-based routing, translation files for EN and PT-BR, and middleware for locale detection/negotiation.

| Task      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Completed | Date       |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-0501 | Create translation files: `src/messages/en.json` and `src/messages/pt.json`. Port all existing translation keys from the legacy `en.json` / `pt_br.json` into the `next-intl` message format (no wrapping `"translation"` key — `next-intl` uses flat or nested keys directly). Add new keys for: blog section, SEO metadata, 404 page, footer, and portfolio project descriptions (the 8 `descEN`/`descPT` values migrated from `PORTFOLIOS` constant to translation keys like `portfolio.fetchhire.description`). | ✅        | 2026-02-28 |
| TASK-0502 | Create `src/i18n/config.ts` — Export `locales = ['en', 'pt'] as const`, `defaultLocale = 'en'`, `type Locale = (typeof locales)[number]`.                                                                                                                                                                                                                                                                                                                                                                           | ✅        | 2026-02-28 |
| TASK-0503 | Create `src/i18n/request.ts` — Configure `next-intl` server-side: `getRequestConfig` from `next-intl/server` that loads the correct messages JSON based on the requested locale.                                                                                                                                                                                                                                                                                                                                    | ✅        | 2026-02-28 |
| TASK-0504 | Create `src/middleware.ts` — Use `createMiddleware` from `next-intl/middleware` with the locale config. This handles automatic locale detection from `Accept-Language` header, redirects `/` to `/en/` (or user's preferred locale), and sets the locale cookie.                                                                                                                                                                                                                                                    | ✅        | 2026-02-28 |
| TASK-0505 | Restructure `src/app/` for locale routing: create `src/app/[locale]/` directory. Move `layout.tsx` and `page.tsx` under `[locale]/`. The root `layout.tsx` at `src/app/layout.tsx` becomes a minimal wrapper that delegates to the locale layout. All pages now receive `params.locale` and use `useTranslations()` or `getTranslations()` for server components.                                                                                                                                                   | ✅        | 2026-02-28 |
| TASK-0506 | Create `src/ui/header/components/LocaleSwitcher.tsx` — A client component that renders the language toggle (EN/PT flag buttons). Uses `useRouter()` and `usePathname()` from `next-intl/navigation` to switch locale while preserving the current path. Replace the old `react-switch` + `react-circle-flags` approach with a cleaner shadcn/ui dropdown or toggle.                                                                                                                                                 | ✅        | 2026-02-28 |

---

### Phase 6: UI Layer — Theme, Layout & Shared Components

- **GOAL-006**: Build the foundational UI layer: theme system, root layout, shared components, and animation primitives.

| Task      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Completed | Date       |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-0601 | Create `src/ui/theme/ThemeProvider.tsx` — A client component wrapping `next-themes`' `ThemeProvider` with `attribute="class"`, `defaultTheme="dark"`, `enableSystem`. This enables Tailwind's `dark:` variant classes to work. Export as a provider to be used in the root layout.                                                                                                                                                                                                                            | ✅        | 2026-02-28 |
| TASK-0602 | Create `src/ui/theme/ThemeToggle.tsx` — A client component using shadcn/ui `Button` that toggles between light/dark using `useTheme()` from `next-themes`. Uses `lucide-react` Sun/Moon icons with a smooth Framer Motion transition between them.                                                                                                                                                                                                                                                            | ✅        | 2026-02-28 |
| TASK-0603 | Set up shadcn/ui components — Install commonly needed components: `pnpm dlx shadcn@latest add button card input textarea badge separator navigation-menu sheet dropdown-menu`. These go into `src/ui/components/ui/` (or wherever `components.json` points).                                                                                                                                                                                                                                                  | ✅        | 2026-02-28 |
| TASK-0604 | Create `src/ui/lib/motion.tsx` — Define reusable Framer Motion animation variants: `fadeInUp`, `fadeIn`, `staggerContainer`, `slideInFromLeft`, `slideInFromRight`, `scaleOnHover`. Export a `MotionSection` component that wraps children in a `motion.section` with viewport-triggered `fadeInUp` animation (using `whileInView`). This provides consistent scroll-reveal animations across all sections.                                                                                                   | ✅        | 2026-02-28 |
| TASK-0605 | Create `src/ui/lib/icons.tsx` — Build an icon resolver: export a `TechIcon` component that takes a `slug: string` and `size?: number` and renders the corresponding brand icon from `simple-icons` (as inline SVG using the `simple-icons` package's SVG path data) or from `lucide-react`. Also export a `SocialIcon` component that maps social `iconSlug` values (`'linkedin'`, `'mail'`, `'instagram'`, `'github'`) to the corresponding `lucide-react` icon. This replaces the pre-rendered JSX pattern. | ✅        | 2026-02-28 |
| TASK-0606 | Create the root locale layout `src/app/[locale]/layout.tsx` — Server Component that: (a) sets `<html lang={locale}>` with `next-intl` provider, (b) wraps children in `ThemeProvider`, (c) imports the Poppins font via `next/font/google`, (d) includes `<Header />` and `<Footer />` components, (e) injects Vercel Analytics (`<Analytics />`) and Speed Insights (`<SpeedInsights />`), (f) defines root metadata (title template, description, OpenGraph defaults).                                      | ✅        | 2026-02-28 |
| TASK-0607 | Create `src/ui/header/components/Header.tsx` — Responsive navigation with: logo/name linking to home, desktop nav links from `Navigation.links` (scroll links use anchor `#id`, blog uses `<Link>`), `LocaleSwitcher`, `ThemeToggle`. Mobile: shadcn/ui `Sheet` component for a slide-out menu (replaces the custom hamburger overlay). Mark as `"use client"` for interactivity. Use Framer Motion for mount/unmount animations on the mobile menu.                                                          | ✅        | 2026-02-28 |
| TASK-0608 | Create `src/ui/components/Footer.tsx` — Simple footer with social links (using `Social.items` from `core/` + `SocialIcon` resolver), copyright year, and a "Built with Next.js" note.                                                                                                                                                                                                                                                                                                                         | ✅        | 2026-02-28 |

---

### Phase 7: UI Layer — Home Page Feature Sections

- **GOAL-007**: Build each section of the home page as a feature module under `src/ui/`, then compose them in the home page route.

| Task      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Completed | Date       |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-0701 | Create `src/ui/hero/components/Hero.tsx` — Hero section with: a heading (translated via `next-intl`), a subtitle paragraph, a CTA button scrolling to portfolio section, and a hero image/illustration. Use `next/image` for the hero images. Wrap in `MotionSection` for scroll-reveal animation. Use Framer Motion for a staggered text appearance effect. The image comparison slider from the legacy site can be reimplemented here or replaced with a simpler animated hero visual — **decision point**: keep the slider as an interactive element or replace with a cleaner hero design. If keeping the slider, create `src/ui/hero/components/ImageSlider.tsx` as a client component with `useRef` + `useState` (null-safe ref access — fixing the legacy bug). | ✅        | 2026-02-28 |
| TASK-0702 | Create `src/ui/experience/components/Experience.tsx` — Section displaying tech skills in a responsive grid. Map over `Tech.items` from `@/core/tech`, render each with `TechIcon` component + title + colored accent (as a `border-bottom` or `box-shadow` using the tech's `color` via inline style or CSS variable). Wrap in `MotionSection`. Use Framer Motion `staggerContainer` + `fadeInUp` for grid items.                                                                                                                                                                                                                                                                                                                                                      | ✅        | 2026-02-28 |
| TASK-0703 | Create `src/ui/portfolio/components/Portfolio.tsx` — Section displaying project cards. Map over `Portfolio.items` from `@/core/portfolio`. Each card uses shadcn/ui `Card` with: `next/image` for thumbnail (automatic optimization — replaces manual jpg/webp pairs), title, tech `Badge` components, translated description via `useTranslations('portfolio')`, and Demo/Code buttons. Use Framer Motion for hover effects (scale, shadow lift). The "Passion Project" ribbon can be a styled badge or a CSS ribbon.                                                                                                                                                                                                                                                 | ✅        | 2026-02-28 |
| TASK-0704 | Create `src/ui/portfolio/components/ProjectCard.tsx` — Extract the individual project card as a standalone component. Props: `project: Portfolio.Type`. Client component for hover animations. Uses `motion.div` with `whileHover` for the interactive overlay effect.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | ✅        | 2026-02-28 |
| TASK-0705 | Create `src/ui/contact/components/ContactSection.tsx` — Contact section with: translated heading/description, the contact form, and social links. Wrap in `MotionSection`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | ✅        | 2026-02-28 |
| TASK-0706 | Create `src/ui/contact/components/ContactForm.tsx` — Client component (`"use client"`) using React Hook Form + Zod resolver with `Contact.formSchema`. Fields: name, email (shadcn/ui `Input`), message (shadcn/ui `Textarea`). Submit handler calls the Server Action from `@/app/actions/contact`. Shows loading state via `useFormStatus` or RHF's `isSubmitting`. Displays success toast (use shadcn/ui `Sonner` or `Toast`) or error message on failure. Real-time field validation feedback using RHF's `formState.errors` + Tailwind classes (red border for errors, green for valid).                                                                                                                                                                          | ✅        | 2026-02-28 |
| TASK-0707 | Create `src/ui/contact/hooks/useContactForm.ts` — Custom hook encapsulating: React Hook Form setup with Zod resolver, form submission logic (calls the server action, handles success/error states), and exposes `{ form, onSubmit, isSubmitting, submitResult }`. Keeps the component thin.                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | ✅        | 2026-02-28 |
| TASK-0708 | Create the home page `src/app/[locale]/page.tsx` — Server Component that composes all sections: `<Hero />`, `<Experience />`, `<Portfolio />`, `<ContactSection />`. Each section has an `id` attribute for scroll navigation. Import translations for static content using `getTranslations()`. Set page-specific metadata via `generateMetadata()`.                                                                                                                                                                                                                                                                                                                                                                                                                  | ✅        | 2026-02-28 |

---

### Phase 8: Blog — MDX Content System

- **GOAL-008**: Implement a blog section with local MDX files, listing page, individual post pages with ISR, and code syntax highlighting.

| Task      | Description                                                                                                                                                                                                                                                                                                                                                     | Completed | Date       |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-0801 | Create the blog content structure: `content/blog/en/` and `content/blog/pt/` directories. Create 1-2 sample blog posts as MDX files with frontmatter: `title`, `description`, `date` (ISO 8601), `tags` (array), `published` (boolean). Example: `content/blog/en/hello-world.mdx`.                                                                             | ✅        | 2026-02-28 |
| TASK-0802 | Create `src/ui/blog/components/BlogList.tsx` — Server Component that receives a `posts: Blog.Post[]` prop and renders a list of blog post cards. Each card shows: title, date (formatted via `lib/date.ts`), description, tags as `Badge` components, and links to the full post. Use `MotionSection` + stagger animation.                                      | ✅        | 2026-02-28 |
| TASK-0803 | Create `src/ui/blog/components/BlogPost.tsx` — Component that renders a single MDX blog post. Uses `next-mdx-remote/rsc` (`MDXRemote`) for server-side MDX rendering. Pass custom components mapping for MDX elements (headings, code blocks, links, images). Style prose content with Tailwind's `@tailwindcss/typography` plugin (`prose` classes).           | ✅        | 2026-02-28 |
| TASK-0804 | Create blog listing page `src/app/[locale]/blog/page.tsx` — Server Component calling `getAllPosts(locale)` from `app/actions/blog.ts` and rendering `<BlogList />`. Set metadata with `generateMetadata()`.                                                                                                                                                     | ✅        | 2026-02-28 |
| TASK-0805 | Create blog post page `src/app/[locale]/blog/[slug]/page.tsx` — Server Component calling `getPost(slug, locale)`. Renders `<BlogPost />`. Implement `generateStaticParams()` to pre-render all known slugs at build time. Set `revalidate = 3600` (1 hour ISR) so new posts are picked up without full rebuild. Set metadata dynamically from post frontmatter. | ✅        | 2026-02-28 |
| TASK-0806 | Install and configure `@tailwindcss/typography` — `pnpm add @tailwindcss/typography`. Add the plugin to the Tailwind config (in v4, add via CSS `@plugin "@tailwindcss/typography"`). Style the blog post content area with `prose dark:prose-invert` classes.                                                                                                  | ✅        | 2026-02-28 |

---

### Phase 9: SEO & Metadata

- **GOAL-009**: Implement comprehensive SEO optimizations using Next.js built-in features.

| Task      | Description                                                                                                                                                                                                                                                                                                                                                               | Completed | Date       |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-0901 | Configure root metadata in `src/app/[locale]/layout.tsx` — Use Next.js `Metadata` type: set `title.template` (`'%s \| JV Vogler'`), `title.default` (`'JV Vogler — Frontend Developer'`), `description`, `keywords`, `authors`, `creator`, `metadataBase` (Vercel production URL), `openGraph` (type, locale, siteName, images), `twitter` (card: 'summary_large_image'). | ✅        | 2026-02-28 |
| TASK-0902 | Create `src/app/sitemap.ts` — Export a `sitemap()` function that generates `MetadataRoute.Sitemap`. Include: home page for each locale, blog listing for each locale, all published blog post URLs for each locale. Set `changeFrequency` and `priority` appropriately.                                                                                                   | ✅        | 2026-02-28 |
| TASK-0903 | Create `src/app/robots.ts` — Export a `robots()` function that generates `MetadataRoute.Robots`. Allow all crawlers, reference the sitemap URL.                                                                                                                                                                                                                           | ✅        | 2026-02-28 |
| TASK-0904 | Create `src/ui/lib/jsonLd.tsx` — Helper component to inject JSON-LD structured data. Create schemas for: `Person` (the portfolio owner), `WebSite`, `BlogPosting` (for individual blog posts). Render as `<script type="application/ld+json">` in the appropriate layouts/pages.                                                                                          | ✅        | 2026-02-28 |
| TASK-0905 | Create OpenGraph images — Option A: static OG images in `public/og/` for the home page. Option B: dynamic OG images using `src/app/[locale]/opengraph-image.tsx` with Next.js `ImageResponse` from `next/og` for auto-generated OG images per page/blog post. Start with Option A (static) and note Option B as a future enhancement.                                     | ✅        | 2026-02-28 |
| TASK-0906 | Add per-page metadata — Ensure every page (`page.tsx`) exports `generateMetadata()` that returns locale-specific title, description, and OpenGraph data. Blog posts pull metadata from MDX frontmatter.                                                                                                                                                                   | ✅        | 2026-02-28 |

---

### Phase 10: Analytics & Performance Monitoring

- **GOAL-010**: Integrate analytics and performance monitoring for production insights.

| Task      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Completed | Date       |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-1001 | Integrate **Vercel Analytics** — already installed in TASK-0107. Add `<Analytics />` from `@vercel/analytics/react` in the root locale layout (TASK-0606). Vercel Analytics is free on the Hobby plan, privacy-friendly (no cookies), and provides page views, unique visitors, top pages, referrers, and geo data. No configuration needed — it auto-activates on Vercel deployment.                                                                               | ✅        | 2026-02-28 |
| TASK-1002 | Integrate **Vercel Speed Insights** — already installed in TASK-0107. Add `<SpeedInsights />` from `@vercel/speed-insights/next` in the root locale layout. This reports Core Web Vitals (LCP, FID, CLS, INP, TTFB) per route. Free on Hobby plan.                                                                                                                                                                                                                  | ✅        | 2026-02-28 |
| TASK-1003 | _(Optional)_ Add **Google Analytics 4** as a secondary analytics source — Create `src/ui/lib/GoogleAnalytics.tsx` component that injects the GA4 `gtag.js` script via `next/script` with `strategy="afterInteractive"`. Read the measurement ID from `NEXT_PUBLIC_GA_MEASUREMENT_ID` env var. Only render in production (`process.env.NODE_ENV === 'production'`). **This task is optional** — Vercel Analytics may be sufficient. Decide after initial deployment. | ✅        | 2026-02-28 |

---

### Phase 11: Deployment & Infrastructure

- **GOAL-011**: Configure Vercel deployment with proper environment variables, ISR, and image optimization.

| Task      | Description                                                                                                                                                                                                                                                                                                                                                                                        | Completed | Date       |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-1101 | Create `vercel.json` (if needed) — Configure redirects (e.g., redirect root `/` to `/en`), headers (security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`). In most cases, `next-intl` middleware handles the locale redirect, so `vercel.json` may not be needed.                                                                                                      | ✅        | 2026-02-28 |
| TASK-1102 | Set up Vercel project — Connect the GitHub repository to Vercel. Set framework preset to Next.js. Configure environment variables in Vercel dashboard: `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM`, `NEXT_PUBLIC_GA_MEASUREMENT_ID` (if using GA). Set `NEXT_PUBLIC_BASE_URL` to the production domain for metadata/sitemap generation.                                             | ✅        | 2026-02-28 |
| TASK-1103 | Configure image optimization — Move all portfolio thumbnails from `src/assets/` to `public/images/portfolio/`. Move hero images to `public/images/hero/`. Next.js `next/image` will automatically serve optimized WebP/AVIF versions — no need to maintain manual jpg+webp pairs. Update `Portfolio.items` in `core/portfolio.ts` to reference paths like `/images/portfolio/thumb-fetchhire.jpg`. | ✅        | 2026-02-28 |
| TASK-1104 | Verify ISR — After deploying, publish a new blog post by committing an MDX file. Confirm it appears within the `revalidate` window (1 hour) without a full redeploy. Alternatively, use on-demand revalidation via a webhook/API route if faster publishing is desired.                                                                                                                            |           |            |
| TASK-1105 | Set up domain — If using a custom domain, configure it in Vercel. Update `metadataBase` in the layout to the production URL. Update `CONTACT_EMAIL_FROM` to use the verified domain with Resend once DNS is configured.                                                                                                                                                                            |           |            |

---

### Phase 12: i18n Translation Content Migration

- **GOAL-012**: Port all translatable content from the legacy codebase into the new `next-intl` message files.

| Task      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Completed | Date       |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-1201 | Populate `src/messages/en.json` with all translation keys. Structure: `{ "metadata": { "title": "...", "description": "..." }, "nav": { "home": "Home", ... }, "hero": { "heading": "...", "paragraph": "...", "cta": "..." }, "experience": { ... }, "portfolio": { "heading": "...", "description": "...", "demo": "Demo", "code": "Code", "fetchhire": { "description": "..." }, ... }, "contact": { ... }, "blog": { "heading": "...", "readMore": "..." }, "footer": { ... }, "a11y": { "hamburger": "...", ... } }`. Pull all values from legacy `en.json` + `PORTFOLIOS.description` fields. | ✅        | 2026-02-28 |
| TASK-1202 | Populate `src/messages/pt.json` with the same structure, pulling values from legacy `pt_br.json` + `PORTFOLIOS.description_pt` fields.                                                                                                                                                                                                                                                                                                                                                                                                                                                              | ✅        | 2026-02-28 |
| TASK-1203 | Audit both translation files for completeness — every key in `en.json` must have a corresponding key in `pt.json`. Write a simple validation: `Object.keys(en)` deep-compared with `Object.keys(pt)`. Can be a one-off script or a manual check.                                                                                                                                                                                                                                                                                                                                                    | ✅        | 2026-02-28 |

---

### Phase 13: Cleanup, Quality & Polish

- **GOAL-013**: Final code quality enforcement, cleanup, and pre-launch polish.

| Task      | Description                                                                                                                                                                                                                                           | Completed | Date |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-1301 | Run Oxlint across the entire `src/` directory — fix all reported issues. Configure any project-specific rule overrides in `oxlint.json`.                                                                                                              |           |      |
| TASK-1302 | Run Oxfmt across the entire `src/` directory — `pnpm format` to auto-format all files. Verify with `pnpm format:check`.                                                                                                                               |           |      |
| TASK-1303 | Run `pnpm typecheck` (tsc) and `pnpm typecheck:go` (tsgo) — fix all type errors. Document any tsgo-specific issues or incompatibilities encountered.                                                                                                  |           |      |
| TASK-1304 | Run `pnpm build` — verify the production build succeeds with zero errors. Check for any build warnings and address them.                                                                                                                              |           |      |
| TASK-1305 | Accessibility audit — manually test with keyboard navigation. Ensure all interactive elements are focusable, images have alt text, color contrast meets WCAG AA. Use `aria-label` on icon-only buttons (theme toggle, locale switcher, social links). |           |      |
| TASK-1306 | Performance audit — run Lighthouse on the deployed Vercel preview. Target: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95. Address any flagged issues.                                                                           |           |      |
| TASK-1307 | Verify the dependency rule — run `grep -rn "from '@/ui/\|from '@/app/" src/core/ src/lib/` — must return zero results. Run `grep -rn "from '@/app/" src/lib/` — must return zero results.                                                             |           |      |
| TASK-1308 | Update `README.md` — Document the new tech stack, project structure, development setup (pnpm install, env vars, dev server), deployment process, blog authoring workflow, and architecture diagram.                                                   |           |      |
| TASK-1309 | _(Optional, future)_ Set up CI/CD pipeline — GitHub Actions workflow that runs: `pnpm install`, `pnpm typecheck`, `pnpm lint`, `pnpm format:check`, `pnpm build` on every PR. Vercel handles deployment automatically.                                |           |      |

---

## 3. Alternatives Considered

- **ALT-001**: **In-place refactor within Vite + styled-components (v1 plan)** — Rejected. Since we're changing every major tool, an in-place migration would be more complex and leave behind legacy patterns. A clean rewrite is cleaner, faster, and results in a more coherent codebase.

- **ALT-002**: **Tailwind v3 instead of v4** — Rejected. Tailwind v4 is stable as of 2026, uses CSS-based configuration (simpler), has improved performance, and is the future direction. Starting new projects on v3 would be regressive.

- **ALT-003**: **ESLint + Prettier instead of Oxlint + Oxfmt** — Rejected per user preference. Oxlint and Oxfmt are significantly faster (written in Rust via the oxc toolchain) and provide a unified experience. The oxc ecosystem is mature enough for production use in 2026.

- **ALT-004**: **Standard tsc instead of tsgo** — We keep tsc as a fallback (tsgo is experimental). If tsgo proves stable enough during development, it becomes the primary type-checker for its speed advantages.

- **ALT-005**: **getform.io or Formspree instead of Resend** — Rejected. Resend gives full control over email formatting, reliability, and delivery. The Server Action pattern (no client-side HTTP call) is also more secure and elegant than posting to a third-party form endpoint from the browser.

- **ALT-006**: **Google Analytics as primary analytics** — Rejected in favor of Vercel Analytics as the primary tool. Vercel Analytics is zero-config on Vercel, privacy-friendly (no cookies), free on Hobby, and purpose-built for Next.js. GA4 remains available as an optional secondary source if more advanced tracking is needed later.

- **ALT-007**: **Contentlayer / Velite for MDX** — Considered but rejected for simplicity. `next-mdx-remote` + `gray-matter` is well-understood, has no build step dependency, and is sufficient for a small blog. Can migrate to Velite later if the blog grows significantly.

- **ALT-008**: **react-icons instead of lucide-react + simple-icons** — Rejected. `react-icons` bundles many icon sets but the tree-shaking isn't ideal, and it encourages storing pre-rendered JSX in constants (the exact anti-pattern we're fixing). `lucide-react` is modern, consistent, tree-shakeable, and covers all UI icon needs. `simple-icons` provides brand/tech logos as SVG data.

---

## 4. Dependencies

### Production Dependencies

| Package                    | Version | Purpose                                        |
| -------------------------- | ------- | ---------------------------------------------- |
| `next`                     | ^15.x   | Framework — App Router, SSR, ISR, Metadata API |
| `react` / `react-dom`      | ^19.x   | UI library (Next.js 15 uses React 19)          |
| `next-intl`                | ^4.x    | Internationalization with locale routing       |
| `next-themes`              | ^0.4.x  | Dark/light theme switching (class strategy)    |
| `framer-motion`            | ^11.x   | Animations — page transitions, scroll reveals  |
| `react-hook-form`          | ^7.x    | Form state management                          |
| `@hookform/resolvers`      | ^3.x    | Zod resolver for React Hook Form               |
| `zod`                      | ^3.x    | Schema validation (forms, data)                |
| `lucide-react`             | ^0.4xx  | UI icons                                       |
| `simple-icons`             | ^13.x   | Brand/tech SVG icons                           |
| `resend`                   | ^4.x    | Email delivery SDK                             |
| `next-mdx-remote`          | ^5.x    | Server-side MDX rendering                      |
| `gray-matter`              | ^4.x    | MDX frontmatter parsing                        |
| `@vercel/analytics`        | ^1.x    | Page view analytics                            |
| `@vercel/speed-insights`   | ^1.x    | Core Web Vitals monitoring                     |
| `class-variance-authority` | ^0.7.x  | Component variant management (shadcn/ui dep)   |
| `clsx`                     | ^2.x    | Conditional class names (shadcn/ui dep)        |
| `tailwind-merge`           | ^2.x    | Tailwind class deduplication (shadcn/ui dep)   |
| `@tailwindcss/typography`  | ^0.5.x  | Prose styling for MDX blog content             |

### Dev Dependencies

| Package              | Version      | Purpose                                    |
| -------------------- | ------------ | ------------------------------------------ |
| `typescript`         | ^5.x         | Type checking (standard compiler)          |
| `@anthropic-ai/tsgo` | experimental | TypeScript Go rewrite (fast type-checking) |
| `tailwindcss`        | ^4.x         | Utility-first CSS framework                |
| `oxlint`             | latest       | Fast linting (Rust-based)                  |
| `oxfmt`              | latest       | Fast formatting (Rust-based)               |
| `@types/node`        | ^22.x        | Node.js type definitions                   |
| `@types/react`       | ^19.x        | React type definitions                     |

---

## 5. Files

### New Directory Structure

```
portfolio/
├── .env.example
├── .env.local                    # Git-ignored
├── .gitignore
├── .oxfmt.toml                   # Oxfmt configuration
├── components.json               # shadcn/ui configuration
├── content/
│   └── blog/
│       ├── en/                   # English blog posts (MDX)
│       │   └── hello-world.mdx
│       └── pt/                   # Portuguese blog posts (MDX)
│           └── hello-world.mdx
├── next.config.ts
├── oxlint.json                   # Oxlint configuration
├── package.json
├── plan/
│   ├── refactor-layered-architecture-1.md   # Superseded
│   └── refactor-layered-architecture-2.md   # This plan
├── pnpm-lock.yaml
├── public/
│   ├── images/
│   │   ├── hero/                 # Hero section images
│   │   └── portfolio/            # Project thumbnails
│   ├── og/                       # Static OpenGraph images
│   ├── favicon.ico
│   └── logo.svg
├── README.md
├── src/
│   ├── app/                      # Next.js App Router (routing + server actions)
│   │   ├── [locale]/
│   │   │   ├── layout.tsx        # Locale-specific root layout
│   │   │   ├── page.tsx          # Home page (composes sections)
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx      # Blog listing
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx  # Individual blog post
│   │   │   └── not-found.tsx     # 404 page
│   │   ├── layout.tsx            # Root layout (minimal)
│   │   ├── sitemap.ts            # Dynamic sitemap generation
│   │   ├── robots.ts             # robots.txt generation
│   │   └── actions/
│   │       ├── contact.ts        # Server Action: send email via Resend
│   │       └── blog.ts           # Data access: read MDX posts
│   │
│   ├── core/                     # Pure domain logic (zero framework imports)
│   │   ├── index.ts              # Barrel export
│   │   ├── theme.ts              # Theme variant enum + toggle
│   │   ├── navigation.ts         # Nav link types + data
│   │   ├── tech.ts               # Tech skill types + data
│   │   ├── portfolio.ts          # Portfolio project types + data
│   │   ├── social.ts             # Social link types + data
│   │   ├── contact.ts            # Contact form types + Zod schema
│   │   └── blog.ts               # Blog post types + pure helpers
│   │
│   ├── lib/                      # Generic utilities (zero domain knowledge)
│   │   ├── index.ts              # Barrel export
│   │   ├── storage.ts            # Type-safe localStorage wrapper
│   │   ├── cn.ts                 # clsx + tailwind-merge utility
│   │   ├── mdx.ts                # MDX file reading utilities
│   │   └── date.ts               # Date formatting utility
│   │
│   ├── i18n/                     # Internationalization config
│   │   ├── config.ts             # Locale list, default locale
│   │   └── request.ts            # next-intl server config
│   │
│   ├── messages/                 # Translation files
│   │   ├── en.json
│   │   └── pt.json
│   │
│   ├── middleware.ts             # next-intl locale middleware
│   │
│   └── ui/                       # Presentation layer
│       ├── components/           # Shared/generic UI components
│       │   ├── ui/               # shadcn/ui generated components
│       │   ├── Footer.tsx
│       │   └── Section.tsx       # Reusable section wrapper with motion
│       ├── lib/                  # UI-specific utilities
│       │   ├── icons.tsx         # Icon resolver (TechIcon, SocialIcon)
│       │   ├── motion.tsx        # Framer Motion animation variants
│       │   ├── jsonLd.tsx        # JSON-LD structured data helpers
│       │   └── GoogleAnalytics.tsx  # Optional GA4 component
│       ├── theme/
│       │   ├── ThemeProvider.tsx  # next-themes wrapper
│       │   └── ThemeToggle.tsx   # Dark/light toggle button
│       ├── header/
│       │   └── components/
│       │       ├── Header.tsx
│       │       └── LocaleSwitcher.tsx
│       ├── hero/
│       │   └── components/
│       │       ├── Hero.tsx
│       │       └── ImageSlider.tsx  # Optional: keep or redesign
│       ├── experience/
│       │   └── components/
│       │       └── Experience.tsx
│       ├── portfolio/
│       │   └── components/
│       │       ├── Portfolio.tsx
│       │       └── ProjectCard.tsx
│       ├── contact/
│       │   ├── components/
│       │   │   ├── ContactSection.tsx
│       │   │   └── ContactForm.tsx
│       │   └── hooks/
│       │       └── useContactForm.ts
│       └── blog/
│           └── components/
│               ├── BlogList.tsx
│               └── BlogPost.tsx
│
└── tsconfig.json
```

### Files Deleted (from main, preserved in legacy branch)

All original `src/` files, `index.html`, `vite.config.ts`, `tsconfig.node.json`, `skills-lock.json`, old `package.json`, and `package-lock.json`.

---

## 6. Testing & Verification

### Build & Type Checks

- **TEST-001**: `pnpm typecheck` (tsc --noEmit) — zero errors.
- **TEST-002**: `pnpm typecheck:go` (tsgo --noEmit) — zero errors (or document known tsgo incompatibilities).
- **TEST-003**: `pnpm build` — successful Next.js production build, zero errors.
- **TEST-004**: `pnpm lint` (Oxlint) — zero errors/warnings (after config).
- **TEST-005**: `pnpm format:check` (Oxfmt) — all files formatted.

### Functional Verification

- **TEST-006**: Home page loads at `/en` with all 5 sections (Hero, Experience, Portfolio, Contact, Footer).
- **TEST-007**: Theme toggle switches dark ↔ light, persists across page reload.
- **TEST-008**: Locale switcher toggles EN ↔ PT-BR, URL updates (`/en/` ↔ `/pt/`), all content translates correctly.
- **TEST-009**: Navigation links scroll to correct sections (Home, Experience, Portfolio, Contact) and Blog link navigates to `/en/blog`.
- **TEST-010**: Mobile menu opens/closes, all links work, body scroll is locked when open.
- **TEST-011**: Experience grid renders all 14 tech icons with correct brand colors.
- **TEST-012**: Portfolio grid renders all 8 projects with optimized images, correct translated descriptions, working Demo/Code links.
- **TEST-013**: Contact form validates all fields (name min 2, email format, message min 20) with real-time feedback.
- **TEST-014**: Contact form submission sends email via Resend. Verify in Resend dashboard that email is delivered.
- **TEST-015**: Blog listing page shows all published posts, sorted by date desc.
- **TEST-016**: Individual blog post page renders MDX content with correct typography, code highlighting, and metadata.
- **TEST-017**: Scroll-reveal animations fire correctly on each section when scrolling into viewport.

### SEO & Performance

- **TEST-018**: `curl -s https://yourdomain.com/sitemap.xml` — returns valid XML with all pages.
- **TEST-019**: `curl -s https://yourdomain.com/robots.txt` — returns valid robots.txt referencing sitemap.
- **TEST-020**: View page source — JSON-LD script tags present on home page and blog posts.
- **TEST-021**: Share a page URL on social media / use OG debugger — OpenGraph preview renders correctly.
- **TEST-022**: Lighthouse audit: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- **TEST-023**: Vercel Analytics dashboard shows page view data after deployment.
- **TEST-024**: Vercel Speed Insights shows Core Web Vitals scores.

### Architecture Verification

- **TEST-025**: `grep -rn "from '@/ui/\|from '@/app/" src/core/ src/lib/` — zero results (inner layers don't import outer).
- **TEST-026**: `grep -rn "from 'react\|from 'next" src/core/` — zero results (core is framework-free; only `zod` allowed).
- **TEST-027**: `grep -rn "from '@/app/" src/lib/` — zero results (lib doesn't import app).
- **TEST-028**: Every key in `en.json` has a matching key in `pt.json` (no missing translations).

---

## 7. Risks & Assumptions

### Risks

- **RISK-001**: **tsgo compatibility** — tsgo is experimental and may not support all TypeScript features (e.g., `const enum`, complex generic inference, some `paths` configurations). **Mitigation**: Keep standard `tsc` as the CI type-checker. Use tsgo for fast local development checks. Document any incompatibilities found.

- **RISK-002**: **Oxfmt maturity** — Oxfmt may not have 100% parity with Prettier for all edge cases (JSX formatting, MDX files). **Mitigation**: If Oxfmt has blocking issues with specific file types, exclude those files from Oxfmt and format them manually or with Prettier. Check Oxfmt's supported file types before configuring.

- **RISK-003**: **Resend domain verification** — Production email sending requires a verified domain with SPF/DKIM records. **Mitigation**: Use Resend's sandbox (`onboarding@resend.dev`) during development. Set up domain verification before production launch (TASK-1105).

- **RISK-004**: **Content migration completeness** — All 8 portfolio project descriptions, 28+ translation keys, and social/tech data must be accurately ported. **Mitigation**: TEST-028 (translation key parity check) and TEST-011/TEST-012 (visual verification of all data).

- **RISK-005**: **Simple-icons integration** — `simple-icons` provides SVG path data, not React components. Rendering them requires creating an `<svg>` wrapper in the `TechIcon` component. **Mitigation**: Build a robust `TechIcon` component in TASK-0605 that handles the SVG rendering. Alternatively, use `@icons-pack/react-simple-icons` if available and tree-shakeable.

- **RISK-006**: **Next.js 15 + React 19 breaking changes** — React 19 introduces new patterns (use, Actions, form actions). Some third-party libraries may not be fully compatible yet. **Mitigation**: Check compatibility of all deps with React 19 before starting. Pin versions if needed.

### Assumptions

- **ASM-001**: Vercel Hobby plan (free) is sufficient for this portfolio — includes Analytics, Speed Insights, serverless functions, ISR, and image optimization.
- **ASM-002**: pnpm is available in the development environment and Vercel supports pnpm out of the box.
- **ASM-003**: The blog starts small (1-2 posts) — the MDX-from-filesystem approach scales sufficiently without needing a CMS.
- **ASM-004**: The designer/developer (owner) will create new layouts in Tailwind during implementation — this plan doesn't prescribe exact visual designs.
- **ASM-005**: Existing portfolio thumbnail images are manually migrated to `public/images/portfolio/` — `next/image` handles optimization from there.
- **ASM-006**: The hero image comparison slider is a "decision point" — it may be kept, redesigned, or removed based on the new layout direction.

---

## 8. Related Specifications & Further Reading

- [Next.js 15 Documentation](https://nextjs.org/docs) — App Router, Server Components, Server Actions, Metadata API, Image Optimization, ISR.
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs) — CSS-based config, design tokens, dark mode.
- [shadcn/ui Documentation](https://ui.shadcn.com) — Component library built on Radix + Tailwind.
- [next-intl Documentation](https://next-intl.dev) — Internationalization for Next.js App Router.
- [React Hook Form Documentation](https://react-hook-form.com) — Performant form management.
- [Zod Documentation](https://zod.dev) — TypeScript-first schema validation.
- [Framer Motion Documentation](https://motion.dev) — Animation library for React.
- [Resend Documentation](https://resend.com/docs) — Email API for developers.
- [next-mdx-remote Documentation](https://github.com/hashicorp/next-mdx-remote) — MDX rendering for Next.js.
- [Vercel Analytics](https://vercel.com/docs/analytics) — Built-in analytics for Vercel deployments.
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights) — Core Web Vitals monitoring.
- [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) — Fast Rust-based linter.
- [Oxfmt (Oxc Formatter)](https://oxc.rs) — Fast Rust-based formatter.
- [tsgo (TypeScript Go)](https://github.com/nicolo-ribaudo/tc39-proposal-type-annotations) — Experimental TypeScript type-checker rewritten in Go. _(Adjust URL per actual release.)_
- [Layered Frontend Architecture Guide](./refactor-layered-architecture-1.md#overview) — The architectural principles (from v1 plan) that still govern the `core/`, `lib/`, `app/`, `ui/` layering.
