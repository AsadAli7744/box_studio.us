import HomePage from '../src/views/HomePage';
import { absoluteSeoUrl, buildPageMetadata } from '../src/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Custom Cosmetic Packaging & Printed Boxes | Box Studio',
  description:
    'Get custom printed cosmetic boxes for makeup, skincare, and fragrance. Choose your carton size, foil stamping, and embossing. Request a quote from Box Studio.',
  path: '/',
  image: absoluteSeoUrl('/images/hcp-home/hero-fantasy-eyes.webp'),
});

export default function Page() {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/images/hcp-home/hero-fantasy-eyes.webp"
        fetchPriority="high"
      />
      <HomePage />
    </>
  );
}
