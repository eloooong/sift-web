import { createHash, randomBytes } from "node:crypto";

/**
 * In-memory auth store: ScamShield PH has no database yet.
 *
 * Accounts and sessions live in server memory attached to globalThis (survives
 * dev hot-reloads; a server restart signs everyone out). Passwords are stored
 * only as scrypt hashes. Sessions are keyed by the SHA-256 of the cookie token,
 * so a database leak of this map never yields usable session credentials.
 */

export type UserRecord = {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string;
  createdAt: string;
};

export type SessionRecord = {
  userId: string;
  createdAt: string;
  expiresAt: string;
};

export type PublicUser = {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
};

type AuthStoreShape = {
  /** Keyed by lowercased email. */
  users: Map<string, UserRecord>;
  /** Keyed by SHA-256 of the raw session token. */
  sessions: Map<string, SessionRecord>;
};

const globalStore = globalThis as unknown as {
  __scamshieldAuthStore?: AuthStoreShape;
};

function createStore(): AuthStoreShape {
  return { users: new Map(), sessions: new Map() };
}

export const authStore: AuthStoreShape =
  globalStore.__scamshieldAuthStore ?? createStore();
globalStore.__scamshieldAuthStore = authStore;

export const SESSION_TTL_MS = 30 * 86_400_000;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function findUserByEmail(email: string): UserRecord | null {
  return authStore.users.get(normalizeEmail(email)) ?? null;
}

function generateUserId(): string {
  return `USR-${randomBytes(5).toString("hex").toUpperCase()}`;
}

export function createUser(input: {
  email: string;
  displayName: string;
  passwordHash: string;
}): UserRecord {
  const user: UserRecord = {
    id: generateUserId(),
    email: normalizeEmail(input.email),
    displayName: input.displayName,
    passwordHash: input.passwordHash,
    createdAt: new Date().toISOString(),
  };
  authStore.users.set(user.email, user);
  return user;
}

/** Only the hash of the token is ever persisted or compared. */
export function hashToken(token: string): string {
  return createHash("sha256").update(`ss-session:${token}`).digest("hex");
}

export function createSession(userId: string): { token: string } {
  const token = randomBytes(32).toString("base64url");
  const now = Date.now();
  authStore.sessions.set(hashToken(token), {
    userId,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_TTL_MS).toISOString(),
  });
  purgeExpiredSessions();
  return { token };
}

export function getSessionUser(token: string): UserRecord | null {
  const session = authStore.sessions.get(hashToken(token));
  if (!session) return null;
  if (Date.parse(session.expiresAt) <= Date.now()) {
    authStore.sessions.delete(hashToken(token));
    return null;
  }
  // Look up by id so an email change can't break sessions mid-life.
  for (const user of authStore.users.values()) {
    if (user.id === session.userId) return user;
  }
  authStore.sessions.delete(hashToken(token));
  return null;
}

export function destroySession(token: string): void {
  authStore.sessions.delete(hashToken(token));
}

/** Destroy every session belonging to a user (used after password change). */
export function destroyAllSessionsForUser(userId: string): void {
  for (const [key, session] of authStore.sessions) {
    if (session.userId === userId) authStore.sessions.delete(key);
  }
}

function purgeExpiredSessions(): void {
  const now = Date.now();
  for (const [key, session] of authStore.sessions) {
    if (Date.parse(session.expiresAt) <= now) authStore.sessions.delete(key);
  }
}

export function toPublicUser(user: UserRecord): PublicUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    createdAt: user.createdAt,
  };
}
