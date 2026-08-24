import { NextResponse } from "next/server";

import {
  sessionCookieOptions,
  SESSION_COOKIE,
  signOutCurrentSession,
} from "@/lib/auth/session";
import { requestSameOrigin } from "@/lib/http/guards";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!requestSameOrigin(request)) {
    return NextResponse.json(
      { error: { code: "forbidden_origin", message: "This request didn't come from ScamShield." } },
      { status: 403 }
    );
  }

  await signOutCurrentSession();

  const response = NextResponse.json({ ok: true });
  // Overwrite with an immediately-expired cookie.
  response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}
