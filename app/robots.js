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

  // Prefer clean category landings (/cosmetic-boxes) over catalog filter URLs.
  // Keep /custom-boxes itself crawlable; block query-string industry/search filters.
  const disallow = ['/admin', '/api/', '/custom-boxes?*'];

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/llms.txt'],
        disallow,
      },
      ...AI_SEARCH_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: ['/', '/llms.txt'],
        disallow,
      })),
    ],
    sitemap: WWW_SITEMAP,
    host: 'www.boxstudio.us',
  };
}
