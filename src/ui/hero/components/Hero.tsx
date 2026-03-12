"use client";

import type { Blog } from "@/core/blog";
import { HeroLatestPost } from "@/ui/hero/components/HeroLatestPost";
import { letterCascade } from "@/ui/lib/motion";
import { useTypingAnimation } from "@/ui/lib/useTypingAnimation";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";

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
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const gridShift = useTransform(scrollYProgress, [0, 1], ["0px", "15px"]);
  const letterGap = useTransform(scrollYProgress, [0, 0.5], ["0px", "24px"]);

  const comment = t("comment");
  const tagline = t("tagline");

  const { displayedText: commentText, isComplete: commentDone } = useTypingAnimation({
    text: comment,
    speed: 30,
    startDelay: 300,
    enabled: !prefersReducedMotion,
  });

  const { displayedText: taglineText, isComplete: taglineDone } = useTypingAnimation({
    text: tagline,
    speed: 25,
    startDelay: 1800,
    enabled: !prefersReducedMotion,
  });

  return (
    <section
      ref={sectionRef}
      className="dot-grid relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-[oklch(0.18_0.01_180)]"
      style={{
        viewTransitionName: "hero",
        backgroundColor: undefined,
      }}
    >
      {/* Tinted charcoal background with teal hue */}
      <div className="absolute inset-0 bg-[oklch(0.18_0.01_180)] dark:bg-[oklch(0.14_0.01_180)]" />

      {/* Dot grid overlay */}
      <motion.div
        className="dot-grid pointer-events-none absolute inset-0"
        style={prefersReducedMotion ? undefined : { backgroundPositionY: gridShift }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center px-6 text-center"
        style={prefersReducedMotion ? undefined : { y: contentY }}
      >
        {/* Comment line */}
        <p className="mb-6 font-mono text-sm text-[oklch(0.65_0.24_155)] sm:text-base">
          {prefersReducedMotion ? comment : commentText}
          {!prefersReducedMotion && !commentDone && <span className="animate-blink">|</span>}
        </p>

        {/* Name — massive scale, letter cascade */}
        <motion.h1
          className="mb-8 flex flex-wrap justify-center font-sans font-bold"
          style={{
            fontSize: "clamp(3rem, 12vw, 12rem)",
            lineHeight: 1,
            ...(prefersReducedMotion ? {} : { gap: letterGap }),
          }}
        >
          {NAME.split("").map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={prefersReducedMotion ? undefined : letterCascade}
              initial={prefersReducedMotion ? undefined : "hidden"}
              animate={prefersReducedMotion ? undefined : "visible"}
              className="inline-block text-[oklch(0.98_0_0)]"
              style={{ willChange: "transform, opacity" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Tagline with typing effect */}
        <p className="mb-8 h-8 font-mono text-sm text-[oklch(0.7_0_0)] sm:text-base md:text-lg">
          {prefersReducedMotion ? tagline : taglineText}
          {!prefersReducedMotion && commentDone && (
            <motion.span
              className={taglineDone ? "" : "animate-blink"}
              animate={{ opacity: taglineDone ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            >
              |
            </motion.span>
          )}
        </p>

        {/* Featured/latest blog post */}
        {latestPost && <HeroLatestPost post={latestPost} />}
      </motion.div>
    </section>
  );
}
