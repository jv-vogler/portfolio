import { $createCodeNode, CodeHighlightNode, CodeNode } from "@lexical/code";
import { createNode, createServerFeature } from "@payloadcms/richtext-lexical";
import { $createTextNode, type ElementNode, type LexicalNode } from "lexical";

/**
 * Markdown transformer for fenced code blocks — ```lang\n…\n``` — producing
 * a Lexical CodeNode with a plain text child. The renderer in
 * `src/ui/blog/components/RichTextRenderer.tsx` accepts either raw text children
 * or code-highlight children; Shiki does the actual syntax highlighting at
 * render time, so there's no need to produce highlight nodes at import time.
 *
 * Payload's default features do not register a fenced-code markdown transformer
 * (code blocks are handled via the Blocks feature instead), so we add one here
 * to keep markdown → Lexical round-trips consistent with how posts were
 * originally seeded.
 */
const CODE_BLOCK_TRANSFORMER = {
  dependencies: [CodeNode],
  type: "multiline-element" as const,
  regExpStart: /^```([a-zA-Z0-9+\-_]*)\s*$/,
  regExpEnd: /^```\s*$/,
  replace: (
    rootNode: ElementNode,
    _children: unknown,
    startMatch: Array<string>,
    _endMatch: Array<string> | null,
    linesInBetween: Array<string> | null,
    isImport: boolean,
  ): boolean | void => {
    if (!isImport || !linesInBetween) return false;
    const lang = (startMatch[1] || "").trim();
    const codeNode = $createCodeNode(lang || undefined);
    const text = linesInBetween.join("\n").replace(/^\n+|\n+$/g, "");
    if (text) codeNode.append($createTextNode(text));
    rootNode.append(codeNode);
    return true;
  },
  export: (node: LexicalNode): null | string => {
    if (!(node instanceof CodeNode)) return null;
    const lang = node.getLanguage() || "";
    const text = node.getTextContent();
    return `\`\`\`${lang}\n${text}\n\`\`\``;
  },
};

/**
 * Server-side Payload feature that registers Lexical's built-in CodeNode and
 * CodeHighlightNode, plus a markdown transformer for fenced code blocks so
 * `convertMarkdownToLexical` produces `type: "code"` nodes with the language
 * attribute set. Without the node registration, the admin editor throws
 * Lexical error #17; without the transformer, ```ts``` markdown imports fall
 * through to a plain paragraph.
 */
export const LexicalCodeFeature = createServerFeature({
  feature: {
    ClientFeature: "@/features/lexicalCode/feature.client#ClientLexicalCodeFeature",
    nodes: [createNode({ node: CodeNode }), createNode({ node: CodeHighlightNode })],
    markdownTransformers: [CODE_BLOCK_TRANSFORMER],
  },
  key: "lexicalCode",
});
