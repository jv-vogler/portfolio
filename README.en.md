# JV Vogler — Portfolio

[![pt](https://img.shields.io/badge/README%20em-português-brightgreen.svg)](./README.md)

Personal portfolio and blog built with a modern stack, following the **Layered Frontend Architecture**.

### [**Live Page**](https://jvvogler.com)

---

## Tech Stack

| Category        | Technology                                |
| --------------- | ----------------------------------------- |
| Framework       | Next.js 16 (App Router, RSC)              |
| Language        | TypeScript 5                              |
| Package Manager | pnpm                                      |
| Styling         | Tailwind CSS v4 + shadcn/ui               |
| i18n            | next-intl (EN / PT-BR)                    |
| Forms           | React Hook Form + Zod                     |
| Icons           | lucide-react + simple-icons               |
| Animations      | Framer Motion                             |
| Blog            | Local MDX + next-mdx-remote + gray-matter |
| SEO             | Metadata API, sitemap, robots, JSON-LD    |
| Analytics       | Vercel Analytics + Speed Insights         |
| Email           | Resend (via Server Actions)               |
| Linting         | Oxlint                                    |
| Formatting      | Oxfmt                                     |
| Deployment      | Vercel                                    |

---

## Architecture

The project follows a **Layered Frontend Architecture** with 4 layers:

```
src/
├── core/       # Domain types + pure logic (zero framework imports)
├── lib/        # Generic utilities (zero domain knowledge)
├── app/        # Next.js routing + Server Actions + data access
├── ui/         # React components, hooks, theme, animations
├── i18n/       # Internationalization configuration
└── messages/   # Translation files (en.json, pt.json)
```

**Dependency rules:**

- `core/` → no external deps (Zod only)
- `lib/` → no imports from `core/`, `app/`, or `ui/`
- `app/` → may import from `core/` and `lib/`
- `ui/` → may import from `core/`, `lib/`, and `app/`

---

## Quick Start

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9

### Installation

```bash
pnpm install
```

### Environment Variables

Copy the example file and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable                        | Description                    |
| ------------------------------- | ------------------------------ |
| `RESEND_API_KEY`                | Resend API key                 |
| `CONTACT_EMAIL_TO`              | Contact form recipient email   |
| `CONTACT_EMAIL_FROM`            | Sender email (Resend domain)   |
| `NEXT_PUBLIC_BASE_URL`          | Production URL                 |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics ID (optional) |

### Development

```bash
pnpm dev          # Development server (Turbopack)
pnpm build        # Production build
pnpm start        # Serve production build
```

### Code Quality

```bash
pnpm lint           # Oxlint
pnpm format         # Oxfmt (auto-fix)
pnpm format:check   # Oxfmt (check only)
pnpm typecheck      # tsc --noEmit
pnpm typecheck:go   # tsgo --noEmit (experimental)
```

---

## Blog

Posts are written in MDX and stored in `content/blog/<locale>/`:

```
content/blog/
├── en/
│   └── my-post.mdx
└── pt/
    └── my-post.mdx
```

Each MDX file requires frontmatter:

```yaml
---
title: 'Post Title'
description: 'Brief description'
date: '2026-02-28'
tags: ['react', 'next.js']
published: true
---
```

Posts with `published: false` are excluded from the build. ISR with 1-hour revalidation.

---

## Deployment

The project is automatically deployed to **Vercel** on every push to `main`. Preview deployments are created for each PR.

---

## License

[MIT](https://choosealicense.com/licenses/mit/).
All rights reserved &copy; 2026 JV Vogler.
