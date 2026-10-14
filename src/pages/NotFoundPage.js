import { Link } from 'react-router-dom';
import { absoluteUrl } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';

export default function NotFoundPage() {
  usePageMeta({
    title: 'Page not found | Box Studio',
    description: 'This page is not part of the Box Studio site.',
    path: '/404',
    image: absoluteUrl('/images/hero-boxes.jpg'),
    jsonLd: null,
  });

  return (
    <div className="not-found">
      <p className="eyebrow">404</p>
      <h1>This page is not available</h1>
      <p>The address may be out of date. The boxes and the quote request are still here.</p>
      <div className="hero-actions">
        <Link to="/custom-boxes" className="btn btn-dark">
          Browse boxes
        </Link>
        <Link to="/" className="btn btn-ghost">
          Back home
        </Link>
      </div>
    </div>
  );
}
