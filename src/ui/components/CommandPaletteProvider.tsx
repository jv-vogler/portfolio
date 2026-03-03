"use client";

import type { Blog } from "@/core/blog";
import { CommandPalette } from "@/ui/components/CommandPalette";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

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

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  // Global keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  return (
    <CommandPaletteContext.Provider value={{ open, close, toggle }}>
      {children}
      <CommandPalette open={isOpen} onOpenChange={setIsOpen} posts={posts} />
    </CommandPaletteContext.Provider>
  );
}
