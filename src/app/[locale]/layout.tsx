import { getCachedMinimalPosts } from "@/app/actions/blog";
import { getCachedMinimalProjects } from "@/app/actions/portfolio";
import { locales } from "@/i18n/config";
import { routing } from "@/i18n/routing";
import { CommandPaletteProvider } from "@/ui/components/CommandPaletteProvider";
import { FocusedReadingProvider } from "@/ui/blog/context/FocusedReadingContext";
import { Footer } from "@/ui/components/Footer";
import { Toaster } from "@/ui/components/ui/sonner";
import { Header } from "@/ui/header/components/Header";
import { GoogleAnalytics } from "@/ui/lib/GoogleAnalytics";
import { PersonJsonLd, WebSiteJsonLd } from "@/ui/lib/jsonLd";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Fira_Code, Poppins } from "next/font/google";
import { notFound } from "next/navigation";

import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "optional",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "optional",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://jvogler.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      template: "%s | JV Vogler",
      default: t("title"),
    },
    description: t("description"),
    keywords: [
      "frontend developer",
      "backend developer",
      "fullstack developer",
      "web developer",
      "react",
      "next.js",
      "typescript",
      "portfolio",
      "ai",
      "agentic engineering",
      "artificial intelligence",
    ],
    authors: [{ name: "JV Vogler", url: BASE_URL }],
    creator: "JV Vogler",
    openGraph: {
      type: "website",
      locale: locale === "pt" ? "pt_BR" : "en_US",
      siteName: "JV Vogler",
      title: t("title"),
      description: t("description"),
      url: `${BASE_URL}/${locale}`,
      images: [
        {
          url: "/og/og-default.svg",
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og/og-default.svg"],
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        en: `${BASE_URL}/en`,
        pt: `${BASE_URL}/pt`,
      },
      types: {
        "application/rss+xml": "/feed.xml",
      },
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const [minimalPosts, minimalProjects] = await Promise.all([
    getCachedMinimalPosts(locale),
    getCachedMinimalProjects(locale),
  ]);

  return (
    <html lang={locale} className="dark">
      <body className={`${poppins.variable} ${firaCode.variable} font-sans antialiased`}>
        <PersonJsonLd
          name="JV Vogler"
          jobTitle="Frontend Developer"
          sameAs={["https://github.com/jvvogler", "https://linkedin.com/in/jvvogler"]}
        />
        <WebSiteJsonLd
          name="JV Vogler"
          description="Portfolio of JV Vogler, a frontend developer specializing in modern web technologies."
        />
        <NextIntlClientProvider messages={messages}>
          <CommandPaletteProvider posts={minimalPosts} projects={minimalProjects}>
            <FocusedReadingProvider>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
              >
                {messages.a11y &&
                typeof messages.a11y === "object" &&
                "skipToContent" in messages.a11y
                  ? (messages.a11y as Record<string, string>).skipToContent
                  : "Skip to content"}
              </a>
              <Header />
              <main id="main-content" className="min-h-screen">
                {children}
              </main>
              <Footer />
              <Toaster />
            </FocusedReadingProvider>
          </CommandPaletteProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
