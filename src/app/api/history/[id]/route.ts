import { NextResponse } from "next/server";

import { currentUser } from "@/lib/auth/session";
import {
  deleteUserHistoryEntry,
  getUserHistoryEntry,
} from "@/lib/history/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

/**
 * Single-entry access is scoped to the session user. Another user's entry —
 * or a nonexistent one — returns the same 404, so IDs can't be probed.
 */
export async function GET(_request: Request, { params }: { params: Params }) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { error: { code: "unauthorized", message: "Sign in first." } },
      { status: 401 }
    );
  }
  const { id } = await params;
  const entry = getUserHistoryEntry(user.id, id);
  if (!entry) {
    return NextResponse.json(
      { error: { code: "not_found", message: "Scan not found." } },
      { status: 404 }
    );
  }
  return NextResponse.json({ entry });
}

export async function DELETE(_request: Request, { params }: { params: Params }) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { error: { code: "unauthorized", message: "Sign in first." } },
      { status: 401 }
    );
  }
  const { id } = await params;
  if (!deleteUserHistoryEntry(user.id, id)) {
    return NextResponse.json(
      { error: { code: "not_found", message: "Scan not found." } },
      { status: 404 }
    );
  }
  return NextResponse.json({ ok: true });
}
