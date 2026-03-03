"use client";

import { Check, Link2, Linkedin, Share2, Twitter } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

type ShareButtonsProps = {
  url: string;
  title: string;
};

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const t = useTranslations("blog");
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Graceful fail
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
      {/* Mobile: Web Share API */}
      {typeof navigator !== "undefined" && "share" in navigator ? (
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
            aria-label="Share on X / Twitter"
            className={buttonClass}
          >
            <Twitter className="size-4" />X
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
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
        aria-label={t("copyLink")}
        className={buttonClass}
      >
        {copied ? (
          <>
            <Check className="size-4 text-green-500" />
            {t("linkCopied")}
          </>
        ) : (
          <>
            <Link2 className="size-4" />
            {t("copyLink")}
          </>
        )}
      </button>
    </div>
  );
}
