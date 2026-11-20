import NotFoundPage from '../src/views/NotFoundPage';
import { buildPageMetadata } from '../src/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Page not found | Box Studio',
  description: 'This Box Studio page is not available.',
  path: '/404',
  noIndex: true,
});

export default function NotFound() {
  return <NotFoundPage />;
}
