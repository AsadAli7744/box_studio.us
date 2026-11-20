import { headers } from 'next/headers';
import { absoluteSeoUrl, AI_SEARCH_CRAWLERS, indexingAllowed } from '../src/lib/seo';

export default async function robots() {
  const host = (await headers()).get('host') || '';
  const allowIndexing = indexingAllowed(host);

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

  // Production: allow general crawlers and explicitly allow AI search bots.
  // Admin and API routes remain closed.
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
    sitemap: absoluteSeoUrl('/sitemap.xml'),
    host: absoluteSeoUrl('/').replace(/\/$/, ''),
  };
}
