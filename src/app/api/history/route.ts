import { NextResponse } from "next/server";

import { currentUser } from "@/lib/auth/session";
import {
  deleteAllUserHistory,
  listUserHistory,
} from "@/lib/history/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** The signed-in user's history, newest first. */
export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { error: { code: "unauthorized", message: "Sign in first." } },
      { status: 401 }
    );
  }

  return NextResponse.json(
    { entries: listUserHistory(user.id) },
    { headers: { "cache-control": "no-store" } }
  );
}

/** Delete the signed-in user's entire history. */
export async function DELETE() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { error: { code: "unauthorized", message: "Sign in first." } },
      { status: 401 }
    );
  }

  const deleted = deleteAllUserHistory(user.id);
  return NextResponse.json({ ok: true, deleted });
}
