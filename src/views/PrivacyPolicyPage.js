'use client';

import Link from 'next/link';
import { absoluteUrl, configuredContact, site } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import styles from './PrivacyPolicyPage.module.css';

const contact = configuredContact();

function Arrow() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M3 15 15 3M7 3h8v8" />
    </svg>
  );
}

export default function PrivacyPolicyPage() {
  usePageMeta({
    title: 'Privacy Policy | Box Studio',
    description:
      'How Box Studio collects, uses, and protects information when you browse our packaging site, request a quote, or contact our team.',
    path: '/privacy',
    image: absoluteUrl('/images/hcp-home/hero-fantasy-eyes.webp'),
  });

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="privacy-heading">
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Legal</p>
          <h1 id="privacy-heading">Privacy Policy</h1>
          <p className={styles.lede}>
            This policy explains how Box Studio handles information when you use{' '}
            {site.domain}, request a packaging quote, or contact our team.
          </p>
          <p className={styles.updated}>
            <time dateTime="2026-11-25">Last updated: November 25, 2026</time>
          </p>
        </div>
      </section>

      <div className={styles.content}>
        <div className={styles.sections}>
          <section className={styles.section}>
            <h2>Who we are</h2>
            <p>
              Box Studio designs and manufactures custom printed packaging for cosmetics,
              skincare, fragrance, healthcare, food, and retail brands. For privacy questions,
              contact us at{' '}
              {contact.email ? (
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              ) : (
                'info@boxstudio.us'
              )}
              {contact.phone ? (
                <>
                  {' '}
                  or{' '}
                  <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}>{contact.phone}</a>
                </>
              ) : null}
              .
            </p>
          </section>

          <section className={styles.section}>
            <h2>Information we collect</h2>
            <p>We may collect information you choose to provide, including:</p>
            <ul>
              <li>Name, email address, phone number, and company details submitted with a quote request</li>
              <li>Product dimensions, quantity intent, finish preferences, and artwork notes</li>
              <li>Files you upload to support a packaging brief</li>
              <li>Messages you send by email, phone, or other contact channels listed on this site</li>
            </ul>
            <p>
              When you browse the site, we may also receive standard technical data such as browser
              type, device information, approximate location derived from IP address, pages viewed,
              and referring URLs.
            </p>
          </section>

          <section className={styles.section}>
            <h2>How we use information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Respond to quote requests and packaging questions</li>
              <li>Prepare dielines, samples, and production discussions related to your project</li>
              <li>Operate, secure, and improve the website experience</li>
              <li>Understand site traffic and content performance through analytics tools</li>
              <li>Communicate about projects you have opened with Box Studio</li>
            </ul>
            <p>
              We do not sell personal information. We do not use quote details for unrelated
              marketing lists unless you ask us to stay in touch about packaging updates.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Cookies and analytics</h2>
            <p>
              Box Studio may use cookies and similar technologies, including Google Tag Manager, to
              measure site usage and improve page performance. These tools can collect information
              about how visitors move through the site.
            </p>
            <p>
              You can control cookies through your browser settings. Blocking some cookies may limit
              parts of the browsing experience, but quote and contact options remain available.
            </p>
          </section>

          <section className={styles.section}>
            <h2>How we share information</h2>
            <p>
              We may share information with trusted service providers who help us run the website,
              store quote files, host email or phone systems, or process analytics. These providers
              are expected to use the information only to perform services for Box Studio.
            </p>
            <p>
              We may also disclose information if required by law, to protect our rights, or in
              connection with a business transfer such as a merger or asset sale.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Data retention and security</h2>
            <p>
              Quote and contact records are kept as long as needed to support the project discussion
              and ordinary business records. Technical logs and analytics data may be retained for
              shorter operational periods.
            </p>
            <p>
              We take reasonable administrative and technical steps to protect information submitted
              through the site. No method of transmission or storage is completely secure, so please
              avoid sending passwords or unrelated sensitive personal data in quote notes.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Your choices</h2>
            <p>
              You may ask us to update or delete contact details we hold about you, or to clarify
              how a quote request is being handled, by emailing{' '}
              {contact.email ? (
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              ) : (
                'info@boxstudio.us'
              )}
              . We may need enough information to verify the request and locate the relevant record.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Children</h2>
            <p>
              This website is intended for business and brand packaging inquiries. It is not directed
              to children, and we do not knowingly collect personal information from children.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Changes to this policy</h2>
            <p>
              We may update this Privacy Policy as our site, tools, or business practices change. The
              “Last updated” date at the top of this page will change when a revision is published.
            </p>
          </section>
        </div>
      </div>

      <section className={styles.ctaBand}>
        <div className={styles.ctaInner}>
          <h2>Questions about privacy?</h2>
          <p>
            Reach the Box Studio team and we will help with privacy requests related to this website
            or a packaging quote.
          </p>
          <Link href="/quote" className={styles.textLink}>
            <span>Request a quote</span>
            <Arrow />
          </Link>
        </div>
      </section>
    </div>
  );
}
