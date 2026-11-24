import { headers } from 'next/headers';
import { AI_SEARCH_CRAWLERS, indexingAllowed } from '../src/lib/seo';

const WWW_ORIGIN = 'https://www.boxstudio.us';
const WWW_SITEMAP = `${WWW_ORIGIN}/sitemap.xml`;

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

  // Always advertise the www sitemap/host so apex never appears in robots.txt.
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
    sitemap: WWW_SITEMAP,
    host: 'www.boxstudio.us',
  };
}
