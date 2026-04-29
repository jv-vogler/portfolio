"use client";

import { ContactForm } from "@/ui/contact/components/ContactForm";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";

export function ContactSection() {
  const t = useTranslations("contact");
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="dot-grid relative py-16 sm:py-24"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5 }}
        >
          <h2
            id="contact-heading"
            className="mb-4 text-center text-3xl font-bold text-foreground sm:text-4xl"
          >
            {t("heading")}
          </h2>
          <p className="mb-12 text-center text-muted-foreground">{t("description")}</p>

          <div className="mx-auto max-w-lg">
            <ContactForm />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
