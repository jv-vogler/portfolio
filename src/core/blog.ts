export namespace Blog {
  export type Frontmatter = {
    title: string
    description: string
    date: string
    tags: string[]
    published: boolean
  }

  export type Post = {
    slug: string
    title: string
    description: string
    date: string
    tags: string[]
    published: boolean
    locale: string
  }

  export function sortByDate(posts: Post[]): Post[] {
    return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  export function filterPublished(posts: Post[]): Post[] {
    return posts.filter((post) => post.published)
  }
}
