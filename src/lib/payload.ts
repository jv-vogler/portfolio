import config from "@payload-config";
import { getPayload, type Payload } from "payload";

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
