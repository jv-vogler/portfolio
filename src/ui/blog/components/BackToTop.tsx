"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const SCROLL_THRESHOLD = 300;

export function BackToTop() {
  const t = useTranslations("blog");
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "instant" : "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label={t("backToTop")}
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-40 flex size-11 items-center justify-center rounded-full border border-border bg-background shadow-md transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronUp className="size-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
