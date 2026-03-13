"use client";

import type { Blog } from "@/core/blog";
import type { Portfolio } from "@/core/portfolio";
import { usePathname, useRouter } from "@/i18n/routing";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

const CommandPalette = dynamic(() =>
  import("@/ui/components/CommandPalette").then((m) => m.CommandPalette),
);

type Post = Pick<Blog.Post, "slug" | "title" | "tags">;
type Project = Pick<Portfolio.Project, "slug" | "title" | "techs">;

type CommandPaletteContextValue = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) throw new Error("useCommandPalette must be used inside CommandPaletteProvider");
  return ctx;
}

type CommandPaletteProviderProps = {
  children: ReactNode;
  posts: Post[];
  projects: Project[];
};

export function CommandPaletteProvider({ children, posts, projects }: CommandPaletteProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((isOpenValue) => !isOpenValue), []);
  const toggleLocale = useCallback(
    () => router.replace(pathname, { locale: locale === "en" ? "pt" : "en" }),
    [router, pathname, locale],
  );

  useHotkey("Mod+K", toggle);
  useHotkey("Mod+Shift+L", toggleLocale);

  return (
    <CommandPaletteContext.Provider value={{ open, close, toggle }}>
      {children}
      <CommandPalette
        open={isOpen}
        onOpenChange={setIsOpen}
        posts={posts}
        projects={projects}
        onToggleLocale={toggleLocale}
      />
    </CommandPaletteContext.Provider>
  );
}
