"use client";

import { Check, Copy } from "lucide-react";
import type { ReactNode } from "react";
import { useRef, useState } from "react";

type CodeBlockCopyProps = {
  children: ReactNode;
  language?: string;
};

export function CodeBlockCopy({ children, language }: CodeBlockCopyProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    const text = preRef.current?.innerText ?? "";
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for browsers without Clipboard API
        const textarea = document.createElement("textarea");
        textarea.value = text;
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

  return (
    <div className="group relative my-4">
      {language && (
        <div className="rounded-t-md border border-b-0 border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
          {language}
        </div>
      )}
      <pre
        ref={preRef}
        className="overflow-x-auto rounded-md border border-border bg-muted p-4 text-sm"
        data-language={language}
      >
        <code>{children}</code>
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Code copied!" : "Copy code"}
        className="absolute right-2 top-2 rounded border border-border bg-background p-1.5 text-muted-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:text-foreground focus-visible:opacity-100"
      >
        {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
}
