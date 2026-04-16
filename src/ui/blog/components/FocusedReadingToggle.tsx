"use client";

import { useFocusedReading } from "@/ui/blog/context/FocusedReadingContext";
import { Button } from "@/ui/components/ui/button";
import { BookOpen, BookX } from "lucide-react";
import { useTranslations } from "next-intl";

export function FocusedReadingToggle() {
  const { isFocused, toggle } = useFocusedReading();
  const t = useTranslations("blog");

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={isFocused ? t("exitFocusedReading") : t("focusedReading")}
      aria-pressed={isFocused}
      title={isFocused ? t("exitFocusedReading") : t("focusedReading")}
      className="h-8 w-8 text-muted-foreground transition-colors hover:text-foreground"
    >
      {isFocused ? <BookX className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
    </Button>
  );
}
