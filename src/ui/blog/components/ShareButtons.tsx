"use client";

import { useFocusedReading } from "@/ui/blog/context/FocusedReadingContext";
import { AlertCircle, Check, Link2, Linkedin, Share2, Twitter } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type ShareButtonsProps = {
  url: string;
  title: string;
};

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const { isFocused } = useFocusedReading();
  const t = useTranslations("blog");
  const tA11y = useTranslations("a11y");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  // Start as false so server and initial client render agree (no navigator on server).
  // Set to true after mount only if the Web Share API is actually available.
  const [hasNativeShare, setHasNativeShare] = useState(false);

  useEffect(() => {
    setHasNativeShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  if (isFocused) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = async () => {
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
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      setCopyStatus("failed");
      setTimeout(() => setCopyStatus("idle"), 3000);
    }
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title, url });
    } catch {
      // Dismissed or not supported — graceful fail
    }
  };

  const buttonClass =
    "flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label={t("sharePost")}>
      {/* Mobile: Web Share API — only rendered after mount to avoid hydration mismatch */}
      {hasNativeShare ? (
        <button type="button" onClick={handleNativeShare} className={buttonClass}>
          <Share2 className="size-4" />
          {t("sharePost")}
        </button>
      ) : (
        <>
          {/* Desktop: individual share buttons */}
          <a
            href={`https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on X / Twitter — ${tA11y("opensInNewTab")}`}
            className={buttonClass}
          >
            <Twitter className="size-4" />X
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on LinkedIn — ${tA11y("opensInNewTab")}`}
            className={buttonClass}
          >
            <Linkedin className="size-4" />
            LinkedIn
          </a>
        </>
      )}

      {/* Copy link — always visible */}
      <button
        type="button"
        onClick={handleCopyLink}
        aria-label={
          copyStatus === "copied"
            ? t("linkCopied")
            : copyStatus === "failed"
              ? t("copyFailed")
              : t("copyLink")
        }
        className={buttonClass}
        data-status={copyStatus}
      >
        {copyStatus === "copied" ? (
          <>
            <Check className="size-4 text-primary" />
            {t("linkCopied")}
          </>
        ) : copyStatus === "failed" ? (
          <>
            <AlertCircle className="size-4 text-destructive" />
            {t("copyFailed")}
          </>
        ) : (
          <>
            <Link2 className="size-4" />
            {t("copyLink")}
          </>
        )}
        <span role="status" aria-live="polite" className="sr-only">
          {copyStatus === "copied"
            ? t("linkCopied")
            : copyStatus === "failed"
              ? t("copyFailed")
              : ""}
        </span>
      </button>
    </div>
  );
}
