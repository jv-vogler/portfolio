"use client";

import { useRouter } from "@/i18n/routing";
import { useCallback } from "react";

/**
 * Wraps Next.js router.push with the native View Transitions API.
 * Falls back to a normal navigation when the API isn't supported or
 * the user prefers reduced motion.
 */
export function useViewTransitionRouter() {
  const router = useRouter();

  const push = useCallback(
    (href: string) => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (
        !prefersReducedMotion &&
        "startViewTransition" in document &&
        typeof document.startViewTransition === "function"
      ) {
        document.startViewTransition(() => {
          router.push(href);
        });
      } else {
        router.push(href);
      }
    },
    [router],
  );

  return { push };
}
