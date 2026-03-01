import { Portfolio } from '@/core/portfolio'
import { locales } from '@/i18n/config'
import { Link } from '@/i18n/routing'
import { Badge } from '@/ui/components/ui/badge'
import { ArrowLeft, ExternalLink, Github } from 'lucide-react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export const revalidate = 3600

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://jv-portfolio.vercel.app'

export function generateStaticParams() {
  return Portfolio.items.flatMap((project) =>
    locales.map((locale) => ({ locale, slug: project.slug })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const project = Portfolio.items.find((p) => p.slug === slug)

  if (!project) return { title: 'Not Found' }

  const t = await getTranslations({ locale, namespace: 'portfolio' })
  const title = t(`${slug}.title`)
  const description = t(`${slug}.description`)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${BASE_URL}/${locale}/portfolio/${slug}`,
      images: [{ url: `/images/portfolio/${project.thumbnail}` }],
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/portfolio/${slug}`,
      languages: {
        en: `${BASE_URL}/en/portfolio/${slug}`,
        pt: `${BASE_URL}/pt/portfolio/${slug}`,
      },
    },
  }
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const project = Portfolio.items.find((p) => p.slug === slug)

  if (!project) notFound()

  const t = await getTranslations({ locale, namespace: 'portfolio' })

  return (
    <section className="container mx-auto max-w-4xl px-4 py-20">
      {/* Back link */}
      <Link
        href="/#portfolio"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('backToPortfolio')}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold sm:text-4xl">{t(`${slug}.title`)}</h1>
          {project.featured && (
            <Badge variant="default" className="bg-primary text-primary-foreground">
              {t('featured')}
            </Badge>
          )}
        </div>
        <p className="text-lg leading-relaxed text-muted-foreground">{t(`${slug}.description`)}</p>
      </div>

      {/* Screenshot */}
      <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl border bg-muted shadow-sm">
        <Image
          src={`/images/portfolio/${project.thumbnail}`}
          alt={t(`${slug}.title`)}
          fill
          className="object-cover"
          sizes="(max-width: 896px) 100vw, 896px"
          priority
        />
      </div>

      {/* Tech stack */}
      <div className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">{t('techStack')}</h2>
        <div className="flex flex-wrap gap-2">
          {project.techs.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-sm">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {/* External links */}
      {(project.demoUrl || project.codeUrl) && (
        <div className="mb-12 flex flex-wrap gap-4">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <ExternalLink className="h-4 w-4" />
              {t('liveDemo')}
            </a>
          )}
          {project.codeUrl && (
            <a
              href={project.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
            >
              <Github className="h-4 w-4" />
              {t('viewCode')}
            </a>
          )}
        </div>
      )}

      {/* Case study sections */}
      {project.caseStudy && (
        <div className="space-y-10 border-t pt-10">
          <h2 className="text-2xl font-bold">{t('caseStudy.heading')}</h2>

          <div>
            <h3 className="mb-2 text-lg font-semibold text-primary">{t('caseStudy.problem')}</h3>
            <p className="leading-relaxed text-muted-foreground">
              {t(`${slug}.caseStudy.problem`)}
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold text-primary">{t('caseStudy.approach')}</h3>
            <p className="leading-relaxed text-muted-foreground">
              {t(`${slug}.caseStudy.approach`)}
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold text-primary">{t('caseStudy.outcome')}</h3>
            <p className="leading-relaxed text-muted-foreground">
              {t(`${slug}.caseStudy.outcome`)}
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold text-primary">{t('caseStudy.learnings')}</h3>
            <p className="leading-relaxed text-muted-foreground">
              {t(`${slug}.caseStudy.learnings`)}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
