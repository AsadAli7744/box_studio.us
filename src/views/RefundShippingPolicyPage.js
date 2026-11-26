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

export default function RefundShippingPolicyPage() {
  usePageMeta({
    title: 'Refund & Shipping Policy | Box Studio',
    description:
      'Box Studio refund and shipping rules: no refunds once production begins, and finished packaging must be received within 15 days or it may be disposed without notice.',
    path: '/refund-shipping-policy',
    image: absoluteUrl('/images/hcp-home/hero-fantasy-eyes.webp'),
  });

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="refund-shipping-heading">
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Legal</p>
          <h1 id="refund-shipping-heading">Refund &amp; Shipping Policy</h1>
          <p className={styles.lede}>
            Clear rules for payments, production, delivery, and unclaimed packaging orders from Box
            Studio on {site.domain}.
          </p>
          <p className={styles.updated}>
            <time dateTime="2026-11-25">Last updated: November 25, 2026</time>
          </p>
        </div>
      </section>

      <div className={styles.content}>
        <div className={styles.sections}>
          <section className={styles.section}>
            <h2>Key points</h2>
            <ul>
              <li>
                <strong>No refund</strong> once product production has begun.
              </li>
              <li>
                You must <strong>receive your product within 15 days</strong> after production is
                complete.
              </li>
              <li>
                If you do not receive or arrange shipping within that window, the order may be{' '}
                <strong>disposed of after 15 days without any further intimation</strong>.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>No refund after production begins</h2>
            <p>
              Custom packaging is made to your approved size, structure, artwork, and finishing
              brief. Once production of your order has begun, the amount paid is{' '}
              <strong>non-refundable</strong>.
            </p>
            <p>
              That means Box Studio will not refund, reverse, or credit the payment for cancelled,
              delayed, or changed orders after manufacturing has started. Please review artwork,
              dimensions, quantity, and finishes carefully before approving production.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Receive your product within 15 days</h2>
            <p>
              When production is finished, Box Studio will notify you that the order is ready for
              shipping or collection. You must receive your product — or confirm and complete the
              shipping arrangement — <strong>within 15 days</strong> of that production-complete
              notice.
            </p>
            <p>
              It is your responsibility to respond promptly, confirm the delivery address, and take
              delivery within this period.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Unclaimed orders after 15 days</h2>
            <p>
              If you do not receive your shipping, arrange collection, or complete delivery within{' '}
              <strong>15 days after production</strong>, Box Studio may dispose of the finished
              packaging <strong>without any further intimation</strong>.
            </p>
            <p>
              No refund, replacement, or storage credit applies to orders disposed of under this
              rule. Storage beyond 15 days is not guaranteed.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Shipping notes</h2>
            <p>
              Shipping timelines, carriers, and delivery details are confirmed with your quote and
              production schedule. Transit time after handover to the carrier is separate from the
              15-day receive window above, which starts when production is complete and the order is
              ready for you.
            </p>
            <p>
              Provide a complete, accurate delivery address and a reachable contact. Delays caused by
              incomplete contact details, refused delivery, or failure to arrange collection still
              count toward the 15-day window.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Questions</h2>
            <p>
              If you need clarification before approving production, contact Box Studio at{' '}
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
        </div>
      </div>

      <section className={styles.ctaBand}>
        <div className={styles.ctaInner}>
          <h2>Ready to start a packaging project?</h2>
          <p>
            Review this policy before production approval, then request a quote with your size,
            quantity, and finish notes.
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
