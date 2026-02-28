'use client'

import { Portfolio } from '@/core/portfolio'
import { fadeInUp, MotionSection, staggerContainer } from '@/ui/lib/motion'
import { ProjectCard } from '@/ui/portfolio/components/ProjectCard'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

export function PortfolioSection() {
  const t = useTranslations('portfolio')

  return (
    <MotionSection
      id="portfolio"
      aria-labelledby="portfolio-heading"
      className="mx-auto max-w-6xl px-4 py-20"
    >
      <div className="mb-12 text-center">
        <h2 id="portfolio-heading" className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
          {t('heading')}
        </h2>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {Portfolio.items.map((project) => (
          <motion.div key={project.id} variants={fadeInUp}>
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>
    </MotionSection>
  )
}
