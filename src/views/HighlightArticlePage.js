'use client';

import Link from 'next/link';
import { absoluteUrl } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import styles from './HighlightArticlePage.module.css';

function Arrow() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M3 15 15 3M7 3h8v8" />
    </svg>
  );
}

export default function HighlightArticlePage({ article }) {
  usePageMeta({
    title: `${article.title} | Box Studio`,
    description: article.subtitle,
    path: `/updates/${article.slug}`,
    image: absoluteUrl(article.heroImage),
  });

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="highlight-heading">
        <div className={styles.heroCopy}>
          <h1 id="highlight-heading">{article.title}</h1>
          <p className={styles.byline}>
            <span>{article.author || 'Box Studio Editorial'}</span>
            {article.publishedAt ? (
              <>
                <span aria-hidden="true"> · </span>
                <time dateTime={article.publishedAt}>
                  {new Date(`${article.publishedAt}T12:00:00Z`).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </>
            ) : null}
          </p>
          <p>{article.subtitle}</p>
        </div>
        <div className={styles.heroMedia}>
          <img
            src={article.heroImage}
            alt={article.heroAlt}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </section>

      <div className={styles.rule} aria-hidden="true" />

      <section className={`${styles.section} ${styles.white}`}>
        <div className={`${styles.inner} ${styles.intro}`}>
          <h2>{article.introHeading}</h2>
          <div>
            {article.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.beige}`}>
        {article.sections.map((section) => (
          <div key={section.title} className={styles.theme}>
            <h2>{section.title}</h2>
            <p className={styles.themeLead}>{section.lead}</p>
            <p>{section.body}</p>
            {section.linkHref ? (
              <Link href={section.linkHref} className={styles.themeLink}>
                <span>{section.linkLabel}</span>
                <Arrow />
              </Link>
            ) : null}
          </div>
        ))}
      </section>

      <div className={styles.ctaBand}>
        <Link href="/quote">
          <span>Get in touch to find out more</span>
          <Arrow />
        </Link>
      </div>

      <section className={styles.closing}>
        <div className={styles.closingInner}>
          <h2>{article.closingTitle}</h2>
          <p>{article.closingBody}</p>
          <Link href="/quote" className={styles.themeLink}>
            <span>Start a project</span>
            <Arrow />
          </Link>
        </div>
      </section>
    </div>
  );
}
