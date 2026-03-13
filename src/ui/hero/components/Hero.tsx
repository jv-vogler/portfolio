"use client";

import type { Blog } from "@/core/blog";
import { HeroLatestPost } from "@/ui/hero/components/HeroLatestPost";
import { useTypingAnimation } from "@/ui/lib/useTypingAnimation";
import { motion, useAnimate, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const NAME = "JV Vogler";

/** Per-character stagger delay (seconds). */
const CHAR_STAGGER = 0.08;
/** Duration of each letter's fade-up (seconds). */
const CHAR_FADE_DURATION = 0.5;
/** Pause after all letters have risen before unblurring (seconds). */
const PAUSE_BEFORE_UNBLUR = 0.15;
/** Duration of the blur → sharp transition (seconds). */
const UNBLUR_DURATION = 3.0;

/** Pre-computed per-character metadata. */
const NAME_CHARS = (() => {
  let nsIdx = 0;
  return NAME.split("").map((char) => ({
    char,
    isSpace: char === " ",
    nonSpaceIdx: char === " " ? -1 : nsIdx++,
  }));
})();

const NON_SPACE_COUNT = NAME_CHARS.filter((c) => !c.isSpace).length;

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

  // ── Name: blur state ───────────────────────────────────────
  const [nameSharp, setNameSharp] = useState(!!prefersReducedMotion);
  const [scope, animate] = useAnimate<HTMLHeadingElement>();

  // After all letters have risen → brief pause → unblur
  useEffect(() => {
    if (prefersReducedMotion) return;

    const cascadeEnd = (NON_SPACE_COUNT - 1) * CHAR_STAGGER + CHAR_FADE_DURATION;
    const unblurStart = cascadeEnd + PAUSE_BEFORE_UNBLUR;

    const timer = setTimeout(() => {
      animate(
        scope.current,
        { filter: "blur(0px)" },
        { duration: UNBLUR_DURATION, ease: "easeOut" },
      );
      setNameSharp(true);
    }, unblurStart * 1000);

    return () => clearTimeout(timer);
  }, [prefersReducedMotion, animate, scope]);

  // ── Comment: typing (starts right after cascade, while still unblurring) ───
  const cascadeEndMs = ((NON_SPACE_COUNT - 1) * CHAR_STAGGER + CHAR_FADE_DURATION) * 1000;
  const commentStart = cascadeEndMs + 200;
  const { displayedText: commentDisplay } = useTypingAnimation({
    text: comment,
    speed: 35,
    startDelay: commentStart,
    enabled: !prefersReducedMotion,
  });

  // ── Tagline: typing (after comment) ────────────────────────
  const taglineStart = commentStart + comment.length * 35 + 300;
  const { displayedText: taglineDisplay } = useTypingAnimation({
    text: tagline,
    speed: 35,
    startDelay: taglineStart,
    enabled: !prefersReducedMotion,
  });

  // Delay for the latest-post card (seconds)
  const latestPostDelay = prefersReducedMotion
    ? 0
    : (taglineStart + tagline.length * 35 + 400) / 1000;

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

        {/* Name – blurred cascade up, then snap to sharp */}
        <h1
          ref={scope}
          className="mb-3 font-sans font-bold text-[oklch(0.98_0_0)]"
          style={{
            fontSize: "clamp(3rem, 12vw, 12rem)",
            lineHeight: 1,
            filter: prefersReducedMotion ? "none" : "blur(24px)",
          }}
          aria-label={NAME}
        >
          {NAME_CHARS.map((meta, i) => (
            <motion.span
              key={i}
              initial={prefersReducedMotion ? undefined : { y: 24, opacity: 0 }}
              animate={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
              transition={{
                duration: CHAR_FADE_DURATION,
                delay: meta.isSpace ? 0 : meta.nonSpaceIdx * CHAR_STAGGER,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block"
            >
              {meta.isSpace ? "\u00A0" : meta.char}
            </motion.span>
          ))}
        </h1>

        {/* Accent underline – expands after name sharpens */}
        <motion.div
          className="mb-6 h-px"
          initial={{ width: 0, opacity: 0 }}
          animate={nameSharp ? { width: "60%", opacity: 1 } : { width: 0, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.65 0.24 155 / 0.5), transparent)",
          }}
        />

        {/* Tagline */}
        <p className="mb-8 h-8 font-mono text-sm text-[oklch(0.7_0_0)] sm:text-base md:text-lg">
          {taglineDisplay}
        </p>

        {/* Featured/latest blog post */}
        {latestPost && <HeroLatestPost post={latestPost} delay={latestPostDelay} />}
      </div>
    </section>
  );
}
