'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import CatalogImage from './CatalogImage';
import Logo from './Logo';
import { useCatalog } from '../context/CatalogContext';
import { buildIndustryGroups } from '../data/industries';
import { site } from '../data/site';
import styles from './HcpHomeChrome.module.css';

const links = [
  { label: 'Christmas', href: '/christmas-boxes' },
  { label: "Get Quote for Your Brand's Box", href: '/quote' },
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const mobileSearchRef = useRef(null);
  const categoriesRef = useRef(null);
  const categoriesButtonRef = useRef(null);
  const categoriesId = useId();
  const mobileCategoriesId = useId();
  const { categories } = useCatalog();
  const industries = buildIndustryGroups(categories);

  useEffect(() => {
    if (!mobileSearchOpen) return undefined;
    const timer = window.setTimeout(() => mobileSearchRef.current?.focus(), 220);

    function closeOnEscape(event) {
      if (event.key === 'Escape') setMobileSearchOpen(false);
    }

    document.addEventListener('keydown', closeOnEscape);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [mobileSearchOpen]);

  useEffect(() => {
    if (!categoriesOpen) return undefined;

    function closeOnOutsideClick(event) {
      if (!categoriesRef.current?.contains(event.target)) setCategoriesOpen(false);
    }

    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setCategoriesOpen(false);
        categoriesButtonRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [categoriesOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link
          href="/"
          className={mobileSearchOpen ? `${styles.logoLink} ${styles.logoHidden}` : styles.logoLink}
          aria-label="Boxstudio.us, home"
        >
          <Logo />
        </Link>

        <div className={styles.desktop}>
          <form className={styles.search} action="/custom-boxes">
            <label className="sr-only" htmlFor="home-header-search">Search boxes</label>
            <input id="home-header-search" name="q" type="search" placeholder="Search boxes..." />
            <button type="submit" aria-label="Search boxes">
              <SearchIcon />
            </button>
          </form>
          <nav aria-label="Homepage navigation">
            <div
              className={styles.categoryDropdown}
              ref={categoriesRef}
              onMouseEnter={() => {
                if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setCategoriesOpen(true);
              }}
              onMouseLeave={() => {
                if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setCategoriesOpen(false);
              }}
            >
              <button
                type="button"
                ref={categoriesButtonRef}
                className={styles.categoryTrigger}
                aria-expanded={categoriesOpen}
                aria-controls={categoriesId}
                onClick={() => setCategoriesOpen((current) => !current)}
              >
                Shop By Industry
                <span className={styles.caret} aria-hidden="true" />
              </button>
              <div
                id={categoriesId}
                className={styles.categoryPanel}
                hidden={!categoriesOpen}
              >
                <div className={styles.categoryPanelHead}>
                  <strong>Shop By Industry</strong>
                  <Link href="/custom-boxes" onClick={() => setCategoriesOpen(false)}>
                    View All Boxes →
                  </Link>
                </div>
                <div className={styles.categoryGrid}>
                  {industries.map((industry) => (
                    <Link
                      key={industry.slug}
                      href={industry.href}
                      onClick={() => setCategoriesOpen(false)}
                    >
                      <CatalogImage
                        src={industry.image}
                        alt=""
                        width={144}
                        height={144}
                        sizes="64px"
                      />
                      <span>{industry.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {links.map((item) => (
              <Link key={item.href} href={item.href}>{item.label}</Link>
            ))}
          </nav>
        </div>

        <form
          className={mobileSearchOpen ? `${styles.mobileSearch} ${styles.isOpen}` : styles.mobileSearch}
          action="/custom-boxes"
        >
          <label className="sr-only" htmlFor="mobile-header-search">Search boxes</label>
          <input
            ref={mobileSearchRef}
            id="mobile-header-search"
            name="q"
            type="search"
            placeholder="Search boxes..."
          />
          <button type="submit" aria-label="Submit search">
            <SearchIcon />
          </button>
        </form>

        <div className={styles.mobileActions}>
          <button
            type="button"
            className={styles.mobileSearchToggle}
            aria-expanded={mobileSearchOpen}
            aria-controls="mobile-header-search"
            aria-label={mobileSearchOpen ? 'Close search' : 'Open search'}
            onClick={() => {
              setOpen(false);
              setMobileSearchOpen((current) => !current);
            }}
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            className={open ? `${styles.menuButton} ${styles.isOpen}` : styles.menuButton}
            aria-expanded={open}
            aria-controls="hcp-home-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => {
              setMobileSearchOpen(false);
              setOpen((current) => !current);
            }}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <nav
        id="hcp-home-menu"
        className={open ? `${styles.mobileMenu} ${styles.isOpen}` : styles.mobileMenu}
        aria-label="Mobile homepage navigation"
      >
        <button
          type="button"
          className={styles.mobileCategoryTrigger}
          aria-expanded={mobileCategoriesOpen}
          aria-controls={mobileCategoriesId}
          onClick={() => setMobileCategoriesOpen((current) => !current)}
        >
          <span>01</span>
          Shop By Industry
          <i className={styles.caret} aria-hidden="true" />
        </button>
        <div
          id={mobileCategoriesId}
          className={
            mobileCategoriesOpen
              ? `${styles.mobileCategoryList} ${styles.isOpen}`
              : styles.mobileCategoryList
          }
          aria-hidden={!mobileCategoriesOpen}
        >
          <Link href="/custom-boxes" onClick={() => setOpen(false)}>All Custom Boxes</Link>
          {industries.map((industry) => (
            <Link
              key={industry.slug}
              href={industry.href}
              onClick={() => setOpen(false)}
            >
              {industry.name}
            </Link>
          ))}
        </div>
        {links.map((item, index) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
            <span>{String(index + 2).padStart(2, '0')}</span>
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
          <Link href="/custom-boxes">Shop By Industry</Link>
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
