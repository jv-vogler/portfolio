import config from "@payload-config";
import type { TypedLocale } from "payload";
import { getPayload, type Payload } from "payload";
import { cache } from "react";

/**
 * Safely initialise Payload.
 *
 * During CI / preview builds the required env-vars (PAYLOAD_SECRET,
 * POSTGRES_URL) may be absent.  Rather than crashing the entire `next build`,
 * this helper catches the init error and returns `null` so callers can fall
 * back to empty data — the pages will be generated on-demand via ISR once the
 * app is running with the correct environment.
 */
export async function getPayloadSafe(): Promise<Payload | null> {
  try {
    return await getPayload({ config });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (error as Error & { payloadInitError?: boolean }).payloadInitError
    ) {
      console.warn("[payload] Skipping — Payload could not initialise:", error.message);
      return null;
    }
    // Re-throw unexpected errors
    throw error;
  }
}

export type AboutItem = { question: string; answer: string };

export type ProfileImage = { url: string; alt?: string } | null;

export type AboutData = {
  profileImage: ProfileImage;
  aboutPageImage: ProfileImage;
  elevatorPitch: string | null;
  items: AboutItem[];
};

/**
 * Fetch the About global for a given locale.
 * Returns profile image, elevator pitch, and Q&A items.
 * Falls back gracefully if Payload is unavailable (e.g. during CI builds).
 */
export const getAbout = cache(async function getAbout(locale: TypedLocale): Promise<AboutData> {
  const payload = await getPayloadSafe();
  if (!payload) return { profileImage: null, aboutPageImage: null, elevatorPitch: null, items: [] };

  const global = await payload.findGlobal({ slug: "about", locale, depth: 1 });

  const rawImage = global.profileImage;
  let profileImage: ProfileImage = null;
  if (rawImage && typeof rawImage === "object" && "url" in rawImage && rawImage.url) {
    profileImage = { url: rawImage.url as string, alt: (rawImage as { alt?: string }).alt };
  }

  const rawAboutImage = (global as Record<string, unknown>).aboutPageImage;
  console.log("[getAbout] rawAboutImage:", JSON.stringify(rawAboutImage));
  console.log("[getAbout] rawProfileImage:", JSON.stringify(rawImage));
  let aboutPageImage: ProfileImage = null;
  if (
    rawAboutImage &&
    typeof rawAboutImage === "object" &&
    "url" in rawAboutImage &&
    rawAboutImage.url
  ) {
    aboutPageImage = {
      url: rawAboutImage.url as string,
      alt: (rawAboutImage as { alt?: string }).alt,
    };
  }

  return {
    profileImage,
    aboutPageImage,
    elevatorPitch: (global.elevatorPitch as string) ?? null,
    items: (global.items ?? []) as AboutItem[],
  };
});
