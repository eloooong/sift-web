import { editDistance } from "./parser";

/**
 * Philippine-relevant official domains used for lookalike detection and
 * "known official domain" positive signals. Trademarks belong to their
 * respective owners; entries describe where the REAL service lives so we can
 * flag hosts that pretend to be it.
 */
export type KnownBrand = {
  /** Canonical brand label shown in reports. */
  label: string;
  /** Official registrable domain(s). */
  domains: string[];
  /** Distinctive token used to spot brand mentions inside fake hosts. */
  tokens: string[];
};

export const KNOWN_BRANDS: KnownBrand[] = [
  { label: "GCash", domains: ["gcash.com"], tokens: ["gcash"] },
  { label: "Maya", domains: ["maya.ph", "paymaya.com"], tokens: ["maya", "paymaya"] },
  { label: "Coins.ph", domains: ["coins.ph"], tokens: ["coinsph", "coins-ph"] },
  { label: "BDO", domains: ["bdo.com.ph"], tokens: ["bdo"] },
  { label: "BPI", domains: ["bpi.com.ph"], tokens: ["bpi"] },
  { label: "Metrobank", domains: ["metrobank.com.ph"], tokens: ["metrobank"] },
  { label: "Security Bank", domains: ["securitybank.com"], tokens: ["securitybank", "security-bank"] },
  { label: "UnionBank", domains: ["unionbankph.com"], tokens: ["unionbank"] },
  { label: "LandBank", domains: ["landbank.com"], tokens: ["landbank"] },
  { label: "SSS", domains: ["sss.gov.ph"], tokens: ["sss"] },
  { label: "PhilHealth", domains: ["philhealth.gov.ph"], tokens: ["philhealth"] },
  { label: "Pag-IBIG Fund", domains: ["pagibigfund.gov.ph"], tokens: ["pagibig", "pag-ibig"] },
  { label: "BIR", domains: ["bir.gov.ph"], tokens: ["bir"] },
  { label: "LBC Express", domains: ["lbcexpress.com"], tokens: ["lbc"] },
  { label: "J&T Express", domains: ["jtexpress.ph"], tokens: ["jtexpress", "jt-express"] },
  { label: "Shopee", domains: ["shopee.ph"], tokens: ["shopee"] },
  { label: "Lazada", domains: ["lazada.com.ph"], tokens: ["lazada"] },
  { label: "Grab", domains: ["grab.com"], tokens: ["grab"] },
  { label: "PSA", domains: ["psa.gov.ph"], tokens: ["psa"] },
  { label: "DTI", domains: ["dti.gov.ph"], tokens: ["dti"] },
];

/** Popular URL shorteners: destination is hidden, so trust is limited. */
export const SHORTENER_DOMAINS = new Set([
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "goo.gl",
  "ow.ly",
  "is.gd",
  "buff.ly",
  "cutt.ly",
  "rb.gy",
  "shorturl.at",
  "rebrand.ly",
  "tiny.cc",
  "bit.do",
  "s.id",
  "shrtco.de",
]);

/**
 * Cheap-trust TLDs frequently abused in phishing. Presence alone is a weak
 * signal (plenty of legitimate sites use them), never decisive on its own.
 */
export const HIGH_ABUSE_TLD_SUFFIXES = [
  ".xyz",
  ".top",
  ".site",
  ".online",
  ".click",
  ".link",
  ".live",
  ".rest",
  ".icu",
  ".cfd",
  ".shop",
  ".buzz",
  ".monster",
  ".quest",
  ".sbs",
];

export function isShortenerDomain(domain: string): boolean {
  return SHORTENER_DOMAINS.has(domain);
}

export function hasHighAbuseTld(hostname: string): boolean {
  return HIGH_ABUSE_TLD_SUFFIXES.some((suffix) => hostname.endsWith(suffix));
}

/**
 * Returns the brand this host appears to impersonate, or null.
 *
 * Detection layers:
 * 1. Exact registrable-domain match → NOT impersonation (it's official).
 * 2. Brand token embedded in an unrelated domain ("gcash" inside
 *    gcash-login.xyz) → strong impersonation signal.
 * 3. Close edit distance to the official domain label ("gcash" vs "gc4sh",
 *    "1bcexpress" vs "lbcexpress") → typosquatting.
 */
export function matchImpersonatedBrand(
  hostname: string,
  domain: string,
  subdomains: string[]
): { brand: KnownBrand; matchedToken: string; reason: string } | null {
  const hostNoWww = hostname.replace(/^www\./, "");
  const domainCore = domain.replace(/\.[a-z]+$/, "");
  const hostCompact = hostNoWww.replace(/[^a-z0-9]/g, "");

  for (const brand of KNOWN_BRANDS) {
    if (brand.domains.includes(domain)) return null;

    // Token embedded anywhere in the host (subdomain or domain core).
    for (const token of brand.tokens) {
      if (token.length < 3) continue;
      if (
        (domainCore.includes(token) && domain !== `${token}`) ||
        subdomains.some((sub) => sub.includes(token))
      ) {
        // Exclude the case where the host IS the official domain with www.
        if (!brand.domains.some((official) => hostNoWww.endsWith(official))) {
          return {
            brand,
            matchedToken: token,
            reason: `The address contains “${token}” but does not sit on ${brand.domains[0]}.`,
          };
        }
      }
    }

    // Typosquat distance against each official domain core.
    for (const officialDomain of brand.domains) {
      const officialCore = officialDomain.split(".")[0];
      if (Math.abs(officialCore.length - domainCore.length) > 2) continue;
      if (domainCore === officialCore) continue;
      const distance = editDistance(hostCompact, officialDomain.replace(/[^a-z0-9]/g, ""));
      if (distance <= 2 && !brand.domains.includes(domain)) {
        return {
          brand,
          matchedToken: domainCore,
          reason: `“${domain}” is only ${distance} character${distance === 1 ? "" : "s"} away from the official ${officialDomain}.`,
        };
      }
    }
  }

  return null;
}

export function findOfficialBrand(
  domain: string
): { brand: KnownBrand; officialDomain: string } | null {
  for (const brand of KNOWN_BRANDS) {
    if (brand.domains.includes(domain)) {
      return { brand, officialDomain: domain };
    }
  }
  return null;
}
