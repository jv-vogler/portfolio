"use client";

import { Social } from "@/core/social";
import { Link } from "@/i18n/routing";
import { SocialIcon } from "@/ui/lib/icons";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const tA11y = useTranslations("a11y");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-border/40 bg-background !transition-none"
      style={{ contain: "layout style paint" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-8 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-4">
          {Social.items.map((item) => (
            <a
              key={item.slug}
              href={item.url}
              target={item.url.startsWith("mailto:") ? undefined : "_blank"}
              rel={item.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
              aria-label={
                item.url.startsWith("mailto:")
                  ? item.label
                  : `${item.label} (${tA11y("opensInNewTab")})`
              }
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <SocialIcon slug={item.slug} size={20} />
            </a>
          ))}
        </div>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            {tNav("home")}
          </Link>
          <Link href="/portfolio" className="transition-colors hover:text-foreground">
            {tNav("portfolio")}
          </Link>
          <Link href="/blog" className="transition-colors hover:text-foreground">
            {tNav("blog")}
          </Link>
          <Link href="/about" className="transition-colors hover:text-foreground">
            {tNav("about")}
          </Link>
        </nav>
        <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground sm:items-end">
          <p>
            &copy; {year} JV Vogler. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
