// ============================================================
// InterviewIQ — IBM IAM Token Manager
// Server-side ONLY. Handles token acquisition and caching.
// ============================================================

import { IAM_CONFIG } from "@/config/ibm.config";

interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

// Module-level cache (per process/serverless warm instance)
let tokenCache: CachedToken | null = null;

/**
 * Retrieves a valid IBM IAM bearer token.
 * Caches the token and refreshes automatically before expiry.
 */
export async function getIbmBearerToken(apiKey: string): Promise<string> {
  const now = Date.now();

  if (tokenCache && tokenCache.expiresAt > now) {
    return tokenCache.accessToken;
  }

  const response = await fetch(IAM_CONFIG.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
      apikey: apiKey,
    }).toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new IbmAuthError(
      `IAM token request failed (${response.status}): ${text}`,
    );
  }

  const data = await response.json();

  tokenCache = {
    accessToken: data.access_token,
    expiresAt: now + IAM_CONFIG.tokenTtlMs,
  };

  return tokenCache.accessToken;
}

/**
 * Clears the token cache. Useful in tests or after credential rotation.
 */
export function clearTokenCache(): void {
  tokenCache = null;
}

export class IbmAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IbmAuthError";
  }
}
