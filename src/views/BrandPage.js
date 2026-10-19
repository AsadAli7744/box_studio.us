'use client';

import Link from 'next/link';
import { absoluteUrl } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';

export default function BrandPage() {
  usePageMeta({
    title: 'Custom Box For Your Brand | Box Studio',
    description: 'A custom box planned around your product and your brand. Choose a structure, then request a quote.',
    path: '/custom-box-for-your-brand',
    image: absoluteUrl('/images/hero-smooth.png'),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Custom Box For Your Brand',
      url: absoluteUrl('/custom-box-for-your-brand'),
      description: 'A custom box planned around your product and your brand.',
    },
  });

  return (
    <article className="catalog-page">
      <header className="page-intro">
        <p className="eyebrow">Your brand</p>
        <h1>Custom Box For Your Brand</h1>
        <p>
          The box starts from the product and the name on it. Pick a structure that fits what you sell, then send the size and the look you want with a quote.
        </p>
        <div className="hero-actions">
          <Link href="/custom-boxes" className="btn btn-dark">
            Explore Boxes
          </Link>
          <Link href="/quote" className="btn btn-ghost">
            Get a Quote
          </Link>
        </div>
      </header>
    </article>
  );
}
