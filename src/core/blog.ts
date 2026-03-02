import type { SerializedEditorState } from "lexical";

// Loose type for Payload Post document (until payload-types.ts is generated)
export type PayloadPost = {
  id: string | number;
  slug: string;
  title: string;
  description: string;
  content: SerializedEditorState;
  tags?: Array<{ tag: string }>;
  publishedDate: string;
  _status?: string;
};

export namespace Blog {
  export type Post = {
    slug: string;
    title: string;
    description: string;
    date: string;
    tags: string[];
    published: boolean;
    locale: string;
  };

  export function sortByDate(posts: Post[]): Post[] {
    return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  export function filterPublished(posts: Post[]): Post[] {
    return posts.filter((post) => post.published);
  }

  export function fromPayload(doc: PayloadPost, locale: string): Post {
    return {
      slug: doc.slug,
      title: doc.title,
      description: doc.description,
      date: doc.publishedDate,
      tags: (doc.tags ?? []).map((t) => t.tag),
      published: doc._status === "published",
      locale,
    };
  }
}
