import type { MetadataRoute } from "next";
// Rendre l'import a BLOG_POSTS avec les entrees blog ci-dessous.
// import { BLOG_POSTS } from "@/lib/blog-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumyx.dev";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/docs", changeFrequency: "weekly", priority: 0.8 },
  // Routes desactivees (app/_pricing, app/_changelog, app/_blog) — pas d'URL morte dans le sitemap.
  // { path: "/pricing", changeFrequency: "monthly", priority: 0.8 },
  // { path: "/changelog", changeFrequency: "weekly", priority: 0.5 },
  // { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
  //   url: `${SITE_URL}/blog/${p.slug}`,
  //   lastModified: new Date(p.date),
  //   changeFrequency: "monthly",
  //   priority: 0.6,
  // }));

  return staticEntries;
}
