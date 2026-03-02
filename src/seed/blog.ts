import fs from "fs";
import path from "path";
import type { Payload } from "payload";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Minimal front-matter parser (gray-matter removed; this is dead-code since
// content/blog/ was deleted after initial migration — kept for reference)
// ---------------------------------------------------------------------------
function parseFrontMatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)/.exec(raw);
  if (!match) return { data: {}, content: raw };
  const data: Record<string, unknown> = {};
  for (const line of match[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const val = line
      .slice(colonIdx + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (key) data[key] = val;
  }
  return { data, content: match[2] };
}

// ---------------------------------------------------------------------------
// Lexical node builder helpers
// ---------------------------------------------------------------------------

type LexicalTextFormat = 0 | 1 | 2 | 4 | 8 | 16 | 32 | 64;

function textNode(text: string, format: LexicalTextFormat = 0) {
  return {
    type: "text" as const,
    text,
    format,
    detail: 0,
    mode: "normal" as const,
    style: "",
    version: 1,
  };
}

function linkNode(url: string, children: ReturnType<typeof textNode>[]) {
  return {
    type: "link" as const,
    url,
    rel: "noreferrer",
    target: "_blank",
    title: null,
    fields: { url, newTab: true, linkType: "custom" },
    children,
    direction: "ltr" as const,
    format: "" as const,
    indent: 0,
    version: 1,
  };
}

function paragraphNode(children: object[]) {
  return {
    type: "paragraph" as const,
    children,
    direction: "ltr" as const,
    format: "" as const,
    indent: 0,
    textFormat: 0,
    version: 1,
  };
}

function headingNode(tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6", children: object[]) {
  return {
    type: "heading" as const,
    tag,
    children,
    direction: "ltr" as const,
    format: "" as const,
    indent: 0,
    version: 1,
  };
}

function listNode(tag: "ul" | "ol", listType: "bullet" | "number", children: object[]) {
  return {
    type: "list" as const,
    tag,
    listType,
    start: 1,
    children,
    direction: "ltr" as const,
    format: "" as const,
    indent: 0,
    version: 1,
  };
}

function listItemNode(value: number, children: object[]) {
  return {
    type: "listitem" as const,
    value,
    children,
    direction: "ltr" as const,
    format: "" as const,
    indent: 0,
    version: 1,
  };
}

function codeNode(language: string, code: string) {
  // Code block: children are text nodes interleaved with linebreak nodes
  const lines = code.split("\n");
  const children: object[] = [];
  lines.forEach((line, i) => {
    children.push({
      type: "code-highlight",
      text: line,
      format: 0,
      detail: 0,
      mode: "normal",
      style: "",
      version: 1,
    });
    if (i < lines.length - 1) {
      children.push({ type: "linebreak", version: 1 });
    }
  });
  return {
    type: "code" as const,
    language,
    children,
    direction: "ltr" as const,
    format: "" as const,
    indent: 0,
    version: 1,
  };
}

// ---------------------------------------------------------------------------
// Inline text parser: handles **bold**, `code`, and [link](url)
// ---------------------------------------------------------------------------

function parseInline(text: string): object[] {
  const nodes: object[] = [];
  // Match **bold**, `inline code`, [link](url) in order
  const pattern = /\*\*(.+?)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    // Plain text before this match
    if (match.index > lastIndex) {
      const raw = text.slice(lastIndex, match.index);
      if (raw) nodes.push(textNode(raw));
    }

    if (match[1] !== undefined) {
      // **bold** — format flag 1
      nodes.push(textNode(match[1], 1));
    } else if (match[2] !== undefined) {
      // `inline code` — format flag 16
      nodes.push(textNode(match[2], 16));
    } else if (match[3] !== undefined) {
      // [text](url)
      nodes.push(linkNode(match[4], [textNode(match[3])]));
    }

    lastIndex = pattern.lastIndex;
  }

  // Remaining plain text
  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex);
    if (remaining) nodes.push(textNode(remaining));
  }

  // Always return at least one node so paragraph children are non-empty
  if (nodes.length === 0) nodes.push(textNode(""));
  return nodes;
}

// ---------------------------------------------------------------------------
// Markdown → Lexical JSON converter
// Handles: h2/h3/h4, fenced code blocks, bullet lists, ordered lists,
// and paragraphs (with inline bold, inline code, and links).
// ---------------------------------------------------------------------------

function mdToLexical(markdown: string) {
  const lines = markdown.split("\n");
  const children: object[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // ── Fenced code block ─────────────────────────────────────────────────
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim() || "plaintext";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      // Remove trailing empty line inside block if any
      while (codeLines.length && codeLines[codeLines.length - 1].trim() === "") {
        codeLines.pop();
      }
      children.push(codeNode(lang, codeLines.join("\n")));
      continue;
    }

    // ── Headings ──────────────────────────────────────────────────────────
    if (line.startsWith("#### ")) {
      children.push(headingNode("h4", parseInline(line.slice(5).trim())));
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      children.push(headingNode("h3", parseInline(line.slice(4).trim())));
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      children.push(headingNode("h2", parseInline(line.slice(3).trim())));
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      children.push(headingNode("h1", parseInline(line.slice(2).trim())));
      i++;
      continue;
    }

    // ── Unordered list ────────────────────────────────────────────────────
    if (line.startsWith("- ")) {
      const listItems: object[] = [];
      let value = 1;
      while (i < lines.length && lines[i].startsWith("- ")) {
        listItems.push(listItemNode(value++, parseInline(lines[i].slice(2).trim())));
        i++;
      }
      children.push(listNode("ul", "bullet", listItems));
      continue;
    }

    // ── Ordered list ──────────────────────────────────────────────────────
    if (/^\d+\.\s/.test(line)) {
      const listItems: object[] = [];
      let value = 1;
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        const text = lines[i].replace(/^\d+\.\s/, "");
        listItems.push(listItemNode(value++, parseInline(text.trim())));
        i++;
      }
      children.push(listNode("ol", "number", listItems));
      continue;
    }

    // ── Empty line → skip ─────────────────────────────────────────────────
    if (line.trim() === "") {
      i++;
      continue;
    }

    // ── Paragraph ─────────────────────────────────────────────────────────
    children.push(paragraphNode(parseInline(line.trim())));
    i++;
  }

  return {
    root: {
      type: "root",
      children,
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    },
  };
}

// ---------------------------------------------------------------------------
// Seed function
// ---------------------------------------------------------------------------

export async function seedBlog(payload: Payload) {
  const contentDir = path.resolve(__dirname, "../../content/blog");

  if (!fs.existsSync(contentDir)) {
    console.log("  ⚠️  content/blog/ not found — skipping blog seed.");
    return;
  }

  const enDir = path.join(contentDir, "en");
  const files = fs.readdirSync(enDir).filter((f) => f.endsWith(".mdx"));

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");

    // Check if post already exists (idempotent runs)
    const existing = await payload.find({
      collection: "posts",
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    });
    if (existing.totalDocs > 0) {
      console.log(`  ⏭️  Post already exists, skipping: ${slug}`);
      continue;
    }

    // ── Read EN ────────────────────────────────────────────────────────────
    const enRaw = fs.readFileSync(path.join(enDir, file), "utf-8");
    const { data: enFm, content: enBody } = parseFrontMatter(enRaw);

    // ── Read PT (fallback to EN if missing) ────────────────────────────────
    const ptPath = path.join(contentDir, "pt", file);
    const hasPt = fs.existsSync(ptPath);
    const { data: ptFm, content: ptBody } = hasPt
      ? parseFrontMatter(fs.readFileSync(ptPath, "utf-8"))
      : { data: enFm, content: enBody };

    console.log(`  📝 Seeding: ${slug}`);

    // ── Create with EN locale (sets slug, tags, publishedDate) ─────────────
    const created = await payload.create({
      collection: "posts",
      locale: "en",
      data: {
        title: enFm.title as string,
        slug,
        description: enFm.description as string,
        content: mdToLexical(enBody),
        tags: ((enFm.tags as string[]) ?? []).map((tag) => ({ tag })),
        publishedDate: enFm.date as string,
        _status: "published",
      },
      overrideAccess: true,
      context: { disableRevalidate: true },
    });

    // ── Update with PT locale (localized fields only) ──────────────────────
    await payload.update({
      collection: "posts",
      id: created.id,
      locale: "pt",
      data: {
        title: ptFm.title as string,
        description: ptFm.description as string,
        content: mdToLexical(ptBody),
      },
      overrideAccess: true,
      context: { disableRevalidate: true },
    });

    console.log(`  ✅ Seeded: ${slug} (id: ${created.id})`);
  }
}
