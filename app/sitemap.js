import { headers } from 'next/headers';
import { getPublicCatalog } from '../src/server/publicCatalog';
import { absoluteSeoUrl, indexingAllowed } from '../src/lib/seo';

export default async function sitemap() {
  const host = (await headers()).get('host') || '';
  if (!indexingAllowed(host)) {
    return [];
  }

  const catalog = await getPublicCatalog();
  const now = new Date();

  const staticRoutes = [
    { path: '/', priority: 1, changeFrequency: 'weekly' },
    { path: '/custom-boxes', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/industries', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/quote', priority: 0.8, changeFrequency: 'monthly' },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteSeoUrl(route.path),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...catalog.categories.map((item) => ({
      url: absoluteSeoUrl(`/${item.slug}`),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
    ...catalog.products.map((item) => ({
      url: absoluteSeoUrl(`/${item.slug}`),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    })),
  ];
}
