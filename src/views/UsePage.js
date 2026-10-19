'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import Breadcrumbs, { breadcrumbJson } from '../components/Breadcrumbs';
import ProductCard from '../components/ProductCard';
import { productsForUse } from '../data/products';
import { absoluteUrl } from '../data/site';
import { getUse } from '../data/uses';
import { usePageMeta } from '../hooks/usePageMeta';
import NotFoundPage from './NotFoundPage';

export default function UsePage() {
  const { useSlug } = useParams();
  const use = getUse(useSlug);
  const matched = use ? productsForUse(use.tags) : [];
  const crumbs = use
    ? [
        { label: 'Home', to: '/' },
        { label: use.name },
      ]
    : [];

  usePageMeta({
    title: use ? `${use.name} | Box Studio` : 'Use not found | Box Studio',
    description: use ? use.description : 'This packaging use is not listed.',
    path: use ? `/uses/${use.slug}` : '/uses',
    image: matched[0] ? absoluteUrl(matched[0].images[0].src) : undefined,
    jsonLd: use
      ? {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'CollectionPage',
              name: use.name,
              description: use.description,
              url: absoluteUrl(`/uses/${use.slug}`),
            },
            {
              '@type': 'ItemList',
              name: use.name,
              itemListElement: matched.map((product, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: product.name,
                url: absoluteUrl(`/products/${product.slug}`),
              })),
            },
            breadcrumbJson(crumbs),
          ],
        }
      : null,
  });

  if (!use) return <NotFoundPage />;

  return (
    <article className="category-page use-page">
      <Breadcrumbs items={crumbs} />
      <header className="page-intro">
        <p className="eyebrow">Made for this product</p>
        <h1>{use.name}</h1>
        <p>{use.intro}</p>
      </header>
      <section>
        <h2>Boxes that fit this product</h2>
        <div className="product-grid">
          {matched.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
      <section className="inline-cta">
        <h2>Request a quote for {use.name.toLowerCase()}</h2>
        <Link href="/quote" className="btn btn-dark">
          Request a Quote
        </Link>
      </section>
    </article>
  );
}
