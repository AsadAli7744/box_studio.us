import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { isOfferingSlug } from '../data/offerings';
import Footer from './Footer';
import Header from './Header';

export default function Layout() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, '');
  const dock = Boolean(slug) && !slug.includes('/') && isOfferingSlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={dock ? 'layout has-dock' : 'layout'}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" className="page" key={pathname}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
