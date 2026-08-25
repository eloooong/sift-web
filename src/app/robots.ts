import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private, session-scoped, or operational surfaces.
      disallow: [
        "/api/",
        "/dashboard",
        "/history",
        "/settings",
        "/signin",
        "/signup",
        "/reports/moderation",
        "/reports/", // individual report pages are ephemeral/ID-based
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
