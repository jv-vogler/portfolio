"use client";

import { Social } from "@/core/social";
import { SocialIcon } from "@/ui/lib/icons";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

export function Footer() {
  const t = useTranslations("footer");
  const tA11y = useTranslations("a11y");
  const year = new Date().getFullYear();
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { rootMargin: "0px 0px 80px 0px", threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={ref}
      className="border-t border-border/40 bg-background transition-all duration-500 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between">
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
        <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground sm:items-end">
          <p>
            &copy; {year} JV Vogler. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
