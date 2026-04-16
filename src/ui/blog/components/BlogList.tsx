"use client";

import type { Blog } from "@/core/blog";
import { Link } from "@/i18n/routing";
import { formatDate } from "@/lib/date";
import { Badge } from "@/ui/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/components/ui/card";
import { fadeInUp, staggerContainer } from "@/ui/lib/motion";
import { formatTag } from "@/ui/blog/utils/formatTag";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, RefreshCw } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { SpotlightCard } from "./SpotlightCard";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function wasUpdated(post: Blog.Post): boolean {
  if (!post.updatedAt) return false;
  return new Date(post.updatedAt).getTime() - new Date(post.date).getTime() > ONE_DAY_MS;
}

type BlogListProps = {
  posts: Blog.Post[];
  tags?: string[];
};

export function BlogList({ posts }: BlogListProps) {
  const t = useTranslations("blog");
  const locale = useLocale();

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground text-lg">{t("noPosts")}</p>
      </div>
    );
  }

  const featuredPost = posts.find((post) => post.featured);
  const regularPosts = posts.filter((post) => !post.featured || post !== featuredPost);

  return (
    <div>
      {featuredPost && <SpotlightCard post={featuredPost} />}

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-6"
      >
        {regularPosts.map((post) => (
          <motion.div key={post.slug} variants={fadeInUp}>
            <Link href={`/blog/${post.slug}`} className="group block">
              <Card className="transition-colors hover:border-primary/50">
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-4" />
                      <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-4" />
                      {t("readingTime", { minutes: post.readingTime })}
                    </span>
                    {wasUpdated(post) && post.updatedAt && (
                      <Badge variant="outline" className="gap-1 text-xs">
                        <RefreshCw className="size-3" />
                        {t("updated", { date: formatDate(post.updatedAt, locale) })}
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl transition-colors group-hover:text-primary">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="mt-1 text-base">
                        {post.description}
                      </CardDescription>
                    </div>

                    {post.coverImage?.thumbnailUrl && (
                      <div className="relative hidden h-20 w-28 shrink-0 overflow-hidden rounded-md sm:block">
                        <Image
                          src={post.coverImage.thumbnailUrl}
                          alt={post.coverImage.alt}
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {formatTag(tag)}
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
        ))}
      </motion.div>
    </div>
  );
}
