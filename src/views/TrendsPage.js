'use client';

import Link from 'next/link';
import { useCatalog } from '../context/CatalogContext';
import { absoluteUrl } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import styles from './TrendsPage.module.css';

const STORIES = [
  {
    id: 'soft-finish',
    kicker: 'Finish & feel',
    title: 'Soft colour, tactile print and quieter luxury',
    lead:
      'Beauty packaging is shifting away from loud novelty toward calm surfaces, considered proportion and finishes that feel intentional in the hand.',
    paragraphs: [
      'Soft peach, ivory, muted rose and warm neutrals continue to lead shelf stories — especially when paired with clean typography and a single strong accent. Emboss, soft-touch coatings and restrained foil can add depth without overcrowding the face of the packaging box.',
      'For brands refreshing an existing line, start with the structure you already trust, then evolve the print and finishing language. A familiar tuck-end or sleeve can look entirely new when colour, type hierarchy and opening detail are refined together.',
      'Box Studio helps you compare those choices against protection, print quality and production reality — so the trend inspiration still works as a manufacturable packaging box.',
    ],
    image: '/images/new_page/lilac-tangerine-beauty.webp',
    imageAlt: 'Lilac and tangerine beauty packaging boxes.',
    productSlugs: ['blush-boxes', 'highlighter-boxes', 'face-powder-boxes'],
  },
  {
    id: 'lip-colour',
    kicker: 'Colour story',
    title: 'The lip colour story: slim packaging boxes with a clear point of view',
    lead:
      'Lipstick, gloss and balm packaging succeed when the packaging box feels as precise as the product — slim, confident and easy to recognise from a distance.',
    paragraphs: [
      'Tall, narrow formats remain a strong cue for lip products. They photograph well, stack cleanly and leave room for a bold product name or shade system on the front panel. Window details and metallic accents work best when they support the formula story instead of competing with it.',
      'Sets and duos are another growing ask: two related SKUs in one presentation packaging box, or a primary product with a mini companion. That is where structure and insert planning matter as much as print.',
      'Browse the lip formats below, then request a quote with your fill size, shade count and finishing preferences so the packaging box is sized to the actual component.',
    ],
    image: '/images/new_page/chromatic-beauty-ribbon.webp',
    imageAlt: 'Chromatic beauty packaging boxes on a silver ribbon.',
    productSlugs: ['lipstick-boxes', 'lip-gloss-boxes', 'lip-balm-boxes', 'liquid-lipstick-boxes'],
  },
  {
    id: 'complexion',
    kicker: 'Skincare & complexion',
    title: 'Complexion packaging that feels clinical, calm and shelf-ready',
    lead:
      'Foundation, primer and sun care are leaning into clearer hierarchies, honest materials and packaging that communicates care as much as colour.',
    paragraphs: [
      'Many brands are balancing “clinical clean” with warmth: cool neutrals for trust, then one soft accent for approachability. Pump bottles, tubes and sticks each need different packaging box footprints — so the trend is less about one universal box and more about a coherent family system.',
      'Sunscreen and after-sun lines benefit from durable print, clear usage cues and formats that survive travel and retail handling. A strong side panel or back panel can carry SPF language without crowding the hero face.',
      'Use the related packaging boxes as references for proportion, then adapt board, finish and artwork to your brand system.',
    ],
    image: '/images/new_page/chartreuse-petrol-skincare.webp',
    imageAlt: 'Chartreuse and petrol-blue luxury skincare packaging boxes.',
    productSlugs: ['foundation-boxes', 'primer-boxes', 'sunscreen-boxes', 'concealer-boxes'],
  },
  {
    id: 'eyes-brows',
    kicker: 'Eyes & brows',
    title: 'Definition, drama and the details that hold an eye story together',
    lead:
      'Mascara, eyeliner and brow packaging reward precision — both in the component and in the packaging box that introduces it.',
    paragraphs: [
      'Dark grounds, metallic type and high-contrast icons still signal intensity for eye products, while brow ranges often prefer softer neutrals with tool-led photography or line illustrations. Either way, the packaging box should make the ritual feel clear: define, fill, set.',
      'Kits are especially useful here — a brow powder with brush, or an eyes essentials pair — because the unboxing moment can explain the routine before the customer opens a single tube.',
      'Explore the formats below when you need slim sleeves, kit packaging boxes or matching secondary packaging across an eye and brow lineup.',
    ],
    image: '/images/new_page/coral-cobalt-fragrance.webp',
    imageAlt: 'Coral and cobalt fragrance packaging boxes on sculptural stairs.',
    productSlugs: ['mascara-boxes', 'eyeliner-boxes', 'eyebrow-product-boxes', 'makeup-set-boxes'],
  },
];

const CLOSING_SLUGS = [
  'bb-cc-cream-boxes',
  'setting-spray-boxes',
  'bronzer-contour-boxes',
  'lip-liner-boxes',
  'lip-tint-boxes',
  'after-sun-boxes',
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

function pickProducts(products, slugs) {
  const bySlug = new Map(products.map((item) => [item.slug, item]));
  return slugs.map((slug) => bySlug.get(slug)).filter(Boolean);
}

function ProductCard({ product }) {
  const image = product.images?.[0];
  return (
    <article className={styles.card}>
      <Link href={`/${product.slug}`}>
        <img
          src={image?.src || '/images/cat-all.jpg'}
          alt={image?.alt || product.name}
          loading="lazy"
          decoding="async"
        />
        <h3>{product.name}</h3>
        <p>{product.short || product.categoryLabel || product.category}</p>
      </Link>
    </article>
  );
}

function FeaturedProduct({ product }) {
  if (!product) return null;
  const image = product.images?.[0];
  return (
    <aside className={styles.featuredProduct}>
      <Link href={`/${product.slug}`}>
        <img
          src={image?.src || '/images/cat-all.jpg'}
          alt={image?.alt || product.name}
          loading="lazy"
          decoding="async"
        />
        <div>
          <p className={styles.featuredLabel}>Featured format</p>
          <h3>{product.name}</h3>
          <p>{product.short || product.description?.slice(0, 140) || product.categoryLabel}</p>
          <span className={styles.inlineCta}>View this box</span>
        </div>
      </Link>
    </aside>
  );
}

export default function TrendsPage() {
  const { products } = useCatalog();
  const closing = pickProducts(products, CLOSING_SLUGS);

  usePageMeta({
    title: 'Packaging Trends | Custom Packaging Inspiration | Box Studio',
    description:
      'Read Box Studio packaging trend notes on colour, finish and structure — then explore matching custom boxes for cosmetics, skincare and beauty brands.',
    path: '/trends',
    image: absoluteUrl('/images/new_page/chromatic-beauty-ribbon.webp'),
  });

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="trends-heading">
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Inspiration journal</p>
          <h1 id="trends-heading">Packaging Trends</h1>
          <p>
            Notes on colour, finish, proportion and presentation — written for brands building
            cosmetics, skincare and beauty packaging that feels current and still works in
            production. Each story points to real Box Studio formats you can open, adapt and quote.
          </p>
        </div>
        <div className={styles.heroMedia}>
          <img
            src="/images/new_page/chromatic-beauty-ribbon.webp"
            alt="Chromatic beauty packaging boxes on a silver ribbon."
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </section>

      <section className={`${styles.section} ${styles.beige}`}>
        <div className={styles.articleInner}>
          <p className={styles.kicker}>Editor’s note</p>
          <h2>Why trend thinking still starts with the product inside</h2>
          <div className={styles.prose}>
            <p>
              Trend boards are useful, but packaging only becomes valuable when it protects the fill,
              carries the brand clearly and can be produced at the quality your launch needs. That is
              why Box Studio treats inspiration as a brief — not a finished specification.
            </p>
            <p>
              Across beauty retail, the strongest packaging boxes share a few habits: one dominant
              visual idea, honest structure for the component, and finishing used with restraint.
              Foil, emboss, soft-touch and windows all have a place; they work best when they
              reinforce the product promise instead of decorating every panel.
            </p>
            <p>
              Use the stories below as a reading path. Each one pairs editorial direction with live
              catalog packaging boxes — lipstick sleeves, complexion boxes, eye kits and more — so
              you can move from mood to a manufacturable reference quickly.
            </p>
          </div>
          <div className={styles.pullQuote}>
            <p>
              “A distinctive finish or opening detail can turn a familiar packaging box into
              something memorable — as long as the structure still fits the product.”
            </p>
          </div>
        </div>
      </section>

      {STORIES.map((story, index) => {
        const storyProducts = pickProducts(products, story.productSlugs);
        const [featured, ...rest] = storyProducts;
        const reversed = index % 2 === 1;

        return (
          <section
            key={story.id}
            className={`${styles.section} ${index % 2 === 0 ? styles.white : styles.beige}`}
            aria-labelledby={story.id}
          >
            <div className={styles.storyInner}>
              <div className={`${styles.storyHero} ${reversed ? styles.storyHeroReverse : ''}`}>
                <div className={styles.storyCopy}>
                  <p className={styles.kicker}>{story.kicker}</p>
                  <h2 id={story.id}>{story.title}</h2>
                  <p className={styles.lead}>{story.lead}</p>
                  <div className={styles.prose}>
                    {story.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
                <div className={styles.storyMedia}>
                  <img src={story.image} alt={story.imageAlt} loading="lazy" decoding="async" />
                </div>
              </div>

              <FeaturedProduct product={featured} />

              {rest.length > 0 ? (
                <div className={styles.relatedBlock}>
                  <div className={styles.relatedHead}>
                    <h3>Related boxes for this direction</h3>
                    <p>Open a format, check the fit notes, then carry the finishing idea into your quote.</p>
                  </div>
                  <div className={styles.grid}>
                    {rest.map((product) => (
                      <ProductCard key={product.slug} product={product} />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        );
      })}

      <section className={`${styles.section} ${styles.beige}`}>
        <div className={styles.articleInner}>
          <p className={styles.kicker}>Practical notes</p>
          <h2>How to turn a trend into a production-ready brief</h2>
          <div className={styles.prose}>
            <p>
              When a mood board feels right, translate it into decisions a packaging team can act on.
              Capture the component size, preferred board, must-have finishes and any insert or window
              requirements. Note what can flex — colourway, typography, secondary panels — so sampling
              stays focused.
            </p>
            <p>
              If you are building a family (lip, eye, complexion), keep one structural logic and vary
              print systems. Consistency across tuck styles, corner radii and type hierarchy makes a
              trend collection feel intentional instead of assembled.
            </p>
            <p>
              Ready to move from inspiration to a packaging box? Start with a related box above, or
              send dimensions and artwork notes through a quote request.
            </p>
          </div>
          <div className={styles.checklist}>
            <div>
              <h3>Bring to your quote</h3>
              <ul>
                <li>Product dimensions and fill type</li>
                <li>Preferred structure or reference box</li>
                <li>Finish priorities (foil, soft-touch, emboss, window)</li>
                <li>Quantity range and timeline</li>
              </ul>
            </div>
            <div>
              <h3>We help refine</h3>
              <ul>
                <li>Fit and board recommendations</li>
                <li>Print and finishing trade-offs</li>
                <li>Set / kit presentation options</li>
                <li>Artwork-ready production notes</li>
              </ul>
            </div>
          </div>
          <TextLink href="/quote">Start a project</TextLink>
        </div>
      </section>

      <section className={`${styles.section} ${styles.white}`} aria-labelledby="more-formats">
        <div className={styles.wideInner}>
          <div className={styles.sectionHead}>
            <h2 id="more-formats">More formats to explore</h2>
            <p>
              A wider cut of catalog boxes that pair well with current colour, finish and kit-led
              packaging directions.
            </p>
          </div>
          <div className={styles.grid}>
            {closing.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          <TextLink href="/custom-boxes">View all boxes</TextLink>
        </div>
      </section>
    </div>
  );
}
