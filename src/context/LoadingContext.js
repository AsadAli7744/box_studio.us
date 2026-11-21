'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import SiteLoader from '../components/SiteLoader';

const LoadingContext = createContext(null);

function isInternalNavLink(anchor) {
  if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return false;
  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
    return false;
  }
  try {
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return false;
    if (url.pathname === window.location.pathname && url.search === window.location.search) return false;
    return true;
  } catch {
    return false;
  }
}

export function LoadingProvider({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Skip the blocking boot overlay on the homepage so hero can paint immediately.
  const [boot, setBoot] = useState(() => pathname !== '/');
  const [count, setCount] = useState(0);
  const hideTimer = useRef(0);
  const routeKey = `${pathname}?${searchParams?.toString() || ''}`;

  const startLoading = useCallback(() => {
    window.clearTimeout(hideTimer.current);
    setCount((current) => current + 1);
  }, []);

  const stopLoading = useCallback(() => {
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      setCount((current) => Math.max(0, current - 1));
    }, 180);
  }, []);

  const withLoading = useCallback(
    async (task) => {
      startLoading();
      try {
        return await task();
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading],
  );

  useEffect(() => {
    if (pathname === '/') {
      setBoot(false);
      setCount(0);
      return undefined;
    }
    const timer = window.setTimeout(() => setBoot(false), 280);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    function onClick(event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const anchor = event.target.closest?.('a[href]');
      if (!isInternalNavLink(anchor)) return;
      try {
        const url = new URL(anchor.getAttribute('href'), window.location.origin);
        // Home should paint immediately — don't block it with the global overlay.
        if (url.pathname === '/') return;
      } catch {
        return;
      }
      startLoading();
    }
    function onSubmit(event) {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || form.method.toLowerCase() !== 'get') return;
      const action = form.getAttribute('action') || window.location.pathname;
      try {
        const url = new URL(action, window.location.origin);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === '/') return;
      } catch {
        return;
      }
      startLoading();
    }
    function onPopState() {
      // Destination is known on the next pathname effect; avoid flashing home.
      if (window.location.pathname === '/') {
        setCount(0);
        return;
      }
      startLoading();
    }
    document.addEventListener('click', onClick, true);
    document.addEventListener('submit', onSubmit, true);
    window.addEventListener('popstate', onPopState);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('submit', onSubmit, true);
      window.removeEventListener('popstate', onPopState);
    };
  }, [startLoading]);

  useEffect(() => {
    setBoot(false);
    window.clearTimeout(hideTimer.current);
    if (pathname === '/') {
      setCount(0);
      return;
    }
    hideTimer.current = window.setTimeout(() => setCount(0), 220);
  }, [routeKey, pathname]);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  const active = boot || count > 0;

  useEffect(() => {
    document.body.setAttribute('aria-busy', active ? 'true' : 'false');
    document.documentElement.classList.toggle('is-loading', active);
  }, [active]);

  const value = useMemo(
    () => ({
      active,
      startLoading,
      stopLoading,
      withLoading,
    }),
    [active, startLoading, stopLoading, withLoading],
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <SiteLoader active={active} />
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
}
