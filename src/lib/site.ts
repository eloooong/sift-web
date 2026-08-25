/**
 * Canonical site origin used for SEO metadata, robots.txt, and sitemap.xml.
 * Set NEXT_PUBLIC_SITE_URL in production; falls back to the Vercel deployment
 * URL locally/preview.
 */
function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = "ScamShield PH";
