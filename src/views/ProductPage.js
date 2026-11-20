'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Accordion from '../components/Accordion';
import { breadcrumbJson } from '../components/Breadcrumbs';
import RelatedSlider from '../components/RelatedSlider';
import { absoluteUrl } from '../data/site';
import { useCatalog } from '../context/CatalogContext';
import { useRequest } from '../context/RequestContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { selectionFromProduct, withPreservedContact } from '../utils/quoteDraft';
import NotFoundPage from './NotFoundPage';

function QuoteArrow() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M3 15 15 3M7 3h8v8" />
    </svg>
  );
}

function ProductFadeImages({ images, alt, interval = 2800 }) {
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const sources = useMemo(() => images.map((image) => image.src), [images]);

  useEffect(() => {
    setActive(0);
    setReady(false);
    let cancelled = false;
    Promise.all(
      sources.map(
        (src) =>
          new Promise((resolve) => {
            const image = new Image();
            image.onload = async () => {
              try {
                await image.decode();
              } catch {
                // Keep the loaded image when decode is unavailable.
              }
              resolve();
            };
            image.onerror = resolve;
            image.src = src;
          }),
      ),
    ).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [sources]);

  useEffect(() => {
    if (!ready || sources.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % sources.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [sources.length, interval, ready]);

  return (
    <div className="product-fade-images">
      {images.map((image, index) => (
        <img
          key={image.src}
          src={image.src}
          alt={index === 0 ? alt : ''}
          aria-hidden={index === 0 ? undefined : true}
          className={index === active ? 'is-active' : ''}
          loading={index === 0 ? 'eager' : 'lazy'}
          fetchPriority={index === 0 ? 'high' : 'auto'}
          decoding="async"
        />
      ))}
    </div>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const { getProduct, getCategory } = useCatalog();
  const product = getProduct(slug);
  const router = useRouter();
  const { updateQuote } = useRequest();
  const category = product ? getCategory(product.category) : null;
  const related = product?.related
    ? product.related
        .map((link) => ({ ...link, product: getProduct(link.slug) }))
        .filter((link) => link.product)
    : [];
  const crumbs = product
    ? [
        { label: 'Home', to: '/' },
        { label: 'Custom Boxes', to: '/custom-boxes' },
        { label: product.categoryLabel, to: `/${product.category}` },
        { label: product.name },
      ]
    : [];

  usePageMeta({
    title: product ? `${product.name} | Box Studio` : 'Box not found | Box Studio',
    description: product ? product.meta || product.short : 'This box is not available.',
    path: product ? `/${product.slug}` : '/custom-boxes',
    image: product ? absoluteUrl(product.images[0].src) : undefined,
    jsonLd: product
      ? {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Product',
              name: product.name,
              description: product.meta || product.description,
              image: product.images.map((image) => absoluteUrl(image.src)),
              brand: { '@type': 'Brand', name: 'Box Studio' },
              category: category?.name,
            },
            {
              '@type': 'FAQPage',
              mainEntity: product.faqs.map((item) => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: { '@type': 'Answer', text: item.a },
              })),
            },
            breadcrumbJson(crumbs),
          ],
        }
      : null,
  });

  if (!product) return <NotFoundPage />;

  const image = product.images[0];

  function carry(step) {
    updateQuote((current) =>
      withPreservedContact(current, {
        ...selectionFromProduct(product),
        step,
        length: current.productSlug === product.slug && current.length !== '' ? current.length : product.defaults.length,
        width: current.productSlug === product.slug && current.width !== '' ? current.width : product.defaults.width,
        height: current.productSlug === product.slug && current.height !== '' ? current.height : product.defaults.height,
        unit: current.productSlug === product.slug && current.unit ? current.unit : product.defaults.unit,
        materialId: current.productSlug === product.slug && current.materialId ? current.materialId : product.materialIds[0],
      })
    );
  }

  function goToQuote() {
    carry('specs');
    router.push(`/quote?product=${product.slug}`);
  }

  return (
    <article className="product-page">
      <section className="product-hero">
        <div className="product-hero-copy">
          <h1>{product.name}</h1>
          <div>
            <p>{product.description}</p>
            <button type="button" className="cta-heading product-text-link" onClick={goToQuote}>
              <span>Get a Quote for This Box</span>
              <QuoteArrow />
            </button>
          </div>
        </div>
      </section>

      <div className="product-hero-media">
        <ProductFadeImages images={product.images} alt={image.alt} />
      </div>

      <RelatedSlider items={related} />

      <section className="faq-section">
        <h2>Questions about this box</h2>
        <Accordion items={product.faqs} />
      </section>

      <div className="quote-dock">
        <button type="button" className="btn btn-gold" onClick={goToQuote}>
          Get a Quote for This Box
        </button>
      </div>
    </article>
  );
}
