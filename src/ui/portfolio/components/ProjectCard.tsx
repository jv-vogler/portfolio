'use client'

import type { Portfolio } from '@/core/portfolio'
import { Badge } from '@/ui/components/ui/badge'
import { Button } from '@/ui/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/ui/components/ui/card'
import { scaleOnHover } from '@/ui/lib/motion'
import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

type ProjectCardProps = {
  project: Portfolio.Type
}

export function ProjectCard({ project }: ProjectCardProps) {
  const t = useTranslations('portfolio')
  const tA11y = useTranslations('a11y')

  return (
    <motion.div variants={scaleOnHover} initial="rest" whileHover="hover" className="h-full">
      <Card className="group relative flex h-full flex-col overflow-hidden">
        {/* Passion Project ribbon */}
        {project.isPassionProject && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="default" className="bg-primary text-primary-foreground shadow-md">
              {t('passionProject')}
            </Badge>
          </div>
        )}

        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={`/images/portfolio/${project.thumbnail}`}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{project.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          <p className="text-sm text-muted-foreground">{t(`${project.slug}.description`)}</p>

          <div className="flex flex-wrap gap-1.5">
            {project.techs.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="gap-2">
          {project.demoUrl && (
            <Button asChild variant="default" size="sm" className="gap-1.5">
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                {t('demo')}
                <span className="sr-only"> ({tA11y('opensInNewTab')})</span>
              </a>
            </Button>
          )}
          {project.codeUrl && (
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <a href={project.codeUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-3.5 w-3.5" />
                {t('code')}
                <span className="sr-only"> ({tA11y('opensInNewTab')})</span>
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
