import { NextResponse } from "next/server";
import { createHash } from "node:crypto";

import { verifyPassword } from "@/lib/auth/passwords";
import {
  sessionCookieOptions,
  SESSION_COOKIE,
} from "@/lib/auth/session";
import { createSession, findUserByEmail, toPublicUser } from "@/lib/auth/store";
import { jsonError, validateEmail, validatePassword } from "@/lib/auth/validation";
import { rateLimit } from "@/lib/reports/rate-limit";
import { readJsonBody, requestSameOrigin } from "@/lib/http/guards";

export const runtime = "nodejs";

function clientKey(request: Request, email: string): string {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const emailHash = createHash("sha256").update(email).digest("hex").slice(0, 16);
  return createHash("sha256")
    .update(`signin:${ip}:${emailHash}`)
    .digest("hex")
    .slice(0, 32);
}

export async function POST(request: Request) {
  if (!requestSameOrigin(request)) {
    return jsonError(
      NextResponse,
      403,
      "forbidden_origin",
      "This request didn't come from ScamShield."
    );
  }

  const parsed = await readJsonBody(request, 4 * 1024);
  if (!parsed.ok) {
    return jsonError(NextResponse, 400, "bad_request", "Invalid request body.");
  }
  const body = parsed.body as Record<string, unknown>;

  const email = validateEmail(body.email);
  if (!email) {
    return jsonError(
      NextResponse,
      400,
      "invalid_credentials",
      "Incorrect email or password."
    );
  }

  // Brute-force guard per IP + targeted account.
  const limit = rateLimit(`signin:${clientKey(request, email)}`, 10, 10 * 60_000);
  if (!limit.ok) {
    return jsonError(
      NextResponse,
      429,
      "rate_limited",
      "Too many sign-in attempts. Please wait a few minutes and try again."
    );
  }

  const password = validatePassword(body.password);
  if (!password) {
    // Same generic message for validation misses — don't leak which part failed.
    return jsonError(
      NextResponse,
      401,
      "invalid_credentials",
      "Incorrect email or password."
    );
  }

  const user = findUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return jsonError(
      NextResponse,
      401,
      "invalid_credentials",
      "Incorrect email or password."
    );
  }

  const { token } = createSession(user.id);
  const response = NextResponse.json({ user: toPublicUser(user) });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return response;
}
