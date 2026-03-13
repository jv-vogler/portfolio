"use client";

import type { Blog } from "@/core/blog";
import { HeroLatestPost } from "@/ui/hero/components/HeroLatestPost";
import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTypingAnimation } from "@/ui/lib/useTypingAnimation";

const NAME = "JV Vogler";

type HeroPost = Pick<
  Blog.Post,
  "slug" | "title" | "description" | "date" | "readingTime" | "tags" | "coverImage"
>;

type HeroProps = {
  latestPost?: HeroPost | null;
};

export function Hero({ latestPost }: HeroProps) {
  const t = useTranslations("hero");
  const prefersReducedMotion = useReducedMotion();

  const comment = t("comment");
  const tagline = t("tagline");

  const { displayedText: commentDisplay } = useTypingAnimation({
    text: comment,
    speed: 35,
    enabled: !prefersReducedMotion,
  });

  const { displayedText: taglineDisplay } = useTypingAnimation({
    text: tagline,
    speed: 35,
    startDelay: comment.length * 35 + 300,
    enabled: !prefersReducedMotion,
  });

  return (
    <section className="dot-grid relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-[oklch(0.18_0.01_180)]">
      {/* Tinted charcoal background with teal hue */}
      <div className="absolute inset-0 bg-[oklch(0.14_0.01_180)]" />

      {/* Dot grid overlay */}
      <div className="dot-grid pointer-events-none absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Comment line */}
        <p className="mb-6 h-5 font-mono text-sm text-[oklch(0.65_0.24_155)] sm:text-base">
          {commentDisplay}
        </p>

        {/* Name */}
        <h1
          className="mb-8 font-sans font-bold text-[oklch(0.98_0_0)]"
          style={{
            fontSize: "clamp(3rem, 12vw, 12rem)",
            lineHeight: 1,
          }}
        >
          {NAME}
        </h1>

        {/* Tagline */}
        <p className="mb-8 h-8 font-mono text-sm text-[oklch(0.7_0_0)] sm:text-base md:text-lg">
          {taglineDisplay}
        </p>

        {/* Featured/latest blog post */}
        {latestPost && <HeroLatestPost post={latestPost} />}
      </div>
    </section>
  );
}
