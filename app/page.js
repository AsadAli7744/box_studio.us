import HomePage from '../src/views/HomePage';
import { getPublicCatalog } from '../src/server/publicCatalog';
import { absoluteSeoUrl, buildPageMetadata } from '../src/lib/seo';

export async function generateMetadata() {
  const catalog = await getPublicCatalog();
  const seo = catalog?.home?.seo || {};
  return buildPageMetadata({
    title: seo.metaTitle || 'Custom Cosmetic Packaging & Printed Boxes | Box Studio',
    description:
      seo.metaDescription ||
      'Get custom printed cosmetic boxes for makeup, skincare, and fragrance. Choose your carton size, foil stamping, and embossing. Request a quote from Box Studio.',
    path: '/',
    image: absoluteSeoUrl('/images/hcp-home/hero-fantasy-eyes.webp'),
  });
}

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
