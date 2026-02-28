import { getAllPosts } from '@/app/actions/blog'
import { BlogList } from '@/ui/blog/components/BlogList'
import { MotionSection } from '@/ui/lib/motion'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })

  return {
    title: t('heading'),
    description: t('description'),
  }
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  const posts = await getAllPosts(locale)

  return (
    <section className="container mx-auto max-w-4xl px-4 py-20">
      <MotionSection className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">{t('heading')}</h1>
        <p className="text-lg text-muted-foreground">{t('description')}</p>
      </MotionSection>
      <BlogList posts={posts} />
    </section>
  )
}
