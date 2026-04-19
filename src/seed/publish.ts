/**
 * Publish a blog post from `content/blog/<slug>/` to Payload.
 *
 * Usage:
 *   pnpm publish:post --slug <slug>           # publish one post
 *   pnpm publish:post --all                   # publish every folder under content/blog/
 *   pnpm publish:post --slug <slug> --draft   # force _status: draft (overrides front-matter)
 *   pnpm publish:post --slug <slug> --dry-run # print resolved data, no DB writes
 *
 * Expects:
 *   content/blog/<slug>/en.md      required
 *   content/blog/<slug>/pt.md      optional (adds PT locale)
 *   content/blog/<slug>/cover.*    optional (jpg|jpeg|png|webp|gif|avif)
 *
 * The slug is the folder name. Cover images are deduped by SHA-256 content hash,
 * so re-running with the same image reuses the existing Media doc.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import config from "@payload-config";
import { convertMarkdownToLexical, editorConfigFactory } from "@payloadcms/richtext-lexical";
import { getPayload, type Field, type Payload, type RichTextField } from "payload";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTENT_ROOT = path.resolve(__dirname, "../../content/blog");
const COVER_EXTS = ["jpg", "jpeg", "png", "webp", "gif", "avif"] as const;
const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

type EnFrontMatter = {
  title: string;
  description: string;
  publishedDate: string;
  status: "draft" | "published";
  tags?: string[];
  featured?: boolean;
  coverAlt?: string;
};

type PtFrontMatter = {
  title: string;
  description: string;
  coverAlt?: string;
};

type CliArgs = {
  slug?: string;
  all: boolean;
  draft: boolean;
  dryRun: boolean;
};

// ─── CLI parsing ──────────────────────────────────────────────────────────

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { all: false, draft: false, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case "--slug":
        args.slug = argv[++i];
        if (!args.slug) throw new Error("--slug requires a value");
        break;
      case "--all":
        args.all = true;
        break;
      case "--draft":
        args.draft = true;
        break;
      case "--dry-run":
        args.dryRun = true;
        break;
      case "--help":
      case "-h":
        printHelp();
        process.exit(0);
        break;
      default:
        throw new Error(`Unknown argument: ${a}`);
    }
  }
  if (!args.slug && !args.all) {
    throw new Error("Must pass --slug <slug> or --all");
  }
  if (args.slug && args.all) {
    throw new Error("Pass either --slug or --all, not both");
  }
  return args;
}

function printHelp() {
  console.log(`pnpm publish:post — publish a blog post from content/blog/<slug>/ to Payload

Usage:
  pnpm publish:post --slug <slug>         Publish one post (content/blog/<slug>/)
  pnpm publish:post --all                 Publish every post folder
  pnpm publish:post --slug <slug> --draft   Force _status to draft
  pnpm publish:post --slug <slug> --dry-run Print resolved data, no DB writes

The slug is the folder name under content/blog/.`);
}

// ─── Front-matter parser ─────────────────────────────────────────────────
// Handles: quoted/unquoted strings, booleans, numbers, inline arrays ([a, b]),
// and block arrays (key:\n  - a\n  - b). Sufficient for our schema.

function parseFrontMatter(raw: string): { data: Record<string, unknown>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)/.exec(raw);
  if (!match) return { data: {}, body: raw };
  const fmRaw = match[1];
  const body = match[2];
  const data: Record<string, unknown> = {};
  const lines = fmRaw.split(/\r?\n/);
  let currentKey: string | null = null;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, "");
    if (!line.trim()) {
      currentKey = null;
      continue;
    }

    const blockItem = /^\s+-\s+(.+)$/.exec(line);
    if (blockItem && currentKey) {
      const arr = data[currentKey];
      if (Array.isArray(arr)) arr.push(parseScalar(blockItem[1].trim()));
      continue;
    }

    const kv = /^([A-Za-z_][\w]*)\s*:\s*(.*)$/.exec(line);
    if (!kv) {
      currentKey = null;
      continue;
    }
    const key = kv[1];
    const rawVal = kv[2].trim();

    if (rawVal === "") {
      data[key] = [];
      currentKey = key;
      continue;
    }

    data[key] = parseValue(rawVal);
    currentKey = null;
  }

  return { data, body };
}

function parseValue(v: string): unknown {
  if (v.startsWith("[") && v.endsWith("]")) {
    const inner = v.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(",").map((s) => parseScalar(s.trim()));
  }
  return parseScalar(v);
}

function parseScalar(v: string): unknown {
  const commentIdx = v.search(/\s#/);
  const t = (commentIdx >= 0 ? v.slice(0, commentIdx) : v).trim();
  if (t === "true") return true;
  if (t === "false") return false;
  if (/^-?\d+$/.test(t)) return Number.parseInt(t, 10);
  if (/^-?\d*\.\d+$/.test(t)) return Number.parseFloat(t);
  return t.replace(/^["']|["']$/g, "");
}

// ─── Front-matter validation ─────────────────────────────────────────────

function validateEn(slug: string, d: Record<string, unknown>): EnFrontMatter {
  const str = (key: string): string => {
    const v = d[key];
    if (typeof v !== "string" || !v.trim()) {
      throw new Error(`[${slug}] en.md: missing or empty required field "${key}"`);
    }
    return v;
  };

  const title = str("title");
  const description = str("description");
  const publishedDate = str("publishedDate");
  const status = str("status");

  if (status !== "draft" && status !== "published") {
    throw new Error(`[${slug}] en.md: status must be "draft" or "published" (got "${status}")`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedDate)) {
    throw new Error(`[${slug}] en.md: publishedDate must be YYYY-MM-DD (got "${publishedDate}")`);
  }

  const out: EnFrontMatter = { title, description, publishedDate, status };

  if (d.tags !== undefined) {
    if (!Array.isArray(d.tags)) {
      throw new Error(`[${slug}] en.md: tags must be an array`);
    }
    out.tags = d.tags.map((t) => String(t)).filter((t) => t.length > 0);
  }
  if (typeof d.featured === "boolean") out.featured = d.featured;
  if (typeof d.coverAlt === "string" && d.coverAlt.trim()) out.coverAlt = d.coverAlt;

  return out;
}

function validatePt(slug: string, d: Record<string, unknown>): PtFrontMatter {
  const str = (key: string): string => {
    const v = d[key];
    if (typeof v !== "string" || !v.trim()) {
      throw new Error(`[${slug}] pt.md: missing or empty required field "${key}"`);
    }
    return v;
  };

  const out: PtFrontMatter = { title: str("title"), description: str("description") };
  if (typeof d.coverAlt === "string" && d.coverAlt.trim()) out.coverAlt = d.coverAlt;
  return out;
}

// ─── Unresolved-marker guard ─────────────────────────────────────────────
// Refuses to publish when a draft still carries authoring tags that are
// meant to be resolved before the post ships:
//   <placeholder>...</placeholder>   author-written prose the LLM must not fill
//   <verify>...</verify>             unverified factual claim
// Both use the same HTML-tag shape on purpose: one grep pattern, one visual
// signal, one guard. Dry-run prints a warning and continues so the author can
// still preview the Lexical conversion while iterating.

type MarkerHit = { line: number; snippet: string };

function scanMarkers(body: string): MarkerHit[] {
  const hits: MarkerHit[] = [];
  const lines = body.split(/\r?\n/);
  const pattern = /<(?:placeholder|verify)\b/i;
  for (let i = 0; i < lines.length; i++) {
    if (pattern.test(lines[i])) {
      hits.push({ line: i + 1, snippet: lines[i].trim().slice(0, 120) });
    }
  }
  return hits;
}

function reportMarkers(slug: string, file: string, hits: MarkerHit[]): string {
  const header = `[${slug}] ${file}: ${hits.length} unresolved marker${hits.length === 1 ? "" : "s"} found`;
  const body = hits.map((h) => `    line ${h.line}: ${h.snippet}`).join("\n");
  return `${header}\n${body}`;
}

function checkUnresolvedMarkers(
  slug: string,
  enRaw: string,
  ptRaw: string | null,
  dryRun: boolean,
): void {
  const reports: string[] = [];
  const enHits = scanMarkers(enRaw);
  if (enHits.length > 0) reports.push(reportMarkers(slug, "en.md", enHits));
  if (ptRaw !== null) {
    const ptHits = scanMarkers(ptRaw);
    if (ptHits.length > 0) reports.push(reportMarkers(slug, "pt.md", ptHits));
  }
  if (reports.length === 0) return;

  const joined = reports.join("\n");
  if (dryRun) {
    console.warn(`  ⚠️  Unresolved markers (dry-run continues):\n${joined}`);
    return;
  }
  throw new Error(
    `Unresolved markers present — resolve them before publishing, or re-run with --dry-run to preview:\n${joined}`,
  );
}

// ─── Cover image discovery ────────────────────────────────────────────────

function findCover(postDir: string): { filePath: string; ext: string } | null {
  for (const ext of COVER_EXTS) {
    const p = path.join(postDir, `cover.${ext}`);
    if (fs.existsSync(p)) return { filePath: p, ext };
  }
  return null;
}

// ─── Cover image upsert (dedupe by SHA-256) ──────────────────────────────

async function upsertCover(
  payload: Payload,
  enFm: EnFrontMatter,
  ptFm: PtFrontMatter | null,
  cover: { filePath: string; ext: string },
  dryRun: boolean,
): Promise<number | string | null> {
  if (!enFm.coverAlt) {
    throw new Error(`coverAlt is required in en.md when a cover.* file exists`);
  }

  const bytes = fs.readFileSync(cover.filePath);
  const hash = crypto.createHash("sha256").update(bytes).digest("hex").slice(0, 8);
  const filename = `cover-${hash}.${cover.ext}`;

  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    depth: 0,
    limit: 1,
    overrideAccess: true,
  });

  if (existing.totalDocs > 0) {
    const id = existing.docs[0].id;
    console.log(`    📎 Cover already uploaded: ${filename} (id: ${id})`);
    return id;
  }

  if (dryRun) {
    console.log(`    📎 [DRY-RUN] Would upload cover: ${filename} (alt="${enFm.coverAlt}")`);
    return null;
  }

  const mimetype = MIME_BY_EXT[cover.ext] ?? "application/octet-stream";
  const created = await payload.create({
    collection: "media",
    locale: "en",
    data: { alt: enFm.coverAlt },
    file: { data: bytes, mimetype, name: filename, size: bytes.byteLength },
    overrideAccess: true,
  });
  console.log(`    📎 Uploaded cover: ${filename} (id: ${created.id})`);

  if (ptFm?.coverAlt) {
    await payload.update({
      collection: "media",
      id: created.id,
      locale: "pt",
      data: { alt: ptFm.coverAlt },
      depth: 0,
      overrideAccess: true,
    });
  }

  return created.id;
}

// ─── Publish one slug ─────────────────────────────────────────────────────

async function publishOne(payload: Payload, slug: string, args: CliArgs): Promise<void> {
  const postDir = path.join(CONTENT_ROOT, slug);
  if (!fs.existsSync(postDir) || !fs.statSync(postDir).isDirectory()) {
    throw new Error(`Post folder not found: ${postDir}`);
  }

  const enPath = path.join(postDir, "en.md");
  if (!fs.existsSync(enPath)) throw new Error(`[${slug}] en.md not found`);

  const enRaw = fs.readFileSync(enPath, "utf-8");
  const { data: enData, body: enBody } = parseFrontMatter(enRaw);
  const enFm = validateEn(slug, enData);

  const ptPath = path.join(postDir, "pt.md");
  let ptFm: PtFrontMatter | null = null;
  let ptBody: string | null = null;
  let ptRaw: string | null = null;
  if (fs.existsSync(ptPath)) {
    ptRaw = fs.readFileSync(ptPath, "utf-8");
    const parsed = parseFrontMatter(ptRaw);
    ptFm = validatePt(slug, parsed.data);
    ptBody = parsed.body;
  }

  checkUnresolvedMarkers(slug, enRaw, ptRaw, args.dryRun);

  const cover = findCover(postDir);
  const coverId = cover ? await upsertCover(payload, enFm, ptFm, cover, args.dryRun) : null;

  const editorConfig = editorConfigFactory.fromField({ field: getPostsContentField(payload) });
  const enContent = convertMarkdownToLexical({ editorConfig, markdown: enBody });
  const ptContent =
    ptBody !== null ? convertMarkdownToLexical({ editorConfig, markdown: ptBody }) : null;

  const effectiveStatus: "draft" | "published" = args.draft ? "draft" : enFm.status;

  const enPayload = {
    title: enFm.title,
    slug,
    description: enFm.description,
    content: enContent,
    tags: (enFm.tags ?? []).map((tag) => ({ tag })),
    publishedDate: enFm.publishedDate,
    featured: enFm.featured ?? false,
    coverImage: coverId,
    _status: effectiveStatus,
  };

  if (args.dryRun) {
    console.log(`    📝 [DRY-RUN] EN upsert payload:`);
    console.log(JSON.stringify(enPayload, null, 2));
    if (ptFm && ptContent) {
      console.log(`    📝 [DRY-RUN] PT update payload:`);
      console.log(
        JSON.stringify(
          { title: ptFm.title, description: ptFm.description, content: ptContent },
          null,
          2,
        ),
      );
    }
    return;
  }

  const existing = await payload.find({
    collection: "posts",
    where: { slug: { equals: slug } },
    depth: 0,
    limit: 1,
    overrideAccess: true,
  });

  let postId: number | string;
  if (existing.totalDocs > 0) {
    const doc = existing.docs[0];
    await payload.update({
      collection: "posts",
      id: doc.id,
      locale: "en",
      data: enPayload,
      depth: 0,
      overrideAccess: true,
      context: { disableRevalidate: true },
    });
    postId = doc.id;
    console.log(`  ✅ Updated: ${slug} (id: ${postId}, status: ${effectiveStatus})`);
  } else {
    const created = await payload.create({
      collection: "posts",
      locale: "en",
      data: enPayload,
      depth: 0,
      overrideAccess: true,
      context: { disableRevalidate: true },
    });
    postId = created.id;
    console.log(`  ✅ Created: ${slug} (id: ${postId}, status: ${effectiveStatus})`);
  }

  if (ptFm && ptContent) {
    try {
      await payload.update({
        collection: "posts",
        id: postId,
        locale: "pt",
        data: { title: ptFm.title, description: ptFm.description, content: ptContent },
        depth: 0,
        overrideAccess: true,
        context: { disableRevalidate: true },
      });
      console.log(`  🌐 PT locale updated`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`  ⚠️  PT update failed (EN is still correct): ${msg}`);
    }
  }
}

// ─── Editor config lookup ─────────────────────────────────────────────────
// `editorConfigFactory.default` builds a pristine default config and ignores
// custom features like `LexicalCodeFeature`. Read the sanitized editor config
// off the actual Posts `content` field so `convertMarkdownToLexical` sees all
// registered features (including our fenced-code markdown transformer).

function getPostsContentField(payload: Payload): RichTextField {
  const posts = payload.config.collections.find((c) => c.slug === "posts");
  if (!posts) throw new Error("posts collection not found in payload.config");
  const field = (posts.fields as Field[]).find(
    (f): f is RichTextField => "name" in f && f.name === "content" && f.type === "richText",
  );
  if (!field) throw new Error("Posts: content richText field not found");
  return field;
}

// ─── Slug discovery ───────────────────────────────────────────────────────

function listSlugs(): string[] {
  if (!fs.existsSync(CONTENT_ROOT)) return [];
  return fs
    .readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("."))
    .map((d) => d.name)
    .sort();
}

// ─── Entrypoint ───────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const slugs = args.all ? listSlugs() : [args.slug!];

  if (slugs.length === 0) {
    console.log(`No post folders found under ${CONTENT_ROOT}`);
    process.exit(0);
  }

  console.log(
    `📢 Publishing ${slugs.length} post${slugs.length === 1 ? "" : "s"}${
      args.dryRun ? " (dry-run)" : ""
    }...`,
  );

  const payload = await getPayload({ config });

  let ok = 0;
  let failed = 0;
  for (const slug of slugs) {
    console.log(`\n🟦 ${slug}`);
    try {
      await publishOne(payload, slug, args);
      ok++;
    } catch (err) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ❌ ${slug}: ${msg}`);
      if (!args.all) {
        console.error(`\n❌ Publish failed.`);
        process.exit(1);
      }
    }
  }

  console.log(`\n📊 Done: ${ok} succeeded, ${failed} failed.`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(`\n❌ Publish failed:`, err);
  process.exit(1);
});
