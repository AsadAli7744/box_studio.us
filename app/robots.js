import { headers } from 'next/headers';
import { absoluteSeoUrl, AI_SEARCH_CRAWLERS, indexingAllowed } from '../src/lib/seo';

export default async function robots() {
  const host = (await headers()).get('host') || '';
  const allowIndexing = indexingAllowed(host);
  const sitemapUrl = absoluteSeoUrl('/sitemap.xml');
  const origin = absoluteSeoUrl('/').replace(/\/$/, '');

  // Staging must stay closed to Google and AI search crawlers.
  if (!allowIndexing) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/',
        },
        ...AI_SEARCH_CRAWLERS.map((userAgent) => ({
          userAgent,
          disallow: '/',
        })),
      ],
    };
  }

  // Production: public pages are crawlable. Launch crawl order is controlled by
  // sitemap.xml (home → about → industries/categories → 2 products per industry).
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
      ...AI_SEARCH_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: ['/admin', '/api/'],
      })),
    ],
    sitemap: sitemapUrl,
    host: origin,
  };
}
