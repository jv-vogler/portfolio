"use client";

import type { AboutItem, ProfileImage } from "@/lib/payload";
import { fadeInUp, staggerContainer } from "@/ui/lib/motion";
import { Button } from "@/ui/components/ui/button";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";

interface AboutSectionProps {
  items: AboutItem[];
  profileImage: ProfileImage;
}

const FALLBACK_IMAGE = "/images/hero/profile.jpg";

export function AboutSection({ items, profileImage }: AboutSectionProps) {
  const t = useTranslations();
  const imageSrc = profileImage?.url ?? FALLBACK_IMAGE;
  const imageAlt = profileImage?.alt ?? t("a11y.authorPhoto1");

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="container mx-auto max-w-6xl px-4 py-20"
    >
      <div className="flex flex-col gap-12 lg:flex-row">
        {/* Left column — sticky photo + name */}
        <motion.aside
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center lg:sticky lg:top-24 lg:w-80 lg:shrink-0 lg:self-start"
        >
          <div className="relative mb-6 h-64 w-64 overflow-hidden rounded-2xl bg-muted shadow-lg">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="256px"
              priority
              loading="eager"
            />
          </div>
          <p className="text-sm text-muted-foreground">{t("metadata.description")}</p>
        </motion.aside>

        {/* Right column — Q&A */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex-1"
        >
          <motion.h2 id="about-heading" variants={fadeInUp} className="mb-10 text-3xl font-bold">
            {t("about.heading")}
          </motion.h2>

          <div className="space-y-8">
            {items.map((item, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <h3 className="mb-2 text-lg font-medium italic text-foreground">{item.question}</h3>
                <p className="leading-relaxed text-muted-foreground">{item.answer}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeInUp}
            className="mt-10 flex flex-wrap gap-3 border-t border-border/40 pt-8"
          >
            <Link href="/portfolio">
              <Button>{t("about.viewPortfolio")}</Button>
            </Link>
            <Link href="/blog">
              <Button variant="outline">{t("about.readBlog")}</Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
