"use client";

import { Navigation } from "@/core/navigation";
import { Social } from "@/core/social";
import { Link } from "@/i18n/routing";
import { useCommandPalette } from "@/ui/components/CommandPaletteProvider";
import { Button } from "@/ui/components/ui/button";
import { Separator } from "@/ui/components/ui/separator";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/ui/components/ui/sheet";
import { LocaleSwitcher } from "@/ui/header/components/LocaleSwitcher";
import { AnimatePresence, type Variants, motion } from "framer-motion";
import {
  BookOpen,
  ExternalLink,
  Github,
  Globe,
  Home,
  Linkedin,
  Mail,
  Menu,
  Search,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ICONS: Record<string, React.ReactNode> = {
  home: <Home className="size-4" />,
  about: <User className="size-4" />,
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

export function Header() {
  const t = useTranslations("nav");
  const tA11y = useTranslations("a11y");
  const tCmd = useTranslations("commandPalette");
  const [open, setOpen] = useState(false);
  const { toggle: togglePalette } = useCommandPalette();
  const pathname = usePathname();

  return (
    <header
      style={{ viewTransitionName: "header" }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-colors duration-200"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold text-foreground" aria-label={tA11y("homeLink")}>
          JV Vogler
        </Link>

        {/* Desktop nav */}
        <nav aria-label={tA11y("desktopNav")} className="hidden items-center gap-6 md:flex">
          {Navigation.links.map((link) => {
            const isRoute = link.href.startsWith("/");

            if (isRoute) {
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t(link.label)}
                </Link>
              );
            }

            return (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {t(link.label)}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={togglePalette}
            aria-label={tCmd("placeholder")}
            className="hidden h-8 gap-1.5 px-3 text-sm text-muted-foreground sm:flex"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">{tCmd("placeholder")}</span>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePalette}
            aria-label={tCmd("placeholder")}
            className="h-8 w-8 sm:hidden"
          >
            <Search className="h-4 w-4" />
          </Button>
          <LocaleSwitcher />

          {/* Mobile menu */}
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
                              <Link
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className={linkClass}
                              >
                                <span
                                  className={isActive ? "text-primary" : "text-muted-foreground"}
                                >
                                  {NAV_ICONS[link.label]}
                                </span>
                                {t(link.label)}
                              </Link>
                            ) : (
                              <a
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className={linkClass}
                              >
                                <span className="text-muted-foreground">
                                  {NAV_ICONS[link.label]}
                                </span>
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
                {/* Social links */}
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

                {/* Locale */}
                <div className="flex items-center justify-between px-1">
                  <p className="text-xs text-muted-foreground">Language</p>
                  <LocaleSwitcher />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
