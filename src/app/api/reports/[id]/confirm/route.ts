import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import { rateLimit } from "@/lib/reports/rate-limit";
import { confirmReport, getApprovedReport } from "@/lib/reports/store";
import { ANON_COOKIE } from "@/lib/reports/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

function readAnonToken(request: Request): string | undefined {
  return request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ANON_COOKIE}=`))
    ?.slice(ANON_COOKIE.length + 1);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!getApprovedReport(id)) {
    return jsonError(404, "not_found", "Report not found.");
  }

  // Gentle flood guard on top of one-confirmation-per-token.
  const token = readAnonToken(request) ?? randomUUID();
  const limit = rateLimit(`confirm:${token}`, 20, 60_000);
  if (!limit.ok) {
    return jsonError(429, "rate_limited", "Slow down a little.");
  }

  const confirmations = confirmReport(id, token);
  if (confirmations === null) {
    return jsonError(404, "not_found", "Report not found.");
  }

  const response = NextResponse.json({ ok: true, confirmations });
  response.cookies.set(ANON_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return response;
}
