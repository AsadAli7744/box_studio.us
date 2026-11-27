'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import { getIndustryGroup } from '../data/industries';
import { absoluteUrl } from '../data/site';
import { useCatalog } from '../context/CatalogContext';
import { usePageMeta } from '../hooks/usePageMeta';
import Accordion from '../components/Accordion';

const PRODUCT_BATCH_SIZE = 12;

export default function BoxesPage({
  categorySlug,
  initialQuery = '',
  initialIndustry = '',
}) {
  const loadMoreRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(PRODUCT_BATCH_SIZE);
  const { categories, products, getCategory } = useCatalog();
  const query = String(initialQuery || '').trim();
  const needle = query.toLowerCase();
  const industrySlug = String(initialIndustry || '').trim().toLowerCase();
  const industry = categorySlug ? null : getIndustryGroup(industrySlug, categories);
  const category = categorySlug ? getCategory(categorySlug) : null;
  const pool = category
    ? products.filter(
        (item) =>
          item.category === category.slug ||
          (Array.isArray(item.categories) && item.categories.includes(category.slug))
      )
    : industry
      ? products.filter((item) => {
          const productCategories = Array.isArray(item.categories) && item.categories.length
            ? item.categories
            : [item.category];
          return productCategories.some((slug) => industry.categorySlugs.includes(slug));
        })
    : products;
  const results = needle
    ? pool.filter((item) => [item.name, item.categoryLabel].join(' ').toLowerCase().includes(needle))
    : pool;
  const path = category
    ? `/${category.slug}`
    : industry
      ? `/custom-boxes?industry=${industry.slug}`
      : '/custom-boxes';
  const title = category
    ? (category.heading || category.name)
    : industry
      ? `${industry.name} Packaging`
      : 'Custom Boxes';
  const progressivelyLoad = !categorySlug;
  const visibleResults = progressivelyLoad ? results.slice(0, visibleCount) : results;
  const hasMore = progressivelyLoad && visibleCount < results.length;

  useEffect(() => {
    setVisibleCount(PRODUCT_BATCH_SIZE);
  }, [categorySlug, industrySlug, needle]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasMore) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((count) => Math.min(count + PRODUCT_BATCH_SIZE, results.length));
        }
      },
      { rootMargin: '600px 0px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, results.length]);

  const metaTitle = category
    ? `${title} | Box Studio`
    : industry
      ? `${title} | Box Studio`
      : 'Custom Product Boxes | Custom Packaging Catalog | Box Studio';
  const metaDescription = category
    ? category.intro
    : industry
      ? `Explore custom ${industry.name.toLowerCase()} packaging from all related Box Studio categories.`
      : 'Browse custom product boxes and printed packaging by category. Open a box to review structure details and request a production quote.';

  const faqEntities = (category?.faqs || [])
    .filter((item) => item?.q && item?.a)
    .map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    }));

  usePageMeta({
    title: metaTitle,
    description: metaDescription,
    path,
    image: absoluteUrl(category ? category.image : industry?.image || products[0]?.images?.[0]?.src || '/images/cat-all.jpg'),
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          name: title,
          url: absoluteUrl(path),
          description: metaDescription,
        },
        ...(faqEntities.length
          ? [
              {
                '@type': 'FAQPage',
                mainEntity: faqEntities,
              },
            ]
          : []),
      ],
    },
  });

  return (
    <div className="catalog-page">
      <header className="page-intro">
        <p className="eyebrow">{category ? 'Category' : industry ? 'Industry' : 'Catalog'}</p>
        <h1>{title}</h1>
        <p>
          {query
            ? `Boxes matching “${query}”.`
            : category
              ? `${category.intro} Minimum order quantity (MOQ) is 1,000 pcs.`
              : industry
                ? `Browse every existing category merged under ${industry.name}. Minimum order quantity (MOQ) is 1,000 pcs.`
                : 'Each box is named for the product it holds. The photo shows that product in the box. Minimum order quantity (MOQ) is 1,000 pcs.'}
        </p>
      </header>
      <div className="shop-layout">
        <div>
          <p className="result-count" aria-live="polite">
            {results.length} {results.length === 1 ? 'box' : 'boxes'}
          </p>
          {results.length ? (
            <>
              <div className="product-grid shop-grid">
                {visibleResults.map((product) => (
                  <ProductCard key={product.slug} product={product} unoptimizedImage />
                ))}
              </div>
              {hasMore ? (
                <div
                  ref={loadMoreRef}
                  className="catalog-load-more"
                  role="status"
                  aria-label="Loading more custom boxes"
                />
              ) : null}
            </>
          ) : (
            <div className="empty-state">
              <h2>No boxes match</h2>
              <p>Try the product name, or open all custom boxes.</p>
              <Link href="/custom-boxes" className="btn btn-dark">Show all boxes</Link>
            </div>
          )}
        </div>
      </div>
      {category?.faqs?.length ? (
        <section className="faq-section category-faqs">
          <h2>Questions about {category.name}</h2>
          <Accordion items={category.faqs} />
        </section>
      ) : null}
    </div>
  );
}
