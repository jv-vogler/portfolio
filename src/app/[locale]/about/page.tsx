import { AboutSection } from '@/ui/about/components/AboutSection'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export const revalidate = 3600

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://jvvogler.com'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  return {
    title: t('heading'),
    description: t('metaDescription'),
    openGraph: {
      title: `${t('heading')} | JV Vogler`,
      description: t('metaDescription'),
      url: `${BASE_URL}/${locale}/about`,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/about`,
      languages: {
        en: `${BASE_URL}/en/about`,
        pt: `${BASE_URL}/pt/about`,
      },
    },
  }
}

export default function AboutPage() {
  return <AboutSection />
}
