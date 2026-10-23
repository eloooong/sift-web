import { NextResponse } from "next/server";

import { hashPassword } from "@/lib/auth/passwords";
import { sessionCookieOptions, SESSION_COOKIE } from "@/lib/auth/session";
import {
  createSession,
  createUser,
  findUserByEmail,
  toPublicUser,
} from "@/lib/auth/store";
import {
  jsonError,
  MIN_PASSWORD_CHARS,
  validateDisplayName,
  validateEmail,
  validatePassword,
} from "@/lib/auth/validation";
import { rateLimit } from "@/lib/reports/rate-limit";
import { clientKey, readJsonBody, requestSameOrigin } from "@/lib/http/guards";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!requestSameOrigin(request)) {
    return jsonError(
      NextResponse,
      403,
      "forbidden_origin",
      "This request didn't come from Sift."
    );
  }

  // Modest flood guard on account creation.
  const limit = await rateLimit(`signup:${clientKey(request)}`, 5, 15 * 60_000);
  if (!limit.ok) {
    return jsonError(
      NextResponse,
      429,
      "rate_limited",
      "Too many sign-up attempts. Please try again later."
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
      "invalid_email",
      "Enter a valid email address."
    );
  }

  const password = validatePassword(body.password);
  if (!password) {
    return jsonError(
      NextResponse,
      400,
      "invalid_password",
      `Passwords must be ${MIN_PASSWORD_CHARS}–200 characters.`
    );
  }

  const displayName =
    validateDisplayName(body.displayName) ?? email.split("@")[0].slice(0, 40);

  if (await findUserByEmail(email)) {
    // Deliberately the same message shape as other failures; existence is
    // still revealed via 409 which sign-in pages treat as "just sign in".
    return jsonError(
      NextResponse,
      409,
      "email_taken",
      "An account with this email already exists. Try signing in instead."
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser({ email, displayName, passwordHash });
  const { token } = await createSession(user.id);

  const response = NextResponse.json({ user: toPublicUser(user) }, { status: 201 });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return response;
}
