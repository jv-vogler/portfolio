"use client";

import type { Blog } from "@/core/blog";
import { Link } from "@/i18n/routing";
import { HeroLatestPost } from "@/ui/hero/components/HeroLatestPost";
import { Button } from "@/ui/components/ui/button";
import { motion, useAnimate, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const NAME = "JV Vogler";

const CHAR_STAGGER = 0.08;
const CHAR_FADE_DURATION = 0.5;
const PAUSE_BEFORE_UNBLUR = 0.15;
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
const CASCADE_END = (NON_SPACE_COUNT - 1) * CHAR_STAGGER + CHAR_FADE_DURATION;

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

    const unblurStart = CASCADE_END + PAUSE_BEFORE_UNBLUR;

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

  // Latest post card eases in just after the name lands.
  const latestPostDelay = prefersReducedMotion ? 0 : CASCADE_END + 0.5;

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-background">
      {/* Asymmetric content — left-anchored, lab notebook layout */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl items-start gap-8 px-6 py-24">
        {/* Marginalia column — section marker, hidden on mobile */}
        <aside
          aria-hidden="true"
          className="hidden lg:flex shrink-0 flex-col items-center gap-3 self-start pt-2"
        >
          <span className="font-mono text-xs tracking-[0.3em] text-muted-foreground">§ 00</span>
          <div
            className="w-px"
            style={{
              height: "7rem",
              background: "linear-gradient(to bottom, oklch(1 0 0 / 0.1), transparent)",
            }}
          />
          <span
            className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            intro
          </span>
        </aside>

        {/* Main content */}
        <div className="flex flex-col items-start">
          {/* Comment line — static, lets the name cascade carry the intensity. */}
          <p className="mb-6 font-mono text-sm text-muted-foreground sm:text-base">{comment}</p>

          {/* Name – blurred cascade up, then snap to sharp.
              aria-label provides the canonical name; per-character spans are
              hidden from SR so partial cascade states never leak. */}
          <h1
            ref={scope}
            className="mb-6 font-sans font-bold text-foreground"
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
                aria-hidden="true"
                initial={prefersReducedMotion ? undefined : { y: 24, opacity: 0 }}
                animate={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
                transition={{
                  duration: CHAR_FADE_DURATION,
                  delay: meta.isSpace ? 0 : meta.nonSpaceIdx * CHAR_STAGGER,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block"
              >
                {meta.isSpace ? " " : meta.char}
              </motion.span>
            ))}
          </h1>

          {/* Tagline — static, secondary to the name. */}
          <p className="mb-8 font-sans text-sm text-muted-foreground sm:text-base md:text-lg">
            {tagline}
          </p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={nameSharp ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10 mt-2"
          >
            <Link href="/#portfolio">
              <Button size="lg" className="rounded-sm px-8 font-medium tracking-wide">
                {t("cta")}
              </Button>
            </Link>
          </motion.div>

          {/* Featured/latest blog post */}
          {latestPost && <HeroLatestPost post={latestPost} delay={latestPostDelay} />}
        </div>
      </div>
    </section>
  );
}
