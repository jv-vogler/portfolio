"use client";

import { AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

import { usePathname } from "@/i18n/routing";

import { PageTransition } from "./PageTransition";

type BlogTransitionWrapperProps = {
  children: ReactNode;
};

export function BlogTransitionWrapper({ children }: BlogTransitionWrapperProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={pathname}>{children}</PageTransition>
    </AnimatePresence>
  );
}
