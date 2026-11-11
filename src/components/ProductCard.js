'use client';

import Link from 'next/link';
import CatalogImage from './CatalogImage';

export default function ProductCard({ product }) {
  const image = product?.images?.[0];

  return (
    <article className="product-card">
      <Link href={`/${product.slug}`} className="product-card-link" title={`View ${product.name}`}>
        <div className="product-card-image-wrap">
          {image ? (
            <CatalogImage
              src={image.src}
              alt={image.alt || product.name}
              className="product-card-img"
              sizes="(max-width: 580px) 50vw, (max-width: 1100px) 33vw, 20vw"
            />
          ) : null}
          <span className="product-card-hover-pill" aria-hidden="true">
            Explore Box &rarr;
          </span>
        </div>
        <div className="product-card-info">
          <h2>{product.name}</h2>
        </div>
      </Link>
    </article>
  );
}
