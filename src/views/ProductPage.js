'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Accordion from '../components/Accordion';
import { breadcrumbJson } from '../components/Breadcrumbs';
import RelatedSlider from '../components/RelatedSlider';
import { getFinish, getInsert, getMaterial } from '../data/catalog';
import { buildProductSeoGuide, getProductCommerceNotes } from '../data/productSeoGuide';
import { absoluteUrl } from '../data/site';
import { useCatalog } from '../context/CatalogContext';
import { useLoading } from '../context/LoadingContext';
import { useRequest } from '../context/RequestContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { selectionFromProduct, withPreservedContact } from '../utils/quoteDraft';
import NotFoundPage from './NotFoundPage';

const INFO_TABS = [
  { id: 'description', label: 'Description' },
  { id: 'specs', label: 'Product Specification' },
  { id: 'faqs', label: "FAQ's" },
];

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
          style={{ objectFit: 'cover', objectPosition: 'center center' }}
        />
      ))}
    </div>
  );
}

function labelList(ids = [], lookup) {
  return ids
    .map((id) => lookup(id)?.name || lookup(id)?.label || id)
    .filter(Boolean);
}

function ProductInfoPanel({ product, seoGuide }) {
  const [tab, setTab] = useState('description');
  const materialNames = labelList(product.materialIds, getMaterial);
  const finishNames = labelList(product.finishIds, getFinish);
  const insertNames = labelList(
    (product.insertIds || []).filter((id) => id && id !== 'none'),
    getInsert,
  );
  const uses = product.applications || [];
  const options = product.structuralOptions || [];
  const commerce = getProductCommerceNotes(product);
  const faqItems = seoGuide?.aeoFaqs?.length ? seoGuide.aeoFaqs : product.faqs || [];

  return (
    <section className="product-info-panel" aria-label={`${product.name} product information`}>
      <div className="product-info-tabs" role="tablist" aria-label="Product information tabs">
        {INFO_TABS.map((item) => {
          const selected = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`product-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`product-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              className={selected ? 'is-active' : undefined}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="product-info-frame">
        <div
          className="product-info-scroll"
          role="tabpanel"
          id={`product-panel-${tab}`}
          aria-labelledby={`product-tab-${tab}`}
          tabIndex={0}
        >
          {tab === 'description' && seoGuide ? (
            <div className="product-info-copy">
              {seoGuide.descriptionSections.map((section) => (
                <div key={section.heading} className="product-info-section">
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ))}
            </div>
          ) : null}

          {tab === 'specs' ? (
            <div className="product-info-copy">
              <div className="product-info-section">
                <h2>Product Specification</h2>
                <p>
                  Clear details for {product.name.toLowerCase()} so you know what you are ordering and what to send
                  with your quote.
                </p>
              </div>

              <dl className="product-spec-list">
                <div>
                  <dt>Product</dt>
                  <dd>{product.name}</dd>
                </div>
                <div>
                  <dt>Category</dt>
                  <dd>{product.categoryLabel || product.category}</dd>
                </div>
                {product.structureName ? (
                  <div>
                    <dt>Structure</dt>
                    <dd>{product.structureName}</dd>
                  </div>
                ) : null}
                {materialNames.length ? (
                  <div>
                    <dt>Materials</dt>
                    <dd>{materialNames.join(', ')}</dd>
                  </div>
                ) : null}
                {finishNames.length ? (
                  <div>
                    <dt>Finishes</dt>
                    <dd>{finishNames.join(', ')}</dd>
                  </div>
                ) : null}
                {insertNames.length ? (
                  <div>
                    <dt>Insert options</dt>
                    <dd>{insertNames.join(', ')}</dd>
                  </div>
                ) : null}
                {product.defaults ? (
                  <div>
                    <dt>Starter size</dt>
                    <dd>
                      {product.defaults.length} × {product.defaults.width} × {product.defaults.height}{' '}
                      {product.defaults.unit || 'mm'} (confirm against your closed product)
                    </dd>
                  </div>
                ) : null}
                {commerce?.moq ? (
                  <div>
                    <dt>Minimum order</dt>
                    <dd>{commerce.moq}</dd>
                  </div>
                ) : null}
                {commerce?.leadTime ? (
                  <div>
                    <dt>Lead time</dt>
                    <dd>{commerce.leadTime}</dd>
                  </div>
                ) : null}
                {commerce?.sampling ? (
                  <div>
                    <dt>Samples &amp; proofs</dt>
                    <dd>{commerce.sampling}</dd>
                  </div>
                ) : null}
              </dl>

              {product.structure ? (
                <div className="product-info-section">
                  <h3>How the structure works</h3>
                  <p>{product.structure}</p>
                </div>
              ) : null}

              {product.measurement ? (
                <div className="product-info-section">
                  <h3>How to measure</h3>
                  <p>{product.measurement}</p>
                </div>
              ) : null}

              {options.length ? (
                <div className="product-info-section">
                  <h3>Structural options</h3>
                  <ul>
                    {options.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {uses.length ? (
                <div className="product-info-section">
                  <h3>Best used for</h3>
                  <ul>
                    {uses.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          {tab === 'faqs' ? (
            <div className="product-info-copy">
              <div className="product-info-section">
                <h2>Frequently Asked Questions</h2>
                <p>Simple answers about {product.name.toLowerCase()}, ordering, and fit.</p>
              </div>
              <div className="product-info-faq">
                <Accordion items={faqItems} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const { getProduct, getCategory } = useCatalog();
  const product = getProduct(slug);
  const router = useRouter();
  const { startLoading } = useLoading();
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
  const seoGuide = product ? buildProductSeoGuide(product) : null;
  const faqEntities = product
    ? [...(seoGuide?.aeoFaqs || []), ...(product.faqs || [])]
        .filter((item, index, list) => list.findIndex((entry) => entry.q === item.q) === index)
        .map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        }))
    : [];

  usePageMeta({
    title: product ? `${product.name} | Custom Packaging | Box Studio` : 'Box not found | Box Studio',
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
              keywords: seoGuide?.searchPhrases?.slice(0, 12).join(', '),
            },
            {
              '@type': 'FAQPage',
              mainEntity: faqEntities,
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
    startLoading();
    router.push(`/quote?product=${product.slug}`);
  }

  return (
    <article className="product-page">
      <section className="product-hero">
        <div className="product-hero-copy">
          <h1>{product.name}</h1>
          <div>
            <p className="lede">{product.description}</p>
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

      {seoGuide ? <ProductInfoPanel key={product.slug} product={product} seoGuide={seoGuide} /> : null}

      <RelatedSlider items={related} />

      <div className="quote-dock">
        <button type="button" className="btn btn-gold" onClick={goToQuote}>
          Get a Quote for This Box
        </button>
      </div>
    </article>
  );
}
