import type { Blog } from '@/core/blog'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://jvvogler.com'

type PersonJsonLdProps = {
  name: string
  url?: string
  jobTitle?: string
  sameAs?: string[]
}

export function PersonJsonLd({ name, url = BASE_URL, jobTitle, sameAs = [] }: PersonJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url,
    jobTitle,
    sameAs,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

type WebSiteJsonLdProps = {
  name: string
  url?: string
  description?: string
}

export function WebSiteJsonLd({ name, url = BASE_URL, description }: WebSiteJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

type BlogPostingJsonLdProps = {
  post: Blog.Post
  locale: string
}

export function BlogPostingJsonLd({ post, locale }: BlogPostingJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: locale === 'pt' ? 'pt-BR' : 'en-US',
    author: {
      '@type': 'Person',
      name: 'JV Vogler',
      url: BASE_URL,
    },
    url: `${BASE_URL}/${locale}/blog/${post.slug}`,
    keywords: post.tags.join(', '),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
