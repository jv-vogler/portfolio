"use client";

import { Badge } from "@/ui/components/ui/badge";
import { fadeIn } from "@/ui/lib/motion";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type TagFilterProps = {
  tags: string[];
};

export function TagFilter({ tags }: TagFilterProps) {
  const t = useTranslations("blog");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion();

  const activeTags = searchParams.getAll("tag");

  const toggleTag = useCallback(
    (tag: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.getAll("tag");

      params.delete("tag");
      if (current.includes(tag)) {
        // Remove tag
        for (const t of current) {
          if (t !== tag) params.append("tag", t);
        }
      } else {
        // Add tag
        for (const t of current) {
          params.append("tag", t);
        }
        params.append("tag", tag);
      }

      router.replace(`${pathname}?${params.toString()}` as never);
    },
    [searchParams, pathname, router],
  );

  const clearAll = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("tag");
    router.replace(`${pathname}?${params.toString()}` as never);
  }, [searchParams, pathname, router]);

  if (tags.length === 0) return null;

  return (
    <motion.div
      variants={prefersReducedMotion ? undefined : fadeIn}
      initial={prefersReducedMotion ? undefined : "hidden"}
      animate={prefersReducedMotion ? undefined : "visible"}
      className="mb-8 flex flex-wrap gap-2"
      role="group"
      aria-label={t("filterByTag")}
    >
      <button
        type="button"
        onClick={clearAll}
        aria-pressed={activeTags.length === 0}
        className="cursor-pointer"
      >
        <Badge
          variant={activeTags.length === 0 ? "default" : "outline"}
          className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          {t("allTags")}
        </Badge>
      </button>

      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => toggleTag(tag)}
          aria-pressed={activeTags.includes(tag)}
          className="cursor-pointer"
        >
          <Badge
            variant={activeTags.includes(tag) ? "default" : "outline"}
            className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            {tag}
          </Badge>
        </button>
      ))}
    </motion.div>
  );
}
