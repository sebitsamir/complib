import type { MetadataRoute } from "next";
import { getComponents } from "@/lib/component-store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const components = await getComponents("");

  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/components`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/playground`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/pricing`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/docs`, changeFrequency: "monthly", priority: 0.5 },
    ...components.map((component) => ({
      url: `${base}/components/${component.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
