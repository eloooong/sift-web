import { NextResponse } from "next/server";

import { currentUser } from "@/lib/auth/session";
import {
  authStore,
  toPublicUser,
} from "@/lib/auth/store";
import { jsonError, validateDisplayName } from "@/lib/auth/validation";
import { readJsonBody, requestSameOrigin } from "@/lib/http/guards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Update the signed-in user's display name. */
export async function PATCH(request: Request) {
  if (!requestSameOrigin(request)) {
    return jsonError(
      NextResponse,
      403,
      "forbidden_origin",
      "This request didn't come from ScamShield."
    );
  }

  const sessionUser = await currentUser();
  if (!sessionUser) {
    return jsonError(NextResponse, 401, "unauthorized", "Sign in first.");
  }

  const parsed = await readJsonBody(request, 4 * 1024);
  if (!parsed.ok) {
    return jsonError(NextResponse, 400, "bad_request", "Invalid request body.");
  }
  const body = parsed.body as Record<string, unknown>;

  const displayName = validateDisplayName(body.displayName);
  if (!displayName) {
    return jsonError(
      NextResponse,
      400,
      "invalid_name",
      "Enter a display name of 1–40 characters."
    );
  }

  // currentUser() already proved the session maps to a live record.
  for (const user of authStore.users.values()) {
    if (user.id === sessionUser.id) {
      user.displayName = displayName;
      return NextResponse.json({ user: toPublicUser(user) });
    }
  }
  return jsonError(NextResponse, 401, "unauthorized", "Sign in first.");
}
