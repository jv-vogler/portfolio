"use client";

import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

const localeLabels: Record<Locale, string> = {
  en: "EN",
  pt: "PT",
};

export function LocaleSwitcher() {
  const t = useTranslations("a11y");
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(locale: Locale) {
    const scrollY = window.scrollY;
    router.replace(pathname, { locale });
    // Restore scroll position after locale change
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
  }

  return (
    <div className="flex items-center gap-1" role="group" aria-label={t("toggleLanguage")}>
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => switchLocale(locale)}
          disabled={locale === currentLocale}
          aria-current={locale === currentLocale ? "true" : undefined}
          className="rounded-md px-2 py-1 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:bg-primary disabled:text-primary-foreground disabled:opacity-100"
        >
          {localeLabels[locale]}
        </button>
      ))}
    </div>
  );
}
