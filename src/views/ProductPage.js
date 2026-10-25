'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Accordion from '../components/Accordion';
import Breadcrumbs, { breadcrumbJson } from '../components/Breadcrumbs';
import CatalogImage from '../components/CatalogImage';
import MeasurementFigure from '../components/MeasurementFigure';
import ProductCard from '../components/ProductCard';
import { getFinish, getInsert, getMaterial } from '../data/catalog';
import { absoluteUrl } from '../data/site';
import { useCatalog } from '../context/CatalogContext';
import { useRequest } from '../context/RequestContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { selectionFromProduct, withPreservedContact } from '../utils/quoteDraft';
import NotFoundPage from './NotFoundPage';

export default function ProductPage() {
  const { slug } = useParams();
  const { getProduct, getCategory } = useCatalog();
  const product = getProduct(slug);
  const [imageIndex, setImageIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setImageIndex(0);
  }, [slug]);
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

  const image = product.images[imageIndex] || product.images[0];

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

  return (
    <article className="product-page">
      <Breadcrumbs items={crumbs} />
      <div className="product-layout">
        <div className="gallery">
          <CatalogImage src={image.src} alt={image.alt} sizes="(max-width: 900px) 100vw, 50vw" priority />
          {product.images.length > 1 ? (
            <div className="thumbs" role="group" aria-label="Product images">
              {product.images.map((item, index) => (
                <button
                  key={item.src}
                  type="button"
                  aria-label={`Image ${index + 1} of ${product.images.length}`}
                  aria-pressed={index === imageIndex}
                  onClick={() => setImageIndex(index)}
                >
                  <CatalogImage src={item.src} alt="" width={160} height={160} sizes="72px" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="product-summary">
          <p className="eyebrow">{product.categoryLabel}</p>
          <h1>{product.name}</h1>
          <p className="structure-label">{product.structureName}</p>
          <p className="lede">{product.description}</p>
          <h2>Made for products like yours</h2>
          <ul>
            {product.applications.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => {
              carry('specs');
              router.push(`/quote?product=${product.slug}`);
            }}
          >
            Get a Quote for This Box
          </button>
        </div>
      </div>

      <section className="detail-grid">
        <div>
          <h2>Structure and closure</h2>
          <p>{product.structure}</p>
          <ul>
            {product.structuralOptions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Available materials</h2>
          <ul>
            {product.materialIds.map((id) => {
              const material = getMaterial(id);
              return <li key={id}>{material ? `${material.name}. ${material.summary}` : id}</li>;
            })}
          </ul>
        </div>
        <div>
          <h2>Compatible finishes</h2>
          {product.finishIds.length ? (
            <ul>
              {product.finishIds.map((id) => {
                const finish = getFinish(id);
                return <li key={id}>{finish ? `${finish.name}. ${finish.summary}` : id}</li>;
              })}
            </ul>
          ) : (
            <p>Decorative finishes are not part of this structure. Add a note if the box needs print.</p>
          )}
        </div>
        <div>
          <h2>Insert options</h2>
          <ul>
            {product.insertIds.map((id) => {
              const insert = getInsert(id);
              return <li key={id}>{insert ? `${insert.name}. ${insert.detail}` : id}</li>;
            })}
          </ul>
        </div>
      </section>

      {(product.sections || []).map((section) => (
        <section key={section.heading} className="product-copy">
          <h2>{section.heading}</h2>
          <p>{section.body}</p>
        </section>
      ))}

      <section className="measure-block">
        <div>
          <h2>How to measure</h2>
          <p>{product.measurement}</p>
        </div>
        <MeasurementFigure />
      </section>

      <section className="faq-section">
        <h2>Questions about this box</h2>
        <Accordion items={product.faqs} />
      </section>

      <section className="related-products" aria-labelledby="related-heading">
        <h2 id="related-heading">Boxes people compare with this one</h2>
        <p className="related-intro">Each photo is that box, not a second view of this one. Open it if the closure or the board is a closer fit.</p>
        <div className="product-grid related-grid">
          {related.map((link) => (
            <article key={link.slug} className="related-card">
              <ProductCard product={link.product} />
              <p className="related-note">{link.note}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="quote-dock">
        <button
          type="button"
          className="btn btn-gold"
          onClick={() => {
            carry('specs');
            router.push(`/quote?product=${product.slug}`);
          }}
        >
          Get a Quote for This Box
        </button>
      </div>
    </article>
  );
}
