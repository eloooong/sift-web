/**
 * Default to verified TLS for remote PostgreSQL hosts. Explicit connection-string
 * SSL settings are left to pg, including custom certificates and local overrides.
 * @param {string} connectionString
 * @param {string | undefined} [ca] Optional PEM certificate for a private CA.
 */
export function postgresTlsOptions(
  connectionString,
  ca = process.env.DATABASE_SSL_CA?.trim(),
) {
  const url = new URL(connectionString);
  if (url.searchParams.has("sslmode") || url.searchParams.has("ssl")) return {};
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (["localhost", "127.0.0.1", "::1"].includes(host)) return {};
  if (url.searchParams.get("host")?.startsWith("/")) return {};
  return { ssl: { rejectUnauthorized: true, ...(ca ? { ca } : {}) } };
}
