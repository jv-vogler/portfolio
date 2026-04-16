"use client";

import { Navigation } from "@/core/navigation";
import { Social } from "@/core/social";
import { Link } from "@/i18n/routing";
import { Button } from "@/ui/components/ui/button";
import { Separator } from "@/ui/components/ui/separator";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/ui/components/ui/sheet";
import { LocaleSwitcher } from "@/ui/header/components/LocaleSwitcher";
import { AnimatePresence, type Variants, motion } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  ExternalLink,
  Github,
  Globe,
  Home,
  Linkedin,
  Mail,
  Menu,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ICONS: Record<string, React.ReactNode> = {
  home: <Home className="size-4" />,
  about: <User className="size-4" />,
  portfolio: <Briefcase className="size-4" />,
  blog: <BookOpen className="size-4" />,
  contact: <Mail className="size-4" />,
};

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  linkedin: <Linkedin className="size-4" />,
  mail: <Mail className="size-4" />,
  instagram: <Globe className="size-4" />,
  github: <Github className="size-4" />,
};

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

export function MobileNav() {
  const t = useTranslations("nav");
  const tA11y = useTranslations("a11y");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" aria-label={tA11y("navigationMenu")}>
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-72 flex-col p-0">
        <SheetTitle className="sr-only">{tA11y("navigationMenu")}</SheetTitle>

        {/* Header / branding */}
        <div className="flex items-center gap-3 border-b border-border/60 px-5 py-4">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            JV
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">JV Vogler</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Frontend Developer</p>
          </div>
        </div>

        {/* Nav links */}
        <nav aria-label={tA11y("mobileNav")} className="flex-1 overflow-y-auto px-3 py-4">
          <AnimatePresence>
            {open && (
              <motion.ul
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="space-y-1"
              >
                {Navigation.links.map((link) => {
                  const isRoute = link.href.startsWith("/");
                  const isActive =
                    isRoute &&
                    (link.href === "/"
                      ? pathname.endsWith("/")
                      : pathname.includes(link.href.replace("/#", "/")));

                  const linkClass = `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`;

                  return (
                    <motion.li key={link.label} variants={itemVariants}>
                      {isRoute ? (
                        <Link href={link.href} onClick={() => setOpen(false)} className={linkClass}>
                          <span className={isActive ? "text-primary" : "text-muted-foreground"}>
                            {NAV_ICONS[link.label]}
                          </span>
                          {t(link.label)}
                        </Link>
                      ) : (
                        <a href={link.href} onClick={() => setOpen(false)} className={linkClass}>
                          <span className="text-muted-foreground">{NAV_ICONS[link.label]}</span>
                          {t(link.label)}
                        </a>
                      )}
                    </motion.li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>
        </nav>

        {/* Footer: social + controls */}
        <div className="border-t border-border/60 px-3 py-4 space-y-3">
          <div className="flex items-center gap-1 px-1">
            {Social.items.map((item) => (
              <a
                key={item.slug}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.label} — ${tA11y("opensInNewTab")}`}
                className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {SOCIAL_ICONS[item.slug] ?? <ExternalLink className="size-4" />}
              </a>
            ))}
          </div>

          <Separator className="opacity-60" />

          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-muted-foreground">Language</p>
            <LocaleSwitcher />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
