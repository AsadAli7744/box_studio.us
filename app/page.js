import HomePage from '../src/views/HomePage';
import { absoluteSeoUrl, buildPageMetadata } from '../src/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Custom Packaging Solutions | Printed Packaging | Box Studio',
  description:
    'Custom packaging solutions for cosmetics, skincare, fragrance, food, healthcare and retail. Printed packaging designed around your product, then quoted for production in the United States.',
  path: '/',
  image: absoluteSeoUrl('/images/hcp-home/hero-fantasy-eyes.webp'),
});

export default function Page() {
  return <HomePage />;
}
