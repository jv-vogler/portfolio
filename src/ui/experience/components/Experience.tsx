'use client'

import { Tech } from '@/core/tech'
import { TechIcon } from '@/ui/lib/icons'
import { fadeInUp, MotionSection, staggerContainer } from '@/ui/lib/motion'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

export function Experience() {
  const t = useTranslations('experience')

  return (
    <MotionSection
      id="experience"
      aria-labelledby="experience-heading"
      className="mx-auto max-w-6xl px-4 py-20"
    >
      <div className="mb-12 text-center">
        <h2 id="experience-heading" className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
          {t('heading')}
        </h2>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      >
        {Tech.items.map((tech) => (
          <motion.div
            key={tech.id}
            variants={fadeInUp}
            className="group flex flex-col items-center gap-3 rounded-lg border border-border/50 bg-card p-5 transition-shadow hover:shadow-md"
            style={{ borderBottomColor: tech.color, borderBottomWidth: '3px' }}
          >
            <div className="text-muted-foreground transition-colors group-hover:text-foreground">
              <TechIcon slug={tech.slug} size={32} />
            </div>
            <span className="text-center text-sm font-medium text-foreground">{tech.title}</span>
          </motion.div>
        ))}
      </motion.div>
    </MotionSection>
  )
}
