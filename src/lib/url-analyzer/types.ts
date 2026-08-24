import type { RiskLevel } from "@/lib/scam-detector";

export type UrlSeverity = "info" | "low" | "medium" | "high" | "critical";

export type UrlSignalId =
  | "insecure-transport"
  | "ip-literal-host"
  | "punycode-host"
  | "excessive-subdomains"
  | "embedded-credentials"
  | "shortened-url"
  | "brand-lookalike"
  | "suspicious-keywords"
  | "suspicious-tld"
  | "encoded-content"
  | "risky-query-params"
  | "unusual-port"
  | "hyphen-heavy-host"
  | "very-long-url"
  | "dangerous-scheme"
  | "known-official-domain"
  | "reputation-unsafe"
  | "reputation-clean";

export type UrlSignal = {
  id: UrlSignalId;
  label: string;
  severity: UrlSeverity;
  /** Points contributed to the risk score (negative for good signals). */
  weight: number;
  explanation: string;
  evidence?: string;
};

export type ParsedUrlParts = {
  protocol: string;
  hostname: string;
  /** All labels left of the registered domain (host minus suffix). */
  subdomains: string[];
  /** Best-effort registrable domain, e.g. "gcash-login.xyz". */
  domain: string;
  path: string;
  queryParams: Array<{ name: string; value: string }>;
  port: string;
  hasCredentials: boolean;
};

export type BrandImpersonation = {
  brandLabel: string;
  officialDomain: string;
  matchedHostToken: string;
  reason: string;
};

export type ReputationResult = {
  providerId: string;
  status: "unsafe" | "clean" | "unknown";
  detail?: string;
};

export type UrlVerdict = "no-signals" | "caution" | "suspicious" | "dangerous" | "blocked";

export type UrlReport = {
  id: string;
  createdAt: string;
  inputUrl: string;
  normalizedUrl: string;
  parseable: boolean;
  protocol: string;
  hostname: string;
  domain: string;
  subdomains: string[];
  path: string;
  queryParams: Array<{ name: string; value: string }>;
  port: string;
  isShortener: boolean;
  riskScore: number;
  riskLevel: RiskLevel;
  verdict: UrlVerdict;
  summary: string;
  signals: UrlSignal[];
  impersonation: BrandImpersonation | null;
  reputation: ReputationResult | null;
  recommendedActions: string[];
};
