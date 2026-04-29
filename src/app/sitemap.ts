import { getAllPosts } from "@/app/actions/blog";
import { locales } from "@/i18n/config";
import type { MetadataRoute } from "next";

export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://jvogler.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Home page for each locale
  for (const locale of locales) {
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1.0,
    });
  }

  // Blog listing for each locale
  for (const locale of locales) {
    entries.push({
      url: `${BASE_URL}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // About page for each locale
  for (const locale of locales) {
    entries.push({
      url: `${BASE_URL}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    });
  }

  // Blog posts for each locale
  for (const locale of locales) {
    const posts = await getAllPosts(locale);
    for (const post of posts) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
