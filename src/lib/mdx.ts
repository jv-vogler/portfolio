import matter from 'gray-matter'
import fs from 'node:fs'
import path from 'node:path'

const CONTENT_ROOT = path.join(process.cwd(), 'content', 'blog')

export function getPostSlugs(locale: string): string[] {
  const dir = path.join(CONTENT_ROOT, locale)

  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))
}

export async function getPostBySlug(
  slug: string,
  locale: string,
): Promise<{ frontmatter: Record<string, unknown>; content: string }> {
  const filePath = path.join(CONTENT_ROOT, locale, `${slug}.mdx`)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return { frontmatter: data, content }
}
