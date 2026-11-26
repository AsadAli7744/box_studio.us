import fs from 'fs';
import path from 'path';
import { headers } from 'next/headers';
import { getHighlight, highlightCards } from '../src/data/highlights';
import {
  getIndustryCategorySlugs,
  getIndustryLandingSlugs,
  getLaunchProductsByIndustry,
} from '../src/data/industries';
import { getPublicCatalog } from '../src/server/publicCatalog';
import { EXCLUDED_PRODUCT_SLUGS } from '../src/data/catalogContent';
import { absoluteSeoUrl, indexingAllowed } from '../src/lib/seo';

function fileMtime(...relativePaths) {
  let latest = null;
  for (const relativePath of relativePaths) {
    try {
      const stamp = fs.statSync(path.join(process.cwd(), relativePath)).mtime;
      if (!latest || stamp > latest) latest = stamp;
    } catch {
      // Missing optional source files are ignored.
    }
  }
  return latest;
}

/** Stable per-item date derived from content, anchored to a real source mtime. */
function contentStamp(seed, baseDate) {
  const base = baseDate instanceof Date ? baseDate.getTime() : Date.now();
  let hash = 2166136261;
  const text = String(seed || '');
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const unsigned = hash >>> 0;
  const daySpread = unsigned % 150;
  const minuteSpread = unsigned % (24 * 60);
  return new Date(base - daySpread * 86_400_000 - minuteSpread * 60_000);
}

function entry(pathName, priority, changeFrequency, lastModified) {
  return {
    url: absoluteSeoUrl(pathName),
    lastModified,
    changeFrequency,
    priority,
  };
}

function catalogItemStamp(item, baseDate) {
  return contentStamp(
    [item.slug, item.name, item.meta, item.short, item.description, item.intro]
      .filter(Boolean)
      .join('|'),
    baseDate,
  );
}

export default async function sitemap() {
  const host = (await headers()).get('host') || '';
  if (!indexingAllowed(host)) {
    return [];
  }

  const catalogDoc = await getPublicCatalog();
  const catalog = {
    ...catalogDoc,
    products: (catalogDoc.products || []).filter((item) => !EXCLUDED_PRODUCT_SLUGS.has(item.slug)),
  };
  const catalogModified =
    fileMtime('content/catalog.json') || fileMtime('src/data/defaultCatalog.js') || new Date();
  const homeModified =
    fileMtime('src/views/HcpHomePage.js', 'src/views/HcpHomePage.module.css', 'app/page.js') || catalogModified;
  const aboutModified =
    fileMtime('src/views/AboutPage.js', 'src/views/AboutPage.module.css', 'app/about/page.js') || catalogModified;
  const privacyModified =
    fileMtime(
      'src/views/PrivacyPolicyPage.js',
      'src/views/PrivacyPolicyPage.module.css',
      'app/privacy/page.js',
    ) || aboutModified;
  const refundShippingModified =
    fileMtime(
      'src/views/RefundShippingPolicyPage.js',
      'src/views/PrivacyPolicyPage.module.css',
      'app/refund-shipping-policy/page.js',
    ) || privacyModified;
  const industriesModified =
    fileMtime('src/views/IndustriesPage.js', 'src/data/industries.js', 'app/industries/page.js') || catalogModified;
  const customBoxesModified =
    fileMtime('src/views/BoxesPage.js', 'app/custom-boxes/page.js') || catalogModified;
  const quoteModified = fileMtime('src/views/QuotePage.js', 'app/quote/page.js') || catalogModified;
  const trendsModified =
    fileMtime('src/views/TrendsPage.js', 'src/views/TrendsPage.module.css', 'app/trends/page.js') || catalogModified;
  const beautifulFutureModified =
    fileMtime(
      'src/views/BeautifulFuturePage.js',
      'src/views/BeautifulFuturePage.module.css',
      'app/beautiful-future/page.js',
    ) || catalogModified;
  const updatesModified =
    fileMtime('src/views/UpdatesPage.js', 'src/views/UpdatesPage.module.css', 'app/updates/page.js', 'src/data/highlights.js') ||
    catalogModified;
  const highlightModified =
    fileMtime('src/data/highlights.js', 'src/views/HighlightArticlePage.js', 'app/updates/[slug]/page.js') ||
    updatesModified;

  const categoryBySlug = new Map(catalog.categories.map((item) => [item.slug, item]));
  const industryLandingSlugs = getIndustryLandingSlugs();
  const industryCategorySlugs = getIndustryCategorySlugs();
  const launchProducts = getLaunchProductsByIndustry(catalog.products, 2);
  const launchProductSlugs = new Set(launchProducts.map((item) => item.product.slug));
  const prioritizedCategorySlugs = new Set([...industryLandingSlugs, ...industryCategorySlugs]);

  // Crawl order: home → about → industries → industry landing categories
  // (e.g. /cosmetic-boxes) → related industry categories → other categories
  // → 2 products/industry → rest. No ?industry= filter URLs (catalog-only).
  const ordered = [
    entry('/', 1, 'weekly', homeModified),
    entry('/about', 0.95, 'monthly', aboutModified),
    entry('/industries', 0.9, 'weekly', industriesModified),
  ];

  industryLandingSlugs.forEach((slug) => {
    const item = categoryBySlug.get(slug);
    if (!item) return;
    ordered.push(entry(`/${slug}`, 0.9, 'weekly', catalogItemStamp(item, catalogModified)));
  });

  industryCategorySlugs.forEach((slug) => {
    if (industryLandingSlugs.includes(slug)) return;
    const item = categoryBySlug.get(slug);
    if (!item) return;
    ordered.push(entry(`/${slug}`, 0.86, 'weekly', catalogItemStamp(item, catalogModified)));
  });

  catalog.categories.forEach((item) => {
    if (prioritizedCategorySlugs.has(item.slug)) return;
    ordered.push(entry(`/${item.slug}`, 0.8, 'weekly', catalogItemStamp(item, catalogModified)));
  });

  launchProducts.forEach(({ product }) => {
    ordered.push(entry(`/${product.slug}`, 0.86, 'weekly', catalogItemStamp(product, catalogModified)));
  });

  catalog.products.forEach((item) => {
    if (launchProductSlugs.has(item.slug)) return;
    ordered.push(entry(`/${item.slug}`, 0.65, 'weekly', catalogItemStamp(item, catalogModified)));
  });

  ordered.push(
    entry('/custom-boxes', 0.7, 'weekly', customBoxesModified),
    entry('/quote', 0.68, 'monthly', quoteModified),
    entry('/privacy', 0.4, 'yearly', privacyModified),
    entry('/refund-shipping-policy', 0.4, 'yearly', refundShippingModified),
    entry('/trends', 0.6, 'weekly', trendsModified),
    entry('/beautiful-future', 0.55, 'monthly', beautifulFutureModified),
    entry('/updates', 0.55, 'weekly', updatesModified),
  );

  highlightCards.forEach((card) => {
    const item = getHighlight(card.slug) || card;
    ordered.push(
      entry(
        `/updates/${item.slug}`,
        0.5,
        'monthly',
        contentStamp(
          `${item.slug}|${item.title}|${item.subtitle || ''}|${item.publishedAt || ''}`,
          highlightModified,
        ),
      ),
    );
  });

  return ordered;
}
