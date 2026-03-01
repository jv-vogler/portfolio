---
goal: Integrate PayloadCMS to manage Blog, Portfolio, and Skills content
version: 1.0
date_created: 2026-02-28
last_updated: 2026-03-01
owner: JV Vogler
status: 'In Progress'
tags:
  - feature
  - architecture
  - migration
  - cms
---

# Introduction

![Status: In Progress](https://img.shields.io/badge/status-In%20Progress-yellow)

Replace the static/file-based content system (MDX blog posts, hardcoded portfolio items, hardcoded skills) with PayloadCMS — a Next.js-native, TypeScript-first headless CMS. PayloadCMS runs inside the existing Next.js application, provides an admin panel at `/admin`, and exposes a Local API for type-safe server-side data fetching. The blog is the highest-priority migration target, followed by portfolio and skills/technologies.

**Current state:**

- Blog: MDX files in `content/blog/{locale}/`, parsed with `gray-matter` + `next-mdx-remote`
- Portfolio: Hardcoded array in `src/core/portfolio.ts` with translation keys in `next-intl` message files
- Skills: Hardcoded array in `src/core/skills.ts` with translation keys in `next-intl` message files
- Internationalization: `next-intl` with `en` and `pt` locales

**Target state:**

- All dynamic content managed through PayloadCMS admin panel at `/admin`
- Blog posts authored with Payload's Lexical rich text editor (with localized content)
- Portfolio items managed as a Payload collection (with localized title/description)
- Skills/technologies managed as a Payload collection
- Existing frontend components adapted to consume Payload data via the Local API
- Existing `next-intl` still handles UI chrome translations (navigation, labels, etc.)

## 1. Requirements & Constraints

- **REQ-001**: PayloadCMS must run inside the existing Next.js 16 application (not as a separate service)
- **REQ-002**: Admin panel must be accessible at `/admin` (outside the `[locale]` route group)
- **REQ-003**: Blog collection must support Payload's built-in localization for `en` and `pt` locales
- **REQ-004**: Blog posts must support rich text content via the Lexical editor (replacing MDX)
- **REQ-005**: Blog posts must have fields: `title`, `slug`, `description`, `content` (richText), `tags`, `published` (status), `publishedDate`
- **REQ-006**: Portfolio collection must support localized `title` and `description` fields
- **REQ-007**: Portfolio items must have fields: `slug`, `thumbnail` (upload/media), `techs` (relationship to skills), `demoUrl`, `codeUrl`, `featured`, `caseStudy` (localized rich text group)
- **REQ-008**: Skills collection must have fields: `slug`, `name` (localized), `category` (select: frontend/backend/tools)
- **REQ-009**: A Media collection must handle image uploads (portfolio thumbnails, blog images)
- **REQ-010**: A Users collection must provide admin authentication
- **REQ-011**: Existing `next-intl` must continue to handle all UI chrome translations (headers, labels, navigation, etc.)
- **REQ-012**: All existing frontend routes (`/[locale]/blog`, `/[locale]/blog/[slug]`, `/[locale]/portfolio/[slug]`) must continue to work
- **REQ-013**: `generateStaticParams` must be updated to fetch from Payload Local API
- **REQ-014**: All data fetching must use Payload's Local API (`getPayload` + `payload.find`/`payload.findByID`) in server components and server actions
- **REQ-015**: Type safety must be maintained by using Payload's generated types (`payload-types.ts`)
- **REQ-016**: Existing blog content (2 MDX posts) must be migrated to Payload via seed script
- **REQ-017**: Existing portfolio items (9 projects) and skills (12 items) must be migrated via seed script

- **SEC-001**: Admin panel must require authentication (Payload Users collection)
- **SEC-002**: All public-facing data access must use `overrideAccess: true` (trusted server-side reads) or appropriately scoped access control

- **CON-001**: Must use PostgreSQL via `@payloadcms/db-postgres` (Vercel Postgres / Neon compatible for deployment)
- **CON-002**: Must not break the existing `next-intl` middleware matcher — Payload admin routes must be excluded
- **CON-003**: The layered architecture (`core` → `lib` → `app/actions` → `ui`) must be preserved. Payload data access goes through `app/actions` or direct server-component calls
- **CON-004**: The `content/blog/` MDX directory can be removed after migration is verified
- **CON-005**: Payload must be configured with `localization` matching the existing `en`/`pt` locale setup

- **GUD-001**: Use Payload's `slugField()` pattern or a `beforeChange` hook to auto-generate slugs from titles
- **GUD-002**: Use Payload's `versions: { drafts: true }` for blog posts to support draft/publish workflow
- **GUD-003**: Use `afterChange` hooks with `revalidatePath`/`revalidateTag` for on-demand ISR when content changes in the admin
- **GUD-004**: Keep Payload collections in `src/collections/` directory
- **GUD-005**: Keep Payload globals (if any) in `src/globals/` directory
- **GUD-006**: Store `payload.config.ts` at `src/payload.config.ts`
- **GUD-007**: Use `@payloadcms/richtext-lexical` as the rich text editor
- **GUD-008**: Use `@payloadcms/storage-vercel-blob` or local disk storage for media in production/dev respectively

- **PAT-001**: Follow Payload's recommended Next.js project structure with `(frontend)` and `(payload)` route groups
- **PAT-002**: Thread `req` through all nested Payload operations in hooks to maintain transaction atomicity
- **PAT-003**: Use `context` flags in hooks to prevent infinite loops

## 2. Implementation Steps

### Phase 1: PayloadCMS Installation & Configuration

- GOAL-001: Install PayloadCMS and all required adapters/plugins, create the base configuration file, and set up the admin panel route.

| Task     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Completed                                                                                                              | Date       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------- |
| TASK-001 | Install dependencies: `payload`, `@payloadcms/next`, `@payloadcms/richtext-lexical`, `@payloadcms/db-postgres`, `@payloadcms/storage-vercel-blob` (or `@payloadcms/storage-local` for dev), `sharp`, `graphql`. Run: `pnpm add payload @payloadcms/next @payloadcms/richtext-lexical @payloadcms/db-postgres sharp graphql`                                                                                                                                                                                                                                            | ✅ (used `@payloadcms/db-vercel-postgres` + `@payloadcms/storage-vercel-blob` instead of `db-postgres`)                | 2026-02-28 |
| TASK-002 | Create `src/payload.config.ts` with `buildConfig()`: configure `db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL } })`, `editor: lexicalEditor()`, `secret: process.env.PAYLOAD_SECRET`, `typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') }`, `admin: { user: 'users', importMap: { baseDir: path.resolve(dirname) } }`, `localization: { locales: [{ label: 'English', code: 'en' }, { label: 'Português', code: 'pt' }], defaultLocale: 'en', fallback: true }`. Import collections (Users, Media — created in Phase 2). | ✅ (uses `vercelPostgresAdapter` + `POSTGRES_URL`; added `importMapFile` explicit path and `serverFunction` to layout) | 2026-02-28 |
| TASK-003 | Create Payload admin catch-all route at `src/app/(payload)/admin/[[...segments]]/page.tsx` that re-exports from `@payloadcms/next/views`. Create `src/app/(payload)/admin/[[...segments]]/not-found.tsx` re-exporting `NotFoundPage`. Create `src/app/(payload)/layout.tsx` importing `@payloadcms/next/layouts` `RootLayout` with `importMap` and `config`.                                                                                                                                                                                                           | ✅                                                                                                                     | 2026-02-28 |
| TASK-004 | Create Payload API routes at `src/app/(payload)/api/[...slug]/route.ts` re-exporting REST handlers and `src/app/(payload)/api/graphql/route.ts` if GraphQL is desired.                                                                                                                                                                                                                                                                                                                                                                                                 | ✅                                                                                                                     | 2026-02-28 |
| TASK-005 | Add `@payload-config` path alias to `tsconfig.json` under `compilerOptions.paths`: `"@payload-config": ["./src/payload.config.ts"]`.                                                                                                                                                                                                                                                                                                                                                                                                                                   | ✅                                                                                                                     | 2026-02-28 |
| TASK-006 | Update `next.config.ts` to use `withPayload` from `@payloadcms/next/withPayload` wrapping the existing `withNextIntl` config chain. The final export becomes `export default withPayload(withNextIntl(nextConfig))`.                                                                                                                                                                                                                                                                                                                                                   | ✅                                                                                                                     | 2026-02-28 |
| TASK-007 | Update `src/middleware.ts` to exclude Payload admin and API routes from `next-intl` middleware. Change the matcher to: `["/", "/(en\|pt)/:path*", "/((?!api\|admin\|_next\|_vercel\|.*\\..*).*)"]` or add a condition in the middleware function to skip requests starting with `/admin` or `/api`.                                                                                                                                                                                                                                                                    | ✅ (renamed to `src/proxy.ts` per Next.js 16 convention; matcher updated)                                              | 2026-03-01 |
| TASK-008 | Add environment variables to `.env` (and `.env.example`): `DATABASE_URL` (Postgres connection string), `PAYLOAD_SECRET` (random 32+ char string).                                                                                                                                                                                                                                                                                                                                                                                                                      | ✅ (uses `POSTGRES_URL` from Neon; all vars synced via `vercel env pull`)                                              | 2026-03-01 |
| TASK-009 | Add `src/app/(payload)/custom.scss` if admin theme customization is needed (optional, can defer).                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | ✅                                                                                                                     | 2026-02-28 |
| TASK-010 | Run `pnpm dev` to verify Payload admin loads at `http://localhost:3000/admin`, creates the database tables, and generates `src/payload-types.ts`. Verify existing frontend routes still render correctly.                                                                                                                                                                                                                                                                                                                                                              | ✅ (`/admin` 200, `/en` 200, `/pt` 200; DB schema pulled from Neon; importMap auto-generated)                          | 2026-03-01 |

### Phase 2: Core Collections (Users & Media)

- GOAL-002: Create the foundational Users and Media collections required by Payload for authentication and file uploads.

| Task     | Description                                                                                                                                                                                                                                                                                                                                                         | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-011 | Create `src/collections/Users.ts`: `CollectionConfig` with `slug: 'users'`, `auth: true`, `admin: { useAsTitle: 'email' }`, fields: `[{ name: 'name', type: 'text' }]`. Access: admin-only for create/update/delete; read allowed for authenticated users.                                                                                                          |           |      |
| TASK-012 | Create `src/collections/Media.ts`: `CollectionConfig` with `slug: 'media'`, `upload: { staticDir: path.resolve(dirname, '../../public/media'), mimeTypes: ['image/*'], imageSizes: [{ name: 'thumbnail', width: 400 }, { name: 'card', width: 768 }, { name: 'hero', width: 1400 }] }`, fields: `[{ name: 'alt', type: 'text', required: true, localized: true }]`. |           |      |
| TASK-013 | Register `Users` and `Media` collections in `src/payload.config.ts` under `collections: [Users, Media]`.                                                                                                                                                                                                                                                            |           |      |
| TASK-014 | Run `pnpm dev`, verify admin panel shows Users and Media collections, create a test admin user at `/admin`.                                                                                                                                                                                                                                                         |           |      |

### Phase 3: Blog Collection & Data Layer

- GOAL-003: Create the Blog Posts collection in Payload, replace the MDX-based data layer with Payload Local API calls, and update all blog-related server actions and core types.

| Task     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Completed | Date |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-015 | Create `src/collections/Posts.ts`: `CollectionConfig` with `slug: 'posts'`, `admin: { useAsTitle: 'title', defaultColumns: ['title', 'status', 'publishedDate', 'updatedAt'] }`, `versions: { drafts: true }`, `fields`: `title` (text, required, localized), `slug` (text, unique, index, admin.position: 'sidebar'), `description` (textarea, required, localized), `content` (richText/lexical, required, localized), `tags` (array of text fields, or alternatively a relationship to a Tags collection), `publishedDate` (date, required, admin.position: 'sidebar'), `status` (select: 'draft'/'published', defaultValue: 'draft'). |           |      |
| TASK-016 | Add `beforeChange` hook to `Posts` collection that auto-generates `slug` from `title` on create if slug is empty (using a slugify utility).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |           |      |
| TASK-017 | Add `afterChange` hook to `Posts` collection that calls `revalidatePath('/[locale]/blog')` and `revalidatePath('/[locale]/blog/[slug]')` for both locales when a post is created/updated/deleted, using `context` flag to prevent loops.                                                                                                                                                                                                                                                                                                                                                                                                  |           |      |
| TASK-018 | Register `Posts` collection in `src/payload.config.ts`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |           |      |
| TASK-019 | Update `src/core/blog.ts`: Keep the `Blog` namespace and types but update `Blog.Post` to align with Payload's generated type. Add a mapping function `fromPayload(doc: PayloadPost): Blog.Post` that maps Payload document shape to the existing `Blog.Post` interface. Keep `sortByDate` and `filterPublished` utility functions. The `Blog.Post` type should remain: `{ slug, title, description, date, tags, published, locale }`.                                                                                                                                                                                                     |           |      |
| TASK-020 | Rewrite `src/app/actions/blog.ts`: Replace `getPostSlugs`/`getPostBySlug` imports with Payload Local API calls. `getAllPosts(locale)` → `const payload = await getPayload({ config }); const { docs } = await payload.find({ collection: 'posts', locale, where: { status: { equals: 'published' } }, sort: '-publishedDate', limit: 100 }); return docs.map(Blog.fromPayload)`. `getPost(slug, locale)` → `const { docs } = await payload.find({ collection: 'posts', locale, where: { slug: { equals: slug } }, limit: 1 }); return { post: Blog.fromPayload(docs[0]), content: docs[0].content }`.                                     |           |      |
| TASK-021 | Update `src/ui/blog/components/BlogPost.tsx`: Replace `MDXRemote` rendering with Payload's Lexical rich text serializer. Install and use `@payloadcms/richtext-lexical/react` `RichText` component to render the serialized Lexical content. The component signature changes from `{ content: string }` to `{ content: SerializedEditorState }` (or the appropriate Payload rich text type).                                                                                                                                                                                                                                              |           |      |
| TASK-022 | Update `src/app/[locale]/blog/page.tsx`: No changes to the component structure (it already calls `getAllPosts` and passes to `BlogList`). Verify it compiles with the updated action.                                                                                                                                                                                                                                                                                                                                                                                                                                                     |           |      |
| TASK-023 | Update `src/app/[locale]/blog/[slug]/page.tsx`: Update `generateStaticParams` to fetch all post slugs from Payload. Update the page to handle Lexical rich text `content` instead of raw MDX string. Pass the Payload rich text content object to `BlogPost` component.                                                                                                                                                                                                                                                                                                                                                                   |           |      |
| TASK-024 | Remove or deprecate `src/lib/mdx.ts` (the MDX file reader). Remove the `gray-matter` and `next-mdx-remote` dependencies: `pnpm remove gray-matter next-mdx-remote`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |           |      |
| TASK-025 | Verify blog list page, individual blog post pages, and blog metadata/OG tags all render correctly with Payload data. Test both `en` and `pt` locales.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |           |      |

### Phase 4: Blog Content Migration (Seed Script)

- GOAL-004: Migrate existing MDX blog content to Payload via a seed script, ensuring no content is lost.

| Task     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Completed | Date |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-026 | Create `src/seed/blog.ts`: A script that reads the existing MDX files from `content/blog/en/` and `content/blog/pt/`, parses frontmatter with `gray-matter`, converts MDX body content to Lexical JSON format (using `@payloadcms/richtext-lexical` utilities or manual conversion for simple markdown), and inserts each post into Payload using the Local API `payload.create({ collection: 'posts', locale: 'en', data: { ... } })` then `payload.update({ collection: 'posts', locale: 'pt', id, data: { ... } })` for the Portuguese version. |           |      |
| TASK-027 | Create `src/seed/index.ts`: Main seed entry point that initializes Payload with `getPayload({ config })`, runs all seed functions (blog first, then portfolio/skills in later phases), and logs results.                                                                                                                                                                                                                                                                                                                                           |           |      |
| TASK-028 | Add a `seed` script to `package.json`: `"seed": "tsx src/seed/index.ts"` (install `tsx` as devDependency if not present).                                                                                                                                                                                                                                                                                                                                                                                                                          |           |      |
| TASK-029 | Run the seed script, verify all 2 blog posts (hello-world, building-a-layered-frontend-architecture) appear in the Payload admin panel with correct content in both locales.                                                                                                                                                                                                                                                                                                                                                                       |           |      |
| TASK-030 | After verification, remove `content/blog/` directory (or move to `content/blog.archive/` for safety).                                                                                                                                                                                                                                                                                                                                                                                                                                              |           |      |

### Phase 5: Portfolio Collection & Data Layer

- GOAL-005: Create the Portfolio collection in Payload, migrate the hardcoded portfolio items, and update the frontend data layer.

| Task     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-031 | Create `src/collections/Projects.ts`: `CollectionConfig` with `slug: 'projects'`, `admin: { useAsTitle: 'title' }`, fields: `title` (text, required, localized), `slug` (text, unique, index), `description` (textarea, required, localized), `thumbnail` (upload, relationTo: 'media'), `techs` (array of text fields, or relationship to 'skills' collection), `demoUrl` (text, optional), `codeUrl` (text, optional), `featured` (checkbox, defaultValue: false), `caseStudy` (group, localized, fields: `enabled` (checkbox), `problem` (textarea, localized), `approach` (textarea, localized), `outcome` (textarea, localized), `learnings` (textarea, localized)). |           |      |
| TASK-032 | Register `Projects` collection in `src/payload.config.ts`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |           |      |
| TASK-033 | Update `src/core/portfolio.ts`: Remove the hardcoded `items` array. Keep the `Portfolio` namespace and `Project` type. Add a `fromPayload(doc)` mapping function. The `Project` type may need to be updated to reference media objects instead of thumbnail filename strings.                                                                                                                                                                                                                                                                                                                                                                                             |           |      |
| TASK-034 | Create `src/app/actions/portfolio.ts`: `getAllProjects(locale)` and `getProject(slug, locale)` functions using Payload Local API to fetch from the 'projects' collection.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |           |      |
| TASK-035 | Update `src/ui/portfolio/components/Portfolio.tsx`: Change from importing hardcoded `Portfolio.items` to receiving projects as props or fetching via a server component wrapper. Since this is a `'use client'` component, create a server wrapper `src/app/[locale]/_sections/PortfolioSection.tsx` that fetches data and passes it as props, or convert the home page to pass projects from the server.                                                                                                                                                                                                                                                                 |           |      |
| TASK-036 | Update `src/ui/portfolio/components/ProjectCard.tsx`: Update to work with Payload Project type (notably `thumbnail` becomes a media object with `url` instead of a filename string).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |           |      |
| TASK-037 | Update `src/app/[locale]/portfolio/[slug]/page.tsx`: Replace `Portfolio.items.find()` with `getProject(slug, locale)` from the new action. Update `generateStaticParams` to fetch slugs from Payload. Update image rendering to use Payload media URL.                                                                                                                                                                                                                                                                                                                                                                                                                    |           |      |
| TASK-038 | Update `src/app/[locale]/page.tsx` (home page): If the `PortfolioSection` now needs server-fetched data, pass it through or use a server component wrapper.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |           |      |

### Phase 6: Portfolio Content Migration (Seed Script)

- GOAL-006: Migrate existing hardcoded portfolio data to Payload via seed script.

| Task     | Description                                                                                                                                                                                                                                                                                                                                                                                           | Completed | Date |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-039 | Extend `src/seed/portfolio.ts`: Read the 9 portfolio items from the old `Portfolio.items` data (can hardcode in the seed script or import from a snapshot). Upload thumbnail images from `public/images/portfolio/` to the Payload Media collection. Create project documents with localized title/description pulled from the existing `en.json` and `pt.json` message files' `portfolio` namespace. |           |      |
| TASK-040 | Add portfolio seed to `src/seed/index.ts`.                                                                                                                                                                                                                                                                                                                                                            |           |      |
| TASK-041 | Run seed script, verify all 9 projects appear in Payload admin with correct thumbnails, localized text, and case study data.                                                                                                                                                                                                                                                                          |           |      |

### Phase 7: Skills/Technologies Collection & Data Layer

- GOAL-007: Create the Skills collection in Payload, migrate the hardcoded skills data, and update the frontend.

| Task     | Description                                                                                                                                                                                                                                                                                                                        | Completed | Date |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-042 | Create `src/collections/Skills.ts`: `CollectionConfig` with `slug: 'skills'`, `admin: { useAsTitle: 'name' }`, fields: `name` (text, required, localized), `slug` (text, unique, index — used for icon lookup), `category` (select: 'frontend'/'backend'/'tools', required), `sortOrder` (number, optional — for manual ordering). |           |      |
| TASK-043 | Register `Skills` collection in `src/payload.config.ts`.                                                                                                                                                                                                                                                                           |           |      |
| TASK-044 | Update `src/core/skills.ts`: Remove hardcoded `items` array, keep namespace and types, add `fromPayload` mapping.                                                                                                                                                                                                                  |           |      |
| TASK-045 | Create `src/app/actions/skills.ts`: `getAllSkills(locale)` and `getSkillsByCategory(category, locale)` using Payload Local API.                                                                                                                                                                                                    |           |      |
| TASK-046 | Update `src/ui/experience/components/Experience.tsx`: Change from importing hardcoded `Skills.byCategory` to receiving data as props from a server component wrapper, or fetch in a parent server component.                                                                                                                       |           |      |
| TASK-047 | Extend `src/seed/skills.ts`: Insert the 12 skills with localized names from message files. Add skills seed to `src/seed/index.ts`.                                                                                                                                                                                                 |           |      |
| TASK-048 | Run seed, verify skills appear in admin and render correctly on the frontend in both locales.                                                                                                                                                                                                                                      |           |      |

### Phase 8: Portfolio Techs Relationship (Optional Enhancement)

- GOAL-008: Link portfolio project `techs` to the Skills collection via relationship fields instead of plain text arrays, enabling consistent tech data management.

| Task     | Description                                                                                                                                              | Completed | Date |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-049 | Update `Projects` collection: Change `techs` field from array-of-text to `{ name: 'techs', type: 'relationship', relationTo: 'skills', hasMany: true }`. |           |      |
| TASK-050 | Update portfolio seed script to look up skill IDs and create relationships.                                                                              |           |      |
| TASK-051 | Update `ProjectCard` and portfolio detail page to resolve tech names from the populated relationship.                                                    |           |      |

### Phase 9: Cleanup & Optimization

- GOAL-009: Remove deprecated code, optimize caching, and ensure production readiness.

| Task     | Description                                                                                                                                                                                                                                                                                    | Completed | Date |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-052 | Remove `content/blog/` directory after confirming all posts are in Payload.                                                                                                                                                                                                                    |           |      |
| TASK-053 | Remove `src/lib/mdx.ts` file.                                                                                                                                                                                                                                                                  |           |      |
| TASK-054 | Remove `gray-matter` and `next-mdx-remote` from `package.json` dependencies.                                                                                                                                                                                                                   |           |      |
| TASK-055 | Remove hardcoded portfolio items from `src/core/portfolio.ts` (keep only type definitions and utility functions).                                                                                                                                                                              |           |      |
| TASK-056 | Remove hardcoded skills items from `src/core/skills.ts` (keep only type definitions and utility functions).                                                                                                                                                                                    |           |      |
| TASK-057 | Clean up translation files (`en.json`, `pt.json`): Remove portfolio item-specific translation keys (title, description, caseStudy) since those are now in Payload. Keep UI chrome translations (heading, description, labels). Skill name translations can also be removed from message files. |           |      |
| TASK-058 | Add `revalidateTag` or `revalidatePath` calls in Payload `afterChange`/`afterDelete` hooks to ensure ISR works correctly when content is updated from admin panel.                                                                                                                             |           |      |
| TASK-059 | Test full build (`pnpm build`) succeeds with no TypeScript errors.                                                                                                                                                                                                                             |           |      |
| TASK-060 | Test all pages render correctly in both locales with Payload data.                                                                                                                                                                                                                             |           |      |
| TASK-061 | Verify Payload admin panel is functional: create, edit, delete posts/projects/skills; verify frontend updates accordingly.                                                                                                                                                                     |           |      |

### Phase 10: Deployment Configuration

- GOAL-010: Configure deployment for Vercel with Payload, including database and storage.

| Task     | Description                                                                                                                                                                                                            | Completed | Date |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-062 | Provision a PostgreSQL database (Vercel Postgres, Neon, or Supabase). Set `DATABASE_URL` environment variable in Vercel project settings.                                                                              |           |      |
| TASK-063 | Set `PAYLOAD_SECRET` environment variable in Vercel project settings.                                                                                                                                                  |           |      |
| TASK-064 | Configure media storage for production: either use `@payloadcms/storage-vercel-blob` with `BLOB_READ_WRITE_TOKEN` env var, or configure an S3-compatible adapter. Register the storage adapter in `payload.config.ts`. |           |      |
| TASK-065 | Deploy to Vercel, verify admin panel access at `https://domain.com/admin`, run seed script against production database, verify frontend renders with CMS data.                                                         |           |      |
| TASK-066 | (Optional) Add `PAYLOAD_PUBLIC_SERVER_URL` env var for correct admin URL generation in production.                                                                                                                     |           |      |

## 3. Alternatives

- **ALT-001**: **Use Payload as a separate service** — Rejected because Payload is Next.js-native and running it in the same app simplifies deployment, removes API latency, and enables Local API usage without network overhead.
- **ALT-002**: **Use MongoDB instead of PostgreSQL** — Rejected because Vercel Postgres (Neon) offers seamless integration with Vercel deployments. PostgreSQL is also more broadly supported and offers better relational query capabilities for future features.
- **ALT-003**: **Keep MDX for blog and only use Payload for portfolio/skills** — Rejected because a unified CMS provides a consistent authoring experience, enables non-technical editing, and simplifies the data layer. MDX is developer-only and doesn't scale for non-technical collaborators.
- **ALT-004**: **Use Payload's `richText` field with Slate editor** — Rejected because Lexical is Payload's default and recommended editor going forward, with better extensibility and maintenance support.
- **ALT-005**: **Use a separate Tags collection with relationships** — Deferred (can be added later). Simple array-of-text for tags is sufficient for the current blog scope and avoids over-engineering.
- **ALT-006**: **Use Sanity/Contentful/other external CMS** — Rejected because Payload is self-hosted, open-source, TypeScript-first, runs inside Next.js, and has no vendor lock-in or per-seat pricing.
- **ALT-007**: **Migrate content manually via admin panel instead of seed script** — Rejected because seed scripts are reproducible, automatable, and ensure consistent data across development/staging/production environments.
- **ALT-008**: **Convert Payload rich text to MDX at runtime** — Rejected because it adds unnecessary complexity. Using Payload's native Lexical renderer is simpler and more performant.

## 4. Dependencies

- **DEP-001**: `payload` (^3.x) — Core CMS framework
- **DEP-002**: `@payloadcms/next` — Next.js integration (admin routes, `withPayload`)
- **DEP-003**: `@payloadcms/richtext-lexical` — Lexical rich text editor
- **DEP-004**: `@payloadcms/db-vercel-postgres` — Vercel Postgres / Neon database adapter (replaces `@payloadcms/db-postgres`)
- **DEP-005**: `@payloadcms/storage-vercel-blob` — Vercel Blob storage adapter for media (production)
- **DEP-006**: `sharp` — Image processing (required by Payload for image resizing)
- **DEP-007**: `graphql` — Peer dependency for Payload
- **DEP-008**: PostgreSQL database instance (Vercel Postgres, Neon, or Supabase)
- **DEP-009**: `tsx` (devDependency) — For running seed scripts via `ts-node`-like execution

**Removed dependencies (after migration):**

- **DEP-R01**: `gray-matter` — No longer needed (MDX frontmatter parsing)
- **DEP-R02**: `next-mdx-remote` — No longer needed (MDX rendering)

## 5. Files

**New files:**

- **FILE-001**: `src/payload.config.ts` — Payload configuration (database, editor, localization, collections)
- **FILE-002**: `src/collections/Users.ts` — Users collection (admin auth)
- **FILE-003**: `src/collections/Media.ts` — Media collection (image uploads)
- **FILE-004**: `src/collections/Posts.ts` — Blog posts collection (localized, rich text, drafts)
- **FILE-005**: `src/collections/Projects.ts` — Portfolio projects collection (localized)
- **FILE-006**: `src/collections/Skills.ts` — Skills/technologies collection
- **FILE-007**: `src/app/(payload)/admin/[[...segments]]/page.tsx` — Payload admin page route
- **FILE-008**: `src/app/(payload)/admin/[[...segments]]/not-found.tsx` — Payload admin 404
- **FILE-009**: `src/app/(payload)/layout.tsx` — Payload admin layout
- **FILE-010**: `src/app/(payload)/api/[...slug]/route.ts` — Payload REST API route
- **FILE-011**: `src/seed/index.ts` — Main seed entry point
- **FILE-012**: `src/seed/blog.ts` — Blog content migration seed
- **FILE-013**: `src/seed/portfolio.ts` — Portfolio content migration seed
- **FILE-014**: `src/seed/skills.ts` — Skills content migration seed
- **FILE-015**: `src/payload-types.ts` — Auto-generated Payload types (generated by Payload)
- **FILE-016**: `src/app/actions/portfolio.ts` — Portfolio data actions (new)
- **FILE-017**: `src/app/actions/skills.ts` — Skills data actions (new)

**Modified files:**

- **FILE-M01**: `next.config.ts` — Add `withPayload` wrapper
- **FILE-M02**: `tsconfig.json` — Add `@payload-config` path alias
- **FILE-M03**: `src/proxy.ts` — Renamed from `src/middleware.ts` (Next.js 16 convention); excludes `/admin` and `/api` from `next-intl` routing
- **FILE-M04**: `src/core/blog.ts` — Add `fromPayload` mapping, keep types/utilities
- **FILE-M05**: `src/core/portfolio.ts` — Remove hardcoded items, add `fromPayload` mapping
- **FILE-M06**: `src/core/skills.ts` — Remove hardcoded items, add `fromPayload` mapping
- **FILE-M07**: `src/app/actions/blog.ts` — Replace MDX reads with Payload Local API calls
- **FILE-M08**: `src/ui/blog/components/BlogPost.tsx` — Replace `MDXRemote` with Lexical `RichText` renderer
- **FILE-M09**: `src/app/[locale]/blog/[slug]/page.tsx` — Update for Payload data shape (rich text content)
- **FILE-M10**: `src/app/[locale]/blog/page.tsx` — Minimal changes (verify compatibility)
- **FILE-M11**: `src/ui/portfolio/components/Portfolio.tsx` — Fetch from Payload instead of hardcoded array
- **FILE-M12**: `src/ui/portfolio/components/ProjectCard.tsx` — Handle Payload media objects for thumbnails
- **FILE-M13**: `src/app/[locale]/portfolio/[slug]/page.tsx` — Fetch from Payload API
- **FILE-M14**: `src/app/[locale]/page.tsx` — Pass server-fetched data to client sections
- **FILE-M15**: `src/ui/experience/components/Experience.tsx` — Consume Payload skills data
- **FILE-M16**: `package.json` — Add/remove dependencies, add seed script
- **FILE-M17**: `src/messages/en.json` — Remove portfolio/skills content translations (keep UI labels)
- **FILE-M18**: `src/messages/pt.json` — Remove portfolio/skills content translations (keep UI labels)

**Deleted files (after migration):**

- **FILE-D01**: `content/blog/en/hello-world.mdx`
- **FILE-D02**: `content/blog/en/building-a-layered-frontend-architecture.mdx`
- **FILE-D03**: `content/blog/pt/hello-world.mdx`
- **FILE-D04**: `content/blog/pt/building-a-layered-frontend-architecture.mdx`
- **FILE-D05**: `src/lib/mdx.ts`

## 6. Testing

- **TEST-001**: `pnpm build` completes without TypeScript errors
- **TEST-002**: Payload admin panel loads at `/admin` and allows login
- **TEST-003**: Can create, edit, and delete a blog post via admin panel in both locales
- **TEST-004**: Blog list page (`/en/blog`, `/pt/blog`) renders posts from Payload
- **TEST-005**: Blog post page (`/en/blog/[slug]`, `/pt/blog/[slug]`) renders Lexical rich text content correctly
- **TEST-006**: Blog post metadata (OG tags, title, description) are correct from Payload data
- **TEST-007**: Blog `generateStaticParams` produces correct params from Payload
- **TEST-008**: Portfolio section on home page renders projects from Payload
- **TEST-009**: Portfolio detail page (`/en/portfolio/[slug]`) renders project data from Payload
- **TEST-010**: Portfolio thumbnails display correctly from Payload media
- **TEST-011**: Skills/Experience section renders skills from Payload
- **TEST-012**: Localization works: switching locale shows correct translated content from Payload
- **TEST-013**: Draft posts do NOT appear on the public blog list
- **TEST-014**: Seed script runs successfully and populates all expected data
- **TEST-015**: Editing content in admin triggers ISR revalidation (pages update without rebuild)
- **TEST-016**: `next-intl` middleware correctly routes locale prefixed paths and does NOT intercept `/admin` or `/api` routes
- **TEST-017**: Media uploads work in admin panel (images appear in Media collection and can be assigned to projects)
- **TEST-018**: All existing SEO features (sitemap, robots, JSON-LD) remain functional
- **TEST-019**: Contact form (Resend integration) continues to work unaffected
- **TEST-020**: Navigation links work correctly between blog, portfolio, and home pages
- **TEST-021**: Production build deploys to Vercel with Payload functioning correctly

## 7. Risks & Assumptions

- **RISK-001**: Payload 3.x with Next.js 16 compatibility — Payload 3 targets Next.js 15. Next.js 16 may introduce breaking changes. **Mitigation**: Check Payload release notes and test thoroughly. If incompatible, consider pinning to a compatible Payload version or waiting for an update.
- **RISK-002**: Lexical rich text rendering may not match MDX styling perfectly — The existing MDX components have custom Tailwind classes. **Mitigation**: Create custom Lexical serializer components matching the existing styling, or apply Tailwind typography plugin to the rendered output.
- **RISK-003**: Database migration during deployment — Schema changes require running migrations. **Mitigation**: Use Payload's built-in migration system (`payload migrate`). Run migrations as part of the deployment pipeline.
- **RISK-004**: `next-intl` middleware conflict with Payload routes — Both systems want to handle routing. **Mitigation**: Carefully configure middleware matcher to exclude Payload routes. Use route groups `(payload)` and `(frontend)` to isolate concerns.
- **RISK-005**: Image migration complexity — Existing thumbnails are static files in `public/images/portfolio/`. Moving to Payload media requires uploading and re-linking. **Mitigation**: Seed script handles upload programmatically. Keep originals in `public/` as fallback during transition.
- **RISK-006**: Build time increase — Payload adds significant dependencies and build complexity. **Mitigation**: Use Turbopack for dev (`next dev --turbopack` already configured). Monitor build times and optimize if needed.

- **ASSUMPTION-001**: PostgreSQL database is available and accessible from the development environment and Vercel deployment
- **ASSUMPTION-002**: Payload 3.x stable release supports Next.js 16 (or a compatible version exists)
- **ASSUMPTION-003**: Lexical editor provides sufficient authoring capabilities for blog posts (code blocks, images, headings, lists, links)
- **ASSUMPTION-004**: The existing 2 blog posts can be adequately converted from MDX to Lexical format (limited complexity)
- **ASSUMPTION-005**: Vercel's serverless function limits are sufficient for Payload's admin panel and API
- **ASSUMPTION-006**: The `next-intl` middleware can be cleanly separated from Payload's route handling without conflicts

## 8. Related Specifications / Further Reading

- [Existing refactor plan](../plan/refactor-layered-architecture.md) — The layered architecture plan this builds upon
- [PayloadCMS Documentation](https://payloadcms.com/docs) — Official documentation
- [PayloadCMS GitHub](https://github.com/payloadcms/payload) — Source code and examples
- [PayloadCMS + Next.js Examples](https://github.com/payloadcms/payload/tree/main/examples) — Official integration examples
- [PayloadCMS Templates](https://github.com/payloadcms/payload/tree/main/templates) — Starter templates
- [Lexical Rich Text Editor](https://payloadcms.com/docs/rich-text/lexical) — Lexical editor documentation
- [Payload Localization](https://payloadcms.com/docs/configuration/localization) — Multi-language content setup
- [Payload + Vercel Deployment](https://payloadcms.com/docs/getting-started/deployment) — Deployment guide
- [next-intl Middleware Config](https://next-intl.dev/docs/routing/middleware) — Middleware configuration reference
