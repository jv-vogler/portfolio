import { Blog } from "@/core/blog";
import { getPostBySlug, getPostSlugs } from "@/lib/mdx";

function mapFrontmatterToPost(
  slug: string,
  locale: string,
  frontmatter: Record<string, unknown>,
): Blog.Post {
  return {
    slug,
    locale,
    title: (frontmatter.title as string) ?? "",
    description: (frontmatter.description as string) ?? "",
    date: (frontmatter.date as string) ?? "",
    tags: (frontmatter.tags as string[]) ?? [],
    published: (frontmatter.published as boolean) ?? false,
  };
}

export async function getAllPosts(locale: string): Promise<Blog.Post[]> {
  const slugs = getPostSlugs(locale);

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { frontmatter } = await getPostBySlug(slug, locale);
      return mapFrontmatterToPost(slug, locale, frontmatter);
    }),
  );

  return Blog.sortByDate(Blog.filterPublished(posts));
}

export async function getPost(
  slug: string,
  locale: string,
): Promise<{ post: Blog.Post; content: string }> {
  const { frontmatter, content } = await getPostBySlug(slug, locale);
  const post = mapFrontmatterToPost(slug, locale, frontmatter);

  return { post, content };
}
