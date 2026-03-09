"use client";

import { useRouter } from "@/i18n/routing";
import { useCallback, useRef } from "react";

/**
 * Wraps Next.js router.push with the native View Transitions API.
 * Falls back to a normal navigation when the API isn't supported or
 * the user prefers reduced motion.
 *
 * Exposes `prefetch` for intent-based prefetching (e.g. on hover).
 * Guards against concurrent navigations to prevent race conditions.
 */
export function useViewTransitionRouter() {
  const router = useRouter();
  const navigatingRef = useRef(false);

  const push = useCallback(
    (href: string) => {
      if (navigatingRef.current) return;
      navigatingRef.current = true;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (
        !prefersReducedMotion &&
        "startViewTransition" in document &&
        typeof document.startViewTransition === "function"
      ) {
        try {
          const transition = (document.startViewTransition as any)({
            update: () => {
              router.push(href);
            },
            types: ["forward"],
          });
          transition.finished.finally(() => {
            navigatingRef.current = false;
          });
        } catch {
          // Fallback for browsers that only support callback form
          document.startViewTransition(() => {
            router.push(href);
          });
          navigatingRef.current = false;
        }
      } else {
        router.push(href);
        navigatingRef.current = false;
      }
    },
    [router],
  );

  const prefetch = useCallback(
    (href: string) => {
      router.prefetch(href);
    },
    [router],
  );

  return { push, prefetch };
}
