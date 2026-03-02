import { Blog, type PayloadPost } from "@/core/blog";
import { getPayloadSafe } from "@/lib/payload";
import type { SerializedEditorState } from "lexical";

export async function getAllPosts(locale: string): Promise<Blog.Post[]> {
  const payload = await getPayloadSafe();
  if (!payload) return [];

  const { docs } = await payload.find({
    collection: "posts",
    locale: locale as "en" | "pt",
    where: {
      _status: { equals: "published" },
    },
    sort: "-publishedDate",
    limit: 100,
    overrideAccess: true,
  });

  return (docs as PayloadPost[]).map((doc) => Blog.fromPayload(doc, locale));
}

export async function getPost(
  slug: string,
  locale: string,
): Promise<{ post: Blog.Post; content: SerializedEditorState }> {
  const payload = await getPayloadSafe();
  if (!payload) throw new Error("Payload unavailable — cannot fetch post");

  const { docs } = await payload.find({
    collection: "posts",
    locale: locale as "en" | "pt",
    where: {
      slug: { equals: slug },
    },
    limit: 1,
    overrideAccess: true,
  });

  if (!docs.length) {
    throw new Error(`Post not found: ${slug}`);
  }

  const doc = docs[0] as PayloadPost;

  return {
    post: Blog.fromPayload(doc, locale),
    content: doc.content,
  };
}
