import { NextResponse } from "next/server";

import { currentUser } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Lightweight identity probe for the navbar; never leaks session state. */
export async function GET() {
  const user = await currentUser();
  return NextResponse.json(
    { user },
    { headers: { "cache-control": "no-store" } }
  );
}
