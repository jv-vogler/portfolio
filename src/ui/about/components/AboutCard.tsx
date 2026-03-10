"use client";

import type { ProfileImage } from "@/lib/payload";
import { Social } from "@/core/social";
import { SocialIcon } from "@/ui/lib/icons";
import { parallaxFadeIn, staggerContainer, fadeInUp } from "@/ui/lib/motion";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

type AboutCardProps = {
  profileImage?: ProfileImage;
  elevatorPitch?: string | null;
};

const FALLBACK_IMAGE = "/images/hero/profile.jpg";

export function AboutCard({ profileImage, elevatorPitch }: AboutCardProps) {
  const t = useTranslations("about");
  const tA11y = useTranslations("a11y");
  const prefersReducedMotion = useReducedMotion();

  const imageSrc = profileImage?.url ?? FALLBACK_IMAGE;
  const imageAlt = profileImage?.alt ?? tA11y("authorPhoto1");
  const pitch = elevatorPitch ?? t("elevatorPitch");

  return (
    <section className="relative py-16 sm:py-24">
      {/* Card */}
      <motion.div
        className="relative mx-auto max-w-[700px] overflow-hidden rounded-3xl border bg-card px-8 py-10 shadow-lg sm:px-12 sm:py-14"
        variants={prefersReducedMotion ? undefined : parallaxFadeIn}
        initial={prefersReducedMotion ? undefined : "hidden"}
        whileInView={prefersReducedMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.3 }}
        whileHover={prefersReducedMotion ? undefined : { scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        {/* Diagonal teal accent */}
        <div
          className="absolute top-0 right-0 size-32 bg-primary/20"
          style={{
            clipPath: "polygon(100% 0, 0 0, 100% 100%)",
          }}
          aria-hidden="true"
        />

        {/* Top row: photo + identity */}
        <div className="mb-8 flex items-center gap-6">
          {/* Profile photo with teal ring */}
          <motion.div
            className="shrink-0 overflow-hidden rounded-full ring-4 ring-primary/30"
            initial={prefersReducedMotion ? undefined : { clipPath: "circle(0%)" }}
            whileInView={prefersReducedMotion ? undefined : { clipPath: "circle(50%)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={120}
              height={120}
              className="size-[120px] object-cover"
            />
          </motion.div>

          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">JV Vogler</h2>
            <p className="text-lg text-primary">Software Engineer</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5" />
              {t("location")}
            </p>
          </div>
        </div>

        {/* Elevator pitch */}
        <p className="mb-8 text-base leading-relaxed text-muted-foreground sm:text-lg">{pitch}</p>

        {/* Bottom strip: social icons + learn more */}
        <motion.div
          className="flex flex-wrap items-center justify-between gap-4 border-t pt-6"
          variants={prefersReducedMotion ? undefined : staggerContainer}
          initial={prefersReducedMotion ? undefined : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={{ once: true }}
        >
          <div className="flex gap-4">
            {Social.items.map((item) => {
              const isMailto = item.url.startsWith("mailto:");
              return (
                <motion.a
                  key={item.slug}
                  href={item.url}
                  target={isMailto ? undefined : "_blank"}
                  rel={isMailto ? undefined : "noopener noreferrer"}
                  className="flex size-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
                  variants={prefersReducedMotion ? undefined : fadeInUp}
                  aria-label={item.label}
                >
                  <SocialIcon slug={item.slug} size={18} />
                  {!isMailto && <span className="sr-only"> ({tA11y("opensInNewTab")})</span>}
                </motion.a>
              );
            })}
          </div>

          <div className="flex flex-col items-end gap-1">
            <Link
              href="/about"
              className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              {t("learnMore")} &rarr;
            </Link>
            <a
              href="#contact"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                setTimeout(() => {
                  document.getElementById("message")?.focus();
                }, 600);
              }}
            >
              {t("reachOut")} &darr;
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
