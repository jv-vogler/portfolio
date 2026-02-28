import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('home')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold text-foreground">{t('title')}</h1>
      <p className="text-lg text-muted-foreground">{t('description')}</p>
    </main>
  )
}
