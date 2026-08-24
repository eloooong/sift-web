import { NextResponse } from "next/server";

import { currentUser } from "@/lib/auth/session";
import {
  authStore,
  toPublicUser,
} from "@/lib/auth/store";
import { jsonError, validateDisplayName } from "@/lib/auth/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Update the signed-in user's display name. */
export async function PATCH(request: Request) {
  const sessionUser = await currentUser();
  if (!sessionUser) {
    return jsonError(NextResponse, 401, "unauthorized", "Sign in first.");
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonError(NextResponse, 400, "bad_request", "Invalid request body.");
  }

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
