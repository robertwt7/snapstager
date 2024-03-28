import { MetadataRoute } from "next";

const mainUrl = "https://snapstager.com";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: mainUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${mainUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${mainUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
