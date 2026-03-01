"use client";

import { Social } from "@/core/social";
import { ContactForm } from "@/ui/contact/components/ContactForm";
import { SocialIcon } from "@/ui/lib/icons";
import { MotionSection } from "@/ui/lib/motion";
import { useTranslations } from "next-intl";

export function ContactSection() {
  const t = useTranslations("contact");
  const tA11y = useTranslations("a11y");

  return (
    <MotionSection
      id="contact"
      aria-labelledby="contact-heading"
      className="mx-auto max-w-6xl px-4 py-20"
    >
      <div className="mb-12 text-center">
        <h2 id="contact-heading" className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
          {t("heading")}
        </h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-2">
        {/* Form */}
        <div>
          <ContactForm />
        </div>

        {/* Social links */}
        <div className="flex flex-col justify-center gap-6">
          <h3 className="text-lg font-semibold text-foreground">{t("heading")}</h3>
          <div className="flex flex-col gap-4">
            {Social.items.map((item) => {
              const isMailto = item.url.startsWith("mailto:");
              return (
                <a
                  key={item.slug}
                  href={item.url}
                  target={isMailto ? undefined : "_blank"}
                  rel={isMailto ? undefined : "noopener noreferrer"}
                  className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <SocialIcon slug={item.slug} size={20} />
                  <span>{item.label}</span>
                  {!isMailto && <span className="sr-only"> ({tA11y("opensInNewTab")})</span>}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
