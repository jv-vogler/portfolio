"use client";

import type { Blog } from "@/core/blog";
import { Link } from "@/i18n/routing";
import { formatDate } from "@/lib/date";
import { Badge } from "@/ui/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/components/ui/card";
import { scaleOnHover } from "@/ui/lib/motion";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

type SpotlightCardProps = {
  post: Blog.Post;
};

export function SpotlightCard({ post }: SpotlightCardProps) {
  const t = useTranslations("blog");
  const locale = useLocale();

  return (
    <motion.div variants={scaleOnHover} initial="rest" whileHover="hover" className="mb-10">
      <Link href={`/blog/${post.slug}`} className="group block">
        <Card className="overflow-hidden border-primary/30 bg-primary/5 transition-colors hover:border-primary/60">
          {post.coverImage && (
            <div className="relative h-56 w-full overflow-hidden sm:h-72">
              <Image
                src={post.coverImage.heroUrl ?? post.coverImage.url}
                alt={post.coverImage.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-background/60 to-transparent" />
            </div>
          )}

          <CardHeader className="pb-3">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="default" className="gap-1">
                <Star className="size-3" />
                {t("featured")}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="size-4" />
                <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-4" />
                {t("readingTime", { minutes: post.readingTime })}
              </span>
            </div>

            <CardTitle className="text-2xl transition-colors group-hover:text-primary sm:text-3xl">
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
                {t("readMore")}
                <ArrowRight className="size-4" />
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
