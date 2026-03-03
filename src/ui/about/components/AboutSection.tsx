"use client";

import type { AboutItem } from "@/lib/payload";
import { fadeInUp, staggerContainer } from "@/ui/lib/motion";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface AboutSectionProps {
  items: AboutItem[];
}

export function AboutSection({ items }: AboutSectionProps) {
  const t = useTranslations();

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
              src="/images/hero/profile.jpg"
              alt={t("a11y.authorPhoto1")}
              fill
              className="object-cover"
              sizes="256px"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold">JV Vogler</h1>
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
                <h3 className="mb-2 text-lg font-medium italic text-primary">{item.question}</h3>
                <p className="leading-relaxed text-muted-foreground">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
