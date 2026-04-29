"use client";

import { useRouter } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

export function PortfolioBackButton() {
  const router = useRouter();
  const t = useTranslations("portfolio");

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/#portfolio");
    }
  };

  return (
    <button
      onClick={handleBack}
      className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
    >
      <ArrowLeft className="h-4 w-4" />
      {t("backToPortfolio")}
    </button>
  );
}
