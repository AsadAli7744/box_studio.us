import TrendsPage from '../../src/views/TrendsPage';
import { absoluteSeoUrl, buildPageMetadata } from '../../src/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Packaging Trends | Custom Packaging Inspiration | Box Studio',
  description:
    'Explore packaging trends and get inspired by Box Studio finishes, decoration ideas and custom boxes for cosmetics, skincare and beauty brands.',
  path: '/trends',
  image: absoluteSeoUrl('/images/new_page/chromatic-beauty-ribbon.webp'),
});

export default function Page() {
  return <TrendsPage />;
}
