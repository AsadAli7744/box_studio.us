import { Link } from 'react-router-dom';
import Accordion from '../components/Accordion';
import Reveal from '../components/Reveal';
import UseList from '../components/UseList';
import { finishes, homeFaqs, materials, processSteps } from '../data/catalog';
import { featuredOfferingSlugs, getOffering, shopCategories } from '../data/offerings';
import { absoluteUrl, site } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <h1>
          Great packaging
          <br />
          starts with a
          <br />
          great box.
        </h1>
        <p className="hero-lead">Custom boxes, thoughtfully made for your brand.</p>
        <div className="hero-actions">
          <Link to="/custom-boxes" className="btn btn-gold hero-pill">
            Explore Boxes
          </Link>
          <Link to="/quote" className="btn hero-pill hero-pill-quiet">
            Get a Quote
          </Link>
        </div>
      </div>
      <div className="hero-visual">
        <img
          src="/images/hero-smooth.png"
          alt="Six custom boxes: a tall green carton, an open green rigid box, a cream cylinder, an open kraft mailer, an orange hexagonal box, and a cream drawer."
        />
      </div>
    </section>
  );
}

function CategoryShowcase() {
  return (
    <section className="section category-section">
      <Reveal className="section-head">
        <p className="eyebrow">Find the right pack</p>
        <h2>Packaging for the product you already sell</h2>
        <p>
          Skincare, a shelf product, a gift, a food carton, or an order you ship. Start with that job, then open a box that can do it.
        </p>
      </Reveal>
      <div className="category-mosaic">
        {shopCategories.map((category) => (
          <article key={category.slug} className="category-tile">
            <Link to={`/${category.slug}`}>
              <img src={category.image} alt={category.alt} loading="lazy" />
              <div>
                <h3>{category.name}</h3>
                <p>{category.short}</p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function FeaturedStyles() {
  const featured = featuredOfferingSlugs.map((slug) => getOffering(slug));
  return (
    <section className="section featured-section">
      <Reveal className="section-head">
        <p className="eyebrow">Searched by name</p>
        <h2>The boxes buyers ask for first</h2>
      </Reveal>
      <div className="feature-list">
        {featured.map((product) => (
          <article key={product.slug} className="feature-row">
            <img src={product.images[0].src} alt={product.images[0].alt} loading="lazy" />
            <div>
              <p className="eyebrow">{product.categoryLabel}</p>
              <h3>{product.name}</h3>
              <p>{product.short}</p>
              <Link to={`/${product.slug}`} className="text-link">
                See if it fits your product
              </Link>
            </div>
          </article>
        ))}
      </div>
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
      <Reveal>
        <p className="eyebrow">After you choose</p>
        <h2>From your product to a box you can order</h2>
      </Reveal>
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
  return (
    <section className="section use-section" id="browse-by-use" aria-labelledby="browse-use-heading">
      <p className="eyebrow">Shop by Industry</p>
      <h2 id="browse-use-heading">Packaging for what you sell</h2>
      <p className="use-intro">Skincare, a product on a shelf, a gift, food, an order you ship, or a client kit. Each heading opens the boxes made for that need.</p>
      <UseList />
    </section>
  );
}

function FaqSection() {
  return (
    <section className="section faq-section">
      <div>
        <p className="eyebrow">Before you order</p>
        <h2>What brands ask before they request a box</h2>
      </div>
      <Accordion items={homeFaqs} />
    </section>
  );
}

function FinalCta() {
  return (
    <section className="final-cta">
      <h2>A box that fits the product, and the way you sell it.</h2>
      <Link to="/quote" className="btn btn-gold">
        Request a Quote
      </Link>
    </section>
  );
}

export default function HomePage() {
  usePageMeta({
    title: 'Box Studio | Custom boxes designed around your brand',
    description: site.description,
    path: '/',
    image: absoluteUrl('/images/hero-smooth.png'),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: site.name,
      url: site.url,
      description: site.description,
    },
  });

  return (
    <>
      <Hero />
      <CategoryShowcase />
      <FeaturedStyles />
      <MaterialsSection />
      <ProcessSection />
      <ApplicationsSection />
      <FaqSection />
      <FinalCta />
    </>
  );
}
