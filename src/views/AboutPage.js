'use client';

import Link from 'next/link';
import { absoluteUrl } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import styles from './AboutPage.module.css';

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

const stats = [
  { value: 'CUSTOM', label: 'Packaging formats' },
  { value: 'MULTI', label: 'Industry collections' },
  { value: 'US', label: 'Production focus' },
  { value: 'QUOTE', label: 'Ready project flow' },
];

export default function AboutPage() {
  usePageMeta({
    title: 'About Box Studio | Custom Packaging',
    description:
      'Box Studio designs and manufactures custom printed packaging for cosmetics, skincare, fragrance, healthcare, food and retail brands.',
    path: '/about',
    image: absoluteUrl('/images/about/beauty-collection.webp'),
  });

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="about-heading">
        <div className={styles.heroCopy}>
          <div className={styles.heroBackdrop} aria-hidden="true">
            <img src="/images/about/beauty-collection.webp" alt="" loading="eager" decoding="async" />
          </div>
          <div className={styles.heroCard}>
            <h1 id="about-heading">About Box Studio</h1>
            <h2>
              Box Studio is a packaging partner for the design, development and
              manufacture of custom printed boxes
            </h2>
            <p>
              From first concept through production, Box Studio works with beauty,
              skincare, fragrance, healthcare, food and retail brands to design and
              supply packaging shaped around the product it holds. We focus on clear
              structures, print-ready finishes and a quote-led path from sample brief
              to finished run.
            </p>
            <p>
              Folding cartons, rigid boxes, kraft formats, sleeves, trays, gift sets
              and related print finishing are developed around your dimensions,
              materials and brand presentation — then confirmed for production in the
              United States.
            </p>
          </div>
        </div>
        <div className={styles.heroMedia}>
          <img
            src="/images/about/beauty-collection.webp"
            alt="Custom Box Studio beauty packaging collection."
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </section>

      <section className={styles.stats} aria-label="Box Studio at a glance">
        {stats.map((item) => (
          <div key={item.label} className={styles.stat}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <div className={styles.featuresWrap}>
        <section className={styles.feature}>
          <div className={styles.featureCopy}>
            <h2>End-to-end support for your brand</h2>
            <p>
              With a clear focus on structure, materials and finishing detail, Box
              Studio supports brands from early packaging direction through artwork
              guidance and production quoting — so teams get direct feedback and a
              practical path to finished packaging.
            </p>
            <TextLink href="/industries">Discover packaging by industry</TextLink>
          </div>
          <div className={styles.featureMedia}>
            <img
              src="/images/about/brow-products.webp"
              alt="Custom brow product packaging from Box Studio."
              loading="lazy"
              decoding="async"
            />
          </div>
        </section>

        <section className={styles.feature}>
          <div className={styles.featureCopy}>
            <h2>Where does Box Studio manufacture packaging?</h2>
            <p>
              Box Studio’s production focus is built for reliable custom packaging
              in the United States — efficient runs, competitive lead times and
              packaging sized to your product, brand and shelf goals.
            </p>
            <TextLink href="/quote">Find out more</TextLink>
          </div>
          <div className={styles.featureMedia}>
            <img
              src="/images/about/tottles-bottles.webp"
              alt="Custom bottle and tottle packaging formats from Box Studio."
              loading="lazy"
              decoding="async"
            />
          </div>
        </section>

        <section className={styles.feature}>
          <div className={styles.featureCopy}>
            <h2>Production-ready packaging capabilities</h2>
            <p>
              The Box Studio portfolio includes folding cartons, rigid boxes, kraft
              packaging, sleeves and trays, gift formats and related print finishes.
              Brands choose a structure, confirm dimensions and materials, then
              request a quote for production.
            </p>
            <TextLink href="/custom-boxes">Browse custom boxes</TextLink>
          </div>
          <div className={styles.featureMedia}>
            <img
              src="/images/about/compacts-palettes-kits.webp"
              alt="Custom compact, palette and kit packaging from Box Studio."
              loading="lazy"
              decoding="async"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
