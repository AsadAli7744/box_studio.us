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
    title: 'Shop By Industry | Box Studio',
    description:
      'Explore custom packaging for cosmetics, skincare, make-up, haircare, fragrance, healthcare, pharma, and food.',
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
