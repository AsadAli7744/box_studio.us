'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import CatalogImage from './CatalogImage';

export default function RelatedSlider({ items }) {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  function updateScrollState() {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);
  }

  useEffect(() => {
    updateScrollState();
    const el = trackRef.current;
    if (!el) return undefined;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [items]);

  function scroll(direction) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('.related-slider-card');
    const scrollAmount = (card ? card.offsetWidth + 24 : 340) * direction;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  if (!items || !items.length) return null;

  return (
    <section className="related-products" aria-labelledby="related-heading">
      <div className="related-head">
        <div className="related-head-copy">
          <span className="related-eyebrow">Related Products</span>
          <h2 id="related-heading">Products You May Be Looking For</h2>
          <p className="related-intro">
            Explore matching packaging styles, alternative structures, or complementary boxes for your product range.
          </p>
        </div>
        {items.length > 1 ? (
          <div className="related-controls" aria-label="Slider controls">
            <button
              type="button"
              className="related-nav-btn"
              onClick={() => scroll(-1)}
              disabled={!canScrollLeft}
              aria-label="Previous products"
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 13 L5 8 L10 3" />
              </svg>
            </button>
            <button
              type="button"
              className="related-nav-btn"
              onClick={() => scroll(1)}
              disabled={!canScrollRight}
              aria-label="Next products"
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 3 L11 8 L6 13" />
              </svg>
            </button>
          </div>
        ) : null}
      </div>

      <div className="related-slider-track" ref={trackRef}>
        {items.map((link) => {
          const product = link.product;
          const image = product.images?.[0];
          const noteText = link.note || product.short || 'Custom dimensions and finishing available.';
          return (
            <Link
              key={link.slug}
              href={`/${product.slug}`}
              className="related-slider-card"
            >
              <div className="related-card-media">
                {product.categoryLabel ? (
                  <span className="related-card-badge">{product.categoryLabel}</span>
                ) : null}
                {image ? (
                  <CatalogImage
                    src={image.src}
                    alt={image.alt || product.name}
                    sizes="(max-width: 768px) 85vw, 340px"
                  />
                ) : null}
              </div>
              <div className="related-card-body">
                <h3>{product.name}</h3>
                <p className="related-card-note">{noteText}</p>
                <div className="related-card-footer">
                  <span>{product.structureName || 'Custom Box'}</span>
                  <span className="related-card-action">
                    View Box
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 8 H13 M9 4 L13 8 L9 12" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
