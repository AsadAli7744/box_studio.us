'use client';

import Link from 'next/link';
import { getHighlightCards } from '../data/highlights';
import { absoluteUrl } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import styles from './UpdatesPage.module.css';

const items = getHighlightCards();

export default function UpdatesPage() {
  usePageMeta({
    title: 'Latest updates & Highlights | Box Studio',
    description:
      'Browse the latest Box Studio updates and packaging highlights — notes on custom packaging boxes, print, structure and shelf presentation.',
    path: '/updates',
    image: absoluteUrl(items[0]?.image || '/images/hcp-home/update-snapshot.jpg'),
  });

  return (
    <div className={styles.page}>
      <section className={styles.section} aria-labelledby="updates-heading">
        <div className={styles.inner}>
          <h1 id="updates-heading">Latest updates &amp; Highlights</h1>
          <div className={styles.grid}>
            {items.map((item) => {
              const media = (
                <>
                  <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
                  <h2>{item.title}</h2>
                </>
              );

              return (
                <article key={item.slug} className={styles.card}>
                  {item.href ? <Link href={item.href}>{media}</Link> : <div>{media}</div>}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
