"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { createHighlighter } from "shiki";

type HighlighterInstance = Awaited<ReturnType<typeof createHighlighter>>;

// Singleton promise — initialised once, reused across all code blocks.
let highlighterPromise: Promise<HighlighterInstance> | null = null;

function getHighlighter(): Promise<HighlighterInstance> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["dracula"],
      langs: [
        "typescript",
        "javascript",
        "tsx",
        "jsx",
        "css",
        "html",
        "json",
        "bash",
        "sh",
        "zsh",
        "python",
        "rust",
        "go",
        "sql",
        "yaml",
        "markdown",
        "mdx",
        "plaintext",
      ],
    });
  }
  return highlighterPromise;
}

type CodeBlockCopyProps = {
  code: string;
  language?: string;
};

export function CodeBlockCopy({ code, language }: CodeBlockCopyProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Normalise language: fall back to "plaintext" for unknown/empty values.
    const lang = language && language !== "plaintext" ? language : "plaintext";

    getHighlighter()
      .then((highlighter) => {
        if (cancelled) return;
        // Guard: use plaintext if the lang wasn't loaded.
        const supported = highlighter.getLoadedLanguages();
        const safeLang = supported.includes(
          lang as Parameters<typeof highlighter.codeToHtml>[1]["lang"],
        )
          ? lang
          : "plaintext";
        const html = highlighter.codeToHtml(code, {
          lang: safeLang as Parameters<typeof highlighter.codeToHtml>[1]["lang"],
          theme: "dracula",
        });
        setHighlightedHtml(html);
      })
      .catch(() => {
        // Graceful fail — leave highlightedHtml as null (plain fallback renders).
      });

    return () => {
      cancelled = true;
    };
  }, [code, language]);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for browsers without Clipboard API
        const textarea = document.createElement("textarea");
        textarea.value = code;
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
      // Graceful fail — do nothing
    }
  };

  const hasLanguage = Boolean(language);

  return (
    // not-prose prevents @tailwindcss/typography from interfering with the
    // shiki-generated <pre> / <code> elements inside.
    <div className="not-prose group my-4">
      {hasLanguage && (
        <div className="rounded-t-md border border-b-0 border-[#44475a] bg-[#282a36] px-3 py-1 font-mono text-xs text-[#6272a4]">
          {language}
        </div>
      )}
      <div
        className={`relative overflow-hidden border border-[#44475a] ${
          hasLanguage ? "rounded-b-md" : "rounded-md"
        }`}
      >
        {highlightedHtml ? (
          // Shiki emits a <pre> with inline background/colour styles.
          // [&>pre] overrides margin/padding/border-radius so it fills the container.
          <div
            className="overflow-x-auto [&>pre]:!m-0 [&>pre]:!rounded-none [&>pre]:!border-0 [&>pre]:p-4 [&>pre]:text-sm"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki output is safe (generated server/client from our own code strings)
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          // Plain fallback while the highlighter is loading.
          <pre className="overflow-x-auto bg-[#282a36] p-4 text-sm text-[#f8f8f2]">
            <code>{code}</code>
          </pre>
        )}
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Code copied!" : "Copy code"}
          className="absolute right-2 top-2 rounded border border-[#44475a] bg-[#282a36] p-1.5 text-[#6272a4] opacity-0 shadow-sm transition-opacity hover:text-[#f8f8f2] focus-visible:opacity-100 group-hover:opacity-100"
        >
          {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
        </button>
      </div>
    </div>
  );
}
