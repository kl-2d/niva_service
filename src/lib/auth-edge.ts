/**
 * Edge-compatible token verification using Web Crypto API (SubtleCrypto).
 * This file is safe to import in Next.js middleware (Edge Runtime).
 * For API routes (Node.js runtime), use lib/auth.ts instead.
 */

function base64urlToBytes(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

/**
 * Verifies an HMAC-SHA256 signed token using Web Crypto API.
 * Returns the payload string if valid, or null if invalid/tampered.
 */
export async function verifyTokenEdge(token: string): Promise<string | null> {
  try {
    const [encodedPayload, sig] = token.split(".");
    if (!encodedPayload || !sig) return null;

    const secret =
      process.env.SECRET_KEY ??
      process.env.ADMIN_PASSWORD ??
      "change-me-in-env";

    const encoder = new TextEncoder();
    const payload = new TextDecoder().decode(base64urlToBytes(encodedPayload));

    // Import secret key for HMAC-SHA256
    const key = await globalThis.crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const sigBytes = base64urlToBytes(sig);
    const sigBuffer = sigBytes.buffer.slice(sigBytes.byteOffset, sigBytes.byteOffset + sigBytes.byteLength) as ArrayBuffer;
    const valid = await globalThis.crypto.subtle.verify(
      "HMAC",
      key,
      sigBuffer,
      encoder.encode(payload)
    );

    return valid ? payload : null;
  } catch {
    return null;
  }
}
