import { createSafeBrowsingProvider } from "./google-safe-browsing";
import type { UrlReputationProvider } from "./types";

export type { ReputationLookup, ReputationStatus, UrlReputationProvider } from "./types";

/**
 * Registry of reputation backends. Each factory returns null when its
 * credentials are absent so the analyzer degrades gracefully to pattern-only
 * analysis (mirroring the AI layer's behavior).
 */
const PROVIDERS: Array<() => UrlReputationProvider | null> = [
  () => createSafeBrowsingProvider(),
];

export function getReputationProvider(): UrlReputationProvider | null {
  for (const factory of PROVIDERS) {
    const provider = factory();
    if (provider) return provider;
  }
  return null;
}
