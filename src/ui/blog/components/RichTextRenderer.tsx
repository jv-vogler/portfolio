"use client";

import { AnchorHeading } from "@/ui/blog/components/AnchorHeading";
import { CodeBlockCopy } from "@/ui/blog/components/CodeBlockCopy";
import type { JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "lexical";

type RichTextRendererProps = {
  data: SerializedEditorState;
};

/** Replicate the heading-slug logic from core/blog.ts for client-side use. */
function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Recursively extract text from a Lexical node tree. */
function extractNodeText(node: { type?: string; text?: string; children?: unknown[] }): string {
  if (node.type === "text" && typeof node.text === "string") return node.text;
  if (Array.isArray(node.children)) {
    return (node.children as Array<{ type?: string; text?: string; children?: unknown[] }>)
      .map(extractNodeText)
      .join("");
  }
  return "";
}

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,

  /** Override heading nodes to add anchor ids and a copy-link button. */
  heading: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    const rawText = extractNodeText(node as { type?: string; text?: string; children?: unknown[] });
    const id = slugifyHeading(rawText);
    const tag = node.tag as string;
    const level = parseInt(tag.replace("h", ""), 10) as 2 | 3 | 4 | 5 | 6;
    return (
      <AnchorHeading id={id} level={level}>
        {children}
      </AnchorHeading>
    );
  },

  /** Override native Lexical code-block nodes to add a copy button. */
  code: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    const language = (node as unknown as { language?: string }).language;
    return <CodeBlockCopy language={language}>{children}</CodeBlockCopy>;
  },
});

export function RichTextRenderer({ data }: RichTextRendererProps) {
  return <RichText data={data} converters={converters} />;
}
