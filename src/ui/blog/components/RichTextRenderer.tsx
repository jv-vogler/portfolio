"use client";

import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "lexical";

type RichTextRendererProps = {
  data: SerializedEditorState;
};

export function RichTextRenderer({ data }: RichTextRendererProps) {
  return <RichText data={data} />;
}
