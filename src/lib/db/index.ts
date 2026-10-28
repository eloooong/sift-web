import { Pool, type PoolClient, type QueryResultRow } from "pg";
import { postgresTlsOptions } from "./connection.mjs";

/**
 * PostgreSQL access layer.
 *
 * When DATABASE_URL is configured (Supabase, Neon, RDS, local Postgres, ...)
 * all persistent stores (accounts, sessions, scan history, community reports,
 * rate limits) read and write through this module.
 *
 * Without DATABASE_URL the stores fall back to their in-memory demo mode so
 * the app stays runnable with zero configuration. Production deployments MUST
 * set DATABASE_URL; in-memory mode loses data on every restart and is not
 * shared between serverless invocations.
 */

const connectionString = process.env.DATABASE_URL?.trim() ?? "";

export function isDatabaseConfigured(): boolean {
  return connectionString.length > 0;
}

const globalForPg = globalThis as unknown as {
  __scamshieldPgPool?: Pool;
};

function createPool(): Pool {
  return new Pool({
    connectionString,
    ...postgresTlsOptions(connectionString),
    max: Number(process.env.PGPOOL_MAX ?? 5),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: Number(process.env.PGCONNECT_TIMEOUT_MS ?? 10_000),
  });
}

export function getPool(): Pool {
  if (!isDatabaseConfigured()) {
    throw new Error(
      "DATABASE_URL is not set; the Postgres layer cannot be used.",
    );
  }
  globalForPg.__scamshieldPgPool ??= createPool();
  return globalForPg.__scamshieldPgPool;
}

/** Run a parameterized query. Never interpolate values into SQL text. */
export async function query<T extends QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const pool = getPool();
  const result = await pool.query<T>(text, params);
  return result.rows;
}

export async function transaction<T>(
  work: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const value = await work(client);
    await client.query("COMMIT");
    return value;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
