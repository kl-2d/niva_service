import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const BASE = "https://niva-service.ru";

  return [
    {
      url: BASE,
      lastModified: "2026-03-07",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE}/services`,
      lastModified: "2026-03-07",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/about`,
      lastModified: "2026-03-07",
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}

