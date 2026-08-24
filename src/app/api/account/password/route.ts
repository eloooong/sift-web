import { NextResponse } from "next/server";

import { hashPassword, verifyPassword } from "@/lib/auth/passwords";
import {
  sessionCookieOptions,
  SESSION_COOKIE,
  currentUser,
} from "@/lib/auth/session";
import {
  authStore,
  createSession,
  destroyAllSessionsForUser,
} from "@/lib/auth/store";
import {
  jsonError,
  MIN_PASSWORD_CHARS,
  validatePassword,
} from "@/lib/auth/validation";
import { rateLimit } from "@/lib/reports/rate-limit";
import { createHash } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Change password. Requires the current password; all existing sessions are
 * revoked so other devices are signed out. The current device receives a
 * fresh session cookie.
 */
export async function POST(request: Request) {
  const sessionUser = await currentUser();
  if (!sessionUser) {
    return jsonError(NextResponse, 401, "unauthorized", "Sign in first.");
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const limit = rateLimit(
    `pwchange:${createHash("sha256").update(ip).digest("hex").slice(0, 32)}`,
    5,
    10 * 60_000
  );
  if (!limit.ok) {
    return jsonError(
      NextResponse,
      429,
      "rate_limited",
      "Too many attempts. Please wait a few minutes."
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonError(NextResponse, 400, "bad_request", "Invalid request body.");
  }

  const currentPassword = validatePassword(body.currentPassword);
  const newPassword = validatePassword(body.newPassword);
  if (!currentPassword || !newPassword) {
    return jsonError(
      NextResponse,
      400,
      "invalid_password",
      `Both fields are required and passwords must be ${MIN_PASSWORD_CHARS}–200 characters.`
    );
  }
  if (currentPassword === newPassword) {
    return jsonError(
      NextResponse,
      400,
      "invalid_password",
      "The new password must be different from the current one."
    );
  }

  for (const user of authStore.users.values()) {
    if (user.id !== sessionUser.id) continue;

    if (!(await verifyPassword(currentPassword, user.passwordHash))) {
      return jsonError(
        NextResponse,
        401,
        "invalid_credentials",
        "Your current password is incorrect."
      );
    }

    user.passwordHash = await hashPassword(newPassword);
    // Sign out every device, then re-issue a fresh session for THIS device so
    // the user isn't logged out of the settings page they're looking at.
    destroyAllSessionsForUser(user.id);
    const { token } = createSession(user.id);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return response;
  }
  return jsonError(NextResponse, 401, "unauthorized", "Sign in first.");
}
