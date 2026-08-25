import {
  findOfficialBrand,
  hasHighAbuseTld,
  isShortenerDomain,
  matchImpersonatedBrand,
} from "./brands";
import type {
  BrandImpersonation,
  ParsedUrlParts,
  UrlSignal,
} from "./types";

const SUSPICIOUS_KEYWORDS = [
  "login",
  "log-in",
  "signin",
  "sign-in",
  "verify",
  "verification",
  "secure",
  "security",
  "account",
  "update",
  "confirm",
  "recover",
  "unlock",
  "suspend",
  "wallet",
  "otp",
  "onetimepin",
  "prize",
  "raffle",
  "claim",
  "bonus",
  "promo",
  "refund",
  "cashback",
  "reward",
  "delivery-fee",
  "redeliver",
  "parcel",
  "customs",
  "loanoffer",
  "quickcash",
];

const RISKY_QUERY_PARAM_NAMES = [
  "redirect",
  "redirect_uri",
  "redirect_url",
  "return",
  "returnurl",
  "next",
  "continue",
  "dest",
  "destination",
  "goto",
  "url",
  "link",
  "token",
  "otp",
  "auth",
];

const COMMON_PORTS = new Set(["", "80", "443", "8080", "8443"]);

function countPercentEncodings(value: string): number {
  return (value.match(/%[0-9a-f]{2}/gi) ?? []).length;
}

function keywordEvidence(hostAndPath: string): string[] {
  const found = SUSPICIOUS_KEYWORDS.filter((keyword) =>
    hostAndPath.includes(keyword)
  );
  return [...new Set(found)].slice(0, 4);
}

export type SignalContext = {
  parts: ParsedUrlParts;
  fullUrl: string;
};

export function detectSignals({ parts, fullUrl }: SignalContext): {
  signals: UrlSignal[];
  impersonation: BrandImpersonation | null;
} {
  const signals: UrlSignal[] = [];
  const { protocol, hostname, subdomains, domain, path, queryParams, port, hasCredentials } =
    parts;
  const hostAndPath = `${hostname}${path}`.toLowerCase();

  // --- Transport -----------------------------------------------------------
  if (protocol === "http") {
    signals.push({
      id: "insecure-transport",
      label: "No encryption (HTTP)",
      severity: "medium",
      weight: 14,
      explanation:
        "Anything you type into an HTTP site (passwords, OTPs, personal details) travels unencrypted and can be intercepted. Legitimate login and payment pages are always HTTPS.",
      evidence: `${protocol}://${hostname}`,
    });
  }

  // --- Dangerous schemes (should be blocked upstream, belt-and-braces) -----
  if (!["http", "https"].includes(protocol)) {
    signals.push({
      id: "dangerous-scheme",
      label: `Dangerous scheme: ${protocol}`,
      severity: "critical",
      weight: 60,
      explanation:
        "This does not use the web’s http/https scheme. Links like javascript: or data: can execute code or hide their true destination entirely.",
      evidence: protocol,
    });
  }

  // --- Host shape ----------------------------------------------------------
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname) || hostname.startsWith("[")) {
    signals.push({
      id: "ip-literal-host",
      label: "Raw IP address instead of a domain",
      severity: "high",
      weight: 26,
      explanation:
        "Legitimate services use named domains. Bare IP addresses are typical of throwaway phishing hosts and give you nothing to verify.",
      evidence: hostname,
    });
  }

  if (hostname.includes("xn--")) {
    signals.push({
      id: "punycode-host",
      label: "Internationalized (punycode) domain",
      severity: "medium",
      weight: 16,
      explanation:
        "Punycode domains can visually imitate familiar letters using look-alike characters from other alphabets, a classic brand-spoofing trick.",
      evidence: hostname,
    });
  }

  if (subdomains.length >= 3) {
    signals.push({
      id: "excessive-subdomains",
      label: `Deep subdomain chain (${subdomains.length} levels)`,
      severity: "low",
      weight: 9,
      explanation:
        "Stacked subdomains like secure.gcash.login.example.com are used to make a fake site look trustworthy at first glance. Only the last part before the single slash is the real owner.",
      evidence: subdomains.join("."),
    });
  }

  if (hasCredentials) {
    signals.push({
      id: "embedded-credentials",
      label: "Credentials embedded in the address",
      severity: "critical",
      weight: 45,
      explanation:
        "The text before @ in a URL is a username field, not the website. Attackers use user@host tricks to make the address appear to point somewhere it doesn’t.",
      evidence: fullUrl.split("@")[0] + "@…",
    });
  }

  if (!COMMON_PORTS.has(port)) {
    signals.push({
      id: "unusual-port",
      label: `Unusual port (:${port})`,
      severity: "info",
      weight: 5,
      explanation:
        "Standard web traffic uses ports 80/443. Odd ports often indicate improvised hosting rather than a professional service.",
      evidence: `:${port}`,
    });
  }

  const hyphenCount = (hostname.match(/-/g) ?? []).length;
  if (hyphenCount >= 3) {
    signals.push({
      id: "hyphen-heavy-host",
      label: `Hyphen-stuffed hostname (${hyphenCount} hyphens)`,
      severity: "low",
      weight: 7,
      explanation:
        "Long hyphen chains like secure-gcash-login-verify.xyz are characteristic of mass-produced phishing domains.",
      evidence: hostname,
    });
  }

  // --- Shorteners ------------------------------------------------------------
  if (isShortenerDomain(domain)) {
    signals.push({
      id: "shortened-url",
      label: "Shortened link hides its destination",
      severity: "medium",
      weight: 18,
      explanation:
        "Shorteners conceal the real address. Scammers rely on that to smuggle people past a suspicious-looking URL. Expand it first (add + to many shortener links) before trusting it.",
      evidence: fullUrl.slice(0, 80),
    });
  }

  // --- Brand lookalike / official -------------------------------------------
  const impersonationMatch = matchImpersonatedBrand(hostname, domain, subdomains);
  let impersonation: BrandImpersonation | null = null;

  if (impersonationMatch) {
    impersonation = {
      brandLabel: impersonationMatch.brand.label,
      officialDomain: impersonationMatch.brand.domains[0],
      matchedHostToken: impersonationMatch.matchedToken,
      reason: impersonationMatch.reason,
    };
    signals.push({
      id: "brand-lookalike",
      label: `Appears to imitate ${impersonation.brandLabel}`,
      severity: "high",
      weight: 30,
      explanation: `${impersonation.reason} The real ${impersonation.brandLabel} service lives only at ${impersonation.officialDomain}.`,
      evidence: hostname,
    });
  } else {
    const official = findOfficialBrand(domain);
    if (official && protocol === "https") {
      signals.push({
        id: "known-official-domain",
        label: `Host is the official ${official.brand.label} domain`,
        severity: "info",
        weight: -12,
        explanation: `The registrable domain matches ${official.brand.label}’s official domain (${official.officialDomain}). That reduces risk, though the page content still deserves attention.`,
        evidence: domain,
      });
    }
  }

  // --- Keywords --------------------------------------------------------------
  const keywords = keywordEvidence(hostAndPath);
  if (keywords.length > 0) {
    const onHostname = keywords.some((keyword) => hostname.includes(keyword));
    signals.push({
      id: "suspicious-keywords",
      label:
        keywords.length === 1
          ? `Phishing-style word “${keywords[0]}”`
          : `${keywords.length} phishing-style words (${keywords.join(", ")})`,
      severity: onHostname ? "high" : "medium",
      weight: Math.min(24, 6 * keywords.length) + (onHostname ? 6 : 0),
      explanation:
        "Words like “verify”, “login”, “prize”, or “claim” inside addresses are bait: they describe what a scam needs you to do, not what a real service would name its infrastructure.",
      evidence: keywords.join(", "),
    });
  }

  // --- Cheap TLDs --------------------------------------------------------------
  if (hasHighAbuseTld(hostname)) {
    signals.push({
      id: "suspicious-tld",
      label: "Domain uses a cheap, abuse-prone ending",
      severity: "low",
      weight: 10,
      explanation:
        "Endings like .xyz, .top, or .site cost pennies and need no verification, so scammers churn through them. Many legitimate sites use them too; this only matters alongside other signals.",
      evidence: hostname.slice(hostname.lastIndexOf(".")),
    });
  }

  // --- Encoding (measured on the raw escaped URL, not decoded parts) --------
  const encodedCount = countPercentEncodings(fullUrl);
  const doubleEncoded = fullUrl.includes("%25");
  if (doubleEncoded || encodedCount >= 6) {
    signals.push({
      id: "encoded-content",
      label: doubleEncoded
        ? "Double-encoded address"
        : `Heavily encoded address (${encodedCount} escapes)`,
      severity: "medium",
      weight: doubleEncoded ? 18 : 12,
      explanation:
        "Heavy %xx encoding (especially double encoding) is used to disguise where a link really goes and to slip past security filters.",
      evidence: doubleEncoded ? "%25…" : undefined,
    });
  }

  // --- Query params --------------------------------------------------------------
  const riskyParams = [
    ...new Set(
      queryParams
        .map((param) => param.name.toLowerCase())
        .filter((name) => RISKY_QUERY_PARAM_NAMES.includes(name))
    ),
  ];
  const redirectValue = queryParams.find((param) =>
    RISKY_QUERY_PARAM_NAMES.slice(0, 13).includes(param.name.toLowerCase())
  );
  const redirectLooksExternal =
    redirectValue !== undefined &&
    /https?%3a|https?:\/\//i.test(redirectValue.value);
  if (riskyParams.length > 0 || redirectLooksExternal) {
    signals.push({
      id: "risky-query-params",
      label: redirectLooksExternal
        ? "Redirect parameter points to another site"
        : `Redirect/token style parameters (${riskyParams.join(", ")})`,
      severity: redirectLooksExternal ? "high" : "low",
      weight: redirectLooksExternal ? 22 : 6,
      explanation: redirectLooksExternal
        ? "This link immediately forwards you somewhere else, a common way to bounce victims through an innocent-looking address to a phishing page."
        : "Parameters that control redirects, tokens, or one-time codes can be abused to hijack the destination or replay stolen session material.",
      evidence: redirectLooksExternal && redirectValue ? `${redirectValue.name}=${redirectValue.value.slice(0, 60)}` : riskyParams.join(", "),
    });
  }

  // --- Length -----------------------------------------------------------------
  if (fullUrl.length >= 160) {
    signals.push({
      id: "very-long-url",
      label: `Unusually long address (${fullUrl.length} characters)`,
      severity: "info",
      weight: 5,
      explanation:
        "Very long URLs are often engineered to push the real domain off the edge of a preview window or to bury junk around the important-looking part.",
      evidence: undefined,
    });
  }

  return { signals, impersonation };
}

/** Extra signal appended after a reputation lookup returns "unsafe". */
export function reputationUnsafeSignal(detail: string | undefined): UrlSignal {
  return {
    id: "reputation-unsafe",
    label: "Flagged by external reputation service",
    severity: "critical",
    weight: 55,
    explanation: `A URL reputation database (${detail ?? "external provider"}) has flagged addresses like this one for phishing, malware, or other abuse.`,
  };
}

export function reputationCleanSignal(source: string): UrlSignal {
  return {
    id: "reputation-clean",
    label: "No entries in external reputation databases",
    severity: "info",
    weight: -10,
    explanation: `${source} reports no phishing or malware history for this exact address. New scam links appear faster than databases update, so this is reassuring but not proof of safety.`,
  };
}
