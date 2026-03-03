import type { ReactNode } from "react";

import { BlogTransitionWrapper } from "@/ui/blog/components/BlogTransitionWrapper";

type BlogLayoutProps = {
  children: ReactNode;
};

export default function BlogLayout({ children }: BlogLayoutProps) {
  return <BlogTransitionWrapper>{children}</BlogTransitionWrapper>;
}
