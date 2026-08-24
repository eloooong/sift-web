import type {
  ReputationLookup,
  UrlReputationProvider,
} from "./types";

const ENDPOINT = "https://safebrowsing.googleapis.com/v4/threatMatches:find";
const DEFAULT_TIMEOUT_MS = 8_000;

type ThreatMatchResponse = {
  matches?: Array<{ threatType?: string; platformType?: string }>;
};

/**
 * Google Safe Browsing v4 (threatMatches lookup).
 *
 * - The scanned URL is sent only as data inside the request body to a fixed
 *   Google endpoint. It is never fetched, resolved, or redirected to.
 * - Requires GOOGLE_SAFE_BROWSING_API_KEY. Without it the factory in
 *   index.ts returns null and analysis proceeds without reputation input.
 */
export function createSafeBrowsingProvider(options?: {
  apiKey?: string;
  timeoutMs?: number;
}): UrlReputationProvider | null {
  const apiKey = options?.apiKey ?? process.env.GOOGLE_SAFE_BROWSING_API_KEY;
  if (!apiKey) return null;

  const timeoutMs =
    options?.timeoutMs ?? Number(process.env.REPUTATION_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS);

  return {
    id: "google-safe-browsing",

    async lookup(url: string): Promise<ReputationLookup> {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetch(`${ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client: { clientId: "scamshield-ph", clientVersion: "1.0.0" },
            threatInfo: {
              threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
              platformTypes: ["ANY_PLATFORM"],
              threatEntryTypes: ["URL"],
              threatEntries: [{ url }],
            },
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          return { status: "unknown", detail: `lookup failed (HTTP ${response.status})` };
        }

        const data = (await response.json()) as ThreatMatchResponse;
        if (data.matches && data.matches.length > 0) {
          const threats = [...new Set(data.matches.map((m) => m.threatType ?? "THREAT"))];
          return { status: "unsafe", detail: `Google Safe Browsing: ${threats.join(", ").toLowerCase().replace(/_/g, " ")}` };
        }
        return { status: "clean", detail: "Google Safe Browsing" };
      } catch {
        return { status: "unknown", detail: "reputation service unreachable" };
      } finally {
        clearTimeout(timer);
      }
    },
  };
}
