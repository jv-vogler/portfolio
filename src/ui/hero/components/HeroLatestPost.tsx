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
};

export function HeroLatestPost({ post }: HeroLatestPostProps) {
  const t = useTranslations("blog");
  const locale = useLocale();
  const prefersReducedMotion = useReducedMotion();
  const thumbnailUrl = post.coverImage?.cardUrl ?? post.coverImage?.url;

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.5 }}
    >
      <Link
        href={`/blog/${post.slug}` as "/blog/[slug]"}
        className="group mx-auto flex max-w-lg items-center gap-4 rounded-lg border border-[oklch(0.65_0.24_155/0.2)] bg-[oklch(0.14_0.01_180/0.6)] px-4 py-3 backdrop-blur-sm transition-colors hover:border-[oklch(0.65_0.24_155/0.4)] hover:bg-[oklch(0.14_0.01_180/0.8)]"
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
          <p className="truncate font-mono text-sm font-medium text-[oklch(0.95_0_0)]">
            {post.title}
          </p>
          <div className="mt-1 flex items-center gap-2 font-mono text-xs text-[oklch(0.6_0_0)]">
            <Clock className="h-3 w-3" />
            <span>{t("readingTime", { minutes: post.readingTime })}</span>
            <span className="text-[oklch(0.65_0.24_155)]">·</span>
            <span>
              {new Date(post.date).toLocaleDateString(locale, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        <ArrowRight className="h-4 w-4 shrink-0 text-[oklch(0.65_0.24_155)] transition-transform group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}
