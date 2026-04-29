"use client";

import { useFocusedReading } from "@/ui/blog/context/FocusedReadingContext";
import { BookOpen, BookX } from "lucide-react";
import { useTranslations } from "next-intl";

export function FocusedReadingToggle() {
  const { isFocused, toggle } = useFocusedReading();
  const t = useTranslations("blog");

  // Desktop-only blog header control. Sized to match the 32px row rhythm of
  // LocaleSwitcher and the desktop search button rather than the AAA 44×44 target.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isFocused ? t("exitFocusedReading") : t("focusedReading")}
      aria-pressed={isFocused}
      title={isFocused ? t("exitFocusedReading") : t("focusedReading")}
      className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {isFocused ? <BookX className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
    </button>
  );
}
