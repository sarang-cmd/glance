import type { MetadataRoute } from "next";
import { site, pages } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  return Object.keys(pages)
    .filter((p) => !["/confirm", "/unsubscribe", "/thank-you"].includes(p))
    .map((p) => ({
      url: site + (p === "/" ? "" : p),
      changeFrequency: p === "/roadmap" ? "weekly" : "monthly",
      priority: p === "/" ? 1 : 0.7,
    }));
}
