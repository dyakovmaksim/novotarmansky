// Минимальный статический sitemap. Если страниц станет много — переключиться
// на @nuxtjs/sitemap, который умеет автогенерацию по router.
//
// SITE_URL берётся из NUXT_PUBLIC_SITE_URL; в дев — http://localhost:3000.
export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const siteUrl = (config.public.siteUrl as string) || "http://localhost:3000";

  const pages = [
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/aboutus", changefreq: "monthly", priority: "0.7" },
    { path: "/photos", changefreq: "monthly", priority: "0.7" },
    { path: "/promotion", changefreq: "weekly", priority: "0.7" },
    { path: "/contacts", changefreq: "monthly", priority: "0.6" },
    { path: "/booking", changefreq: "weekly", priority: "0.9" },
  ];

  const urls = pages
    .map(
      (p) => `  <url>
    <loc>${siteUrl}${p.path}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
    )
    .join("\n");

  event.node.res.setHeader("Content-Type", "application/xml; charset=utf-8");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
});
