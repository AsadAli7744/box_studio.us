'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCatalog } from '../context/CatalogContext';
import { useScrolled } from '../hooks/useScrolled';
import Logo from './Logo';

export default function Header() {
  const scrolled = useScrolled();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [industryOpen, setIndustryOpen] = useState(false);
  const [mobileIndustry, setMobileIndustry] = useState(false);
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const industryRef = useRef(null);
  const industryButtonRef = useRef(null);
  const menuId = useId();
  const industryId = useId();
  const { categories, products } = useCatalog();

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return products
      .filter((item) => [item.name, item.categoryLabel].join(' ').toLowerCase().includes(needle))
      .slice(0, 6);
  }, [query, products]);

  const menuCards = categories.map((category) => ({
    ...category,
    line: category.line || category.short,
    href: `/${category.slug}`,
  }));

  useEffect(() => {
    setMenuOpen(false);
    setIndustryOpen(false);
    setMobileIndustry(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!searchOpen) return undefined;
    function onPointer(event) {
      if (!searchRef.current?.contains(event.target)) setSearchOpen(false);
    }
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [searchOpen]);

  function submitSearch(event) {
    event.preventDefault();
    const needle = query.trim();
    setSearchOpen(false);
    setMenuOpen(false);
    router.push(needle ? `/custom-boxes?q=${encodeURIComponent(needle)}` : '/custom-boxes');
  }

  useEffect(() => {
    if (!industryOpen) return undefined;
    function onPointer(event) {
      if (!industryRef.current?.contains(event.target)) setIndustryOpen(false);
    }
    function onKey(event) {
      if (event.key === 'Escape') {
        setIndustryOpen(false);
        industryButtonRef.current?.focus();
      }
    }
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [industryOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const root = menuRef.current;
    const focusable = () =>
      [...root.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(
        (node) => !node.hasAttribute('disabled')
      );
    const timer = window.setTimeout(() => focusable()[0]?.focus(), 20);
    function onKey(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    root?.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previous;
      root?.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const home = pathname === '/';
  const headerClass = ['site-header', scrolled ? 'is-scrolled' : '', home ? 'is-home' : ''].filter(Boolean).join(' ');

  return (
    <header className={headerClass}>
      <div className="header-bar">
        <Link href="/" className="logo-link" aria-label="Boxstudio.us, home">
          <Logo />
        </Link>
        <nav className="desktop-nav" aria-label="Primary">
          <div
            className={industryOpen ? 'dropdown is-open' : 'dropdown'}
            ref={industryRef}
            onMouseEnter={() => {
              if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setIndustryOpen(true);
            }}
            onMouseLeave={() => {
              if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setIndustryOpen(false);
            }}
          >
            <button
              type="button"
              ref={industryButtonRef}
              aria-expanded={industryOpen}
              aria-controls={industryId}
              onClick={() => setIndustryOpen((open) => !open)}
            >
              Shop by Industry
              <span className="caret" aria-hidden="true" />
            </button>
            <div className="dropdown-panel nav-menu" id={industryId} hidden={!industryOpen}>
              <div className="nav-menu-head">
                <p className="use-label">Shop by Industry</p>
                <Link href="/custom-boxes" onClick={() => setIndustryOpen(false)}>
                  All custom boxes
                </Link>
              </div>
              <ul className="nav-industry">
                {menuCards.map((category) => (
                  <li key={category.slug}>
                    <Link href={category.href} onClick={() => setIndustryOpen(false)}>
                      <strong>{category.name}</strong>
                      <small>{category.line}</small>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Link href="/custom-box-for-your-brand" className={pathname === '/custom-box-for-your-brand' ? 'is-active' : undefined}>
            Get custom box for your brand
          </Link>
          <Link href="/about" className={pathname === '/about' ? 'is-active' : undefined}>
            About
          </Link>
          <Link href="/contact" className={pathname === '/contact' ? 'is-active' : undefined}>
            Contact
          </Link>
        </nav>
        <form className="header-search" onSubmit={submitSearch} ref={searchRef}>
          <label>
            <span className="sr-only">Search boxes</span>
            <input
              type="search"
              value={query}
              placeholder="Search boxes"
              onChange={(event) => {
                setQuery(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
            />
          </label>
          {searchOpen && query.trim() ? (
            <div className="header-search-panel">
              {matches.length ? (
                <ul>
                  {matches.map((product) => (
                    <li key={product.slug}>
                      <Link href={`/${product.slug}`} onClick={() => setSearchOpen(false)}>
                        <img src={product.images[0].src} alt="" />
                        <span>{product.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No boxes match that search.</p>
              )}
              <button type="submit">See matching boxes</button>
            </div>
          ) : null}
        </form>
        <Link href="/quote" className="btn btn-gold header-quote">
          Get a Quote
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          ref={menuButtonRef}
          onClick={() => setMenuOpen(true)}
        >
          <span className="sr-only">Open menu</span>
          <span className="burger" aria-hidden="true" />
        </button>
      </div>
      {menuOpen ? (
        <div className="mobile-nav" id={menuId} ref={menuRef} role="dialog" aria-modal="true" aria-label="Menu">
          <div className="mobile-nav-bar">
            <Logo />
            <button type="button" className="menu-close" onClick={() => setMenuOpen(false)}>
              Close
            </button>
          </div>
          <form className="header-search header-search-mobile" onSubmit={submitSearch}>
            <label>
              <span className="sr-only">Search boxes</span>
              <input
                type="search"
                value={query}
                placeholder="Search boxes"
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </form>
          <nav aria-label="Mobile">
            <button
              type="button"
              className="mobile-parent"
              aria-expanded={mobileIndustry}
              onClick={() => setMobileIndustry((open) => !open)}
            >
              Shop by Industry
            </button>
            {mobileIndustry ? (
              <ul className="mobile-sub">
                <li>
                  <Link href="/custom-boxes">All custom boxes</Link>
                </li>
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link href={`/${category.slug}`}>{category.name}</Link>
                  </li>
                ))}
              </ul>
            ) : null}
            <Link href="/custom-box-for-your-brand">Get custom box for your brand</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/quote" className="btn btn-gold">
              Get a Quote
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
