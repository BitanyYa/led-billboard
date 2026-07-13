import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://awloadvertising.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep admin panel out of search indexes
        disallow: "/admin/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
