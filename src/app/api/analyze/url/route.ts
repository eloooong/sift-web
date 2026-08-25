import { NextResponse } from "next/server";

import { currentUser } from "@/lib/auth/session";
import type { Lang } from "@/lib/i18n/config";
import { recordScan } from "@/lib/history/store";
import {
  clientKey,
  readJsonBody,
  requestSameOrigin,
} from "@/lib/http/guards";
import { rateLimit } from "@/lib/reports/rate-limit";
import { analyzeUrl } from "@/lib/url-analyzer";
import { ALLOWED_PROTOCOLS, parseUrl } from "@/lib/url-analyzer/parser";

export const runtime = "nodejs";

const MAX_URL_LENGTH = 2048;
const MAX_BODY_BYTES = 8 * 1024;

function jsonError(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

/**
 * SECURITY CONSIDERATIONS (URL scanner)
 *
 * 1. SSRF: the analyzed URL is parsed as a *string* only. This codebase never
 *    fetches it, resolves its DNS, follows redirects, or opens sockets to it.
 *    The sole outbound request goes to the reputation provider's fixed API
 *    endpoint, which receives the URL as JSON data; see
 *    src/lib/url-analyzer/reputation/types.ts.
 *
 * 2. Protocol allowlist: only http/https inputs are accepted for analysis.
 *    javascript:, data:, file:, and other schemes are rejected here so they
 *    can neither be rendered nor processed downstream.
 *
 * 3. Input bounds: length-capped, whitespace-stripped, and parsed with the
 *    WHATWG URL parser to eliminate malformed-input surprises.
 *
 * 4. No internal-network probing: because nothing is ever requested from the
 *    target host, internal addresses (localhost, 169.254.x.x, RFC1918) can
 *    only ever be *described* in a report, never contacted.
 *
 * 5. Reputation privacy: URLs pointing at internal/loopback hosts are never
 *    sent to the third-party reputation provider; the lookup is skipped so
 *    internal hostnames and addresses never leave the server.
 */
export async function POST(request: Request) {
  if (!requestSameOrigin(request)) {
    return jsonError(
      403,
      "forbidden_origin",
      "That request didn’t come from ScamShield. Please scan from the app."
    );
  }

  const limit = rateLimit(`scan-url:${clientKey(request)}`, 15, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      {
        error: {
          code: "rate_limited",
          message:
            "You’ve checked a lot of links in a short time. Please wait a minute before trying again.",
        },
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const parsed = await readJsonBody(request, MAX_BODY_BYTES);
  if (!parsed.ok) {
    return jsonError(
      parsed.reason === "too_large" ? 413 : 400,
      parsed.reason === "too_large" ? "too_large" : "bad_request",
      parsed.reason === "too_large"
        ? "That request is too large. Please check a shorter link."
        : "We couldn’t read that request. Please try scanning again."
    );
  }
  const body = parsed.body;

  const rawUrl =
    typeof body === "object" && body !== null && "url" in body
      ? (body as { url?: unknown }).url
      : undefined;

  if (typeof rawUrl !== "string" || !rawUrl.trim()) {
    return jsonError(
      400,
      "empty_input",
      "Paste the link you want checked before running a scan."
    );
  }

  const trimmed = rawUrl.trim();
  if (trimmed.length > MAX_URL_LENGTH) {
    return jsonError(
      400,
      "too_long",
      `That link is too long. Please check URLs up to ${MAX_URL_LENGTH.toLocaleString()} characters.`
    );
  }

  // Protocol allowlist; first line of defense before any parsing work.
  const probe = parseUrl(trimmed);
  if (
    probe.ok &&
    !ALLOWED_PROTOCOLS.includes(probe.url.protocol as (typeof ALLOWED_PROTOCOLS)[number])
  ) {
    return jsonError(
      400,
      "unsupported_scheme",
      "Only http:// and https:// links can be checked. That scheme isn’t a web address."
    );
  }

  try {
    const requestedLang =
      typeof body === "object" && body !== null && "lang" in body
        ? (body as { lang?: unknown }).lang
        : undefined;
    const lang: Lang = requestedLang === "fil" ? "fil" : "en";
    const report = await analyzeUrl(trimmed, { lang });
    const user = await currentUser();
    if (user) {
      recordScan({
        userId: user.id,
        scanType: "url",
        rawInput: trimmed,
        status: "completed",
        urlReport: report,
      });
    }
    return NextResponse.json({ report });
  } catch (error) {
    console.error("[api/analyze/url] unexpected failure", error);
    const user = await currentUser();
    if (user) {
      recordScan({
        userId: user.id,
        scanType: "url",
        rawInput: trimmed,
        status: "failed",
      });
    }
    return jsonError(
      500,
      "internal_error",
      "Something went wrong while checking this link. Please try again."
    );
  }
}
