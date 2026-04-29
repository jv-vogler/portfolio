"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ComponentProps, ReactNode } from "react";

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const slideInFromLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const parallaxFadeIn: Variants = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

export const slideInFromLeftWide: Variants = {
  hidden: { opacity: 0, x: -80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const slideInFromRightWide: Variants = {
  hidden: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const scaleOnHover: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2, ease: "easeInOut" } },
};

export const letterCascade: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export const drawLine: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: "easeInOut" },
  },
};

type MotionSectionProps = {
  children: ReactNode;
  className?: string;
} & Omit<
  ComponentProps<typeof motion.section>,
  "variants" | "initial" | "whileInView" | "viewport"
>;

export function MotionSection({ children, className, ...props }: MotionSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      variants={prefersReducedMotion ? undefined : fadeInUp}
      initial={prefersReducedMotion ? undefined : "hidden"}
      whileInView={prefersReducedMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.2 }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}
