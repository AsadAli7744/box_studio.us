'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useCatalog } from '../context/CatalogContext';
import { getHighlightCards } from '../data/highlights';
import { buildIndustryGroups } from '../data/industries';
import { absoluteUrl, site } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import styles from './HcpHomePage.module.css';

const highlightItems = getHighlightCards({ limit: 4 });

const heroImages = [
  '/images/hcp-home/hero-fantasy-eyes.webp',
  '/images/hcp-home/hero-solar-capsule.webp',
  '/images/hcp-home/hero-velora.webp',
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

  useEffect(() => {
    if (images.length < 2) return undefined;
    // Warm later frames in the background without blocking first paint.
    images.slice(1).forEach((src) => {
      const image = new Image();
      image.src = src;
    });
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % images.length);
    }, interval);
    return () => window.clearInterval(timer);
    // images is a stable constant array from the section that mounts this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length, interval]);

  return (
    <div className={`${styles.fadeImages} ${className}`.trim()}>
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={index === 0 ? alt : ''}
          aria-hidden={index === 0 ? undefined : true}
          className={index === active ? styles.isActive : ''}
          loading={eager && index === 0 ? 'eager' : 'lazy'}
          fetchPriority={eager && index === 0 ? 'high' : 'low'}
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

  useEffect(() => {
    heroImages.slice(1).forEach((src) => {
      const image = new Image();
      image.src = src;
    });
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % heroImages.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, []);

  const imageLayers = (className) =>
    heroImages.map((src, index) => (
      <img
        key={`${className}-${src}`}
        src={src}
        alt={index === 0 ? 'A curated collection of luxury cosmetic packaging.' : ''}
        aria-hidden={index === 0 ? undefined : true}
        className={index === active ? styles.isActive : ''}
        loading={index === 0 ? 'eager' : 'lazy'}
        fetchPriority={index === 0 ? 'high' : 'low'}
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

function LatestUpdates({ industries }) {
  return (
    <section className={`${styles.section} ${styles.beige} ${styles.industrySection}`}>
      <div className={`${styles.sectionInner} ${styles.copyGrid} ${styles.industryIntro}`}>
        <h2>Shop By Industry</h2>
        <div>
          <p>
            Explore custom packaging by industry and choose the format that fits your product, brand and
            shelf goals. From cosmetics and skincare to fragrance, healthcare and food, each collection
            brings together structures, finishes and presentation options ready for production.
          </p>
          <TextLink href="/industries">View More...</TextLink>
        </div>
      </div>
      <div className={styles.sectionInner}>
        <div className={styles.industryDesktop}>
          <div className={styles.updates}>
            {industries.map((item, index) => (
              <article key={item.slug} className={styles.updateCard}>
                <Link href={item.href}>
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    decoding="async"
                  />
                  <h3>{item.title}</h3>
                </Link>
              </article>
            ))}
          </div>
        </div>
        <div className={styles.industryMobile}>
          <p>
            Cosmetics, Skincare, Make-up, Haircare, Fragrance, Pharma &amp; Healthcare, and Food.{' '}
            <Link href="/industries" className={styles.industryInlineLink}>View all industries</Link>
          </p>
          <Link href="/industries" aria-label="View all packaging industries">
            <img
              src="/images/Premium products in six elegant arches.png"
              alt="Cosmetics, skincare, makeup, fragrance, healthcare, and food products displayed in arches."
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Discover() {
  return (
    <>
      <section className={`${styles.section} ${styles.beige} ${styles.discoverSection}`}>
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
            <TextLink href="/about">Find out more</TextLink>
          </div>
        </div>
      </section>
      <div className={styles.beigeToWhite}>
        <FadeImages
          images={[
            '/images/what we do/Brow Obsession premium carton flatlay-4.webp',
            '/images/what we do/Aqua Skincare Carton Quartet-1.webp',
            '/images/what we do/Honey-Gold Art Deco Cosmetic Packaging-3.webp',
          ]}
          alt="A collection of premium custom cosmetic and skincare packaging."
          className={styles.featureImage}
          interval={2800}
        />
      </div>
    </>
  );
}

function LatestHighlights() {
  return (
    <section className={`${styles.section} ${styles.beige} ${styles.highlightsSection}`}>
      <div className={styles.highlightsInner}>
        <h2>Latest updates &amp; Highlights</h2>
        <div className={styles.updates}>
          {highlightItems.map((item) => {
            const media = (
              <>
                <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
                <h3>{item.title}</h3>
              </>
            );
            return (
              <article key={item.slug} className={styles.updateCard}>
                {item.href ? <Link href={item.href}>{media}</Link> : <div>{media}</div>}
              </article>
            );
          })}
        </div>
        <TextLink href="/updates">Read more</TextLink>
      </div>
    </section>
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

function DeferredBelowFold({ children }) {
  const [show, setShow] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const node = sentinelRef.current;
    const reveal = () => {
      if (!cancelled) setShow(true);
    };

    if (!node || typeof window.IntersectionObserver !== 'function') {
      const timeoutId = window.setTimeout(reveal, 1200);
      return () => {
        cancelled = true;
        window.clearTimeout(timeoutId);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          reveal();
          observer.disconnect();
        }
      },
      { rootMargin: '280px 0px' },
    );
    observer.observe(node);

    // Fallback if the user never scrolls far enough for the sentinel.
    const timeoutId = window.setTimeout(reveal, 2500);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className={styles.belowFoldSentinel} />
      {show ? children : null}
    </>
  );
}

export default function HcpHomePage() {
  const { categories } = useCatalog();
  const industries = buildIndustryGroups(categories);

  usePageMeta({
    title: 'Custom Packaging Solutions | Printed Packaging | Box Studio',
    description:
      'Custom packaging solutions for cosmetics, skincare, fragrance, food, healthcare and retail. Printed packaging designed around your product, then quoted for production in the United States.',
    path: '/',
    image: absoluteUrl(heroImages[0]),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: site.name,
      url: site.url,
      description: site.summary || site.description,
    },
  });

  return (
    <div className={styles.home}>
      <Hero />
      <LatestUpdates industries={industries} />
      <DeferredBelowFold>
        <Discover />
        <EditorialSection
          title="A beautiful future"
          paragraphs={[
            'Better packaging begins with considered choices: the right structure, the right amount of material and finishes selected for a clear purpose.',
            'We help brands compare paperboard, kraft and recyclable options while keeping protection, print quality and shelf presence in view.',
          ]}
          images={[
            '/images/beautiful future/mmckewtrojgeinzxiw4j.webp',
            '/images/beautiful future/Drift beauty cartons on ivory stone-6.webp',
            '/images/beautiful future/ioxxesfonf8hzb05og3z.webp',
          ]}
          alt="A refined collection of modern beauty packaging."
          href="/beautiful-future"
          linkLabel="Find out more"
        />
        <EditorialSection
          title="Be inspired by packaging trends"
          paragraphs={[
            'A distinctive finish, proportion or opening detail can turn a familiar packaging box into something memorable.',
            'Use current colour, material and decoration ideas as a starting point, then make the final packaging recognisably yours.',
          ]}
          images={[
            '/images/trends/Paradiso Botanical Folding Carton Collection-3.webp',
            '/images/trends/Caresse rose-peach embossed carton collection-4.webp',
            '/images/trends/Pastel Creams Folding Carton Showcase-5.webp',
            '/images/trends/Turquoise luxury folding carton showcase-2.webp',
            '/images/trends/Dreamy starlight skincare carton collection-1.webp',
          ]}
          alt="A collection of contemporary packaging box trends."
          href="/trends"
          linkLabel="Explore all boxes"
        />
        {/* <LatestHighlights /> */}
      </DeferredBelowFold>
    </div>
  );
}
