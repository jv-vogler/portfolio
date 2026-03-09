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

/**
 * Fetch the About global Q&A items for a given locale.
 * Returns an empty array if Payload is unavailable (e.g. during CI builds).
 */
export const getAbout = cache(async function getAbout(locale: TypedLocale): Promise<AboutItem[]> {
  const payload = await getPayloadSafe();
  if (!payload) return [];

  const global = await payload.findGlobal({ slug: "about", locale, depth: 0 });
  return (global.items ?? []) as AboutItem[];
});
