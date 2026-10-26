'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Accordion from '../components/Accordion';
import CatalogImage from '../components/CatalogImage';
import ProductCard from '../components/ProductCard';
import Reveal from '../components/Reveal';
import { finishes, homeFaqs, materials, processSteps } from '../data/catalog';
import { DEFAULT_HERO_SLIDES } from '../data/catalogContent';
import { absoluteUrl, site } from '../data/site';
import { useCatalog } from '../context/CatalogContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

function Hero() {
  const { heroSlides: catalogSlides } = useCatalog();
  const heroSlides = catalogSlides.length ? catalogSlides : DEFAULT_HERO_SLIDES;
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = heroSlides.length;
  const slide = heroSlides[index] || heroSlides[0];

  function go(step) {
    setIndex((current) => (current + step + count) % count);
  }

  useEffect(() => {
    if (index >= count) setIndex(0);
  }, [count, index]);

  useEffect(() => {
    if (reduced || paused || count < 2) return undefined;
    const timer = window.setInterval(() => go(1), 7000);
    return () => window.clearInterval(timer);
  }, [reduced, paused, index, count]);

  if (!slide) return null;

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="Featured packaging"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero-copy">
        <h1>{slide.title}</h1>
        <p className="hero-lead">{slide.lead}</p>
        <div className="hero-actions">
          {slide.primaryLabel ? (
            <Link href={slide.primaryHref || '/quote'} className="btn hero-pill hero-pill-dark">
              {slide.primaryLabel}
            </Link>
          ) : null}
          {slide.secondaryLabel ? (
            <Link href={slide.secondaryHref || '/custom-boxes'} className="hero-text-link">
              {slide.secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
      <div className={slide.collage ? 'hero-visual is-collage' : 'hero-visual'}>
        <img src={slide.image} alt={slide.alt} />
      </div>
      {count > 1 ? (
        <div className="hero-controls">
          <p className="sr-only" aria-live="polite">
            Slide {index + 1} of {count}
          </p>
          <button type="button" onClick={() => go(-1)} aria-label="Previous hero slide">
            <ChevronIcon />
          </button>
          <div className="hero-dots" role="tablist" aria-label="Hero slides">
            {heroSlides.map((item, dot) => (
              <button
                key={item.id || item.image}
                type="button"
                role="tab"
                aria-label={`Show slide ${dot + 1}`}
                aria-selected={dot === index}
                onClick={() => setIndex(dot)}
              />
            ))}
          </div>
          <button type="button" className="is-next" onClick={() => go(1)} aria-label="Next hero slide">
            <ChevronIcon />
          </button>
        </div>
      ) : null}
    </section>
  );
}

const sampleStories = [
  {
    initials: 'AB',
    role: 'Skincare brand',
    quote: 'The packaging brought our brand to life, from the first design to the final unboxing.',
    image: '/images/story-unbox.jpg',
    alt: 'An open orange mailer with two green boxes resting in tissue paper.',
  },
  {
    initials: 'CD',
    role: 'Retail business',
    quote: 'Thoughtful guidance, clear communication and a finish we’re proud to put our name on.',
    image: '/images/story-retail.jpg',
    alt: 'An open cream box holding a kraft carton in tissue paper.',
  },
  {
    initials: 'EF',
    role: 'E-commerce brand',
    quote: 'A great fit for our products and a memorable experience for our customers.',
    image: '/images/story-shop.jpg',
    alt: 'An open kraft mailer with two green boxes in tissue paper.',
  },
];

function StoryCard({ story, featured }) {
  return (
    <article className={featured ? 'story-card is-featured' : 'story-card'}>
      <div className="story-copy">
        <div className="story-top">
          <QuoteMark />
          <span className="sample-pill">Sample review</span>
        </div>
        <p>{story.quote}</p>
        <div className="story-person">
          <span className="story-avatar" aria-hidden="true">{story.initials}</span>
          <span>
            <strong>Example Customer</strong>
            <small>{story.role}</small>
          </span>
        </div>
      </div>
      <img src={story.image} alt={story.alt} />
    </article>
  );
}

function StoriesSection() {
  const [page, setPage] = useState(0);
  const count = sampleStories.length;
  const stories = [0, 1, 2].map((offset) => sampleStories[(page + offset) % count]);

  function move(step) {
    setPage((current) => (current + step + count) % count);
  }

  return (
    <section className="story-section" id="customer-stories" aria-roledescription="carousel" aria-label="Sample customer stories">
      <div className="section-geometry" aria-hidden="true" />
      <div className="story-head">
        <div>
          <p className="section-kicker">The unboxing experience</p>
          <h2>Good packaging.<br />Even better partnerships.</h2>
        </div>
        <div className="story-aside">
          <p>Real feedback belongs here. Add your verified customer stories.</p>
          <a className="btn story-outline" href="#customer-stories">
            Read Customer Stories
            <ArrowIcon />
          </a>
        </div>
      </div>
      <div className="story-grid">
        {stories.map((story, index) => (
          <StoryCard key={`${story.initials}-${page}`} story={story} featured={index === 0} />
        ))}
      </div>
      <div className="story-controls">
        <p className="story-count" aria-live="polite">
          {String(page + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </p>
        <div className="story-progress" aria-hidden="true">
          <span style={{ left: `${page * 28}%` }} />
        </div>
        <div className="story-nav">
          <button type="button" onClick={() => move(-1)} aria-label="Previous sample stories">
            <ChevronIcon />
          </button>
          <button type="button" className="is-next" onClick={() => move(1)} aria-label="Next sample stories">
            <ChevronIcon />
          </button>
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section className="why-section" aria-labelledby="why-heading">
      <div className="section-geometry is-right" aria-hidden="true" />
      <div className="why-head">
        <div>
          <p className="section-kicker">Why Boxstudio</p>
          <h2 id="why-heading">More than packaging.<br />A partner for your brand.</h2>
        </div>
        <div className="why-aside">
          <p>From your first idea to the final unboxing, we help you make every detail count.</p>
          <Link href="/quote" className="btn btn-gold story-pill">
            Let’s talk packaging
            <ArrowIcon />
          </Link>
        </div>
      </div>
      <div className="why-grid">
        <article className="why-card why-design">
          <h3>Design, with direction.</h3>
          <p>Turn your ideas into packaging-ready artwork with thoughtful guidance.</p>
          <img src="/images/why-design.jpg" alt="Color swatches, a box drawing, an orange pencil, and a kraft box." />
        </article>
        <article className="why-card why-time">
          <h3>Built around your timeline.</h3>
          <p>Plan your launch with clear production and delivery updates.</p>
          <div className="why-time-art" aria-hidden="true">
            <CalendarIcon />
            <ClockIcon />
          </div>
        </article>
        <article className="why-card why-unbox">
          <h3>Made for the unboxing.</h3>
          <p>Boxes that protect your products and make arrivals memorable.</p>
          <div className="why-unbox-photo">
            <img src="/images/story-unbox.jpg" alt="An open orange mailer holding two green boxes in tissue paper." />
            <Link href="/custom-boxes" className="why-explore">
              Explore packaging
              <ArrowIcon />
            </Link>
          </div>
        </article>
        <article className="why-card why-materials">
          <h3>Materials that make sense.</h3>
          <p>Explore kraft, corrugated and paperboard options for your product.</p>
          <div className="why-photo">
            <LeafIcon />
            <img src="/images/why-boards.jpg" alt="Stacked sheets of kraft, corrugated board, and paperboard." />
          </div>
        </article>
        <article className="why-card why-detail">
          <div>
            <h3>Details worth noticing.</h3>
            <p>Crisp printing, considered colour and distinctive finishes.</p>
          </div>
          <img src="/images/why-print.jpg" alt="Close-up of a kraft box with BOXSTUDIO pressed into the surface." />
        </article>
        <article className="why-card why-delivery">
          <div>
            <h3>Delivery, made clear.</h3>
            <p>Understand your shipping options before you order.</p>
          </div>
          <BoxIcon />
        </article>
      </div>
    </section>
  );
}

function QuoteMark() {
  return (
    <svg className="story-mark" viewBox="0 0 46 32" aria-hidden="true">
      <path d="M8.5 32C3.8 32 0 28.2 0 23.2 0 14.2 6.2 6.4 17.2 0l2.2 4.2C12.2 7.2 9.2 11.6 9.2 16.2h5.2c2.4 0 4.2 1.8 4.2 4.2v7.4c0 2.4-1.8 4.2-4.2 4.2H8.5zm22.6 0c-4.7 0-8.5-3.8-8.5-8.8C22.6 14.2 28.8 6.4 39.8 0L42 4.2C34.8 7.2 31.8 11.6 31.8 16.2h5.2c2.4 0 4.2 1.8 4.2 4.2v7.4c0 2.4-1.8 4.2-4.2 4.2H31.1z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="btn-arrow" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 13 L13 3 M6 3 H13 V10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6 3 L11 8 L6 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 148 92" className="why-calendar">
      <rect x="2" y="10" width="144" height="80" rx="10" />
      <path d="M2 30 H146" />
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3, 4].map((col) => (
          <circle key={`${row}-${col}`} cx={22 + col * 26} cy={46 + row * 12} r="1.7" fill="currentColor" stroke="none" />
        )),
      )}
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 92 92" className="why-clock">
      <circle cx="46" cy="46" r="40" />
      <path d="M46 46 L46 22 M46 46 L66 52" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 48 48" className="why-leaf" aria-hidden="true">
      <path d="M10 38 C12 20 24 8 40 8 C40 26 28 38 12 40 Z" />
      <path d="M16 32 C22 26 28 20 36 14" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 86 64" className="why-box" aria-hidden="true">
      <path d="M8 22 L43 6 L78 22 L43 38 Z" />
      <path d="M8 22 V46 L43 62 V38" />
      <path d="M78 22 V46 L43 62" />
      <path d="M43 38 V22 M28 14 L58 28" />
    </svg>
  );
}

const wayPoints = [
  {
    title: 'Made to Fit',
    text: 'Packaging tailored to your product.',
    icon: 'fit',
  },
  {
    title: 'Design Support',
    text: 'Expert guidance from concept to print.',
    icon: 'pencil',
  },
  {
    title: 'Print & Finishing',
    text: 'Premium materials and elevated details.',
    icon: 'layers',
  },
  {
    title: 'Clear Communication',
    text: 'Responsive, transparent and easy to work with.',
    icon: 'chat',
  },
];

const waySteps = [
  {
    number: '01',
    title: 'Share Your Brief',
    text: 'Tell us about your product, goals and requirements.',
    image: '/images/way-brief.jpg',
    alt: 'A box dieline on paper, with an orange pencil and a cup of pencils.',
  },
  {
    number: '02',
    title: 'Review Your Quote',
    text: 'Get a clear, detailed quote tailored to your needs.',
    image: '/images/way-quote.jpg',
    alt: 'A sample quote sheet listing style, size, material, printing, finishing, and quantity.',
  },
  {
    number: '03',
    title: 'Approve Your Artwork',
    text: 'Review and give final approval before production.',
    image: '/images/way-approve.jpg',
    alt: 'An open kraft box beside a card stamped Approved.',
  },
  {
    number: '04',
    title: 'Production & Quality',
    text: 'Your packaging is printed, finished and carefully inspected.',
    image: '/images/way-quality.jpg',
    alt: 'Stacked orange boxes with a leaf print and a magnifying glass.',
  },
  {
    number: '05',
    title: 'Ready for Delivery',
    text: 'Packed with care and on its way to you.',
    image: '/images/way-ship.jpg',
    alt: 'A kraft carton closed with an orange BoxStudio.us band.',
  },
];

function WayIcon({ name }) {
  if (name === 'pencil') {
    return (
      <svg className="way-icon" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M6 26 L8 18 L20 6 L26 12 L14 24 Z" />
        <path d="M18 8 L24 14" />
        <path d="M6 26 L11 24" />
      </svg>
    );
  }
  if (name === 'layers') {
    return (
      <svg className="way-icon" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M6 11 L16 8 L26 11 L16 14 Z" />
        <path d="M6 16 L16 13 L26 16 L16 19 Z" />
        <path d="M6 21 L16 18 L26 21 L16 24 Z" />
      </svg>
    );
  }
  if (name === 'chat') {
    return (
      <svg className="way-icon" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M8 10 H20 a4 4 0 0 1 4 4 V18 a4 4 0 0 1 -4 4 H14 L9 25 V22 H8 a4 4 0 0 1 -4 -4 V14 a4 4 0 0 1 4 -4 Z" />
        <path d="M14 12 H26 a3 3 0 0 1 3 3 V19" />
      </svg>
    );
  }
  return (
    <svg className="way-icon" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M7 13 L16 8 L25 13 L16 18 Z" />
      <path d="M7 13 V21 L16 26 V18" />
      <path d="M25 13 V21 L16 26" />
    </svg>
  );
}

function WaySection() {
  return (
    <section className="way-section" aria-labelledby="way-heading">
      <ul className="way-points">
        {wayPoints.map((point) => (
          <li key={point.title}>
            <WayIcon name={point.icon} />
            <div>
              <h3>{point.title}</h3>
              <p>{point.text}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="way-intro">
        <p className="section-kicker">The Boxstudio way</p>
        <h2 id="way-heading">From your idea to their doorstep.</h2>
      </div>
      <div className="way-track">
        <ol className="way-steps">
          {waySteps.map((step) => (
            <li key={step.number}>
              <img src={step.image} alt={step.alt} />
              <h3><span>{step.number}</span> {step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="way-banner">
        <p>Your next great unboxing starts here.</p>
        <Link href="/quote" className="btn btn-gold story-pill">
          Start Your Project
          <ArrowIcon />
        </Link>
      </div>
    </section>
  );
}

function HomeCatalog() {
  const { categories, products } = useCatalog();
  const [query, setQuery] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((item) => {
      if (categorySlug && item.category !== categorySlug) return false;
      if (!needle) return true;
      return [item.name, item.categoryLabel].join(' ').toLowerCase().includes(needle);
    });
  }, [products, query, categorySlug]);

  const preview = results.slice(0, 8);

  return (
    <section className="section home-catalog">
      <label className="search-field home-search">
        <span className="sr-only">Search boxes</span>
        <input
          type="search"
          value={query}
          placeholder="Search boxes"
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <p className="eyebrow">Start with the need</p>
      <h2>Boxes for what you pack, and how you sell it</h2>
      <div className="home-categories" role="group" aria-label="Box categories">
        <button type="button" aria-pressed={categorySlug === ''} onClick={() => setCategorySlug('')}>
          <img src="/images/cat-all.jpg" alt="" />
          <span>All categories</span>
        </button>
        {categories.map((category) => (
          <button
            key={category.slug}
            type="button"
            aria-pressed={categorySlug === category.slug}
            onClick={() => setCategorySlug(category.slug)}
          >
            <CatalogImage src={category.image} alt="" width={160} height={160} sizes="80px" />
            <span>{category.name}</span>
          </button>
        ))}
      </div>
      <p className="eyebrow">Made for one product</p>
      <h2>Custom boxes sized to what goes inside</h2>
      {preview.length ? (
        <div className="product-grid shop-grid">
          {preview.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <p className="home-empty">No boxes match that search.</p>
      )}
      <Link href="/custom-boxes" className="btn btn-dark home-catalog-more">
        See all products
      </Link>
    </section>
  );
}

function MaterialsSection() {
  const samples = [
    ...materials,
    ...finishes,
    {
      id: 'insert',
      name: 'Custom inserts',
      summary: 'A cradle, dividers, or tissue can be requested inside a suitable box.',
      image: '/images/sample-insert.jpg',
      alt: 'Paperboard insert tray inside an open ivory box.',
    },
  ];

  return (
    <section className="section materials-section">
      <Reveal className="section-head">
        <p className="eyebrow">What they notice first</p>
        <h2>The board and finish in their hands</h2>
        <p>
          A tuck is a structure. Kraft is a material appearance. Lamination, foil, embossing, and spot UV are finishes, and they are only useful on structures that can carry them.
        </p>
      </Reveal>
      <div className="material-board">
        {samples.map((item) => (
          <figure key={item.id}>
            <img src={item.image} alt={item.alt} loading="lazy" />
            <figcaption>
              <strong>{item.name}</strong>
              <span>{item.summary}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="section process-section">
      <div className="process-layout">
        <Reveal className="section-head">
          <p className="eyebrow">After you choose</p>
          <h2>From your product to a box you can order</h2>
        </Reveal>
        <img
          src="/images/about-workspace.jpg"
          alt="Packaging workspace with an unfolded dieline, paper swatches, a ruler, and a plain box on an ivory table."
        />
      </div>
      <ol className="process-list">
        {processSteps.map((step) => (
          <li key={step.n}>
            <span>{step.n}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ApplicationsSection() {
  const { categories } = useCatalog();

  return (
    <section className="section use-section" id="browse-by-use" aria-labelledby="browse-use-heading">
      <div className="section-head">
        <p className="eyebrow">Shop by Industry</p>
        <h2 id="browse-use-heading">Packaging for what you sell</h2>
        <p className="use-intro">Skincare, a product on a shelf, a gift, food, an order you ship, or a client kit. Each card opens the boxes made for that need.</p>
      </div>
      <ul className="industry-board">
        {categories.map((item) => (
          <li key={item.slug}>
            <Link href={`/${item.slug}`}>
              <CatalogImage src={item.image} alt={item.alt} sizes="(max-width: 700px) 50vw, 20vw" />
              <span>
                <strong>{item.name}</strong>
                <small>{item.line}</small>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="section faq-section">
      <div className="faq-intro">
        <p className="eyebrow">Before you order</p>
        <h2>What brands ask before they request a box</h2>
        <img
          src="/images/sample-insert.jpg"
          alt="Paperboard insert tray inside an open ivory box."
        />
      </div>
      <Accordion items={homeFaqs} />
    </section>
  );
}

function FinalCta() {
  return (
    <section className="final-cta">
      <div>
        <h2>A box that fits the product, and the way you sell it.</h2>
        <Link href="/quote" className="btn btn-gold">
          Request a Quote
        </Link>
      </div>
      <img
        src="/images/cta-brand.jpg"
        alt="An open forest-green rigid box with a cream jar and a folded card inside."
      />
    </section>
  );
}

export default function HomePage() {
  const { heroSlides } = useCatalog();
  usePageMeta({
    title: 'Any Box Packaging Sized to Your Product | Box Studio',
    description: site.description,
    path: '/',
    image: absoluteUrl(heroSlides[0]?.image || '/images/hero-smooth.png'),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: site.name,
      url: site.url,
      description: site.description,
    },
  });

  return (
    <div className="home-page">
      <Hero />
      <StoriesSection />
      <WhySection />
      <WaySection />
      <HomeCatalog />
      <MaterialsSection />
      <ProcessSection />
      <ApplicationsSection />
      <FaqSection />
      <FinalCta />
    </div>
  );
}
