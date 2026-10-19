'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCatalog } from '../context/CatalogContext';
import Footer from './Footer';
import Header from './Header';

export default function Layout({ children }) {
  const pathname = usePathname();
  const { getProduct } = useCatalog();
  const slug = pathname.replace(/^\//, '');
  const admin = pathname.startsWith('/admin');
  const dock = !admin && Boolean(slug) && !slug.includes('/') && Boolean(getProduct(slug));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={admin ? 'layout is-admin' : dock ? 'layout has-dock' : 'layout'}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {admin ? null : <Header />}
      <main id="main" className={admin ? 'page admin-main' : 'page'} key={pathname}>
        {children}
      </main>
      {admin ? null : <Footer />}
    </div>
  );
}
