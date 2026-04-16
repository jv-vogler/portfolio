"use client";

import { Navigation } from "@/core/navigation";
import { Link } from "@/i18n/routing";
import { useFocusedReading } from "@/ui/blog/context/FocusedReadingContext";
import { useCommandPalette } from "@/ui/components/CommandPaletteProvider";
import { Button } from "@/ui/components/ui/button";
import { LocaleSwitcher } from "@/ui/header/components/LocaleSwitcher";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

const MobileNav = dynamic(
  () => import("@/ui/header/components/MobileNav").then((m) => m.MobileNav),
  { ssr: false },
);

export function Header() {
  const t = useTranslations("nav");
  const tA11y = useTranslations("a11y");
  const tCmd = useTranslations("commandPalette");
  const { toggle: togglePalette } = useCommandPalette();
  const { isFocused } = useFocusedReading();

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
        <nav
          aria-label={tA11y("desktopNav")}
          className={cn("hidden items-center gap-6 md:flex", isFocused && "!hidden")}
        >
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
            <kbd
              aria-hidden="true"
              className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex"
            >
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
          {!isFocused && <LocaleSwitcher />}

          {/* Mobile menu */}
          <MobileNav isFocused={isFocused} />
        </div>
      </div>
    </header>
  );
}
