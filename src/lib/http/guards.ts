import { createHash } from "node:crypto";

const DEFAULT_MAX_BODY_BYTES = 32 * 1024;

export type JsonBodyResult =
  | { ok: true; body: unknown }
  | { ok: false; reason: "too_large" | "unreadable" };

export async function readJsonBody(
  request: Request,
  maxBytes: number = DEFAULT_MAX_BODY_BYTES
): Promise<JsonBodyResult> {
  const declaredLength = Number(request.headers.get("content-length") ?? "");
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    return { ok: false, reason: "too_large" };
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return { ok: false, reason: "unreadable" };
  }

  if (Buffer.byteLength(raw, "utf8") > maxBytes) {
    return { ok: false, reason: "too_large" };
  }

  try {
    return { ok: true, body: JSON.parse(raw) };
  } catch {
    return { ok: false, reason: "unreadable" };
  }
}

export function requestSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function clientKey(request: Request): string {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const ua = request.headers.get("user-agent") ?? "";
  return createHash("sha256").update(`${ip}|${ua}`).digest("hex").slice(0, 32);
}

export function requestContentLengthExceeds(
  request: Request,
  maxBytes: number
): boolean {
  const declaredLength = Number(request.headers.get("content-length") ?? "");
  return Number.isFinite(declaredLength) && declaredLength > maxBytes;
}
