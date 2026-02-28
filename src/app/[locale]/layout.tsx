import { routing } from '@/i18n/routing'
import { Footer } from '@/ui/components/Footer'
import { Toaster } from '@/ui/components/ui/sonner'
import { Header } from '@/ui/header/components/Header'
import { GoogleAnalytics } from '@/ui/lib/GoogleAnalytics'
import { PersonJsonLd, WebSiteJsonLd } from '@/ui/lib/jsonLd'
import { ThemeProvider } from '@/ui/theme/ThemeProvider'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { Poppins } from 'next/font/google'
import { notFound } from 'next/navigation'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://jvvogler.com'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      template: '%s | JV Vogler',
      default: t('title'),
    },
    description: t('description'),
    keywords: [
      'frontend developer',
      'web developer',
      'react',
      'next.js',
      'typescript',
      'tailwind css',
      'portfolio',
    ],
    authors: [{ name: 'JV Vogler', url: BASE_URL }],
    creator: 'JV Vogler',
    openGraph: {
      type: 'website',
      locale: locale === 'pt' ? 'pt_BR' : 'en_US',
      siteName: 'JV Vogler',
      title: t('title'),
      description: t('description'),
      url: `${BASE_URL}/${locale}`,
      images: [
        {
          url: '/og/og-default.svg',
          width: 1200,
          height: 630,
          alt: t('title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/og/og-default.svg'],
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        en: `${BASE_URL}/en`,
        pt: `${BASE_URL}/pt`,
      },
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <PersonJsonLd
          name="JV Vogler"
          jobTitle="Frontend Developer"
          sameAs={['https://github.com/jvvogler', 'https://linkedin.com/in/jvvogler']}
        />
        <WebSiteJsonLd
          name="JV Vogler"
          description="Portfolio of JV Vogler, a frontend developer specializing in modern web technologies."
        />
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <Toaster />
          </NextIntlClientProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
