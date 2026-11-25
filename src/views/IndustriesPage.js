'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCatalog } from '../context/CatalogContext';
import { buildIndustryGroups } from '../data/industries';
import { absoluteUrl } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import styles from './IndustriesPage.module.css';

const closingImages = [
  '/images/industries/closing/reale-minis-gift-set.jpg',
  '/images/industries/closing/collagen-beauty-gift-set.jpg',
  '/images/industries/closing/pastel-creams-folding-cartons.jpg',
];

function Arrow() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M3 15 15 3M7 3h8v8" />
    </svg>
  );
}

function TextLink({ href, children }) {
  return (
    <Link href={href} className={styles.textLink}>
      <span>{children}</span>
      <Arrow />
    </Link>
  );
}

function FadeImages({ images, alt }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % images.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, [images.length]);

  return (
    <div className={styles.featureImage}>
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={index === 0 ? alt : ''}
          aria-hidden={index === 0 ? undefined : true}
          className={index === active ? styles.isActive : ''}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
        />
      ))}
    </div>
  );
}

export default function IndustriesPage() {
  const { categories } = useCatalog();
  const industries = buildIndustryGroups(categories);

  usePageMeta({
    title: 'Shop By Industry | Custom Packaging | Box Studio',
    description:
      'Shop custom packaging by industry for cosmetics, skincare, makeup, fragrance, healthcare and food. Choose a category and request a production quote.',
    path: '/industries',
    image: absoluteUrl('/images/Premium products in six elegant arches.png'),
  });

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="industries-hero-heading">
        <div className={styles.heroCopy}>
          <p>Box Studio</p>
          <h1 id="industries-hero-heading">Shop By Industry</h1>
          <p>
            Packaging shaped around the product it holds. Browse by industry, then open the formats
            that fit your brand and production needs.
          </p>
          <TextLink href="/quote">Start a project</TextLink>
        </div>
        <div className={styles.heroMedia}>
          <img
            src="/images/Premium products in six elegant arches.png"
            alt="Custom packaging across cosmetics, skincare, fragrance, healthcare and food."
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </section>

      <section className={`${styles.section} ${styles.beige}`}>
        <div className={`${styles.sectionInner} ${styles.intro}`}>
          <h2>Choose your industry</h2>
          <div>
            <p>
              Explore custom packaging by industry and choose the format that fits your product, brand and
              shelf goals. From cosmetics and skincare to fragrance, healthcare and food, each collection
              brings together structures, finishes and presentation options ready for production.
            </p>
          </div>
        </div>
        <div className={styles.sectionInner}>
          <div className={styles.grid}>
            {industries.map((industry) => (
              <article key={industry.slug} className={styles.card}>
                <Link href={industry.href}>
                  <img src={industry.image} alt={industry.alt} loading="lazy" decoding="async" />
                  <h3>{industry.title}</h3>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.white}`}>
        <div className={styles.closing}>
          <h2>From idea to finished packaging</h2>
          <div>
            <p>
              Once you choose an industry path, refine the structure, materials and finishing details.
              Box Studio helps turn that brief into packaging ready for print and production.
            </p>
            <TextLink href="/quote">Get a Quote for This Box</TextLink>
          </div>
        </div>
      </section>
      <div className={styles.featureWrap}>
        <FadeImages
          images={closingImages}
          alt="Custom gift-set and folding carton packaging for beauty and skincare brands."
        />
      </div>
    </div>
  );
}
