'use client'

import { Button } from '@/ui/components/ui/button'
import { fadeInUp, staggerContainer } from '@/ui/lib/motion'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function Hero() {
  const t = useTranslations('hero')

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4"
    >
      {/* Background gradient decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,var(--color-primary)/0.08,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_70%_80%,var(--color-primary)/0.04,transparent)]" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mx-auto flex max-w-4xl flex-col items-center text-center"
      >
        <motion.p
          variants={fadeInUp}
          className="mb-4 text-sm font-medium tracking-widest text-primary uppercase"
        >
          JV Vogler
        </motion.p>

        <motion.h1
          id="hero-heading"
          variants={fadeInUp}
          className="mb-6 text-4xl leading-tight font-bold text-foreground sm:text-5xl md:text-6xl"
        >
          {t('heading')}
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl"
        >
          {t('paragraph')}
        </motion.p>

        <motion.div variants={fadeInUp}>
          <Button asChild size="lg" className="gap-2">
            <a href="#portfolio">
              {t('cta')}
              <ArrowDown className="h-4 w-4" />
            </a>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
