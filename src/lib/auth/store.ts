import { createHash, randomBytes } from "node:crypto";

import { isDatabaseConfigured, query } from "@/lib/db";

/**
 * Auth store: accounts and sessions.
 *
 * With DATABASE_URL set, data lives in Postgres (see db/migrations). Without
 * it the store falls back to server memory attached to globalThis (survives
 * dev hot-reloads; a restart signs everyone out) so the demo stays runnable.
 *
 * Passwords are stored only as scrypt hashes. Sessions are keyed by the
 * SHA-256 of the cookie token, so a database leak never yields usable
 * session credentials.
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

type MemoryAuthStore = {
  /** Keyed by lowercased email. */
  users: Map<string, UserRecord>;
  /** Keyed by SHA-256 of the raw session token. */
  sessions: Map<string, SessionRecord>;
};

const globalStore = globalThis as unknown as {
  __scamshieldAuthStore?: MemoryAuthStore;
};

function memoryStore(): MemoryAuthStore {
  globalStore.__scamshieldAuthStore ??= {
    users: new Map(),
    sessions: new Map(),
  };
  return globalStore.__scamshieldAuthStore;
}

export const SESSION_TTL_MS = 30 * 86_400_000;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function generateUserId(): string {
  return `USR-${randomBytes(5).toString("hex").toUpperCase()}`;
}

/** Only the hash of the token is ever persisted or compared. */
export function hashToken(token: string): string {
  return createHash("sha256").update(`ss-session:${token}`).digest("hex");
}

function rowToUser(row: Record<string, unknown>): UserRecord {
  return {
    id: String(row.id),
    email: String(row.email),
    displayName: String(row.display_name),
    passwordHash: String(row.password_hash),
    createdAt: new Date(row.created_at as string).toISOString(),
  };
}

function purgeExpiredSessions(): void {
  const now = Date.now();
  for (const [key, session] of memoryStore().sessions) {
    if (Date.parse(session.expiresAt) <= now) {
      memoryStore().sessions.delete(key);
    }
  }
}

export async function createUser(input: {
  email: string;
  displayName: string;
  passwordHash: string;
}): Promise<UserRecord> {
  const user: UserRecord = {
    id: generateUserId(),
    email: normalizeEmail(input.email),
    displayName: input.displayName,
    passwordHash: input.passwordHash,
    createdAt: new Date().toISOString(),
  };

  if (isDatabaseConfigured()) {
    const rows = await query(
      `INSERT INTO users (id, email, display_name, password_hash, created_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        user.id,
        user.email,
        user.displayName,
        user.passwordHash,
        user.createdAt,
      ]
    );
    return rowToUser(rows[0]);
  }

  memoryStore().users.set(user.email, user);
  return user;
}

export async function findUserByEmail(
  email: string
): Promise<UserRecord | null> {
  const normalized = normalizeEmail(email);

  if (isDatabaseConfigured()) {
    const rows = await query(
      "SELECT * FROM users WHERE email = $1 LIMIT 1",
      [normalized]
    );
    return rows[0] ? rowToUser(rows[0]) : null;
  }

  return memoryStore().users.get(normalized) ?? null;
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  if (isDatabaseConfigured()) {
    const rows = await query("SELECT * FROM users WHERE id = $1 LIMIT 1", [id]);
    return rows[0] ? rowToUser(rows[0]) : null;
  }

  for (const user of memoryStore().users.values()) {
    if (user.id === id) return user;
  }
  return null;
}

export async function updateUserProfile(
  userId: string,
  displayName: string
): Promise<UserRecord | null> {
  if (isDatabaseConfigured()) {
    const rows = await query(
      `UPDATE users SET display_name = $2 WHERE id = $1 RETURNING *`,
      [userId, displayName]
    );
    return rows[0] ? rowToUser(rows[0]) : null;
  }

  for (const [email, user] of memoryStore().users) {
    if (user.id === userId) {
      const updated = { ...user, displayName };
      memoryStore().users.set(email, updated);
      return updated;
    }
  }
  return null;
}

export async function updateUserPassword(
  userId: string,
  passwordHash: string
): Promise<void> {
  if (isDatabaseConfigured()) {
    await query(`UPDATE users SET password_hash = $2 WHERE id = $1`, [
      userId,
      passwordHash,
    ]);
    return;
  }

  for (const [email, user] of memoryStore().users) {
    if (user.id === userId) {
      memoryStore().users.set(email, { ...user, passwordHash });
      return;
    }
  }
}

export async function createSession(userId: string): Promise<{ token: string }> {
  const token = randomBytes(32).toString("base64url");
  const now = Date.now();
  const createdAt = new Date(now).toISOString();
  const expiresAt = new Date(now + SESSION_TTL_MS).toISOString();

  if (isDatabaseConfigured()) {
    await query(
      `INSERT INTO sessions (token_hash, user_id, created_at, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [hashToken(token), userId, createdAt, expiresAt]
    );
    return { token };
  }

  memoryStore().sessions.set(hashToken(token), {
    userId,
    createdAt,
    expiresAt,
  });
  purgeExpiredSessions();
  return { token };
}

/**
 * Resolve a session cookie token to its live user. Expired or orphaned
 * sessions are deleted on sight so they cannot accumulate.
 */
export async function getSessionUser(
  token: string
): Promise<UserRecord | null> {
  const key = hashToken(token);

  if (isDatabaseConfigured()) {
    const rows = await query(
      `SELECT u.*, s.expires_at AS session_expires_at
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = $1 LIMIT 1`,
      [key]
    );
    if (!rows[0]) return null;
    if (Date.parse(String(rows[0].session_expires_at)) <= Date.now()) {
      await query("DELETE FROM sessions WHERE token_hash = $1", [key]);
      return null;
    }
    return rowToUser(rows[0]);
  }

  const session = memoryStore().sessions.get(key);
  if (!session) return null;
  if (Date.parse(session.expiresAt) <= Date.now()) {
    memoryStore().sessions.delete(key);
    return null;
  }
  // Look up by id so an email change can't break sessions mid-life.
  for (const user of memoryStore().users.values()) {
    if (user.id === session.userId) return user;
  }
  memoryStore().sessions.delete(key);
  return null;
}

export async function destroySession(token: string): Promise<void> {
  const key = hashToken(token);

  if (isDatabaseConfigured()) {
    await query("DELETE FROM sessions WHERE token_hash = $1", [key]);
    return;
  }
  memoryStore().sessions.delete(key);
}

/** Destroy every session belonging to a user (used after password change). */
export async function destroyAllSessionsForUser(userId: string): Promise<void> {
  if (isDatabaseConfigured()) {
    await query("DELETE FROM sessions WHERE user_id = $1", [userId]);
    return;
  }
  for (const [key, session] of memoryStore().sessions) {
    if (session.userId === userId) memoryStore().sessions.delete(key);
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
