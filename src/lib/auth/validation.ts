import type { NextResponse } from "next/server";

export function jsonError(
  response: typeof NextResponse,
  status: number,
  code: string,
  message: string
) {
  return response.json({ error: { code, message } }, { status });
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  if (email.length < 6 || email.length > 254) return null;
  return EMAIL_PATTERN.test(email) ? email : null;
}

export const MIN_PASSWORD_CHARS = 8;
export const MAX_PASSWORD_CHARS = 200;

export function validatePassword(raw: unknown): string | null {
  if (
    typeof raw !== "string" ||
    raw.length < MIN_PASSWORD_CHARS ||
    raw.length > MAX_PASSWORD_CHARS
  ) {
    return null;
  }
  return raw;
}

export function validateDisplayName(raw: unknown): string | null {
  if (raw === undefined || raw === null || raw === "") return null;
  if (typeof raw !== "string") return null;
  const name = raw.replace(/\s+/g, " ").trim();
  if (name.length === 0) return null;
  return name.slice(0, 40);
}
