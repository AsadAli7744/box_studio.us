'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../components/ProductCard';
import { getIndustryGroup } from '../data/industries';
import { absoluteUrl } from '../data/site';
import { useCatalog } from '../context/CatalogContext';
import { usePageMeta } from '../hooks/usePageMeta';
import Accordion from '../components/Accordion';

const PRODUCT_BATCH_SIZE = 12;

export default function BoxesPage({ categorySlug }) {
  const params = useSearchParams();
  const loadMoreRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(PRODUCT_BATCH_SIZE);
  const { categories, products, getCategory } = useCatalog();
  const query = (params.get('q') || '').trim();
  const needle = query.toLowerCase();
  const industrySlug = (params.get('industry') || '').trim().toLowerCase();
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

  usePageMeta({
    title: `${title} | Box Studio`,
    description: category
      ? category.intro
      : industry
        ? `Explore custom ${industry.name.toLowerCase()} packaging from all related Box Studio categories.`
        : 'Custom boxes named for the product they hold. Open a box to see that product and request a quote.',
    path,
    image: absoluteUrl(category ? category.image : industry?.image || products[0]?.images?.[0]?.src || '/images/cat-all.jpg'),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      url: absoluteUrl(path),
      description: category
        ? category.intro
        : industry
          ? `Custom ${industry.name.toLowerCase()} packaging grouped from related categories.`
          : 'Custom boxes grouped by the product they pack.',
    },
  });

  return (
    <div className="catalog-page">
      <header className="page-intro">
        <p className="eyebrow">{category ? category.name : 'Shop By Industry'}</p>
        <h1>{title}</h1>
        <p>
          {query
            ? `Boxes matching “${query}”.`
            : category
              ? category.intro
              : industry
                ? `Browse every existing category merged under ${industry.name}.`
                : 'Each box is named for the product it holds. The photo shows that product in the box.'}
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
