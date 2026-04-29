"use client";

import type { Blog } from "@/core/blog";
import { Link } from "@/i18n/routing";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

type HeroPost = Pick<
  Blog.Post,
  "slug" | "title" | "description" | "date" | "readingTime" | "tags" | "coverImage"
>;

type HeroLatestPostProps = {
  post: HeroPost;
  delay?: number;
};

export function HeroLatestPost({ post, delay = 1.5 }: HeroLatestPostProps) {
  const t = useTranslations("blog");
  const locale = useLocale();
  const prefersReducedMotion = useReducedMotion();
  const thumbnailUrl = post.coverImage?.cardUrl ?? post.coverImage?.url;

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Link
        href={`/blog/${post.slug}` as "/blog/[slug]"}
        className="group flex max-w-lg items-center gap-4 rounded-lg border border-border px-4 py-3 transition-colors hover:border-white/20"
      >
        {thumbnailUrl && (
          <div className="relative hidden h-14 w-20 shrink-0 overflow-hidden rounded sm:block">
            <Image
              src={thumbnailUrl}
              alt={post.coverImage?.alt ?? post.title}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate font-sans text-sm font-semibold text-foreground">{post.title}</p>
          <div className="mt-1 flex items-center gap-2 font-sans text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{t("readingTime", { minutes: post.readingTime })}</span>
            <span className="text-muted-foreground">·</span>
            <span>
              {new Date(post.date).toLocaleDateString(locale, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        <ArrowRight
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1"
          aria-hidden="true"
        />
      </Link>
    </motion.div>
  );
}
