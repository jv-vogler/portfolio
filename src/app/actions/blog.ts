import { Blog, type PayloadPost } from "@/core/blog";
import { getPayloadSafe } from "@/lib/payload";
import type { SerializedEditorState } from "lexical";
import type { Where } from "payload";

export async function getAllPosts(locale: string, tag?: string): Promise<Blog.Post[]> {
  const payload = await getPayloadSafe();
  if (!payload) return [];

  const where: Where = {
    _status: { equals: "published" },
  };

  if (tag) {
    where["tags.tag"] = { equals: tag };
  }

  const { docs } = await payload.find({
    collection: "posts",
    locale: locale as "en" | "pt",
    where,
    sort: "-publishedDate",
    limit: 100,
    depth: 1,
    overrideAccess: true,
  });

  return (docs as PayloadPost[]).map((doc) => Blog.fromPayload(doc, locale));
}

/** Return a deduplicated, alphabetically sorted list of all tags in use. */
export async function getAllTags(locale: string): Promise<string[]> {
  const posts = await getAllPosts(locale);
  const tagSet = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
}

/**
 * Return up to `limit` posts related to the given slug, ranked by shared-tag
 * overlap then by date descending. Falls back to most-recent posts when no
 * tags overlap.
 */
export async function getRelatedPosts(
  slug: string,
  tags: string[],
  locale: string,
  limit = 3,
): Promise<Blog.Post[]> {
  const all = await getAllPosts(locale);
  const others = all.filter((p) => p.slug !== slug);

  const scored = others.map((post) => {
    const shared = post.tags.filter((t) => tags.includes(t)).length;
    return { post, shared };
  });

  scored.sort((a, b) => {
    if (b.shared !== a.shared) return b.shared - a.shared;
    return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
  });

  return scored.slice(0, limit).map((s) => s.post);
}

export async function getPost(
  slug: string,
  locale: string,
): Promise<{
  post: Blog.Post;
  content: SerializedEditorState;
  headings: Blog.Heading[];
}> {
  const payload = await getPayloadSafe();
  if (!payload) throw new Error("Payload unavailable — cannot fetch post");

  const { docs } = await payload.find({
    collection: "posts",
    locale: locale as "en" | "pt",
    where: {
      slug: { equals: slug },
    },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  });

  if (!docs.length) {
    throw new Error(`Post not found: ${slug}`);
  }

  const doc = docs[0] as PayloadPost;

  return {
    post: Blog.fromPayload(doc, locale),
    content: doc.content,
    headings: Blog.extractHeadings(doc.content),
  };
}
