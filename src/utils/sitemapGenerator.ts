import { supabase } from "@/integrations/supabase/client";

interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = async (baseUrl: string): Promise<string> => {
  const urls: SitemapURL[] = [
    // Static pages
    { loc: `${baseUrl}`, priority: 1.0, changefreq: 'daily' },
    { loc: `${baseUrl}/blog`, priority: 0.9, changefreq: 'daily' },
    { loc: `${baseUrl}/videos`, priority: 0.9, changefreq: 'daily' },
    { loc: `${baseUrl}/irankiai`, priority: 0.8, changefreq: 'weekly' },
    { loc: `${baseUrl}/apie`, priority: 0.7, changefreq: 'monthly' },
    { loc: `${baseUrl}/kontaktai`, priority: 0.6, changefreq: 'monthly' },
  ];

  // Get blog posts
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('status', 'published');

  if (posts) {
    posts.forEach(post => {
      urls.push({
        loc: `${baseUrl}/blog/${post.slug}`,
        lastmod: post.updated_at,
        priority: 0.8,
        changefreq: 'weekly'
      });
    });
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
}; 