'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../components/ProductCard';
import { absoluteUrl } from '../data/site';
import { useCatalog } from '../context/CatalogContext';
import { usePageMeta } from '../hooks/usePageMeta';
import Accordion from '../components/Accordion';

export default function BoxesPage({ categorySlug }) {
  const params = useSearchParams();
  const { products, getCategory } = useCatalog();
  const query = (params.get('q') || '').trim();
  const needle = query.toLowerCase();
  const category = categorySlug ? getCategory(categorySlug) : null;
  const pool = category ? products.filter((item) => item.category === category.slug) : products;
  const results = needle
    ? pool.filter((item) => [item.name, item.categoryLabel].join(' ').toLowerCase().includes(needle))
    : pool;
  const path = category ? `/${category.slug}` : '/custom-boxes';
  const title = category ? category.name : 'Custom Boxes';

  usePageMeta({
    title: `${title} | Box Studio`,
    description: category ? category.intro : 'Custom boxes named for the product they hold. Open a box to see that product and request a quote.',
    path,
    image: absoluteUrl(category ? category.image : products[0].images[0].src),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      url: absoluteUrl(path),
      description: category ? category.intro : 'Custom boxes grouped by the product they pack.',
    },
  });

  return (
    <div className="catalog-page">
      <header className="page-intro">
        <p className="eyebrow">Shop by Industry</p>
        <h1>{title}</h1>
        <p>
          {query
            ? `Boxes matching “${query}”.`
            : category
              ? category.intro
              : 'Each box is named for the product it holds. The photo shows that product in the box.'}
        </p>
      </header>
      <div className="shop-layout">
        <div>
          <p className="result-count" aria-live="polite">
            {results.length} {results.length === 1 ? 'box' : 'boxes'}
          </p>
          {results.length ? (
            <div className="product-grid shop-grid">
              {results.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
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
