"use client";

import { Navigation } from "@/core/navigation";
import { Link } from "@/i18n/routing";
import { useCommandPalette } from "@/ui/components/CommandPaletteProvider";
import { Button } from "@/ui/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/ui/components/ui/sheet";
import { LocaleSwitcher } from "@/ui/header/components/LocaleSwitcher";
import { ThemeToggle } from "@/ui/theme/ThemeToggle";
import { Menu, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function Header() {
  const t = useTranslations("nav");
  const tA11y = useTranslations("a11y");
  const tCmd = useTranslations("commandPalette");
  const [open, setOpen] = useState(false);
  const { toggle: togglePalette } = useCommandPalette();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
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
          <ThemeToggle />

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label={tA11y("navigationMenu")}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetTitle className="sr-only">{tA11y("navigationMenu")}</SheetTitle>
              <nav aria-label={tA11y("mobileNav")} className="mt-8 flex flex-col gap-4">
                {Navigation.links.map((link) => {
                  const isRoute = link.href.startsWith("/");

                  if (isRoute) {
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                      >
                        {t(link.label)}
                      </Link>
                    );
                  }

                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {t(link.label)}
                    </a>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
