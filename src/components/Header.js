import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { industries } from '../data/uses';
import { useScrolled } from '../hooks/useScrolled';
import Logo from './Logo';
import UseList from './UseList';

function navClass({ isActive }) {
  return isActive ? 'is-active' : undefined;
}

export default function Header() {
  const scrolled = useScrolled();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [industryOpen, setIndustryOpen] = useState(false);
  const [mobileIndustry, setMobileIndustry] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const industryRef = useRef(null);
  const industryButtonRef = useRef(null);
  const menuId = useId();
  const industryId = useId();

  useEffect(() => {
    setMenuOpen(false);
    setIndustryOpen(false);
    setMobileIndustry(false);
  }, [location.pathname, location.search]);

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

  const home = location.pathname === '/';
  const headerClass = ['site-header', scrolled ? 'is-scrolled' : '', home ? 'is-home' : ''].filter(Boolean).join(' ');

  return (
    <header className={headerClass}>
      <div className="header-bar">
        <Link to="/" className="logo-link" aria-label="Box Studio, home">
          <Logo tone={home ? 'dark' : 'light'} />
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
            <div className="dropdown-panel use-panel" id={industryId} hidden={!industryOpen}>
              <p className="use-label">Shop by Industry</p>
              <UseList onNavigate={() => setIndustryOpen(false)} />
              <Link to="/custom-boxes" className="dropdown-all" onClick={() => setIndustryOpen(false)}>
                All custom boxes
              </Link>
            </div>
          </div>
          <NavLink to="/about" className={navClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={navClass}>
            Contact
          </NavLink>
        </nav>
        <Link to="/quote" className="btn btn-gold header-quote">
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
                {industries.map((item) => (
                  <li key={item.id}>
                    <Link to={item.href}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            ) : null}
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/quote" className="btn btn-gold">
              Get a Quote
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
