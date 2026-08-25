import type { Lang } from "@/lib/i18n/config";
import { URL_SIGNAL_FIL, VERDICT_SUMMARY_FIL } from "./fil";
import { detectSignals, reputationCleanSignal, reputationUnsafeSignal } from "./signals";
import { scoreUrlSignals, sortSignalsForDisplay } from "./scoring";
import { isShortenerDomain } from "./brands";
import { parseUrl } from "./parser";
import { getReputationProvider } from "./reputation";
import type { UrlReport, UrlVerdict } from "./types";

export * from "./types";

const VERDICT_SUMMARIES: Record<UrlVerdict, (domain: string) => string> = {
  dangerous: () =>
    "This address shows multiple strong signs of a phishing or scam page. Do not open it, and never enter logins, OTPs, or payment details on it.",
  suspicious: (domain) =>
    `“${domain}” carries several warning signs typical of scam links. Treat it as untrusted until you can verify the destination through an official app or website.`,
  caution: (domain) =>
    `“${domain}” raised minor concerns but nothing decisive. Open it only if you expected it, and double-check the domain spelling before entering any information.`,
  "no-signals": (domain) =>
    `No structural red flags were found in “${domain}”. This checks the address itself; it cannot see the page content, so stay alert after opening any link.`,
  blocked: () =>
    "This input isn't a web address we can analyze. Only http/https links are supported.",
};

function verdictSummary(
  verdict: UrlVerdict,
  domain: string,
  lang: Lang
): string {
  if (lang === "fil") {
    const fil = VERDICT_SUMMARY_FIL[verdict];
    if (fil) return fil(domain);
  }
  return VERDICT_SUMMARIES[verdict](domain);
}

function buildActions(
  verdict: UrlVerdict,
  isShortener: boolean,
  lang: Lang = "en"
): string[] {
  if (lang === "fil") return buildActionsFil(verdict, isShortener);
  const actions: string[] = [];

  if (verdict === "blocked") {
    return [
      "Paste a full web link starting with http:// or https://.",
      "If this came from a QR code or chat app, check who sent it before going further.",
    ];
  }

  if (isShortener) {
    actions.push(
      "Expand the short link first: most shorteners show the real destination if you add “+” to the end of the URL."
    );
  }
  if (verdict === "dangerous" || verdict === "suspicious") {
    actions.push(
      "Do not click this link; type the service's official address yourself instead."
    );
    actions.push(
      "Log in only through the official app or by typing the known domain, never through links that arrive by SMS or chat."
    );
    actions.push(
      "Report the link to the platform that delivered it and to the impersonated company's official support channel."
    );
  } else {
    actions.push(
      "Verify the exact spelling of the domain in your browser's address bar after opening."
    );
    actions.push(
      "Enter passwords, OTPs, or card details only on pages you reached deliberately."
    );
  }

  return actions;
}

function buildActionsFil(verdict: UrlVerdict, isShortener: boolean): string[] {
  const actions: string[] = [];

  if (verdict === "blocked") {
    return [
      "I-paste ang buong web link na nagsisimula sa http:// o https://.",
      "Kung ito ay galing sa QR code o chat app, alamin muna kung sino ang nagpadala bago magpatuloy.",
    ];
  }

  if (isShortener) {
    actions.push(
      "Palawakin muna ang short link: kadalasang ipinapakita ng mga shortener ang tunay na destinasyon kapag dinagdag mo ang “+” sa dulo ng URL."
    );
  }
  if (verdict === "dangerous" || verdict === "suspicious") {
    actions.push(
      "Huwag i-click ang link; i-type mo mismo ang opisyal na address ng serbisyo."
    );
    actions.push(
      "Mag-log in lang sa opisyal na app o sa pag-type ng kilalang domain, hindi sa mga link na dumating sa SMS o chat."
    );
    actions.push(
      "I-report ang link sa platform kung saan ito dumating at sa opisyal na support channel ng inimpersonate na company."
    );
  } else {
    actions.push(
      "Tiyaking tama ang spelling ng domain sa address bar ng browser mo pagkatapos buksan."
    );
    actions.push(
      "Maglagay lang ng password, OTP, o card details sa mga page na sinadya mong puntahan."
    );
  }

  return actions;
}

function blockedReport(
  id: string,
  createdAt: string,
  rawInput: string,
  lang: Lang = "en"
): UrlReport {
  const scheme = rawInput.trim().match(/^([a-z][a-z0-9+.-]*):/i)?.[1] ?? "";
  const fil = lang === "fil";
  return {
    id,
    createdAt,
    inputUrl: rawInput.slice(0, 2048),
    normalizedUrl: "",
    parseable: false,
    protocol: scheme || "-",
    hostname: "-",
    domain: "-",
    subdomains: [],
    path: "",
    queryParams: [],
    port: "",
    isShortener: false,
    riskScore: 0,
    riskLevel: "low",
    verdict: "blocked",
    summary: fil
      ? `${scheme ? `Hindi web address ang “${scheme}:” na link` : "Hindi ito web address na kayang suriin"}, tanging http/https link lang ang sinusuportahan.`
      : `${scheme ? `“${scheme}:” links are not web addresses` : "This isn’t a web address we can analyze"}; only http/https links are supported.`,
    signals: [
      {
        id: "dangerous-scheme",
        label: fil
          ? `Hindi suriing web address (${scheme || "di-kilalang scheme"})`
          : `Not a checkable web address (${scheme || "unknown scheme"})`,
        severity: "critical",
        weight: 0,
        explanation: fil
          ? (URL_SIGNAL_FIL["dangerous-scheme"]?.explanation ?? "")
          : "Only http:// and https:// links can be analyzed. Schemes like javascript:, data:, or file: are rejected outright for safety.",
        evidence: scheme ? `${scheme}:…` : undefined,
      },
    ],
    impersonation: null,
    reputation: null,
    recommendedActions: buildActions("blocked", false, lang),
  };
}

import { isInternalHostname } from "@/lib/url-analyzer/internal-hosts";

/**
 * Full server-side URL analysis: parse → structural signals → scoring →
 * optional external reputation lookup.
 *
 * SECURITY: this function never performs network requests to the analyzed
 * URL. The only outbound call goes to the configured reputation provider,
 * which receives the URL strictly as data (see reputation/types.ts).
 */
export async function analyzeUrl(
  rawInput: string,
  options?: { lang?: Lang }
): Promise<UrlReport> {
  const lang: Lang = options?.lang === "fil" ? "fil" : "en";
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  // Defense in depth: the API route also enforces this, but the analyzer
  // refuses non-web schemes on its own so every caller gets safe behavior.
  const schemeProbe = rawInput.trim().match(/^([a-z][a-z0-9+.-]*):/i);
  if (schemeProbe && !/^https?$/i.test(schemeProbe[1])) {
    return blockedReport(id, createdAt, rawInput, lang);
  }

  const parsed = parseUrl(rawInput);

  if (!parsed.ok) {
    return blockedReport(id, createdAt, rawInput, lang);
  }

  const { url, parts } = parsed;
  const normalizedUrl = url.toString();
  const { signals: structural, impersonation } = detectSignals({
    parts,
    fullUrl: normalizedUrl,
  });
  const localized = lang === "fil"
    ? structural.map((signal) => ({
        ...signal,
        label: URL_SIGNAL_FIL[signal.id]?.label ?? signal.label,
        explanation:
          URL_SIGNAL_FIL[signal.id]?.explanation ?? signal.explanation,
      }))
    : structural;
  const signals = [...localized];

  // --- External reputation (optional, server-side only) --------------------
  // Internal/loopback hosts are never disclosed to third-party APIs.
  let reputation: UrlReport["reputation"] = null;
  const provider = getReputationProvider();
  if (provider && !isInternalHostname(parts.hostname)) {
    const lookup = await provider.lookup(normalizedUrl);
    reputation = {
      providerId: provider.id,
      status: lookup.status,
      detail: lookup.detail,
    };
    if (lookup.status === "unsafe") {
      signals.push(reputationUnsafeSignal(lookup.detail));
    } else if (lookup.status === "clean") {
      signals.push(reputationCleanSignal(lookup.detail ?? provider.id));
    }
  }

  const { riskScore, riskLevel, verdict } = scoreUrlSignals(signals);
  const isShortener = isShortenerDomain(parts.domain);

  return {
    id,
    createdAt,
    inputUrl: rawInput.trim().slice(0, 2048),
    normalizedUrl,
    parseable: true,
    protocol: parts.protocol,
    hostname: parts.hostname,
    domain: parts.domain,
    subdomains: parts.subdomains,
    path: parts.path,
    queryParams: parts.queryParams,
    port: parts.port,
    isShortener,
    riskScore,
    riskLevel,
    verdict,
    summary: verdictSummary(verdict, parts.domain, lang),
    signals: sortSignalsForDisplay(signals),
    impersonation,
    reputation,
    recommendedActions: buildActions(verdict, isShortener, lang),
  };
}
