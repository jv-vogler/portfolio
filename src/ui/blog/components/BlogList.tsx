'use client'

import type { Blog } from '@/core/blog'
import { Link } from '@/i18n/routing'
import { formatDate } from '@/lib/date'
import { Badge } from '@/ui/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/ui/card'
import { fadeInUp, staggerContainer } from '@/ui/lib/motion'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

type BlogListProps = {
  posts: Blog.Post[]
}

export function BlogList({ posts }: BlogListProps) {
  const t = useTranslations('blog')
  const locale = useLocale()

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground text-lg">{t('noPosts')}</p>
      </div>
    )
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid gap-6"
    >
      {posts.map((post) => (
        <motion.div key={post.slug} variants={fadeInUp}>
          <Link href={`/blog/${post.slug}`} className="group block">
            <Card className="transition-colors hover:border-primary/50">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="size-4" />
                  <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-base">{post.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                    {t('readMore')}
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
