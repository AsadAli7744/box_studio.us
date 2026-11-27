'use client';

import Link from 'next/link';
import { absoluteUrl, configuredContact, site } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import styles from './AboutPage.module.css';

const contact = configuredContact();

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
  { value: 'QUOTE', label: 'Project-led quoting' },
  { value: '1,000', label: 'pcs MOQ' },
];

export default function AboutPage() {
  usePageMeta({
    title: 'About Box Studio | Custom Packaging',
    description:
      'Box Studio designs and manufactures custom printed packaging for cosmetics, skincare, fragrance, healthcare, food and retail brands. Production is based in Karachi, with service for United States brands.',
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
              materials and brand presentation — then quoted for manufacture and
              shipping to your delivery address.
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

      <section className={styles.proof} aria-labelledby="about-contact-heading">
        <div className={styles.proofInner}>
          <h2 id="about-contact-heading">Company details &amp; contact</h2>
          <p>
            Box Studio ({site.name}) is a custom packaging company serving brands in the{' '}
            {site.areaServed}. Manufacturing and production operations are based in{' '}
            <strong>{site.productionLocation}</strong>
            {site.usPresence ? (
              <>
                , with a United States market presence in <strong>{site.usPresence}</strong>
              </>
            ) : null}
            . Country-of-origin details for each order are confirmed on production documents and
            shipping paperwork.
          </p>
          <dl className={styles.proofList}>
            {contact.address ? (
              <div>
                <dt>Primary location</dt>
                <dd>{site.productionLocation}</dd>
              </div>
            ) : null}
            {site.usPresence ? (
              <div>
                <dt>US presence</dt>
                <dd>{site.usPresence}</dd>
              </div>
            ) : null}
            {contact.email ? (
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </dd>
              </div>
            ) : null}
            {contact.phone ? (
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}>{contact.phone}</a>
                </dd>
              </div>
            ) : null}
          </dl>
          <p>
            Follow Box Studio on{' '}
            <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            ,{' '}
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            , and{' '}
            <a href={site.social.facebook} target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            .
          </p>
        </div>
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
            <h2>Where is packaging produced and shipped?</h2>
            <p>
              Custom packaging is manufactured in {site.productionLocation}. Finished
              orders are packed and shipped to the delivery address confirmed on your
              quote. Lead times, freight method, and country-of-origin marking are
              confirmed before production starts — including any sample or proof step
              you request.
            </p>
            <TextLink href="/quote">Request a packaging quote</TextLink>
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
              request a quote for production. Minimum order quantity is 1,000 pcs.
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
