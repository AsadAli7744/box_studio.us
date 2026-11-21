import AboutPage from '../../src/views/AboutPage';
import { absoluteSeoUrl, buildPageMetadata } from '../../src/lib/seo';

export const metadata = buildPageMetadata({
  title: 'About Box Studio | Custom Packaging',
  description:
    'Box Studio designs and manufactures custom printed packaging for cosmetics, skincare, fragrance, healthcare, food and retail brands.',
  path: '/about',
  image: absoluteSeoUrl('/images/about/beauty-collection.webp'),
});

export default function Page() {
  return <AboutPage />;
}
