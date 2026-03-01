import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import type { ComponentProps } from "react";

type MDXComponentMap = ComponentProps<typeof MDXRemote>["components"];

const mdxComponents: MDXComponentMap = {
  h1: ({ children, ...props }) => (
    <h1 className="mt-8 mb-4 text-3xl font-bold tracking-tight" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="mt-8 mb-4 text-2xl font-semibold tracking-tight" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mt-6 mb-3 text-xl font-semibold" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="mb-4 leading-7" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="mb-4 ml-6 list-disc space-y-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="mb-4 ml-6 list-decimal space-y-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-7" {...props}>
      {children}
    </li>
  ),
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
          {...props}
        >
          {children}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      );
    }
    return (
      <Link
        href={href ?? "#"}
        className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
        {...props}
      >
        {children}
      </Link>
    );
  },
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="mt-4 mb-4 border-l-4 border-primary pl-4 italic text-muted-foreground"
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ children, ...props }) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm" {...props}>
      {children}
    </code>
  ),
  pre: ({ children, ...props }) => (
    <pre className="mb-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm" {...props}>
      {children}
    </pre>
  ),
  hr: (props) => <hr className="my-8 border-border" {...props} />,
  img: ({ src, alt, ...props }) => {
    if (process.env.NODE_ENV === "development" && !alt) {
      console.warn(`[MDX] Image missing alt text: ${src}`);
    }
    return (
      <Image
        src={src ?? ""}
        alt={alt || "Blog post image"}
        width={800}
        height={450}
        className="my-4 rounded-lg"
        {...props}
      />
    );
  },
  strong: ({ children, ...props }) => (
    <strong className="font-semibold" {...props}>
      {children}
    </strong>
  ),
};

type BlogPostProps = {
  content: string;
};

export function BlogPost({ content }: BlogPostProps) {
  return (
    <article className="prose prose-neutral dark:prose-invert mx-auto max-w-3xl">
      <MDXRemote source={content} components={mdxComponents} />
    </article>
  );
}
