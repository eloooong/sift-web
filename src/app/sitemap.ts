import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * Public, indexable marketing and tooling surfaces. User-private routes
 * (dashboard, history, settings) and moderation are excluded via robots.txt.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const entries: Array<[string, MetadataRoute.Sitemap[number]["changeFrequency"]]> =
    [
      ["/", "weekly"],
      ["/scanner", "weekly"],
      ["/scanner/url", "monthly"],
      ["/scanner/screenshot", "monthly"],
      ["/scams", "weekly"],
      ["/reports", "daily"],
      ["/about", "monthly"],
    ];

  return entries.map(([path, changeFrequency]) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority: path === "/" ? 1 : 0.7,
  }));
}
