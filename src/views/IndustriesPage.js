'use client';

import Link from 'next/link';
import { useCatalog } from '../context/CatalogContext';
import { buildIndustryGroups } from '../data/industries';
import { absoluteUrl } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import styles from './HcpHomePage.module.css';

export default function IndustriesPage() {
  const { categories } = useCatalog();
  const industries = buildIndustryGroups(categories);

  usePageMeta({
    title: 'Custom Packaging by Industry | Cosmetics, Food & Healthcare | Box Studio',
    description:
      'Explore custom packaging by industry for cosmetics, skincare, makeup, fragrance, healthcare and food. Choose a category to browse matching product boxes.',
    path: '/industries',
    image: absoluteUrl('/images/Premium products in six elegant arches.png'),
  });

  return (
    <div className={styles.home}>
      <section className={`${styles.section} ${styles.beige} ${styles.industrySection}`}>
        <div className={styles.sectionInner}>
          <h1 className={styles.industryPageTitle}>Shop By Industry</h1>
          <p className={styles.industryPageIntro}>
            Choose an industry to explore every matching custom packaging product.
          </p>
          <div className={styles.updates}>
            {industries.map((industry) => (
              <article key={industry.slug} className={styles.updateCard}>
                <Link href={industry.href}>
                  <img src={industry.image} alt={industry.alt} />
                  <h2>{industry.name}</h2>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
