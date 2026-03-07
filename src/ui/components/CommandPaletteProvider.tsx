"use client";

import type { Blog } from "@/core/blog";
import { usePathname, useRouter } from "@/i18n/routing";
import { CommandPalette } from "@/ui/components/CommandPalette";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type Post = Pick<Blog.Post, "slug" | "title" | "tags">;

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
};

export function CommandPaletteProvider({ children, posts }: CommandPaletteProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { setTheme, theme } = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((isOpenValue) => !isOpenValue), []);
  const toggleTheme = useCallback(
    () => setTheme(theme === "dark" ? "light" : "dark"),
    [setTheme, theme],
  );
  const toggleLocale = useCallback(
    () => router.replace(pathname, { locale: locale === "en" ? "pt" : "en" }),
    [router, pathname, locale],
  );

  useHotkey("Mod+K", toggle);
  useHotkey("Mod+Shift+M", toggleTheme);
  useHotkey("Mod+Shift+L", toggleLocale);

  return (
    <CommandPaletteContext.Provider value={{ open, close, toggle }}>
      {children}
      <CommandPalette
        open={isOpen}
        onOpenChange={setIsOpen}
        posts={posts}
        onToggleTheme={toggleTheme}
        onToggleLocale={toggleLocale}
      />
    </CommandPaletteContext.Provider>
  );
}
