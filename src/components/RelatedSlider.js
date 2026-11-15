import Link from 'next/link';
import CatalogImage from './CatalogImage';

export default function RelatedSlider({ items }) {
  if (!items || !items.length) return null;

  return (
    <section className="related-products" aria-labelledby="related-heading">
      <div className="related-head">
        <h2 id="related-heading">Products You May Be Looking For</h2>
      </div>

      <div className="related-slider-track">
        {items.map((link) => {
          const product = link.product;
          const image = product.images?.[0];
          return (
            <Link
              key={link.slug}
              href={`/${product.slug}`}
              className="related-slider-card"
            >
              <div className="related-card-media">
                {image ? (
                  <CatalogImage
                    src={image.src}
                    alt={image.alt || product.name}
                    sizes="(max-width: 680px) calc(100vw - 2.7rem), (max-width: 1024px) 46vw, 23vw"
                  />
                ) : null}
              </div>
              <div className="related-card-body">
                <h3>{product.name}</h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
