"use client";

import { useRouter } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";

export function PortfolioBackButton() {
  const router = useRouter();
  const t = useTranslations("portfolio");
  const navigatingRef = useRef(false);

  const handleBack = () => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;

    const canGoBack = window.history.length > 1;
    const navigate = () => {
      if (canGoBack) {
        router.back();
      } else {
        router.push("/#portfolio");
      }
    };

    if ("startViewTransition" in document && typeof document.startViewTransition === "function") {
      try {
        const transition = (document.startViewTransition as any)({
          update: navigate,
          types: ["backward"],
        });
        transition.finished.finally(() => {
          navigatingRef.current = false;
        });
      } catch {
        // Fallback for browsers that only support callback form
        document.startViewTransition(navigate);
        navigatingRef.current = false;
      }
    } else {
      navigate();
      navigatingRef.current = false;
    }
  };

  return (
    <button
      onClick={handleBack}
      className="mb-8 inline-flex items-center gap-2 text-sm text-[oklch(0.65_0_0)] transition-colors hover:text-[oklch(0.85_0_0)] cursor-pointer"
    >
      <ArrowLeft className="h-4 w-4" />
      {t("backToPortfolio")}
    </button>
  );
}
