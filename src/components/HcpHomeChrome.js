'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { site } from '../data/site';
import styles from './HcpHomeChrome.module.css';

const links = [
  { label: 'categories', href: '/custom-boxes' },
  { label: 'cosmetics', href: '/cosmetic-boxes' },
  { label: 'healthcare', href: '/healthcare-boxes' },
  { label: 'food', href: '/restaurant-food-boxes' },
  { label: 'christmas', href: '/christmas-boxes' },
  { label: 'quote', href: '/quote' },
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </svg>
  );
}

export function HcpHomeHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.logoLink} aria-label="Boxstudio.us, home">
          <Logo />
        </Link>

        <div className={styles.desktop}>
          <form className={styles.search} action="/custom-boxes">
            <label className="sr-only" htmlFor="home-header-search">Search boxes</label>
            <input id="home-header-search" name="search" type="search" placeholder="search boxes..." />
            <button type="submit" aria-label="Search boxes">
              <SearchIcon />
            </button>
          </form>
          <nav aria-label="Homepage navigation">
            {links.map((item) => (
              <Link key={item.href} href={item.href}>{item.label}</Link>
            ))}
          </nav>
        </div>

        <button
          type="button"
          className={open ? `${styles.menuButton} ${styles.isOpen}` : styles.menuButton}
          aria-expanded={open}
          aria-controls="hcp-home-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav
        id="hcp-home-menu"
        className={open ? `${styles.mobileMenu} ${styles.isOpen}` : styles.mobileMenu}
        aria-label="Mobile homepage navigation"
      >
        {links.map((item, index) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7.5 10v7M7.5 7v.2M11 17v-7m0 3.1c.7-2.2 5-2.4 5 1V17" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".8" className={styles.socialDot} />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 21v-8h3l.5-3H14V8.2c0-1 .3-1.7 1.8-1.7H18V3.8c-.4-.1-1.6-.2-2.7-.2-2.7 0-4.6 1.7-4.6 4.8V10H8v3h2.7v8" />
    </svg>
  );
}

export function HcpHomeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          <div>
            <h2>Keep up to date</h2>
            <p>
              Discover new Box Studio products, packaging ideas, finishes and materials.
            </p>
            <Link href="/quote" className={styles.signup}>Start a project</Link>
          </div>
          <div className={styles.socials} aria-label="Social media">
            <a href="#" aria-label="LinkedIn"><LinkedInIcon /></a>
            <a href="#" aria-label="Instagram"><InstagramIcon /></a>
            <a href="#" aria-label="Facebook"><FacebookIcon /></a>
          </div>
        </div>

        <div className={styles.footerLinks}>
          <Link href="/custom-boxes">Packaging Categories</Link>
          <Link href="/quote">Request a Quote</Link>
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(site.email)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Email Us
          </a>
          <a href="tel:+12254835392">Call {site.phone}</a>
          <Link href="/healthcare-boxes">Healthcare Boxes</Link>
          <Link href="/restaurant-food-boxes">Food Boxes</Link>
        </div>

        <p className={styles.copyright}>
          © 2026 Box Studio. Custom packaging specifications are confirmed when a quote is reviewed.
        </p>
      </div>
    </footer>
  );
}
