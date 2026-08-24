export type ReputationStatus = "unsafe" | "clean" | "unknown";

export type ReputationLookup = {
  status: ReputationStatus;
  detail?: string;
};

/**
 * Contract for external URL reputation services.
 *
 * SECURITY NOTE: implementations must only talk to the provider's fixed API
 * endpoint with the URL as *data*. They must never make HTTP requests to the
 * scanned URL itself, follow its redirects, or resolve its hostname — that
 * would turn a user-submitted link into an SSRF vector against our network.
 */
export interface UrlReputationProvider {
  readonly id: string;
  lookup(url: string): Promise<ReputationLookup>;
}
