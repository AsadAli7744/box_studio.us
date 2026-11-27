'use client';

import Link from 'next/link';
import CatalogImage from './CatalogImage';

export default function ProductCard({ product, unoptimizedImage = false }) {
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
              unoptimized={unoptimizedImage}
            />
          ) : null}
          <span className="product-card-hover-pill" aria-hidden="true">
            Explore Box &rarr;
          </span>
        </div>
        <div className="product-card-info">
          <h3>{product.name}</h3>
        </div>
      </Link>
    </article>
  );
}
