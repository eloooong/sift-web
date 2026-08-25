import { NextResponse } from "next/server";

import { currentUser } from "@/lib/auth/session";
import {
  deleteAllUserHistory,
  listUserHistory,
} from "@/lib/history/store";
import { requestSameOrigin } from "@/lib/http/guards";

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
    { entries: await listUserHistory(user.id) },
    { headers: { "cache-control": "no-store" } }
  );
}

/** Delete the signed-in user's entire history. */
export async function DELETE(request: Request) {
  if (!requestSameOrigin(request)) {
    return NextResponse.json(
      { error: { code: "forbidden_origin", message: "This request didn't come from ScamShield." } },
      { status: 403 }
    );
  }

  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { error: { code: "unauthorized", message: "Sign in first." } },
      { status: 401 }
    );
  }

  const deleted = await deleteAllUserHistory(user.id);
  return NextResponse.json({ ok: true, deleted });
}
