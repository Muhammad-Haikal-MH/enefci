// ----------------------------------------------------------------
// Shared utility helpers
// ----------------------------------------------------------------

/**
 * Generates a 4-character random alphanumeric suffix (uppercase).
 * Uses only unambiguous characters (no 0/O, 1/I/L) for readability
 * when printed on physical standees.
 * e.g. "A7X9", "B2M4", "K9P3"
 */
const SAFE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateRandomSuffix(length = 4): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += SAFE_CHARS[Math.floor(Math.random() * SAFE_CHARS.length)];
  }
  return result;
}

/**
 * Generates a card ID in the format "UMKM-001-A7X9".
 * @param index - 1-based sequential number (1–999)
 */
export function generateCardId(index: number): string {
  const seq = String(index).padStart(3, "0");
  const suffix = generateRandomSuffix(4);
  return `UMKM-${seq}-${suffix}`;
}

/**
 * Builds the Google Review direct link from a Place ID.
 */
export function buildReviewUrl(placeId: string): string {
  return `https://search.google.com/local/writereview?placeid=${placeId}`;
}

/**
 * Builds the card scan URL (the URL embedded in NFC/QR).
 */
export function buildCardUrl(idKartu: string): string {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  return `${base}/c/${idKartu}`;
}
