#!/usr/bin/env node
/**
 * Applies pending SQL migrations from db/migrations in filename order.
 *
 * Usage: npm run db:migrate   (requires DATABASE_URL)
 *
 * Each applied migration is recorded in _migrations; re-running is a no-op.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const here = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(here, "..", "db", "migrations");

// Plain Node doesn't auto-load .env.local the way next dev does.
// Load it manually (without overriding variables already set).
if (!process.env.DATABASE_URL) {
  const envLocal = join(here, "..", ".env.local");
  if (existsSync(envLocal)) {
    for (const line of readFileSync(envLocal, "utf8").split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      const key = match[1];
      const value = match[2].replace(/^["']|["']$/g, "");
      if (!(key in process.env)) process.env[key] = value;
    }
  }
}

const connectionString = process.env.DATABASE_URL?.trim();
if (!connectionString) {
  console.error(
    "DATABASE_URL is not set. Copy .env.example to .env.local, point it at\n" +
      "your Postgres (Supabase/Neon/local), and try again."
  );
  process.exit(1);
}

const needsSsl =
  !/localhost|127\.0\.0\.1|::1/.test(connectionString) &&
  !/sslmode=disable/.test(connectionString);
const pool = new pg.Pool({
  connectionString,
  ...(needsSsl ? { ssl: { rejectUnauthorized: false } } : {}),
});

async function main() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name       TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  const { rows } = await pool.query("SELECT name FROM _migrations");
  const applied = new Set(rows.map((row) => row.name));

  const files = readdirSync(migrationsDir)
    .filter((name) => name.endsWith(".sql"))
    .sort();

  const pending = files.filter((name) => !applied.has(name));
  if (pending.length === 0) {
    console.log(`No pending migrations (${applied.size} already applied).`);
    return;
  }

  for (const name of pending) {
    const sql = readFileSync(join(migrationsDir, name), "utf8");
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      // All migration files use IF NOT EXISTS / idempotent statements.
      await client.query(sql);
      await client.query("INSERT INTO _migrations (name) VALUES ($1)", [name]);
      await client.query("COMMIT");
      console.log(`Applied ${name}`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
  console.log("Database is up to date.");
}

main()
  .catch((error) => {
    console.error("Migration failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
