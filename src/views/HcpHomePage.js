'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCatalog } from '../context/CatalogContext';
import { absoluteUrl, site } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import styles from './HcpHomePage.module.css';

const heroImages = [
  '/images/hcp-home/hero-solar.jpg',
  '/images/hcp-home/hero-industrial.jpg',
  '/images/hcp-home/hero-fantasy.jpg',
  '/images/hcp-home/hero-carousel.jpg',
  '/images/hcp-home/hero-uno.jpg',
];

function Arrow() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M3 15 15 3M7 3h8v8" />
    </svg>
  );
}

function FadeImages({ images, alt, interval = 4800, eager = false, className = '' }) {
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      images.map(
        (src) =>
          new Promise((resolve) => {
            const image = new Image();
            image.onload = async () => {
              try {
                await image.decode();
              } catch {
                // The decoded file is still usable when decode is unsupported.
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
  }, [images]);

  useEffect(() => {
    if (!ready || images.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % images.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [images.length, interval, ready]);

  return (
    <div className={`${styles.fadeImages} ${className}`.trim()}>
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={index === 0 ? alt : ''}
          aria-hidden={index === 0 ? undefined : true}
          className={index === active ? styles.isActive : ''}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          decoding="async"
        />
      ))}
    </div>
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

function Hero() {
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      heroImages.map(
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
  }, []);

  useEffect(() => {
    if (!ready) return undefined;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % heroImages.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [ready]);

  const imageLayers = (className) =>
    heroImages.map((src, index) => (
      <img
        key={`${className}-${src}`}
        src={src}
        alt={index === 0 ? 'A curated collection of luxury cosmetic packaging.' : ''}
        aria-hidden={index === 0 ? undefined : true}
        className={index === active ? styles.isActive : ''}
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
    ));

  return (
    <section className={styles.hero} aria-labelledby="hcp-home-heading">
      <div className={styles.heroLarge}>{imageLayers('large')}</div>
      <div className={styles.heroRight}>
        <div className={styles.heroIntro}>
          <div className={styles.heroPreview}>{imageLayers('preview')}</div>
          <p className={styles.heroKicker}>Welcome to Box Studio</p>
          <div className={styles.heroTitleWrap}>
            <h1 id="hcp-home-heading">
              Innovative.
              <br />
              Creative.
              <br />
              Dependable.
            </h1>
          </div>
        </div>
        <div className={styles.heroCopy}>
          <p>
            Custom printed packaging designed around cosmetics, skincare, fragrance, food, healthcare,
            gifts and retail products.
          </p>
          <p>
            From structure and artwork to print and finishing, Box Studio helps brands create packaging
            that fits the product and stands out on the shelf.
          </p>
          <TextLink href="/quote">Get in touch</TextLink>
        </div>
      </div>
    </section>
  );
}

function LatestUpdates({ categories }) {
  return (
    <section className={`${styles.section} ${styles.beige}`}>
      <div className={styles.sectionInner}>
        <h2>Packaging categories</h2>
        <div className={styles.updates}>
          {categories.map((item) => (
            <article key={item.slug} className={styles.updateCard}>
              <Link href={`/${item.slug}`}>
                <img src={item.image} alt={item.alt} loading="lazy" />
                <h3>{item.name}</h3>
              </Link>
            </article>
          ))}
        </div>
        <TextLink href="/custom-boxes">View all boxes</TextLink>
      </div>
    </section>
  );
}

function Discover() {
  return (
    <>
      <section className={`${styles.section} ${styles.beige}`}>
        <div className={`${styles.sectionInner} ${styles.copyGrid}`}>
          <h2>Discover what we do</h2>
          <div>
            <p>
              With a focus on thoughtful structure, strong print and careful finishing, Box Studio gives
              brands a direct path from an idea to packaging ready for production.
            </p>
            <p>
              Our range includes folding cartons, window boxes, kraft packaging, sleeves, trays, gift
              boxes and presentation formats for products of many shapes and sizes.
            </p>
            <TextLink href="/custom-boxes">Find out more</TextLink>
          </div>
        </div>
      </section>
      <div className={styles.beigeToWhite}>
        <FadeImages
          images={['/images/hcp-home/discover-fusion.jpg', '/images/hcp-home/discover-brow.jpg']}
          alt="A diagonal arrangement of cosmetic bottles and tubes."
          className={styles.featureImage}
        />
      </div>
    </>
  );
}

function EditorialSection({ title, paragraphs, images, alt, href, linkLabel }) {
  return (
    <>
      <section className={`${styles.section} ${styles.white}`}>
        <div className={`${styles.sectionInner} ${styles.copyGrid}`}>
          <h2>{title}</h2>
          <div>
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <TextLink href={href}>{linkLabel}</TextLink>
          </div>
        </div>
      </section>
      <div className={styles.white}>
        <FadeImages images={images} alt={alt} className={styles.featureImage} />
      </div>
    </>
  );
}

function Newsletter() {
  return (
    <section className={styles.newsletter}>
      <div className={styles.newsletterInner}>
        <div>
          <p className={styles.newsletterLabel}>Box Studio updates</p>
          <h2>Keep up to date</h2>
        </div>
        <div>
          <p>
            Explore new packaging ideas, finishes, materials and product launches from the Box Studio
            catalog.
          </p>
          <TextLink href="/quote">Start a project</TextLink>
        </div>
      </div>
    </section>
  );
}

export default function HcpHomePage() {
  const { categories } = useCatalog();

  usePageMeta({
    title: 'Custom Cosmetic, Skincare & Product Packaging | Box Studio',
    description:
      'Creative custom printed packaging for cosmetics, skincare, fragrance, food, healthcare, gifts and retail products.',
    path: '/',
    image: absoluteUrl(heroImages[0]),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: site.name,
      url: site.url,
      description: site.description,
    },
  });

  return (
    <div className={styles.home}>
      <Hero />
      <LatestUpdates categories={categories} />
      <Discover />
      <EditorialSection
        title="A beautiful future"
        paragraphs={[
          'Better packaging begins with considered choices: the right structure, the right amount of material and finishes selected for a clear purpose.',
          'We help brands compare paperboard, kraft and recyclable options while keeping protection, print quality and shelf presence in view.',
        ]}
        images={['/images/hcp-home/future-main.jpg', '/images/hcp-home/future-alt.jpg']}
        alt="A clean arrangement of pastel cosmetic packaging."
        href="/quote"
        linkLabel="Find out more"
      />
      <EditorialSection
        title="Be inspired by packaging trends"
        paragraphs={[
          'A distinctive finish, proportion or opening detail can turn a familiar carton into something memorable.',
          'Use current colour, material and decoration ideas as a starting point, then make the final packaging recognisably yours.',
        ]}
        images={['/images/hcp-home/trends-main.jpg', '/images/hcp-home/trends-alt.jpg']}
        alt="A styled collection of contemporary lipstick packaging."
        href="/custom-boxes"
        linkLabel="Explore all boxes"
      />
    </div>
  );
}
