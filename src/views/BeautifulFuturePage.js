'use client';

import Link from 'next/link';
import { absoluteUrl } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import styles from './BeautifulFuturePage.module.css';

const images = {
  hero: '/images/new_page/campaign-hero.webp',
  band: '/images/new_page/frosted-glass.webp',
  feature1: '/images/new_page/campaign-feature-1.webp',
  feature2: '/images/new_page/campaign-feature-2.webp',
  feature3: '/images/new_page/campaign-feature-3.webp',
};

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

export default function BeautifulFuturePage() {
  usePageMeta({
    title: 'A Beautiful Future | Packaging Box Shelf Life | Box Studio',
    description:
      'See how Box Studio packaging boxes protect products longer on shelf, reduce damage, and help brands grow with stronger presentation and production-ready structure.',
    path: '/beautiful-future',
    image: absoluteUrl(images.hero),
  });

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="future-heading">
        <div className={styles.heroCopy}>
          <div className={styles.heroBackdrop} aria-hidden="true">
            <img src={images.hero} alt="" loading="eager" decoding="async" />
          </div>
          <div className={styles.heroCard}>
            <p className={styles.kicker}>A beautiful future</p>
            <h1 id="future-heading">Packaging boxes that protect longer and help brands grow</h1>
            <h2>
              Better shelf life starts with the right structure, materials and finishing — sized to
              the product inside.
            </h2>
            <p>
              Box Studio designs packaging boxes that keep products safer in transit and more
              presentable on shelf, so brands spend less time recovering damaged stock and more time
              building recognition, trust and repeat purchase.
            </p>
          </div>
        </div>
        <div className={styles.heroMedia}>
          <img
            src={images.hero}
            alt="Box Studio packaging boxes designed for longer shelf life and brand growth."
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </section>

      <section className={`${styles.section} ${styles.beige}`}>
        <div className={`${styles.sectionInner} ${styles.intro}`}>
          <h2>Shelf life is a growth decision</h2>
          <div className={styles.prose}>
            <p>
              When a packaging box fails early — crushed corners, scuffed print, weak closures —
              products leave the shelf faster for the wrong reasons. Returns rise, reviews suffer,
              and the brand looks less reliable than the formula inside deserves.
            </p>
            <p>
              Box Studio treats shelf life as part of brand growth: choose board and structure for
              real handling, keep print durable, and present the product clearly so shoppers
              recognise value before they open anything.
            </p>
            <p>
              From first brief to production quote, we help teams balance protection, shelf presence
              and manufacturable detail — so the packaging box still looks intentional after shipping,
              stocking and customer touch.
            </p>
          </div>
        </div>
      </section>

      <div className={styles.bandWrap}>
        <div className={styles.bandSlot}>
          <img
            src={images.band}
            alt="Packaging boxes that stay presentation-ready through shipping and shelf display."
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <div>
        <section className={styles.feature}>
          <div className={styles.featureCopy}>
            <h2>Structure that extends product life on shelf</h2>
            <p>
              A packaging box only supports shelf life when it fits the fill. Correct dimensions,
              board caliper and closure style reduce crushing, dust ingress and panel warp during
              storage and retail handling.
            </p>
            <p>
              Box Studio sizes each format around the component — lipstick, bottle, jar, kit or set —
              then confirms materials and finishing that hold up through warehouse movement and shelf
              rotation.
            </p>
            <TextLink href="/custom-boxes">Browse packaging boxes</TextLink>
          </div>
          <div className={styles.featureMedia}>
            <img
              src={images.feature1}
              alt="Structured packaging boxes that protect products during storage and retail handling."
              loading="lazy"
              decoding="async"
            />
          </div>
        </section>

        <section className={`${styles.feature} ${styles.featureReverse}`}>
          <div className={styles.featureCopy}>
            <h2>Presentation that keeps brands looking new longer</h2>
            <p>
              Shelf life is visual as well as physical. Scuffed ink, soft edges and tired finishes
              make a product feel older before the use-by date matters. Clean print, considered
              coatings and restrained decoration help the packaging box stay sharp under store
              lighting and customer handling.
            </p>
            <p>
              Stronger shelf presence supports conversion: clearer hierarchy, honest materials and a
              box that still photographs well after transit.
            </p>
            <TextLink href="/trends">Explore packaging inspiration</TextLink>
          </div>
          <div className={styles.featureMedia}>
            <img
              src={images.feature2}
              alt="Shelf-ready packaging boxes with durable print and clear brand presentation."
              loading="lazy"
              decoding="async"
            />
          </div>
        </section>

        <section className={styles.feature}>
          <div className={styles.featureCopy}>
            <h2>Less damage, more growth</h2>
            <p>
              Every damaged unit is lost margin and lost trust. Packaging boxes engineered for real
              shipping and stocking conditions reduce waste, protect launches and keep inventory
              sellable for longer — especially across beauty, skincare, fragrance, healthcare and
              food lines.
            </p>
            <p>
              That operational reliability compounds into growth: fewer replacements, cleaner
              unboxing, and a brand experience that feels consistent from first impression to repeat
              order.
            </p>
            <TextLink href="/quote">Start a project</TextLink>
          </div>
          <div className={styles.featureMedia}>
            <img
              src={images.feature3}
              alt="Premium packaging boxes that support brand growth with lasting shelf presence."
              loading="lazy"
              decoding="async"
            />
          </div>
        </section>
      </div>

      <section className={`${styles.section} ${styles.beige}`}>
        <div className={styles.sectionInner}>
          <p className={styles.kicker}>How Box Studio helps</p>
          <h2 className={styles.sectionTitle}>
            Three levers that extend packaging box shelf life
          </h2>
          <div className={styles.points}>
            <article className={styles.point}>
              <h3>Fit &amp; board</h3>
              <p>
                Right-size the packaging box to the product and choose board that resists crush and
                warp through shipping and shelf cycles.
              </p>
            </article>
            <article className={styles.point}>
              <h3>Print &amp; finish</h3>
              <p>
                Durable print systems and purposeful coatings keep colour, type and brand detail
                looking intentional after handling.
              </p>
            </article>
            <article className={styles.point}>
              <h3>Quote-ready path</h3>
              <p>
                Move from brief to production with clear dimensions, materials and finishing notes —
                so shelf performance is planned, not guessed.
              </p>
            </article>
          </div>
          <div className={styles.checklist}>
            <div>
              <h3>What longer shelf life supports</h3>
              <ul>
                <li>Fewer damaged or unsellable units</li>
                <li>Stronger brand trust at first glance</li>
                <li>Cleaner retail and unboxing experience</li>
                <li>More consistent launch-to-reorder quality</li>
              </ul>
            </div>
            <div>
              <h3>Bring to your quote</h3>
              <ul>
                <li>Product dimensions and fill type</li>
                <li>Shipping and shelf handling notes</li>
                <li>Must-have finishes or windows</li>
                <li>Quantity range and timeline</li>
              </ul>
            </div>
          </div>
          <div className={styles.ctaRow}>
            <TextLink href="/quote">Get a Quote for This Box</TextLink>
          </div>
        </div>
      </section>
    </div>
  );
}
