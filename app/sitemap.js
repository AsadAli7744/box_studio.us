import { headers } from 'next/headers';
import { highlightArticles } from '../src/data/highlights';
import { getIndustryCategorySlugs, getLaunchProductsByIndustry } from '../src/data/industries';
import { getPublicCatalog } from '../src/server/publicCatalog';
import { absoluteSeoUrl, indexingAllowed } from '../src/lib/seo';

function entry(path, priority, changeFrequency, lastModified) {
  return {
    url: absoluteSeoUrl(path),
    lastModified,
    changeFrequency,
    priority,
  };
}

export default async function sitemap() {
  const host = (await headers()).get('host') || '';
  if (!indexingAllowed(host)) {
    return [];
  }

  const catalog = await getPublicCatalog();
  const now = new Date();
  const categoryBySlug = new Map(catalog.categories.map((item) => [item.slug, item]));
  const industryCategorySlugs = getIndustryCategorySlugs();
  const launchProducts = getLaunchProductsByIndustry(catalog.products, 2);
  const launchProductSlugs = new Set(launchProducts.map((item) => item.product.slug));

  // Crawl order: home → about → industries → categories → 2 products/industry → rest.
  const ordered = [
    entry('/', 1, 'weekly', now),
    entry('/about', 0.95, 'monthly', now),
    entry('/industries', 0.9, 'weekly', now),
  ];

  industryCategorySlugs.forEach((slug) => {
    if (!categoryBySlug.has(slug)) return;
    ordered.push(entry(`/${slug}`, 0.88, 'weekly', now));
  });

  catalog.categories.forEach((item) => {
    if (industryCategorySlugs.includes(item.slug)) return;
    ordered.push(entry(`/${item.slug}`, 0.8, 'weekly', now));
  });

  launchProducts.forEach(({ product }) => {
    ordered.push(entry(`/${product.slug}`, 0.86, 'weekly', now));
  });

  catalog.products.forEach((item) => {
    if (launchProductSlugs.has(item.slug)) return;
    ordered.push(entry(`/${item.slug}`, 0.65, 'weekly', now));
  });

  ordered.push(
    entry('/custom-boxes', 0.7, 'weekly', now),
    entry('/quote', 0.68, 'monthly', now),
    entry('/trends', 0.6, 'weekly', now),
    entry('/beautiful-future', 0.55, 'monthly', now),
    entry('/updates', 0.55, 'weekly', now),
  );

  highlightArticles.forEach((item) => {
    ordered.push(entry(`/updates/${item.slug}`, 0.5, 'monthly', now));
  });

  return ordered;
}
