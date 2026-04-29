import type { Blog } from "@/core/blog";
import { Link } from "@/i18n/routing";
import { formatDate } from "@/lib/date";
import { Badge } from "@/ui/components/ui/badge";
import { Clock } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

type RelatedPostsProps = {
  posts: Blog.Post[];
  locale: string;
};

export async function RelatedPosts({ posts, locale }: RelatedPostsProps) {
  const t = await getTranslations({ locale, namespace: "blog" });

  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="related-posts-heading" className="mt-16 border-t border-border pt-10">
      <h2 id="related-posts-heading" className="mb-6 text-xl font-semibold">
        {t("relatedPosts")}
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-2 rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground/30 hover:bg-accent/30"
            >
              {post.coverImage?.thumbnailUrl && (
                <div className="relative aspect-video w-full overflow-hidden rounded-md">
                  <Image
                    src={post.coverImage.thumbnailUrl}
                    alt={post.coverImage.alt}
                    fill
                    className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105 motion-safe:group-focus-within:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              <h3 className="line-clamp-2 text-sm font-medium leading-snug group-hover:text-foreground">
                {post.title}
              </h3>
              <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
                <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
                {post.readingTime > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {t("readingTime", { minutes: post.readingTime })}
                    </span>
                  </>
                )}
              </div>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
