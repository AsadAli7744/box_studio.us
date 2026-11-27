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

function Hero({ hero }) {
  const [active, setActive] = useState(0);
  const slides = (hero?.slides && hero.slides.length > 0) ? hero.slides.map((s) => s.src) : heroImages;

  useEffect(() => {
    slides.slice(1).forEach((src) => {
      const image = new Image();
      image.src = src;
    });
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [slides]);

  const imageLayers = (className) =>
    slides.map((src, index) => (
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

  const kicker = hero?.kicker || 'CUSTOM PRINTED PACKAGING BOXES FOR BRANDS';
  const headingLines = (hero?.heading || 'Custom\nPackaging\nBoxes').split('\n');
  const copyParagraphs = hero?.copy
    ? hero.copy.split('\n\n').filter(Boolean)
    : [
        'Custom printed packaging boxes designed around cosmetics, skincare, fragrance, food, healthcare, gifts and retail products.',
        'From structure and artwork to print and finishing, Box Studio helps brands create packaging that fits the product and stands out on the shelf.',
      ];

  return (
    <section className={styles.hero} aria-labelledby="hcp-home-heading">
      <div className={styles.heroLarge}>{imageLayers('large')}</div>
      <div className={styles.heroRight}>
        <div className={styles.heroIntro}>
          <div className={styles.heroPreview}>{imageLayers('preview')}</div>
          <p className={styles.heroKicker}>{kicker}</p>
          <div className={styles.heroTitleWrap}>
            <h1 id="hcp-home-heading">
              {headingLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < headingLines.length - 1 && <br />}
                </span>
              ))}
            </h1>
          </div>
        </div>
        <div className={styles.heroCopy}>
          {copyParagraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <TextLink href={hero?.primaryHref || '/quote'}>{hero?.primaryLabel || 'Get in touch'}</TextLink>
        </div>
      </div>
    </section>
  );
}

function LatestUpdates({ industries, config }) {
  const heading = config?.heading || 'Custom Packaging Boxes by Industry';
  const lead = config?.lead || 'Find custom printed packaging boxes for cosmetics, skincare, hair care, fragrance, healthcare, and food products. Explore folding cartons for lipsticks, serum bottles, cream jars, perfumes, and more. Choose a box style, size, and finish that fits your product and showcases your brand on the shelf.';
  const linkText = config?.linkText || 'Shop By Industry...';
  const linkHref = config?.linkHref || '/industries';
  const bannerHeadline = config?.bannerHeadline || 'Cosmetics, Skincare, Make-up, Haircare, Fragrance, Pharma & Healthcare, and Food.';
  const bannerLinkText = config?.bannerLinkText || 'View all industries';
  const bannerLinkHref = config?.bannerLinkHref || '/industries';

  return (
    <section className={`${styles.section} ${styles.beige} ${styles.industrySection}`}>
      <div className={`${styles.sectionInner} ${styles.copyGrid} ${styles.industryIntro}`}>
        <h2>{heading}</h2>
        <div>
          <p>{lead}</p>
          <TextLink href={linkHref}>{linkText}</TextLink>
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
            {bannerHeadline}{' '}
            <Link href={bannerLinkHref} className={styles.industryInlineLink}>{bannerLinkText}</Link>
          </p>
          <Link href={bannerLinkHref} aria-label="View all packaging industries">
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

function Discover({ config }) {
  const heading = config?.heading || 'Discover what we do';
  const lead = config?.lead || 'Box Studio creates custom printed boxes for cosmetics, skincare, fragrance, food, and other retail products. We help you choose the right box style, size, and finish, then turn your idea into packaging ready for production.';
  const cardTitle = config?.cardTitle || 'Explore folding cartons, window boxes, kraft boxes, packaging sleeves, trays, and gift boxes. Add details like gold or silver foil stamping and embossing to make your packaging stand out on the shelf.';
  const cardLinkText = config?.cardLinkText || 'Learn About Box Studio';
  const cardLinkHref = config?.cardLinkHref || '/about';
  const galleryImages = (config?.gallery && config.gallery.length > 0)
    ? config.gallery.map((g) => g.src)
    : [
        '/images/what we do/Brow Obsession premium carton flatlay-4.webp',
        '/images/what we do/Aqua Skincare Carton Quartet-1.webp',
        '/images/what we do/Honey-Gold Art Deco Cosmetic Packaging-3.webp',
      ];

  return (
    <>
      <section className={`${styles.section} ${styles.beige} ${styles.discoverSection}`}>
        <div className={`${styles.sectionInner} ${styles.copyGrid}`}>
          <h2>{heading}</h2>
          <div>
            <p>{lead}</p>
            {cardTitle ? <p>{cardTitle}</p> : null}
            <TextLink href={cardLinkHref}>{cardLinkText}</TextLink>
          </div>
        </div>
      </section>
      <div className={styles.beigeToWhite}>
        <FadeImages
          images={galleryImages}
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
          {highlightItems.map((item) => (
            <article key={item.slug} className={styles.updateCard}>
              <Link href={item.href || `/updates/${item.slug}`}>
                <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
                <h3>{item.title}</h3>
              </Link>
            </article>
          ))}
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
  const { categories, home } = useCatalog();
  const industries = buildIndustryGroups(categories);
  const homeData = home || {};
  const seo = homeData.seo || {};
  const hero = homeData.hero || {};
  const industriesSection = homeData.industriesSection || {};
  const discoverSection = homeData.discoverSection || {};
  const futureSection = homeData.futureSection || {};
  const trendsSection = homeData.trendsSection || {};

  const futureParagraphs = futureSection?.body
    ? futureSection.body.split('\n\n').filter(Boolean)
    : [
        'Better packaging begins with considered choices: the right structure, the right amount of material and finishes selected for a clear purpose.',
        'We help brands compare paperboard, kraft and recyclable options while keeping protection, print quality and shelf presence in view.',
      ];

  const trendsParagraphs = trendsSection?.lead
    ? trendsSection.lead.split('\n\n').filter(Boolean)
    : [
        'A distinctive finish, proportion or opening detail can turn a familiar packaging box into something memorable.',
        'Use current colour, material and decoration ideas as a starting point, then make the final packaging recognisably yours.',
      ];

  usePageMeta({
    title: seo.metaTitle || 'Custom Cosmetic Packaging & Printed Boxes | Box Studio',
    description:
      seo.metaDescription ||
      'Get custom printed cosmetic boxes for makeup, skincare, and fragrance. Choose your carton size, foil stamping, and embossing. Request a quote from Box Studio.',
    path: '/',
    image: absoluteUrl(hero.slides?.[0]?.src || heroImages[0]),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: site.name,
      url: site.url,
      description: seo.metaDescription || site.summary || site.description,
    },
  });

  return (
    <div className={styles.home}>
      <Hero hero={hero} />
      <LatestUpdates industries={industries} config={industriesSection} />
      <DeferredBelowFold>
        <Discover config={discoverSection} />
        <EditorialSection
          title={futureSection?.heading || 'A beautiful future'}
          paragraphs={futureParagraphs}
          images={[
            '/images/beautiful future/mmckewtrojgeinzxiw4j.webp',
            '/images/beautiful future/Drift beauty cartons on ivory stone-6.webp',
            '/images/beautiful future/ioxxesfonf8hzb05og3z.webp',
          ]}
          alt={futureSection?.alt || 'A refined collection of modern beauty packaging.'}
          href={futureSection?.ctaHref || '/beautiful-future'}
          linkLabel={futureSection?.ctaLabel || 'Find out more'}
        />
        <EditorialSection
          title={trendsSection?.heading || 'Be inspired by packaging trends'}
          paragraphs={trendsParagraphs}
          images={[
            '/images/trends/Paradiso Botanical Folding Carton Collection-3.webp',
            '/images/trends/Caresse rose-peach embossed carton collection-4.webp',
            '/images/trends/Pastel Creams Folding Carton Showcase-5.webp',
            '/images/trends/Turquoise luxury folding carton showcase-2.webp',
            '/images/trends/Dreamy starlight skincare carton collection-1.webp',
          ]}
          alt={trendsSection?.alt || 'A collection of contemporary packaging box trends.'}
          href={trendsSection?.highlightHref || '/trends'}
          linkLabel={trendsSection?.highlightTitle || 'Explore Packaging Design Trends'}
        />
        {/* <LatestHighlights /> */}
      </DeferredBelowFold>
    </div>
  );
}
