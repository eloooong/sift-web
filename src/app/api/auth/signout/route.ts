import { NextResponse } from "next/server";

import {
  sessionCookieOptions,
  SESSION_COOKIE,
  signOutCurrentSession,
} from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST() {
  await signOutCurrentSession();

  const response = NextResponse.json({ ok: true });
  // Overwrite with an immediately-expired cookie.
  response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}
