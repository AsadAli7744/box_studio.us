import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getShopCategory, offerings, shopCategories } from '../data/offerings';
import { absoluteUrl } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';

export default function BoxesPage({ categorySlug }) {
  const category = categorySlug ? getShopCategory(categorySlug) : null;
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const pool = category ? offerings.filter((item) => item.category === category.slug) : offerings;

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return pool;
    return pool.filter((item) => [item.name, item.short, item.categoryLabel].join(' ').toLowerCase().includes(needle));
  }, [pool, query]);

  const path = category ? `/${category.slug}` : '/custom-boxes';
  const title = category ? category.name : 'Custom Boxes';

  usePageMeta({
    title: `${title} | Box Studio`,
    description: category ? category.intro : 'Custom boxes named for the product they hold. Open a box to see that product and request a quote.',
    path: query ? `${path}?q=${encodeURIComponent(query)}` : path,
    image: absoluteUrl(category ? category.image : offerings[0].images[0].src),
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
        <p>{category ? category.intro : 'Each box is named for the product it holds. The photo shows that product in the box.'}</p>
      </header>
      <div className="shop-layout">
        <aside className="shop-filters" aria-label="Category">
          <h2>Category</h2>
          <Link to="/custom-boxes" aria-current={category ? undefined : 'page'}>
            All Custom Boxes ({offerings.length})
          </Link>
          {shopCategories.map((item) => {
            const count = offerings.filter((offering) => offering.category === item.slug).length;
            return (
              <Link key={item.slug} to={`/${item.slug}`} aria-current={category?.slug === item.slug ? 'page' : undefined}>
                {item.name} ({count})
              </Link>
            );
          })}
          <label className="search-field">
            <span>Search</span>
            <input
              type="search"
              value={query}
              placeholder="Eyeliner, mailer, tea"
              onChange={(event) => {
                const next = new URLSearchParams(params);
                if (event.target.value) next.set('q', event.target.value);
                else next.delete('q');
                setParams(next);
              }}
            />
          </label>
        </aside>
        <div>
          <p className="result-count" aria-live="polite">
            {results.length} of {pool.length} boxes
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
              <Link to="/custom-boxes" className="btn btn-dark">Show all boxes</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
