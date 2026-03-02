---
goal: Fix Payload admin white blank page and align project configuration with production-ready reference
version: 1.0
date_created: 2026-03-01
last_updated: 2026-03-02
owner: JV Vogler
status: "In Progress"
tags:
  - bug
  - infrastructure
  - chore
  - deployment
---

# Introduction

![Status: In Progress](https://img.shields.io/badge/status-In%20Progress-yellow)

The Payload admin panel at `https://jvogler.vercel.app/admin` renders as a white blank page. A comparative audit against a working reference project (`guiha-portfolio`, Payload 3.63 + Next.js 15) revealed multiple missing configurations, incorrect file setups, and deployment gaps in the current project (`jv-portfolio`, Payload 3.78 + Next.js 16). This plan addresses every identified discrepancy — prioritizing the critical issues that cause the blank page, then listing secondary hardening tasks to prepare for a future layered-architecture refactor.

## 1. Requirements & Constraints

**Critical (White Blank Page Root Causes)**

- **REQ-001**: The Vercel build must run `payload migrate` before `next build` so the database schema exists when the admin panel loads
- **REQ-002**: The REST API route must export `REST_PUT` — Payload admin panel uses HTTP PUT for some operations (e.g., globals updates)
- **REQ-003**: `payload.config.ts` must include a `cors` array so admin panel XHR requests are not blocked by the browser
- **REQ-004**: Vercel environment variables (`POSTGRES_URL`, `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN`) must be set — without them Payload cannot initialise its database adapter and the entire server-side render fails silently, producing a blank page

**Important (Functional correctness)**

- **REQ-005**: The `next-intl` middleware must be at a path that Next.js 16 actually loads — confirm `src/proxy.ts` is being picked up, or rename to `src/middleware.ts`
- **REQ-006**: Security headers in `vercel.json` must exclude `/admin` from `X-Frame-Options: DENY` — Payload admin uses iframes for media selection, live preview, and modal dialogs
- **REQ-007**: The build script should suppress Node.js deprecation warnings (consistency with reference project)
- **REQ-008**: The project should have a `NEXT_PUBLIC_BASE_URL` (or equivalent) env var for generating correct absolute URLs in metadata, OG tags, and Payload's server URL resolution

**Hardening / Optimisation**

- **GUD-001**: `tsconfig.json` `jsx` should be `"preserve"` — this is the Next.js convention and avoids TypeScript attempting JSX transformation (even though `noEmit: true` makes it a no-op, IDEs and tooling expect `preserve`)
- **GUD-002**: Add `sourceMap: true` to `tsconfig.json` for production debugging parity with reference project
- **GUD-003**: Add `cross-env` dependency for cross-platform script compatibility
- **GUD-004**: Add a `payload` script to `package.json` for running CLI commands (e.g., `pnpm payload migrate:create`)

**Constraints**

- **CON-001**: Do not change collection schemas, hooks, or the existing `next-intl` setup — this plan is strictly infrastructure/config
- **CON-002**: The reference project is on Payload 3.63 / Next.js 15; this project is on Payload 3.78 / Next.js 16 — any differences in generated file conventions must be verified against the Payload 3.78 docs
- **CON-003**: The `patches/payload@3.78.0.patch` (namespace import fix for `@next/env`) must remain applied via `pnpm-workspace.yaml`

## 2. Implementation Steps

### Phase 1: Fix Critical Deployment Issues (White Blank Page)

- GOAL-001: Resolve all issues that directly cause the Payload admin panel to render as a white blank page on Vercel

| Task     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Completed           | Date                                                                                                                                                                                                                                       |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- | ---------- |
| TASK-001 | **Add `vercel-build` script to `package.json`**: Add `"vercel-build": "payload migrate && next build"` to the `scripts` object. Vercel automatically uses `vercel-build` when present. Without this, `payload migrate` never runs and the Postgres database has no tables — Payload's server-side initialisation fails and the admin page renders blank. Reference project uses `"vercel-build": "cross-env NODE_OPTIONS=--no-deprecation payload migrate && next build"`. | ✅                  | 2026-03-02                                                                                                                                                                                                                                 |
| TASK-002 | **Add `REST_PUT` export to the REST API route**: In `src/app/(payload)/api/[...slug]/route.ts`, add `import { REST_PUT } from '@payloadcms/next/routes'` and `export const PUT = REST_PUT(config)`. The reference project exports this; Payload admin uses HTTP PUT for updating globals and some collection operations. Without it, the admin panel's client-side JS sends PUT requests that 405, causing UI errors or blank rendering.                                   | ✅                  | 2026-03-02                                                                                                                                                                                                                                 |
| TASK-003 | **Add CORS configuration to `payload.config.ts`**: Add `cors: [process.env.NEXT_PUBLIC_BASE_URL                                                                                                                                                                                                                                                                                                                                                                            |                     | 'http://localhost:3000'].filter(Boolean)`to the`buildConfig()`call. The reference project uses`cors: [getServerSideURL()].filter(Boolean)`. Without CORS, browser-initiated requests from the admin SPA to the Payload API may be blocked. | ✅  | 2026-03-02 |
| TASK-004 | **Verify Vercel environment variables are set**: Confirm these are configured in the Vercel project dashboard: `POSTGRES_URL` (Neon/Vercel Postgres connection string), `PAYLOAD_SECRET` (random 32+ char string), `BLOB_READ_WRITE_TOKEN` (Vercel Blob token). If `POSTGRES_URL` or `PAYLOAD_SECRET` are missing, Payload falls back to empty strings and fails to initialise. This is a manual verification step — no code change.                                       | ⚠️ Partial (manual) | 2026-03-02                                                                                                                                                                                                                                 |
| TASK-005 | **Add `NEXT_PUBLIC_BASE_URL` environment variable**: Set `NEXT_PUBLIC_BASE_URL=https://jvogler.vercel.app` in Vercel project settings. Used by CORS config (TASK-003), metadata generation, and OG tags. Also add it to `.env.example` if not already present.                                                                                                                                                                                                             | ✅                  | 2026-03-02                                                                                                                                                                                                                                 |

### Phase 2: Fix Security Header Conflict

- GOAL-002: Ensure Vercel security headers do not break Payload admin panel functionality

| Task     | Description                                                                                                                                                                                                                                                                                                                                                                                                           | Completed   | Date       |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------- |
| TASK-006 | **Scope `X-Frame-Options` to exclude `/admin`**: In `vercel.json`, change the source pattern for the `X-Frame-Options: DENY` header from `/(.*)` to `/((?!admin).*)` so that the Payload admin panel can use iframes for media modals, live preview, and relationship selection dialogs. Alternatively, split into two header blocks — one for `/admin` routes (without X-Frame-Options) and one for everything else. | ✅          | 2026-03-02 |
| TASK-007 | **Add `Content-Security-Policy` header for non-admin routes**: Consider adding a basic CSP to the non-admin header block: `"default-src 'self'; img-src 'self' https://*.public.blob.vercel-storage.com; script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'"`. This is optional but recommended for production hardening.                                              | ⏳ Deferred |            |

### Phase 3: Verify Middleware Setup

- GOAL-003: Ensure `next-intl` middleware is active and correctly excludes Payload routes

| Task     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Completed               | Date       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ---------- | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ---------- |
| TASK-008 | **Verify `src/proxy.ts` is picked up by Next.js 16**: Next.js 16 introduced `proxy.ts` as a successor to `middleware.ts`. Confirm the dev server logs show the proxy/middleware being loaded. If `proxy.ts` is NOT recognised (i.e., locale routing is broken on the frontend), rename `src/proxy.ts` → `src/middleware.ts` and remove the proxy reference. Test by visiting `/` — it should redirect to `/en` (or user's locale). The admin panel should NOT be affected since the matcher excludes `/admin` and `/api`. | ✅                      | 2026-03-02 |
| TASK-009 | **Confirm matcher pattern is correct**: The current matcher is `["/", "/(en                                                                                                                                                                                                                                                                                                                                                                                                                                               | pt)/:path\*", "/((?!api | admin      | \_next | \_vercel | ._\\.._).\*)"]`. Verify that requests to `/admin`, `/api/...`, `/admin/login`, and `/admin/collections/posts`all bypass the middleware. Test locally with`pnpm dev`. | ✅  | 2026-03-02 |

### Phase 4: Build Script & Tooling Alignment

- GOAL-004: Align build scripts and tooling with production best practices from the reference project

| Task     | Description                                                                                                                                                                                                                                                        | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ---------- |
| TASK-010 | **Add `payload` CLI script to `package.json`**: Add `"payload": "payload"` to the `scripts` object. This enables running `pnpm payload migrate:create`, `pnpm payload generate:types`, `pnpm payload generate:importmap` etc. The reference project includes this. | ✅        | 2026-03-02 |
| TASK-011 | **Add `generate:importmap` script**: Add `"generate:importmap": "payload generate:importmap"` to `scripts`. Useful when adding custom admin components (e.g., BeforeDashboard, BeforeLogin).                                                                       | ✅        | 2026-03-02 |
| TASK-012 | **Add `generate:types` script**: Add `"generate:types": "payload generate:types"` to `scripts`. Regenerates `src/payload-types.ts` after collection schema changes.                                                                                                | ✅        | 2026-03-02 |
| TASK-013 | **Add `cross-env` dependency**: Run `pnpm add -D cross-env`. Update `vercel-build` script to use `cross-env NODE_OPTIONS=--no-deprecation` prefix for consistency. This suppresses Payload's punycode deprecation warnings during build.                           | ✅        | 2026-03-02 |

### Phase 5: TypeScript Configuration Alignment

- GOAL-005: Align `tsconfig.json` with Next.js / Payload conventions

| Task     | Description                                                                                                                                                                                                                                                                                                    | Completed | Date       |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-014 | **Change `jsx` from `"react-jsx"` to `"preserve"`**: Next.js expects `"preserve"` — it handles JSX transformation via SWC/Turbopack. While `noEmit: true` makes this harmless at build time, some IDE integrations and Payload's code generation expect `"preserve"`. The reference project uses `"preserve"`. | ✅        | 2026-03-02 |
| TASK-015 | **Add `react` path mapping**: Add `"react": ["./node_modules/@types/react"]` to `compilerOptions.paths`. The reference project includes this to prevent React type resolution conflicts in monorepo-like setups. This project uses `pnpm-workspace.yaml` so the same issue may arise.                          | ✅        | 2026-03-02 |
| TASK-016 | **Add `sourceMap: true`** to `compilerOptions` for debugging in production (Vercel source maps). Currently missing.                                                                                                                                                                                            | ✅        | 2026-03-02 |

### Phase 6: Payload Config Hardening

- GOAL-006: Add production-readiness features to `payload.config.ts` that exist in the reference project

| Task     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Completed   | Date       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------- |
| TASK-017 | **Move Vercel Blob storage outside conditional**: Currently `vercelBlobStorage` is only added when `BLOB_READ_WRITE_TOKEN` is set. This is fine, but make sure the token is set on Vercel. The reference project always includes the plugin and passes the token directly: `vercelBlobStorage({ collections: { media: true }, token: process.env.BLOB_READ_WRITE_TOKEN \|\| '' })`. Aligning with this approach avoids silent failures where media uploads silently fall back to local disk (which doesn't exist on Vercel). | ✅          | 2026-03-02 |
| TASK-018 | **Add `admin.livePreview` configuration** (optional): The reference project configures live preview breakpoints. This is not critical but improves the content editing experience. Can be deferred.                                                                                                                                                                                                                                                                                                                          | ⏳ Deferred |            |
| TASK-019 | **Add `jobs` configuration** (optional): The reference project has a `jobs` block with cron-authenticated access control. This pairs with the `vercel.json` cron job at `/api/payload-jobs/run`. Not needed yet, but if scheduled tasks are planned (e.g., scheduled publishing), add the jobs config and the cron entry. Can be deferred.                                                                                                                                                                                   | ⏳ Deferred |            |

### Phase 7: Deployment Verification

- GOAL-007: Verify the fixes resolve the white blank page and the entire deployment is functional

| Task     | Description                                                                                                                                                                                                                                             | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-020 | **Local verification**: Run `pnpm dev`, navigate to `http://localhost:3000/admin`. Confirm the login page renders. Create an admin user, log in, verify collections (Users, Media, Posts, Projects, Skills) are visible and operable.                   |           |      |
| TASK-021 | **Build verification**: Run `pnpm build` locally. Confirm no TypeScript errors and the build succeeds.                                                                                                                                                  |           |      |
| TASK-022 | **Deploy to Vercel**: Push changes and trigger a Vercel deployment. Monitor build logs — confirm `payload migrate` runs (from `vercel-build` script) and `next build` completes.                                                                        |           |      |
| TASK-023 | **Production admin verification**: Navigate to `https://jvogler.vercel.app/admin`. Confirm the login page renders (not a white page). Log in with admin credentials. Verify CRUD operations on all collections.                                         |           |      |
| TASK-024 | **Frontend verification**: Navigate to `https://jvogler.vercel.app/en` and `https://jvogler.vercel.app/pt`. Confirm pages render with Payload data. Navigate to blog, portfolio, and about pages in both locales.                                       |           |      |
| TASK-025 | **Run seed on production** (if needed): If the production database is empty, run the seed script against production: `POSTGRES_URL=<prod-url> PAYLOAD_SECRET=<secret> pnpm seed` or use Vercel's `vercel env pull` to get credentials locally and seed. |           |      |

## 3. Alternatives

- **ALT-001**: **Downgrade to Payload 3.63 / Next.js 15 to match reference exactly** — Rejected. The project intentionally uses newer versions and the issues are configuration gaps, not version incompatibilities.
- **ALT-002**: **Remove `next-intl` and handle i18n manually** — Rejected. `next-intl` is deeply integrated and working for the frontend. The middleware/proxy just needs to be at the correct path.
- **ALT-003**: **Use Payload's built-in `serverURL` config instead of CORS** — Considered. Payload's `serverURL` config sets the server URL for admin panel links. This could be added alongside CORS but doesn't replace it. `serverURL` is for link generation; `cors` is for browser security.
- **ALT-004**: **Remove security headers entirely** — Rejected. Security headers are best practice. They just need to be scoped to exclude `/admin`.

## 4. Dependencies

- **DEP-001**: `cross-env` (devDependency, new) — Cross-platform environment variable setting for build scripts
- **DEP-002**: Vercel Postgres / Neon instance — must be provisioned and connection string set as `POSTGRES_URL`
- **DEP-003**: Vercel Blob Storage — must be enabled and `BLOB_READ_WRITE_TOKEN` set
- **DEP-004**: `PAYLOAD_SECRET` — must be a strong random string set on Vercel

## 5. Files

**Modified files:**

- **FILE-001**: `package.json` — Add `vercel-build`, `payload`, `generate:importmap`, `generate:types` scripts; add `cross-env` devDependency
- **FILE-002**: `src/app/(payload)/api/[...slug]/route.ts` — Add `REST_PUT` import and `PUT` export
- **FILE-003**: `src/payload.config.ts` — Add `cors` array; optionally adjust Vercel Blob plugin to always-on
- **FILE-004**: `vercel.json` — Scope `X-Frame-Options` header to exclude `/admin` routes
- **FILE-005**: `tsconfig.json` — Change `jsx` to `"preserve"`, add `react` path, add `sourceMap`
- **FILE-006**: `src/proxy.ts` → `src/middleware.ts` (rename, only if `proxy.ts` is not picked up by Next.js 16)
- **FILE-007**: `.env.example` — Ensure `NEXT_PUBLIC_BASE_URL` is documented

**No new files created. No files deleted.**

## 6. Testing

- **TEST-001**: `pnpm build` completes without errors
- **TEST-002**: `http://localhost:3000/admin` renders the Payload login page (not a blank page)
- **TEST-003**: Admin panel CRUD works for all 5 collections (Users, Media, Posts, Projects, Skills)
- **TEST-004**: `https://jvogler.vercel.app/admin` renders the login page after Vercel deployment
- **TEST-005**: Frontend routes (`/en`, `/pt`, `/en/blog`, `/en/portfolio/*`) render correctly
- **TEST-006**: Locale switching works (confirms middleware/proxy is active)
- **TEST-007**: Media upload in admin panel works (confirms Vercel Blob storage is configured)
- **TEST-008**: Security headers are present on frontend routes (`X-Frame-Options: DENY`) but absent on `/admin` routes
- **TEST-009**: HTTP PUT requests to `/api/*` return 200 (not 405)
- **TEST-010**: Vercel build logs show `payload migrate` running before `next build`

## 7. Risks & Assumptions

- **RISK-001**: `src/proxy.ts` may not be a valid Next.js 16 convention — If Next.js 16 doesn't recognise `proxy.ts`, the file must be renamed to `middleware.ts`. This only affects frontend i18n routing, not the admin panel. **Mitigation**: Test locally first; check Next.js 16 docs/changelog.
- **RISK-002**: The `payload@3.78.0.patch` may become stale if Payload is updated — **Mitigation**: Check if newer Payload versions fix the `@next/env` import issue before upgrading.
- **RISK-003**: Running `payload migrate` on first Vercel build against an empty database may fail if no migration files exist — **Mitigation**: Verify `src/seed/apply-migration.ts` and any migration files are present, or run `payload migrate:create` locally first to generate the initial migration.
- **RISK-004**: The conditional Vercel Blob plugin (`if BLOB_READ_WRITE_TOKEN`) means local dev uses disk storage at `public/media/`, but Vercel has no persistent disk — If the token isn't set on Vercel, media uploads will fail silently. **Mitigation**: TASK-017 addresses this.

- **ASSUMPTION-001**: Vercel environment variables (`POSTGRES_URL`, `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN`) are or will be set correctly
- **ASSUMPTION-002**: The Neon/Vercel Postgres instance is provisioned and accessible
- **ASSUMPTION-003**: The `pnpm-workspace.yaml` `patchedDependencies` section correctly applies the Payload patch during `pnpm install` on Vercel
- **ASSUMPTION-004**: Payload 3.78 is compatible with Next.js 16.1.6 (confirmed by local dev working per the integration plan)

## 8. Related Specifications / Further Reading

- [PayloadCMS Integration Plan](feature-payloadcms-integration-1.md) — The existing integration plan this builds upon
- [Layered Architecture Refactor Plan](refactor-layered-architecture.md) — The follow-up refactor plan
- [PayloadCMS Deployment Docs](https://payloadcms.com/docs/getting-started/deployment) — Official deployment guide
- [PayloadCMS + Vercel Template](https://github.com/payloadcms/payload/tree/main/templates/with-vercel-website) — Reference template source
- [Next.js 16 Middleware Changes](https://nextjs.org/blog/next-16) — Next.js 16 release notes re: proxy.ts
- [Vercel Build Configuration](https://vercel.com/docs/build-step) — `vercel-build` script documentation
