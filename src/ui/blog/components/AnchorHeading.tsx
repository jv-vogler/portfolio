"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, Link2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useState } from "react";

type AnchorHeadingProps = {
  id: string;
  level: 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
};

type CopyStatus = "idle" | "copied" | "failed";

export function AnchorHeading({ id, level, children, className }: AnchorHeadingProps) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const t = useTranslations("blog");
  const Tag = `h${level}` as "h2" | "h3" | "h4" | "h5" | "h6";

  const handleCopy = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (!ok) throw new Error("execCommand copy returned false");
      }
      history.replaceState(null, "", `#${id}`);
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("failed");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const label =
    status === "copied" ? t("linkCopied") : status === "failed" ? t("copyFailed") : t("copyLink");

  return (
    <Tag id={id} className={cn("group scroll-mt-24", className)}>
      {children}
      <button
        type="button"
        onClick={handleCopy}
        aria-label={label}
        title={status === "failed" ? label : undefined}
        className={cn(
          "ml-2 inline-flex translate-y-[-1px] items-center opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100",
          "rounded hover:text-foreground",
          status === "failed" ? "text-destructive opacity-100" : "text-muted-foreground",
        )}
      >
        {status === "failed" ? <AlertCircle className="size-4" /> : <Link2 className="size-4" />}
        <span role="status" aria-live="polite" className="sr-only">
          {status === "idle" ? "" : label}
        </span>
      </button>
    </Tag>
  );
}
