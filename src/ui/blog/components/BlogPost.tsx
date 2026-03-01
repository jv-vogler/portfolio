import { RichText } from "@payloadcms/richtext-lexical/react";

type BlogPostProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
};

export function BlogPost({ content }: BlogPostProps) {
  return (
    <article className="prose prose-neutral dark:prose-invert mx-auto max-w-3xl">
      <RichText data={content} />
    </article>
  );
}
