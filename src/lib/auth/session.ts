import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  SESSION_TTL_MS,
  destroySession,
  getSessionUser,
  toPublicUser,
  type PublicUser,
} from "./store";

export const SESSION_COOKIE = "ss_session";

/**
 * Read the signed-in user from the session cookie, or null.
 * Safe in server components and route handlers. The cookie is httpOnly, so
 * client code can never impersonate a user — everything derives from this.
 */
export async function currentUser(): Promise<PublicUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const user = getSessionUser(token);
  return user ? toPublicUser(user) : null;
}

/**
 * Page guard — redirects unauthenticated visitors to the sign-in screen with
 * a `next` parameter so they land back here after authenticating.
 */
export async function requireUser(returnTo: string): Promise<PublicUser> {
  const user = await currentUser();
  if (!user) {
    redirect(`/signin?next=${encodeURIComponent(returnTo)}`);
  }
  return user;
}

export async function signOutCurrentSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) destroySession(token);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
    path: "/",
  };
}
