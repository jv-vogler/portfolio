"use client";

import { useFocusedReading } from "@/ui/blog/context/FocusedReadingContext";
import { BookOpen, BookX } from "lucide-react";
import { useTranslations } from "next-intl";

export function FocusedReadingToggle() {
  const { isFocused, toggle } = useFocusedReading();
  const t = useTranslations("blog");

  // Desktop-only blog header control. Sized to match the 32px desktop search
  // button (Button size=sm) rather than the AAA 44×44 target. Focus ring
  // mirrors the canonical Button base (border-ring + ring/50 at 3px) so all
  // three header chrome controls share one focus style.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isFocused ? t("exitFocusedReading") : t("focusedReading")}
      aria-pressed={isFocused}
      title={isFocused ? t("exitFocusedReading") : t("focusedReading")}
      className="inline-flex size-8 items-center justify-center rounded-md border border-transparent text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      {isFocused ? <BookX className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
    </button>
  );
}
