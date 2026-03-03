"use client";

import type { Blog } from "@/core/blog";
import { Navigation } from "@/core/navigation";
import { Social } from "@/core/social";
import { useRouter } from "@/i18n/routing";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/ui/components/ui/command";
import { formatForDisplay } from "@tanstack/react-hotkeys";
import {
  BookOpen,
  ExternalLink,
  Github,
  Globe,
  Home,
  Languages,
  Link2,
  Linkedin,
  Mail,
  Moon,
  User,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback } from "react";

type Post = Pick<Blog.Post, "slug" | "title" | "tags">;

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  posts: Post[];
  onToggleTheme: () => void;
  onToggleLocale: () => void;
};

const NAV_ICONS: Record<string, React.ReactNode> = {
  home: <Home className="mr-2 h-4 w-4" />,
  about: <User className="mr-2 h-4 w-4" />,
  blog: <BookOpen className="mr-2 h-4 w-4" />,
  contact: <Mail className="mr-2 h-4 w-4" />,
};

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  linkedin: <Linkedin className="mr-2 h-4 w-4" />,
  mail: <Mail className="mr-2 h-4 w-4" />,
  instagram: <Globe className="mr-2 h-4 w-4" />,
  github: <Github className="mr-2 h-4 w-4" />,
};

export function CommandPalette({
  open,
  onOpenChange,
  posts,
  onToggleTheme,
  onToggleLocale,
}: CommandPaletteProps) {
  const t = useTranslations("commandPalette");
  const tNav = useTranslations("nav");
  const router = useRouter();
  const locale = useLocale();

  const handleSelect = useCallback(
    (action: () => void) => {
      onOpenChange(false);
      action();
    },
    [onOpenChange],
  );

  const navigateTo = useCallback(
    (href: string) => {
      if (href.startsWith("http") || href.startsWith("mailto")) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else if (href.startsWith("/#")) {
        window.location.href = `/${locale}${href.slice(1)}`;
      } else {
        router.push(href as Parameters<typeof router.push>[0]);
      }
    },
    [router, locale],
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder={t("placeholder")} />
      <CommandList>
        <CommandEmpty>{t("noResults")}</CommandEmpty>

        {/* Navigation group */}
        <CommandGroup heading={t("navigation")}>
          {Navigation.links.map((link) => (
            <CommandItem
              key={link.label}
              value={tNav(link.label)}
              onSelect={() => handleSelect(() => navigateTo(link.href))}
              keywords={[link.href]}
            >
              {NAV_ICONS[link.label] ?? <Globe className="mr-2 h-4 w-4" />}
              {tNav(link.label)}
            </CommandItem>
          ))}
        </CommandGroup>

        {/* Blog posts group */}
        {posts.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading={t("posts")}>
              {posts.map((post) => (
                <CommandItem
                  key={post.slug}
                  value={post.title}
                  onSelect={() => handleSelect(() => navigateTo(`/blog/${post.slug}`))}
                  keywords={post.tags}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  {post.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Social links group */}
        <CommandSeparator />
        <CommandGroup heading={t("social")}>
          {Social.items.map((item) => (
            <CommandItem
              key={item.slug}
              value={item.label}
              onSelect={() => handleSelect(() => navigateTo(item.url))}
            >
              {SOCIAL_ICONS[item.slug] ?? <Link2 className="mr-2 h-4 w-4" />}
              {item.label}
              <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground" />
            </CommandItem>
          ))}
        </CommandGroup>

        {/* Actions group */}
        <CommandSeparator />
        <CommandGroup heading={t("actions")}>
          <CommandItem value={t("toggleTheme")} onSelect={() => handleSelect(onToggleTheme)}>
            <Moon className="mr-2 h-4 w-4" />
            {t("toggleTheme")}
            <kbd className="ml-auto font-mono text-xs text-muted-foreground">
              {formatForDisplay("Mod+Shift+M")}
            </kbd>
          </CommandItem>
          <CommandItem value={t("toggleLanguage")} onSelect={() => handleSelect(onToggleLocale)}>
            <Languages className="mr-2 h-4 w-4" />
            {t("toggleLanguage")} ({locale === "en" ? "PT" : "EN"})
            <kbd className="ml-auto font-mono text-xs text-muted-foreground">
              {formatForDisplay("Mod+Shift+L")}
            </kbd>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
